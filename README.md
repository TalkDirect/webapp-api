# ready-start
Custom Remote Player
Built and Deployed Web App is available [here](https://talkdirect-webapp.onrender.com), requires the building and running of the accompanying desktop app inorder to host sessions for the web app to join to.

# Compiling & Running Backend API

1. Go to server/main and run command `npm run compile` this will compile all of the Typescript code into Javascript and put it into server/main/build
2. Next run command `npm run build` this will `cd build` and once in the build directory it will run `node index.js` to run the javascript file associated with the backend API
3. The API should display `server started` in console if all steps were followed