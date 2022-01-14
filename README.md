# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Firebase Setup For House Marketplace

1. Create Firebase Project
2. Create "web" app within firebase to get config values"
3. Install firebase in your project "npm i firebase
4. Create a config file in your project
5. Add authentication for email/password and Google
6. Create [auth rules](https://gist.github.com/bradtraversy/6d7de7e877d169a6aa4e61140d25767f)
7. Create a user from Firebase
8. Enable Firestore
9. Create 3 composite indexes for advanced querying

#### First

-   Collection: Listing
-   Query Scope: Collection

| Field     |            |
| --------- | ---------- |
| type      | Ascending  |
| timestamp | Descending |

#### Second

-   Collection: Listing
-   Query Scope: Collection

| Field     |            |
| --------- | ---------- |
| userRef   | Ascending  |
| timestamp | Descending |

#### Third

-   Collection: Listing
-   Query Scope: Collection

| Field     |            |
| --------- | ---------- |
| offer     | Ascending  |
| timestamp | Descending |

10. Create dummy listing with sample data

| Field           | Value                                                                                                                                                                                                                                                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name            | Beautiful Stratford Condo                                                                                                                                                                                                                                                                                                         |
| type            | rent                                                                                                                                                                                                                                                                                                                              |
| bedrooms        | 2                                                                                                                                                                                                                                                                                                                                 |
| userRef         | ID OF A USER                                                                                                                                                                                                                                                                                                                      |
| bathrooms       | 2                                                                                                                                                                                                                                                                                                                                 |
| parking         | true                                                                                                                                                                                                                                                                                                                              |
| furnished       | false                                                                                                                                                                                                                                                                                                                             |
| offer           | true                                                                                                                                                                                                                                                                                                                              |
| regularPrice    | 2500                                                                                                                                                                                                                                                                                                                              |
| discountedPrice | 2000                                                                                                                                                                                                                                                                                                                              |
| location        | 8601 West Peachtree St Stratford, CT 06614                                                                                                                                                                                                                                                                                        |
| geolocation     | **lat**: 41.205590 **lng**: -73.150530                                                                                                                                                                                                                                                                                            |
| imageUrls       | ['https://images.unsplash.com/photo-1586105251261-72a756497a11?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1258&q=80', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80'] |

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
