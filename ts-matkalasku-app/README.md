## Front end development

1. Navigate to the "ts-matkalasku-app"-folder
2. Run "npm install" in the terminal
   Note: ONLY install the node_modules inside the ts-matkalasku-app folder.
3. Run "npm dev run" in the terminal to start the development server and view the website.

## Back end development

Navigate to "server"-folder and follow the instructions in its README.

## To run Map API location functionality in the km_allowance component

1. create an account in [openrouteservice](https://openrouteservice.org/)
2. create api key - go Dev dashboard --> Tokens, press Create Token and copy the appeared Key
3. create .env file inside the ts-matkalasku-app folder
4. in .env place this "VITE_API_KEY=(insert your key)"
5. click the start point, map shows up, click the location, close the map
6. click the end point, map shows up, click the location, close the map
7. result of km calculation will appear in the Distance (km) box

## Branch development workflow

Pull requests for development should be merged into the dev branch.
Important: Each pull request must have at least one reviewer.
For major changes, merge main with the dev branch.

## File structure (Frontend)

Web pages are located in src/routes.
Redux-related files are stored in src/store.
UI components are stored in src/components.
Assets such as images and logos are stored in src/assets.

## Instructions to Stay Logged-In on the Website

1. Open your browser’s Settings.
2. In Mozilla Firefox, navigate to Privacy & Security.
   Scroll to the Enhanced Tracking Protection section and click Manage Exceptions....
3. In the exceptions list, add http://localhost:5173/.
4. Register on the website using your Tutors email.
5. Log in with your newly created account.
6. You should now remain logged in, even after refreshing the page.

## Link to Figma

https://www.figma.com/design/JMT5lzNsPAj0tqZMLZBK1V/Matkalasku-Desktop---Design---Jere-Kukkohovi?t=1oQ7YjFZXiw4TqrO-0

## Link to Hailer

https://app.hailer.com/#/activities/process/665628ecb783b8d89d1a3ac2/phase/66b88af8d32ef7e2361083a9/table
