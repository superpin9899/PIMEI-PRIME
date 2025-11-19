import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

function loadSupabaseConfig() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;

  if (serviceKey && supabaseUrl) {
    return { serviceKey, supabaseUrl };
  }

  const configPath = join(process.cwd(), 'config.json');
  const raw = readFileSync(configPath, 'utf-8');
  const parsed = JSON.parse(raw);

  return {
    serviceKey: parsed.supabase.serviceKey,
    supabaseUrl: parsed.supabase.url,
  };
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { serviceKey, supabaseUrl } = loadSupabaseConfig();
    const supabase = createClient(supabaseUrl, serviceKey);

    const body = JSON.parse(event.body || '{}');
    const { fileName, mimeType, base64, userId } = body;

    if (!fileName || !mimeType || !base64 || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan parámetros para subir el avatar.' }),
      };
    }

    const fileExt = fileName.split('.').pop() || 'jpg';
    const storagePath = `${userId}/avatar.${fileExt}`;
    const buffer = Buffer.from(base64, 'base64');

    const { error: uploadError } = await supabase.storage.from('avatars').upload(storagePath, buffer, {
      upsert: true,
      contentType: mimeType,
    });

    if (uploadError) {
      throw uploadError;
    }

    const { error: updateError } = await supabase.from('prime_users').update({ avatar_path: storagePath }).eq('user_id', userId);
    if (updateError) {
      throw updateError;
    }

    const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(storagePath);

    return {
      statusCode: 200,
      body: JSON.stringify({ publicUrl: publicUrl.publicUrl }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Error subiendo avatar' }),
    };
  }
};

export { handler };

