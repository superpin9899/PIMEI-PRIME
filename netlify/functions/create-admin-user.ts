import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

function loadSupabaseConfig() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const url = process.env.SUPABASE_URL;

  if (serviceKey && url) {
    return { serviceKey, url };
  }

  try {
    const configRaw = readFileSync(join(process.cwd(), 'config.json'), 'utf-8');
    const parsed = JSON.parse(configRaw);
    const fallbackUrl = parsed?.supabase?.url;
    const fallbackKey = parsed?.supabase?.serviceKey;
    if (!fallbackUrl || !fallbackKey) throw new Error('Supabase env vars not configured');
    return { serviceKey: fallbackKey, url: fallbackUrl };
  } catch (error) {
    throw new Error('Supabase env vars not configured');
  }
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { serviceKey, url: supabaseUrl } = loadSupabaseConfig();

    const body = JSON.parse(event.body || '{}');
    const { first_name, last_name, email, phone, birthdate, gender, province, is_woman, receives_benefits, password } = body;

    if (!password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'La contraseña es obligatoria.' }) };
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'participant',
        full_name: `${first_name} ${last_name}`,
      },
    });

    if (authError) {
      throw authError;
    }

    const { data: primeUser, error: profileError } = await supabase
      .from('prime_users')
      .insert({
        user_id: authUser.user.id,
        first_name,
        last_name,
        email,
        phone,
        birthdate,
        gender,
        province,
        is_woman,
        receives_benefits,
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        auth_user: authUser.user,
        prime_user: primeUser,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Error inesperado creando usuario' }),
    };
  }
};

export { handler };

