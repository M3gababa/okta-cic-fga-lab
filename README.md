
![Auth0 Fine Grain Authorization](https://docs.fga.dev/assets/images/auth0-fga-lockup-en-onlight-af0256a6a8905a0e876871cee2beee1c.svg)

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

Create a **Single Page Application** in the [Auth0 Dashboard](https://manage.auth0.com/#/applications).

- **Allowed Callback URLs**: `http://localhost:3100`
- **Allowed Logout URLs**: `http://localhost:3100`
- **Allowed Web Origins**: `http://localhost:3100`

> These URLs should reflect the origins that your application is running on. **Allowed Callback URLs** may also include a path, depending on where you're handling the callback (see below).

Take note of the **Client ID** and **Domain** values under the "Basic Information" section. You'll need these values in the next step.

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
    "fga_apiHost": "https://api.us1.fga.dev", // Current URL for fga.dev API
    "fga_storeId": "STORE_ID FROM THE FGA SETTINGS",
    "fga_apiTokenIssuer": "fga.us.auth0.com", // Issuer for the tokens
    "fga_apiAudience": "https://api.us1.fga.dev/", // Audience for API calls
    "fga_clientId": "ID FROM THE FGA SETTINGS",
    "fga_clientSecret": "SECRETS FROM THE FGA SETTINGS"
}
```

## Run

To run the complete project, just launch the command ```npm start```. Both the front end and the backend servers will run and communicate together and make the application available in your browser at the [localhost url](http://localhost:3100).

## Feedback

For other comprehensive examples and documentation on the configuration options, see the [EXAMPLES.md](https://github.com/auth0/lock/blob/master/EXAMPLES.md) document.

### Contributing

We appreciate feedback and contribution to this repo! Before you get started, please see the following:

- [Auth0's general contribution guidelines](https://github.com/auth0/open-source-template/blob/master/GENERAL-CONTRIBUTING.md)
- [Auth0's code of conduct guidelines](https://github.com/auth0/open-source-template/blob/master/CODE-OF-CONDUCT.md)
- [This repo's contribution guide](https://github.com/auth0/lock/blob/master/DEVELOPMENT.md)

### Raise an issue

:warning: Note: We are no longer supporting requests for new features. Only requests for bug fixes or security patches will be considered.

To provide feedback or report a bug, please [raise an issue on our issue tracker](https://github.com/auth0/lock/issues).

### Vulnerability Reporting

Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.


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