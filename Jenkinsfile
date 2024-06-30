pipeline {
    agent any

    environment {
        AWS_CREDENTIALS_ID = 'aws_full_2'
        S3_BUCKET = 'www.krishchadha.online'
        SLACK_CHANNEL = '#website'
        SLACK_WEBHOOK_CREDENTIAL_ID = 'slack'
        DOCKER_HUB_CREDENTIAL_ID = 'docker'
        AWS_REGION = 'ap-south-1'
        SONAR_HOME = tool 'Sonar'
    }

    tools {
        nodejs "NodeJS_LTS"
    }

    stages {
        stage('Clone Code from GitHub') {
            steps {
                git url: "https://github.com/krishchadha/angular-portfolio.git", branch: "main"
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    try {
                        echo 'Starting npm install...'
                        bat 'npm install'
                        echo 'npm install completed.'
                    } catch (Exception e) {
                        echo "Error during npm install: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }

        stage('Build Application') {
            steps {
                script {
                    try {
                        echo 'Starting npm run build...'
                        bat 'npm run build'
                        echo 'npm run build completed.'
                    } catch (Exception e) {
                        echo "Error during npm build: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }
       stage('SonarQube Quality Analysis') {
                    steps {
                        script {
                            try {
                                echo "Running SonarQube analysis..."
                                withSonarQubeEnv("Sonar") {
                                    bat "${env.SONAR_HOME}\\bin\\sonar-scanner.bat -Dsonar.projectName=portfolio -Dsonar.projectKey=portfolio"
                                }
                                echo "SonarQube analysis completed."
                            } catch (Exception e) {
                                echo "Error during SonarQube analysis: ${e.message}"
                                currentBuild.result = 'FAILURE'
                                throw e
                            }
                        }
                    }
                }
        stage('OWASP Dependency Check') {
                    steps {
                        dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'Owasp'
                        dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
                    }
                }


        stage('Sonar Quality Gate Scan') {
            steps {
                timeout(time: 2, unit: "MINUTES") {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('Dockerize') {
            steps {
                script {
                    try {
                        def appImage = docker.build("krishchadha/angular-final:${env.BUILD_ID}")
                        docker.withRegistry('https://index.docker.io/v1/', env.DOCKER_HUB_CREDENTIAL_ID) {
                            appImage.push('latest')
                        }
                    } catch (Exception e) {
                        echo "Error during Docker build/push: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }

        stage('Trivy Docker Image Scan') {
            steps {
                script {
                    bat "trivy image --format table -o trivy-docker-image-report.html krishchadha/angular-final:${env.BUILD_ID}"
                    archiveArtifacts artifacts: 'trivy-docker-image-report.html'
                }
            }
        }

        stage('Deploy to S3') {
            steps {
                script {
                    try {
                        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: env.AWS_CREDENTIALS_ID]]) {
                            // Install AWS CLI
                            bat 'curl "https://awscli.amazonaws.com/AWSCLIV2.msi" -o "AWSCLIV2.msi"'
                            bat 'msiexec.exe /i AWSCLIV2.msi /qn'
                            bat 'del AWSCLIV2.msi'  // Clean up the installer

                            // Print the directory structure for debugging
                            bat 'dir dist\\angular-final\\browser'

                            // Copy build files to S3 bucket
                            bat '''
                                aws s3 cp dist/angular-final/browser/ s3://%S3_BUCKET%/ --recursive
                            '''

                            // List the files in the S3 bucket to ensure they are uploaded
                            bat '''
                                aws s3 ls s3://%S3_BUCKET%/
                            '''
                        }
                    } catch (Exception e) {
                        echo "Error during S3 deployment: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }

        stage('Configure S3 Static Website Hosting') {
            steps {
                script {
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: env.AWS_CREDENTIALS_ID]]) {
                        bat '''
                            aws s3 website s3://%S3_BUCKET%/ --index-document index.html --error-document error.html
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        failure {
            script {
                slackSend (
                    channel: env.SLACK_CHANNEL,
                    color: '#FF0000',
                    message: "Build failed for ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)",
                    tokenCredentialId: env.SLACK_WEBHOOK_CREDENTIAL_ID
                )
            }
        }
        success {
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
