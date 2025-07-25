exports.handler = async (event, context) => {
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
};