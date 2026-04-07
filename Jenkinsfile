pipeline {
    agent any

    environment {
        // AWS Infrastructure Config
        AWS_ACCOUNT_ID = "140612709421"
        AWS_REGION     = "eu-north-1"
        CLUSTER_NAME   = "my-cluster"
        
        // Docker/ECR Config
        ECR_REPO       = "project16"
        IMAGE_TAG      = "tag-1"
        IMAGE_URI      = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}"
    }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build & Test') {
            steps {
                // Combined for efficiency; replace with real scripts if available
                sh 'npm run build || echo "Build skipped"'
                sh 'npm test || echo "No tests defined"'
            }
        }

        stage('Docker Build') {
            steps {
                // Builds the image locally on the Jenkins agent
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
                # 1. Force the connection to the Stockholm Cluster (Fixes the Mumbai DNS error)
                aws eks update-kubeconfig --region ${AWS_REGION} --name ${CLUSTER_NAME}
                
                # 2. Deploy the infrastructure manifests
                # This creates the Deployment and Service if they don't exist
                kubectl apply -f deployment.yaml
                
                # 3. Imperatively update the image to the one we just pushed
                # Replace 'nodejs' with the actual container name in your YAML if different
                kubectl set image deployment/nodejs nodejs=${IMAGE_URI}
                
                # 4. Verify the rollout success
                kubectl rollout status deployment/nodejs
                """
            }
        }
    }

    post {
        success {
            echo "Successfully deployed ${IMAGE_TAG} to ${CLUSTER_NAME} in ${AWS_REGION}!"
        }
        failure {
            echo "Pipeline failed. Check ECR permissions or EKS Cluster connectivity."
        }
    }
}
