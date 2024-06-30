FROM node:latest as build

WORKDIR /app

COPY ./package.json .

COPY . .

RUN npm install

ENV API_KEY="AIzaSyBI3L_DX6MkUNMdcuKaTUcHMznCshd9Las"
ENV AUTH_DOMAIN="whatsappbot-64b82.firebaseapp.com"
ENV DATABASE_URL="https://whatsappbot-64b82-default-rtdb.firebaseio.com/"
ENV PROJECT_ID="whatsappbot-64b82"
ENV STORAGE_BUCKET="whatsappbot-64b82.appspot.com"
ENV MESSAGING_SENDER_ID="163266114384"
ENV APP_ID="1:163266114384:web:84a6027ee86b4f512af255"
ENV MEASUREMENT_ID="G-PYCB810QJZ"

ENV BOT_INSTANCE_ID="1103952865"
ENV BOT_API_TOKEN_INSTANCE="646d3b9095384112b5a1715748d614b7c3c4e444363c454281"

ENV API_KEY_GEMINI="AIzaSyCQvjPSP8EePV_ihpr3zmpNIRX-Y_b9L3w"
ENV GEMINI_MODEL="gemini-pro"

ENV VERTEX_AI_PROJECT_ID="whatsapp-426813"

ENV GCLOUD_CLIENT_ID="1076250762043-6jl15qdj5lpjce0fgfkk7fra3jm8a61o.apps.googleusercontent.com"
ENV GCLOUD_PROJECT_ID="whatsapp-426813"
ENV GCLOUD_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
ENV GCLOUD_TOKEN_URI="https://oauth2.googleapis.com/token"
ENV GCLOUD_AUTH_PROVIDER_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
ENV GCLOUD_CLIENT_SECRET="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"
ENV REDIRECT_URIS="http://localhost"

EXPOSE 3000

CMD ["npm", "start"]


#FROM nginx:latest

#COPY ./build /var/www/html

#COPY ./nginx.conf /etc/nginx/nginx.conf

#ENTRYPOINT ["nginx", "-g", "daemon off;"]
