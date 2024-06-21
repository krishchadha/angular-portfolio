pipeline {
    agent any
   tools {
        nodejs "NodeJS LTS" 
    }
  
    environment {
        AWS_CREDENTIALS_ID = 'aws_full'
        S3_BUCKET = 'krishchadha'
        SLACK_CHANNEL = '#website'
        SLACK_WEBHOOK_CREDENTIAL_ID = 'slack'
    }

    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm run test'
                // OWASP ZAP Scan (example command)
                sh 'owasp-zap -cmd'
            }
        }

        stage('Dockerize') {
            steps {
                script {
                    docker.build("my-angular-app:${env.BUILD_ID}")
                }
            }
        }

        stage('Deploy to S3') {
            steps {
                withAWS(credentials: env.AWS_CREDENTIALS_ID, region: 'ap-south-1') {
                    s3Upload(bucket: env.S3_BUCKET, includePathPattern: 'dist/**')
                }
            }
        }

        stage('Notify') {
            steps {
                script {
                    slackSend (
                        channel: env.SLACK_CHANNEL,
                        color: '#00FF00',
                        message: "Deployment completed for build ${env.BUILD_ID}",
                        tokenCredentialId: env.SLACK_WEBHOOK_CREDENTIAL_ID
                    )
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
