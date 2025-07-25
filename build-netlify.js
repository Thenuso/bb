const fs = require('fs');
const path = require('path');

console.log('🎬 Building Bulldog Stream Platform for Netlify...');

// Create directories
const dirs = ['dist', 'netlify/functions'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
});

// Copy files
const filesToCopy = [
    { src: 'index-production.html', dest: 'dist/index.html' },
    { src: 'admin.htm', dest: 'dist/admin.html' },
    { src: 'style-production.css', dest: 'dist/style.css' },
    { src: 'style.css', dest: 'dist/style-legacy.css' },
    { src: 'app-production.js', dest: 'dist/app.js' },
    { src: 'backend.js', dest: 'dist/backend-legacy.js' },
    { src: 'manifest.json', dest: 'dist/manifest.json' },
    { src: 'sw.js', dest: 'dist/sw.js' }
];

console.log('📄 Copying files...');
filesToCopy.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`✅ Copied ${src} → ${dest}`);
    } else {
        console.log(`⚠️  Source file not found: ${src}`);
    }
});

// Create serverless function for health check
const healthFunction = `exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
    },
    body: JSON.stringify({
      success: true,
      status: "healthy",
      message: "Bulldog Stream Platform API is running on Netlify",
      timestamp: new Date().toISOString(),
      platform: "netlify",
      version: "1.0.0"
    })
  };
};`;

fs.writeFileSync('netlify/functions/health.js', healthFunction);
console.log('✅ Created health check function');

// Create auth serverless function
const authFunction = `const { createClient } = require('@supabase/supabase-js');

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
};`;

fs.writeFileSync('netlify/functions/auth.js', authFunction);
console.log('✅ Created auth function');

// Create channels function
const channelsFunction = `const { createClient } = require('@supabase/supabase-js');

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
};`;

fs.writeFileSync('netlify/functions/channels.js', channelsFunction);
console.log('✅ Created channels function');

// Create package.json for functions
const functionsPackage = {
  "name": "netlify-functions",
  "version": "1.0.0",
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  }
};

fs.writeFileSync('netlify/functions/package.json', JSON.stringify(functionsPackage, null, 2));
console.log('✅ Created functions package.json');

// Update HTML files to use correct paths
const updateHtmlFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update script and style references
        content = content.replace(/backend-production\.js/g, 'app.js');
        content = content.replace(/style-production\.css/g, 'style.css');
        
        // Update API endpoints to use Netlify functions
        content = content.replace(/\/api\//g, '/.netlify/functions/');
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated ${filePath} for Netlify`);
    }
};

updateHtmlFile('dist/index.html');
updateHtmlFile('dist/admin.html');

// Update JavaScript file for Netlify
if (fs.existsSync('dist/app.js')) {
    let jsContent = fs.readFileSync('dist/app.js', 'utf8');
    
    // Update API base URL
    jsContent = jsContent.replace(/const API_BASE = [^;]+;/, 'const API_BASE = "/.netlify/functions";');
    jsContent = jsContent.replace(/\/api\//g, '/.netlify/functions/');
    
    fs.writeFileSync('dist/app.js', jsContent);
    console.log('✅ Updated app.js for Netlify');
}

console.log('\n🎉 Build completed successfully!');
console.log('📦 Files ready for Netlify deployment in dist/ directory');
console.log('\n🚀 Deploy to Netlify:');
console.log('   1. Drag and drop the entire project folder to netlify.com');
console.log('   2. Or connect your GitHub repo for auto-deployment');
console.log('   3. Set environment variables in Netlify dashboard:');
console.log('      - SUPABASE_URL');
console.log('      - SUPABASE_ANON_KEY');
console.log('      - SUPABASE_SERVICE_KEY');
console.log('      - JWT_SECRET');
console.log('      - STRIPE_PUBLISHABLE_KEY (optional)');
console.log('\n✨ Your streaming platform will be live on Netlify!');
