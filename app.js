const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DevOps Project 16 | EKS</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background: #f4f7f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .hero-section { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 100px 0; border-bottom: 5px solid #00d4ff; }
            .card { border: none; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s; }
            .card:hover { transform: translateY(-10px); }
            .status-pulse { height: 15px; width: 15px; background-color: #00ff00; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px #00ff00; }
        </style>
    </head>
    <body>
        <div class="hero-section text-center">
            <div class="container">
                <h1 class="display-3 fw-bold">Cloud Automation Hub</h1>
                <p class="lead">Containerized Application deployed via Jenkins CI/CD to Amazon EKS</p>
                <div class="mt-4">
                    <span class="badge bg-info p-2">Docker</span>
                    <span class="badge bg-warning p-2 text-dark">Kubernetes</span>
                    <span class="badge bg-primary p-2">AWS ECR</span>
                    <span class="badge bg-dark p-2">Jenkins</span>
                </div>
            </div>
        </div>

        <div class="container my-5">
            <div class="row text-center">
                <div class="col-md-4">
                    <div class="card p-4">
                        <h3>Environment</h3>
                        <p class="text-muted">Production (AWS Mumbai)</p>
                        <div class="text-success fw-bold">Active <span class="status-pulse"></span></div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card p-4">
                        <h3>Architecture</h3>
                        <p class="text-muted">Node.js + MongoDB</p>
                        <a href="/api/status" class="btn btn-outline-primary btn-sm">Check Connection</a>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card p-4">
                        <h3>Deployment</h3>
                        <p class="text-muted">Rolling Update Enabled</p>
                        <a href="/data" class="btn btn-primary btn-sm">View JSON Data</a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Changed route names to look more professional
app.get('/data', (req, res) => {
  res.json({
    project: "Project 16",
    infrastructure: "Amazon EKS",
    region: "ap-south-1",
    containers: ["Node.js", "MongoDB"],
    pipeline: "Jenkins Declarative"
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
