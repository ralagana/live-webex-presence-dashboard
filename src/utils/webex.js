/*
--------TO DO--------
- Add OAuth so that users can authorize the app themselves with an integration (currently using a service app).
- Add refresh logic to refresh the token.
*/

import { ACCESS_TOKEN } from "./constant.js";

let webex = null;

webex = window.Webex.init({
  credentials: {
    access_token: ACCESS_TOKEN
  }
});

export default webex;