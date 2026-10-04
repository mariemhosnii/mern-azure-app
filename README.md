# MERN App on Azure

Express + Mongoose (MongoDB Atlas) backend that also serves the React build from `public/`.

## Run locally
1. Put your Atlas connection string in `config/.env`
2. `npm install`
3. `npm run build:client`   (builds React and copies it to `public/`)
4. `npm start`  ->  http://localhost:5000

## Deploy on Azure
Set the app setting `MONGO_URI` in the Web App, then deploy with GitHub or Local Git.
