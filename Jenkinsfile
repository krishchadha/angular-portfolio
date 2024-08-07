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
        SONARQUBE_URL = 'http://localhost:9000'
        NVD_API_KEY = 'owasp'
        AWS_ACCESS_KEY_ID = credentials('aws_id')
        AWS_SECRET_ACCESS_KEY = credentials('aws_secret_key') 
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
                            withCredentials([string(credentialsId: 'sonar', variable: 'SONAR_TOKEN')]) {
                                bat "${SONAR_HOME}\\bin\\sonar-scanner.bat -Dsonar.projectName=portfolio -Dsonar.projectKey=portfolio -Dsonar.exclusions=**/dependency-check-report.html -Dsonar.host.url=${env.SONARQUBE_URL} -Dsonar.login=${SONAR_TOKEN}"
                            }
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

        stage('Wait for SonarQube Processing') {
            steps {
                script {
                    echo "Waiting for SonarQube to process the report..."
                    sleep(time: 30, unit: "SECONDS")
                }
            }
        }

        stage('Sonar Quality Gate Scan') {
            steps {
                timeout(time: 10, unit: "MINUTES") {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                script {
                    try {
                        echo 'Running OWASP Dependency Check...'
                        dependencyCheck additionalArguments: ' --scan ./ --format HTML', odcInstallation: 'Owasp'
                        dependencyCheckPublisher pattern: '**/dependency-check-report.html'
                        echo 'OWASP Dependency Check completed.'
                    } catch (Exception e) {
                        echo "Error during OWASP Dependency Check: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }

        stage('Dockerize') {
            steps {
                script {
                    try {
                        echo 'Building Docker image...'
                        def appImage = docker.build("krishchadha/angular-final:${env.BUILD_ID}")
                        docker.withRegistry('https://index.docker.io/v1/', env.DOCKER_HUB_CREDENTIAL_ID) {
                            appImage.push('latest')
                        }
                        echo 'Docker image built and pushed.'
                    } catch (Exception e) {
                        echo "Error during Docker build/push: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }

        stage('Deploy to S3') {
            steps {
                script {
                    try {
                        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: env.AWS_CREDENTIALS_ID]]) {
                            echo 'Deploying to S3...'
                            bat 'curl "https://awscli.amazonaws.com/AWSCLIV2.msi" -o "AWSCLIV2.msi"'
                            bat 'msiexec.exe /i AWSCLIV2.msi /qn'
                            bat 'del AWSCLIV2.msi' 

                            bat 'dir dist\\angular-final\\browser'

                            bat '''
                                aws s3 cp dist/angular-final/browser/ s3://%S3_BUCKET%/ --recursive
                            '''

                            bat '''
                                aws s3 ls s3://%S3_BUCKET%/
                            '''
                            echo 'S3 deployment completed.'
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
                        echo 'Configuring S3 Static Website Hosting...'
                        bat '''
                            aws s3 website s3://%S3_BUCKET%/ --index-document index.html --error-document error.html
                        '''
                        echo 'S3 Static Website Hosting configured.'
                    }
                }
            }
        }

        // stage('Deploy Prometheus') {
        //     steps {
        //         script {
        //             // def prometheusContainer = bat(script: "docker ps -q -f name=prometheus", returnStdout: true).trim()
        //             // if (prometheusContainer) {
        //             //     echo 'Prometheus container is already running.'
        //             // } else {
        //                 try {
        //                     echo 'Starting Prometheus setup...'
        //                     bat 'docker run -d --name prometheus -p 9090:9090 -v %WORKSPACE%\\monitoring\\prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus'
        //                     echo 'Prometheus setup completed.'
        //                 } catch (Exception e) {
        //                     echo "Error during Prometheus setup: ${e.message}"
        //                     currentBuild.result = 'FAILURE'
        //                     throw e
        //                 }
        //             }
        //         }
        //     }
        // }

    //     stage('Deploy Grafana') {
    //         steps {
    //             script {
    //                     try {
    //                         echo 'Starting Grafana setup...'
    //                         bat 'docker run -d --name grafana -p 3000:3000 grafana/grafana'
    //                         echo 'Grafana setup completed.'
    //                     } catch (Exception e) {
    //                         echo "Error during Grafana setup: ${e.message}"
    //                         currentBuild.result = 'FAILURE'
    //                         throw e
    //                 }
    //             }
    //         }
    //     }
 // stage('Deploy SonarQube') {
        //     steps {
        //         script {
        //            
        //                 try {
        //                     echo 'Starting sonarqube-server setup...'
        //                     bat 'docker run -d --name sonarqube-server -p 9000:9000 sonarqube:lts-community'
        //                     echo 'sonarqube-server setup completed.'
        //                 } catch (Exception e) {
        //                     echo "Error during sonarqube-server setup: ${e.message}"
        //                     currentBuild.result = 'FAILURE'
        //                     throw e
        //                 }
        //             }
        //         }
        //     }
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
