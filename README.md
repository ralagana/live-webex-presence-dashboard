# UNFINISHED APP
See below for more details, app functions but is not complete.

# Live Webex user presence React App
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

It pulls all users from an org and lists their webex presence status. user status is updated in real time as it changes on webex.

## Run the App
To run the app you need to run `npm install` from terminal to install node modules and once that's completed you can run `npm start`.

## Work in progress...
App isn't fully functional yet but does run in a testing environment and lists user presence. However, subscribing isn't working as expected due to limitations with the plugin in that it uses old/deprecated presence service APIs (Apheleia). More info on the SDK team's discovery efforts found [here](https://confluence-eng-gpk2.cisco.com/conf/display/WSDK/Public+Presence+Plugin). More details to follow...

# DISCLAIMER
This app uses the unsupported (and outdated) [internal-plugin-presence](https://github.com/webex/webex-js-sdk/tree/master/packages/%40webex/internal-plugin-presence) package found on our [Webex Browser SDK](https://github.com/webex/webex-js-sdk). Any use of this app and/or package is at your own risk and Webex will not be able provide support for it. This application is built purely as an exploratory exercise and is not to Production standard.

