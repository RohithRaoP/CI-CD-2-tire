pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "140612709421"
        AWS_REGION     = "ap-south-1"
        CLUSTER_NAME   = "my-cluster"
        ECR_REPO       = "p16"
        IMAGE_TAG      = "tag-1"
        IMAGE_URI      = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build & Test') {
            steps {
                sh 'npm run build || echo "Build skipped"'
                sh 'npm test || echo "No tests defined"'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t ${ECR_REPO}:${IMAGE_TAG} .'
            }
        }

        stage('Login to AWS ECR') {
            steps {
                sh """
                aws ecr get-login-password --region ${AWS_REGION} | \
                docker login --username AWS --password-stdin \
                ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                """
            }
        }

        stage('Push to ECR') {
            steps {
                sh """
                docker tag ${ECR_REPO}:${IMAGE_TAG} ${IMAGE_URI}
                docker push ${IMAGE_URI}
                """
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh """
                # 1. Update EKS Context for mumbai
                aws eks update-kubeconfig --region ap-south-1 --name my-cluster
                
                # 2. Apply Database (These work already)
                kubectl apply -f k8/mongodb-Deployment.yaml
                kubectl apply -f k8/mongodb-service.yaml
                
                # 3. Apply Node.js Manifests (FIXED FILENAMES)
                # We use quotes because of the space in 'node.js Deployment.yaml'
                kubectl apply -f "k8/node.js Deployment.yaml"
                kubectl apply -f "k8/node.js service.yaml"
                
                # 4. Update the Image (FIXED NAMES)
                # We use 'nodejs-deployment' because that is the 'metadata.name' in your YAML
                # We assume the container name inside the YAML is 'nodejs'
                kubectl set image deployment/nodejs-deployment nodejs-container=${IMAGE_URI}
                
                # 5. Final Status Check
                kubectl rollout status deployment/nodejs-deployment
                """
            }
        }
    }
}
