pipeline {
    agent any

    environment {
        AWS_CREDENTIALS_ID = 'aws_full'
        S3_BUCKET = 'krishchadha'
        SLACK_CHANNEL = '#website'
        SLACK_WEBHOOK_CREDENTIAL_ID = 'slack'
    }

    tools {
        nodejs "NodeJS LTS"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Starting npm install...'
                sh 'npm install'
                echo 'npm install completed.'
            }
        }

        stage('Build Application') {
            steps {
                echo 'Starting npm run build...'
                sh 'npm run build'
                echo 'npm run build completed.'
            }
        }

        stage('Dockerize') {
            steps {
                script {
                    def appImage = docker.build("my-angular-app:${env.BUILD_ID}")
                    appImage.push('latest')
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
