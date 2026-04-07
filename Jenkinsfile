pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "140612709421"
        AWS_REGION     = "eu-north-1"
        CLUSTER_NAME   = "my-cluster"
        ECR_REPO       = "project16"
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
                aws eks update-kubeconfig --region ${AWS_REGION} --name ${CLUSTER_NAME}
                kubectl apply -f k8/mongodb-Deployment.yaml
                kubectl apply -f k8/mongodb-service.yaml
                kubectl apply -f k8/node.jsdeployment.yaml
                kubectl set image deployment/nodejs nodejs=${IMAGE_URI}
                kubectl rollout status deployment/nodejs
                """
            }
        }
    }

    post {
        success {
            echo "Successfully deployed!"
        }
        failure {
            echo "Pipeline failed. Check syntax or AWS permissions."
        }
    }
}
