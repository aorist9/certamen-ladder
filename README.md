# Certamen Ladder
Certamen Ladder is currently a web-based front-end only application for creating ladders for Certamen tournaments. It is built to run on GitHub Pages, and is deployed there automatically with each push to main. You can find the app at https://aorist9.github.io/certamen-ladder/

## Running the App
Certamen Ladder is a basic Typescript React app built with [Create-React-App](https://create-react-app.dev/docs/getting-started#scripts). You can get started by running `yarn install` and `yarn start` or `npm install` and `npm start`.

## Operation of the App
Currently all data is stored in local storage on the user's browser mediated by `ladderService`. This state obviously limits the potential of the app, especially around sharing an active ladder by any means other than printing, but that's where we are right now.