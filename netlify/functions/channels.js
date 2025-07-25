const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event, context) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('tv_channels')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            channels: data || [],
            pagination: {
              total: data?.length || 0,
              page: 1,
              limit: 50
            }
          }
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: "Method not allowed" })
    };

  } catch (error) {
    console.error('Channels function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      })
    };
  }
};