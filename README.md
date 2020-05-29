# Compare Your Music Taste With Friends!

This is the frontend repository for [musictaste.space](https://musictaste.space), a web app that lets users see insights into their listening habits and compare their music taste with friends (or strangers), utilising the Spotify API.

This is the _frontend repository_ for the project, which leverages a fully serverless backend powered by [Firebase Auth](https://firebase.google.com/products/auth), [Firebase Firestore](https://firebase.google.com/products/firestore) and [Firebase Cloud Functions](hhttps://firebase.google.com/products/functions).

To reduce on intensive document reads, many global level documents are cached through the [Vercel Cloud Function CDN](https://vercel.com/edge-network).

**NOTE: Due to security concerns and protecting user data, the backend repository with the cloud function API services is currently private. You cannot develop on this repository without the relevant .env files, Vercel API development endpoints, and the Firebase emulator running. Once this project ends, I may make this repository public!**

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
