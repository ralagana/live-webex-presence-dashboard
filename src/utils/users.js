/*
--TO DO--
Add pagination for orgs that have more than 100 users.
*/

import axios from "axios";
import { ACCESS_TOKEN, API_URL, ORG_ID } from "./constant.js";

// Function to fetch users
export const fetchUsers = async () => {
  try {
    let activeUsers = [];

    //get all users from org using the SCIM 2.0 Search Users API.
    const response = await axios.get(`${API_URL}/identity/scim/${ORG_ID}/v2/Users?count=100`, {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json"
        }
    });

    const rawUserData = response.data.Resources;

    /* collect all active users with active accountStatus. 
    Some records do not return accountStatus, seems that the API returns it mainly when accountStatus is pending (for unverified users for example). 
    But also seeing on occasion that it returns active accountStatus, the API seems a bit buggy. 
    In any case, working around this through code below. */
    rawUserData.forEach((user) => {

      // this is the schema that the accountStatus field is in.
      const userIDschema = user["urn:scim:schemas:extension:cisco:webexidentity:2.0:User"];

      // if accountStatus doesn't exist and user is active, add user to array.
      if(!userIDschema.hasOwnProperty("accountStatus") && (user.active)) {
          activeUsers.push(user);
      }

      //if accountStatus exists and its value is active, add user to array.
      if(userIDschema.hasOwnProperty("accountStatus") && userIDschema.accountStatus[0] === "active") {
          activeUsers.push(user);
      }
    });

    console.log(`Filtered down to ${activeUsers.length} users in total.`);

    return activeUsers;

  } catch (error) {
    console.error("Error fetching users: ", error);
  }
};