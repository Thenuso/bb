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
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};
    const pathSegments = event.path.split('/').filter(Boolean);
    const endpoint = pathSegments[pathSegments.length - 1];

    switch (endpoint) {
      case 'login':
        if (method === 'POST') {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: body.email || body.identifier,
            password: body.password
          });

          if (error) throw error;

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
              success: true, 
              data: {
                user: data.user,
                token: data.session?.access_token
              }
            })
          };
        }
        break;

      case 'register':
        if (method === 'POST') {
          const { data, error } = await supabase.auth.signUp({
            email: body.email,
            password: body.password,
            options: {
              data: {
                username: body.username,
                display_name: body.displayName || body.username
              }
            }
          });

          if (error) throw error;

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data })
          };
        }
        break;

      case 'profile':
        if (method === 'GET') {
          const token = event.headers.authorization?.replace('Bearer ', '');
          if (!token) {
            return {
              statusCode: 401,
              headers,
              body: JSON.stringify({ success: false, error: 'No token provided' })
            };
          }

          const { data: { user }, error } = await supabase.auth.getUser(token);
          if (error) throw error;

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: user })
          };
        }
        break;

      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: "Endpoint not found" })
        };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: "Method not allowed" })
    };

  } catch (error) {
    console.error('Auth function error:', error);
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