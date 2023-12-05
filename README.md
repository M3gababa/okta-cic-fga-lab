
![Auth0 Fine Grain Authorization](/src/assets/auth0-fga-lockup-en-onlight.svg)

# Okta CIC (Auth0) + OpenFGA - Relationship-Based Access Control

## Documentation

- [Docs Site](https://auth0.com/docs) - explore our Docs site and learn more about Okta CIC.
- [FGA Site](https://docs.fga.dev/) - explore our Docs site and learn more about FGA.

## Getting Started
### Okta CIC

You already know and use Okta Customer Identity Cloud (CIC), formerly known as Auth0, as an Identity Provider and are able to implement a federation with applications based on OIDC.

If not : 
1. Access the [signup page](https://auth0.com/signup)
2. Create your account with a valid email address, a GitHub/Google/MSFT account
3. A default tenant, located in the US, will be provided to you. You can override its name and location before the creation of your tenant by ticking the box provided.

You can now access your [admin dashboard](https://manage.auth0.com/).

### FGA DEV

By having an admin account, you are able to sign-in to FGA DEV.
1. Access the [dashboard](https://dashboard.fga.dev/) and click continue with my Auth0 account
2. Complete the account setup with 
 * An account name : Global name for all your authorization stores. Use something related to your account.
 * A store name : Authorization model name specific to some usage. Use something related to this lab.

You can now access your [fga dashboard](https://dashboard.fga.dev/) and manipulate your authorization model.

## Installation

### Configure Okta CIC authentication

#### Integrate the Expenses application
In the Auth0 Management Dashboard, 
Navigate to Applications > Applications and create a Single Page Application named Expenses.
* Switch from the Quickstart tab to the Settings tab.
* Set aside the **Domain** and **Client ID** settings under Basic Information, you will need this shortly.
* Set all of the following application setting to http://localhost:3100
  * Allowed Callback URLs
  * Allowed Logout URLs
  * Allowed Web Origins
* Click the Save Changes button at the bottom of the page.

![Auth0 Create APP](/src/assets/doc_createAPP.png)

Navigate to Applications > APIs and create an API named Example API with an Identifier of http://localhost:3101/api/v1

![Auth0 Create API](/src/assets/doc_createAPI.png)

Navigate to User Management > Users, and create the Okta CIC test users with the password of your choice. This workshop requires four test users to be created:
* sam@example.com
* matt@example.com
* daniel@example.com
* peter@example.com

The application is using the **Mail Nickname** of each test user to link a user to its permissions, thus it needs to be included in the **Access Token**.
Navigate to Actions > Library and click the **Build Custom** button to create a new custom action named **"Set access token custom claims"** with a **"Login / Post Login"** trigger..
Set the code as follows:

```js
exports.onExecutePostLogin = async (event, api) => {
  api.accessToken.setCustomClaim("employee_id", event.user.email.split('@')[0]);
};
```

Click the **Deploy** button to make this new Action available for use in Flows.
Navigate to Actions > Flows and click **Login**. In the Add Action panel on the right-hand side, switch to the Custom tab and drag and drop the Set access token custom claims Action between the Start and Complete of the Login flow. Click the Apply button to update the Login flow.

### Configure FGA 

Inside your store, go to the **Settings** menu in order to gather the information related to API calls. 
- Store Name
- Store ID

Click on *Create Credentials* and name them after this "Expenses" Lab you're running. Take note of the following fields **SECRET** generated. Once back on the Settings, actualize the page to get the **ID**.

### Authentication config

Inside your project folder, there's a sample file ```sample_auth_config.json``` under the ```./src/``` folder. Rename the file as ```auth_config.json``` and update the values accordingly :
```json
{
    "domain": "DOMAIN NAME FROM THE OKTA CIC APPLICATION CONFIGURATION",
    "clientId": "CLIENT_ID FROM THE OKTA CIC APPLICATION CONFIGURATION",
    "audience": "http://localhost:3101/api/v1", // Local API defined in the app
    "fga_apiHost": "api.us1.fga.dev", // Current URL for fga.dev API
    "fga_storeId": "STORE_ID FROM THE FGA SETTINGS",
    "fga_apiTokenIssuer": "fga.us.auth0.com", // Issuer for the tokens
    "fga_apiAudience": "https://api.us1.fga.dev/", // Audience for API calls
    "fga_clientId": "ID FROM THE FGA SETTINGS",
    "fga_clientSecret": "SECRETS FROM THE FGA SETTINGS"
}
```

## Local Application

### Install
Before using the project, you must install all the dependencies by launching the command ```npm install```.

### Run
To run the complete project, just launch the command ```npm start```. Both the front end and the backend servers will run and communicate together and make the application available in your browser at the [localhost url](http://localhost:3100).

## Feedback

For other comprehensive examples and documentation on the configuration options, see the [EXAMPLES.md](https://github.com/auth0/lock/blob/master/EXAMPLES.md) document.

## What is Auth0?

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.auth0.com/website/sdks/logos/auth0_dark_mode.png" width="150">
    <source media="(prefers-color-scheme: light)" srcset="https://cdn.auth0.com/website/sdks/logos/auth0_light_mode.png" width="150">
    <img alt="Auth0 Logo" src="https://cdn.auth0.com/website/sdks/logos/auth0_light_mode.png" width="150">
  </picture>
</p>
<p align="center">
  Auth0 is an easy to implement, adaptable authentication and authorization platform. To learn more checkout <a href="https://auth0.com/why-auth0">Why Auth0?</a>
</p>
<p align="center">
  This project is licensed under the MIT license. See the <a href="https://github.com/auth0/lock/blob/master/LICENSE"> LICENSE</a> file for more info.
</p>