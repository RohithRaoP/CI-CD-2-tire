const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files (CSS/Images) from the public folder
app.use(express.static('public'));

// 1. HOME ROUTE - Serves your Fancy Template
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. DATA ROUTE - For the "View JSON Data" button
app.get('/users', (req, res) => {
    res.json([
        { id: 1, name: "Rohith", role: "DevOps Engineer", status: "Active" },
        { id: 2, name: "Gemini", role: "AI Assistant", status: "Standby" }
    ]);
});

// 3. STATUS ROUTE - For the "Architecture/Check Connection" button
app.get('/api/status', (req, res) => {
    res.json({
        status: "Connected",
        database: "MongoDB",
        cluster: "Amazon EKS",
        region: "ap-south-1 (Mumbai)",
        message: "2-Tier Architecture is Healthy"
    });
});

app.listen(port, () => {
    console.log(`Application is running on http://localhost:${port}`);
});
