pipeline {
    agent any

    environment {
        MONGO_URL  = credentials('MONGO_URL')
        JWT_SECRETE = credentials('JWT_SECRETE')
        EXPIRES_IN = credentials('EXPIRES_IN')
        EMAIL      = credentials('EMAIL')
        PASSWORD   = credentials('PASSWORD')
        PORT       = "5000"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/fullstacktraning/nodejs-appln.git'
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                docker build --no-cache -t node-backend-app .
                '''
            }
        }

        stage('Docker Run') {
            steps {
                sh '''
                docker rm -f node-backend || true

                docker run -d \
                  -p 5000:5000 \
                  --name node-backend \
                  -e PORT=$PORT \
                  -e MONGO_URL=$MONGO_URL \
                  -e JWT_SECRETE=$JWT_SECRETE \
                  -e EXPIRES_IN=$EXPIRES_IN \
                  -e EMAIL=$EMAIL \
                  -e PASSWORD="$PASSWORD"  \
                  node-backend-app
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Backend deployed successfully on port 5000"
        }
        failure {
            echo "❌ Deployment failed – check logs"
        }
    }
}