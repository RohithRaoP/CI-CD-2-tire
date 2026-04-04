pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "140612709421"
        AWS_REGION     = "eu-north-1"
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

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
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

        stage('Tag Image') {
            steps {
                sh 'docker tag ${ECR_REPO}:${IMAGE_TAG} ${IMAGE_URI}'
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push ${IMAGE_URI}'
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh """
                kubectl set image deployment/nodejs nodejs=${IMAGE_URI}
                kubectl apply -f deployment.yaml
                """
                }
        }
    }
}
