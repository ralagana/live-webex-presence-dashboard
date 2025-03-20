import axios from "axios";
import { ACCESS_TOKEN, API_URL, ORG_ID } from "./utils/constant.js";

// /*
// --RESPONSE FROM .list presence method--
// category: "unknown"
// expiresTTL: -1
// status: "unknown"
// subject: "1412d869-de2c-4d7d-8aa4-bc30240e3e00"
// suppressNotifications: false
// url: "https://apheleia.prod-afra-general2.wbx2.com/apheleia/api/v1?userId=1412d869-de2c-4d7d-8aa4-bc30240e3e00"
// vectorCounters: {sourceDC: 'urn:TEAM:eu-central-1_k', counters: {…}}
// [[Prototype]]: Object
// */

const fetchUsers = async () => {
    try {
        const activeUsers = [];

        const response = await axios.get(`${API_URL}/identity/scim/${ORG_ID}/v2/Users?count=100`, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        const rawUserData = response.data.Resources;

        rawUserData.forEach((user) => {
            const userIDschema = user["urn:scim:schemas:extension:cisco:webexidentity:2.0:User"];

            if(!userIDschema.hasOwnProperty("accountStatus") && (user.active)) {
                activeUsers.push(user);
            }

            if(userIDschema.hasOwnProperty("accountStatus") && userIDschema.accountStatus[0] === "active") {
                activeUsers.push(user);
            }
        });

        console.log(`Filtered down to ${activeUsers.length} users in total.`);

        console.log(JSON.stringify(activeUsers));

    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
}

fetchUsers();

/*
merging matching user records between users and presenceData arrays into one single array. Each array has a different
key identifier, "id" in users array and "subject" in presenceData array. Both represent the same user ID field so I'm 
just mapping both into one single array that we can then use to display the full data in the table/dashboard.
*/
// function mergeMatchingRecords(usersIn, presenceDataIn) {
//     const map = new Map();
  
//     // Store first array in a Map using key1 as the identifier
//     usersIn.forEach(item => {
//       map.set(item["id"], item); // Store object with keyID as reference
//     });
  
//     // Find matches in the second array and merge data
//     const matchedRecords = presenceDataIn
//       .filter(item => map.has(item["subject"])) // Check if keySubject exists in map
//       .map(item => {
//         const match = map.get(item["subject"]); // Get corresponding record from usersIn
//         return {
//           id: item["subject"], // Use keySubject value (or keyID, they should be the same)
//           name: match.displayName, // From usersIn
//           email: match.emails[0], // From presenceDataIn
//           status: item.status // Example: take extra data from usersIn
//         };
//       });
  
//     return matchedRecords;
//   }
  
//   // Example Data
//   const users = [
//     { id: 101, displayName: "Alice", emails: ["bobbie@example.com"] },
//     { id: 102, displayName: "Bobbie", emails: ["charlie@example.com"] },
//     { id: 103, displayName: "Charlie", emails: ["david@example.com"] }
//   ];
  
//   const presenceData = [
//     { subject: 102, status: "Active" }, // Matching but different key name
//     { subject: 103, status: "Inactive" },
//     { subject: 104, status: "Active" } // No match
//   ];
  
//   // Call function specifying different key names
//   const result = mergeMatchingRecords(users, presenceData, "id", "subject");
//   console.log(result);