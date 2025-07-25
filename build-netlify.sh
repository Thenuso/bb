#!/bin/bash

# Netlify Build Script for Bulldog Stream Platform
echo "🎬 Building Bulldog Stream Platform for Netlify..."

# Create dist directory
mkdir -p dist

# Copy HTML files
echo "📄 Copying HTML files..."
cp index-production.html dist/index.html
cp admin.htm dist/admin.html

# Copy CSS files
echo "🎨 Copying CSS files..."
cp style-production.css dist/style.css
cp style.css dist/style-legacy.css

# Copy JavaScript files
echo "⚡ Copying JavaScript files..."
cp app-production.js dist/app.js
cp backend.js dist/backend-legacy.js

# Copy other assets
echo "📁 Copying assets..."
cp manifest.json dist/
cp sw.js dist/

# Create serverless functions directory
mkdir -p netlify/functions

# Create a simple API function for health check
cat > netlify/functions/health.js << 'EOF'
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      success: true,
      status: "healthy",
      message: "Bulldog Stream Platform API is running on Netlify",
      timestamp: new Date().toISOString(),
      platform: "netlify"
    })
  };
};
EOF

# Create auth function for Supabase integration
cat > netlify/functions/auth.js << 'EOF'
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
    const { path } = event;
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};

    if (path.includes('/login') && method === 'POST') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: body.email,
        password: body.password
      });

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data })
      };
    }

    if (path.includes('/register') && method === 'POST') {
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

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, error: "Endpoint not found" })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
EOF

# Update HTML files to work with Netlify
echo "🔧 Updating files for Netlify deployment..."

# Update index.html to use relative paths
sed -i 's|backend-production.js|app.js|g' dist/index.html 2>/dev/null || true
sed -i 's|style-production.css|style.css|g' dist/index.html 2>/dev/null || true

# Update admin.html
sed -i 's|backend-production.js|app.js|g' dist/admin.html 2>/dev/null || true
sed -i 's|style-production.css|style.css|g' dist/admin.html 2>/dev/null || true

echo "✅ Build completed successfully!"
echo "📦 Files ready for Netlify deployment in dist/ directory"
echo "🚀 Deploy to Netlify:"
echo "   1. Drag and drop the dist/ folder to netlify.com"
echo "   2. Or connect your GitHub repo for auto-deployment"
echo "   3. Set environment variables in Netlify dashboard"
