pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        AWS_CREDENTIALS = credentials('aws-credentials')
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/your-repo/angular-portfolio.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build('angular-portfolio')
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'DOCKERHUB_CREDENTIALS') {
                        docker.image('angular-portfolio').push('latest')
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    sh 'kubectl apply -f kubernetes/deployment.yaml'
                    sh 'kubectl apply -f kubernetes/service.yaml'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
