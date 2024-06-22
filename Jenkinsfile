pipeline {
    agent any

    environment {
        AWS_CREDENTIALS_ID = 'aws_full_2'
     //   S3_BUCKET = 'krishchadha'
        SLACK_CHANNEL = '#website'
        SLACK_WEBHOOK_CREDENTIAL_ID = 'slack'
        DOCKER_HUB_CREDENTIAL_ID = 'docker'
       AWS_REGION = 'ap-south-1'
        S3_BUCKET = 'krishchadha'
    }

    tools {
        nodejs "NodeJS_LTS"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Starting npm install...'
                bat 'npm install'
                echo 'npm install completed.'
            }
        }

        stage('Build Application') {
            steps {
                echo 'Starting npm run build...'
                bat 'npm run build'
                echo 'npm run build completed.'
            }
        }

        stage('Dockerize') {
            steps {
                script {
                    def appImage = docker.build("krishchadha/angular-final:${env.BUILD_ID}")
                    docker.withRegistry('https://index.docker.io/v1/', env.DOCKER_HUB_CREDENTIAL_ID) {
                        appImage.push('latest')
                    }
                }
            }
        }

    stage('Deploy to S3') {
    steps {
        script {
            withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: env.AWS_CREDENTIALS_ID]]) {
                // Install AWS CLI
                bat 'curl "https://awscli.amazonaws.com/AWSCLIV2.msi" -o "AWSCLIV2.msi"'
                bat 'msiexec.exe /i AWSCLIV2.msi /qn'
                bat 'del AWSCLIV2.msi'  // Clean up the installer

                // Copy build files to S3 bucket
                bat '''
                    aws s3 cp dist/ s3://%S3_BUCKET%/ --recursive
                '''
            }
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
