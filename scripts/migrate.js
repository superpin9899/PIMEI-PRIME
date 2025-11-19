import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer configuración
let config;
try {
  const configFile = readFileSync(join(__dirname, '..', 'config.json'), 'utf-8');
  config = JSON.parse(configFile);
} catch (error) {
  console.error('❌ Error: No se encontró config.json');
  console.error('   Copia config.json.example a config.json y completa las credenciales');
  process.exit(1);
}

if (!config.supabase?.url || !config.supabase?.serviceKey) {
  console.error('❌ Error: config.json debe contener supabase.url y supabase.serviceKey');
  process.exit(1);
}

console.log('📁 Configuración cargada correctamente');
console.log(`🔗 Conectando a Supabase: ${config.supabase.url}`);

// Crear cliente con Service Role Key (permisos absolutos)
const supabase = createClient(config.supabase.url, config.supabase.serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

function splitSQLStatements(sql) {
  const statements = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inLineComment = false;
  let inBlockComment = false;
  let dollarTag = null;

  const flushStatement = () => {
    if (current.trim().length > 0) {
      statements.push(current.trim());
    }
    current = '';
  };

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const next = sql[i + 1];
    const twoChars = char + (next ?? '');

    if (inLineComment) {
      if (char === '\n') {
        inLineComment = false;
        current += char;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === '*' && next === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && !dollarTag) {
      if (twoChars === '--') {
        inLineComment = true;
        i++;
        continue;
      }
      if (twoChars === '/*') {
        inBlockComment = true;
        i++;
        continue;
      }
    }

    const dollarMatch = sql.slice(i).match(/^\$[a-zA-Z0-9_]*\$/);
    if (dollarMatch && !inLineComment && !inBlockComment) {
      const tag = dollarMatch[0];
      if (!dollarTag) {
        dollarTag = tag;
      } else if (tag === dollarTag) {
        dollarTag = null;
      }
      current += tag;
      i += tag.length - 1;
      continue;
    }

    if (!dollarTag) {
      if (!inDoubleQuote && char === '\'') {
        if (inSingleQuote && next === '\'') {
          current += "''";
          i++;
          continue;
        }
        inSingleQuote = !inSingleQuote;
        current += char;
        continue;
      }

      if (!inSingleQuote && char === '"') {
        if (inDoubleQuote && next === '"') {
          current += '""';
          i++;
          continue;
        }
        inDoubleQuote = !inDoubleQuote;
        current += char;
        continue;
      }
    }

    if (char === ';' && !inSingleQuote && !inDoubleQuote && !dollarTag) {
      flushStatement();
      continue;
    }

    current += char;
  }

  flushStatement();
  return statements;
}

// Función para ejecutar SQL usando la función helper exec_sql
async function executeSQL(sql) {
  const statements = splitSQLStatements(sql);
  if (statements.length === 0) {
    console.log('   ↳ No hay statements para ejecutar (archivo vacío o solo comentarios)');
    return;
  }

  console.log(`   ↳ ${statements.length} statement(s) detectado(s)`);

  for (const [index, statement] of statements.entries()) {
    if (!statement) continue;

    const preview = statement.length > 120
      ? `${statement.substring(0, 117)}...`
      : statement;

    console.log(`      ▶ Ejecutando statement ${index + 1}: ${preview}`);

    // Ejecutar usando la función RPC exec_sql
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: statement + ';' 
    });

    if (error) {
      // Si la función no existe, dar instrucciones claras
      if (error.message?.includes('function exec_sql') || error.code === '42883') {
        throw new Error(
          `❌ La función exec_sql no existe en Supabase.\n` +
          `   Por favor, ejecuta manualmente la migración 001_initial_setup.sql desde el SQL Editor de Supabase.\n` +
          `   Esto creará la función necesaria para ejecutar migraciones automáticamente.`
        );
      }
      throw new Error(`Error ejecutando SQL: ${error.message}\nSQL: ${preview}`);
    }
  }
}

// Función principal de migración
async function migrate() {
  console.log('🚀 Iniciando migraciones...\n');

  const migrationsDir = join(__dirname, '..', 'migrations');
  
  // Verificar que existe la carpeta migrations
  try {
    const stats = statSync(migrationsDir);
    if (!stats.isDirectory()) {
      throw new Error('migrations no es un directorio');
    }
  } catch (error) {
    console.error('❌ Error: No se encontró la carpeta migrations/');
    process.exit(1);
  }

  // Obtener todas las migraciones y quedarnos con la última (orden alfabético)
  const files = readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('ℹ️  No hay migraciones para ejecutar');
    return;
  }

  const latestFile = files[files.length - 1];
  console.log(`📌 Última migración detectada: ${latestFile}`);

  const filePath = join(migrationsDir, latestFile);
  const content = readFileSync(filePath, 'utf-8');
  console.log(`\n📄 Ejecutando: ${latestFile}`);

  try {
    // Ejecutar el SQL completo
    await executeSQL(content);
    console.log(`✅ ${latestFile} ejecutada correctamente`);

  } catch (error) {
    console.error(`❌ Error ejecutando ${latestFile}:`, error.message);
    console.error('   Deteniendo migraciones...');
    process.exit(1);
  }

  console.log(`\n✨ Migración completada`);
}

// Ejecutar
migrate().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
