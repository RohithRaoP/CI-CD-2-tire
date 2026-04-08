const express = require('express');
const app = express();

// 1. New Home Route - This fixes "Cannot GET /"
app.get('/', (req, res) => {
  res.send(`
    <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
      <h1>🚀 Project 16: Deployment Successful!</h1>
      <p>Node.js app is running on Amazon EKS.</p>
      <a href="/users" style="color: blue; font-weight: bold;">View API Data</a>
    </div>
  `);
});

// 2. API Route (Keep this as is)
app.get('/users', (req, res) => {
  res.json([
    { name: "Rohith", role: "DevOps Engineer", status: "EKS Expert" }
  ]);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
