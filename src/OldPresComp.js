// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import webex from "./utils/webex.js"; // Webex SDK instance
// //import { fetchUsers } from "./utils/users.js"; // SCIM Users API utility
// import { mergeMatchingRecords } from "./utils/merger.js"; 
// import { usersJson } from "./utils/test.js";

// export default function PresenceUpdates() {

//   console.log("🔄 Component is rendering..."); // Logs every render

//   const [initialUserPresence, setInitialUserPresence] = useState([]);
//   //const [users, setUsers] = useState([]);
//   // const [subscribedPresenceData, setSubscribedPresenceData] = useState([]);
//   const [initialUserTable, setInitialUserTable] = useState([]);

//   // Fetch all users from SCIM API
//   const orgUsers = useMemo(() => usersJson, []);//await fetchUsers();
//   const userIds = useMemo(() => orgUsers.map((user) => user.id), [orgUsers]); // Extract SCIM User IDs
//   console.log("User IDs are: ", userIds);

//   const initializePresence = useCallback((isMounted) => {
//     try {

//       if (isMounted) {
//         // Save users and extract IDs for presence subscription
//         //setUsers(orgUsers);
//         //console.log("users state is: ", users);
        
        

//         // Subscribe to presence updates
//         // webex.internal.presence.subscribe(userIds).then((subscribed) => {
//         //   console.log("Subscribed to users presence successfully: ", subscribed);
//         // })
//         // .catch((error) => {
//         //   console.error("Error subscribing to users presence. Error: ", error);
//         // });

//         // Fetch initial presence data
//         console.log("Now attempting to list users' presence..");
//         webex.internal.presence.list(userIds)
//         .then((presenceDataListed) => {
//           console.log("Presence Data obtained from List function. ", presenceDataListed);
//           setInitialUserPresence(presenceDataListed);
//           console.log("initialUserPresence state is: ", initialUserPresence);
//         })
//         .catch((error) => {
//           console.error("Error fetching presence data. Error: ", error);
//         });

//         console.log("Now check if initialUserPresence is ready..");
//         if (initialUserPresence.length !== 0 && initialUserPresence.statusList.length > 0) {
//           console.log("Inside the if statement within initialUserPresence content check.");
//           const constructInitialTable = mergeMatchingRecords(orgUsers, initialUserPresence);

//           //console.log("construct final table is: ", constructInitialTable);
//           setInitialUserTable(constructInitialTable);
//           console.log("initialUserTable state is: ", initialUserTable);
//         }

//         // const initialPresence = await Promise.all(
//         //   userIds.map((id) => webex.internal.presence.get(id))
//         // );

//         // if (isMounted) {
//         //   setPresenceData(
//         //     initialPresence.map((data, index) => ({
//         //       id: userIds[index],
//         //       status: data.status || "unknown",
//         //       displayName: orgUsers[index]?.displayName || "Unknown"
//         //     }))
//         //   );
//         // }

//         // Listen for presence change events
//         // webex.internal.mercury.on('event:apheleia.subscription_update', (data) => {
//         //   if (isMounted) {
//         //     console.log("Presence updated:", data);

//         //     setPresenceData((prevData) =>
//         //       prevData.map((user) =>
//         //         user.id === data.subject
//         //           ? { ...user, status: data.status }
//         //           : user
//         //       )
//         //     );
//         //   }
//         // });
//       }
//     } catch (error) {
//       console.error("Error initializing presence: ", error);
//     }
//   }, [orgUsers, userIds, initialUserPresence, initialUserTable]);

//   useEffect(() => {
//     console.log("useEffect running..");
//     let isMounted = true;

//     initializePresence(isMounted);

//     return () => {
//       console.log("I'm being cleaned up!");
//       isMounted = false;
//       try {
//         //const userIds = users.map((user) => user.id);
//         //await webex.internal.presence.unsubscribe(userIds);
//         //setFinalUserTable([]);
//         console.log("try of return statement...");
//       } catch (error) {
//         console.error("catch of return statement ---Error unsubscribing from presence updates:", error);
//       }
//     };
//   }, [initializePresence]); 

//   // useEffect(() => {
//   //   console.log("Second useEffect running..");
//   //   if (initialUserPresence.length !== 0 && initialUserPresence.statusList.length > 0) {
//   //     console.log("Inside the if statement of 2nd useEffect");
//   //     const constructInitialTable = mergeMatchingRecords(users, initialUserPresence);

//   //     //console.log("construct final table is: ", constructInitialTable);
//   //     setInitialUserTable(constructInitialTable);
//   //     console.log("Now initialUserTable should be set, with value as: ", initialUserTable);
//   //   }
//   // });


//   if (initialUserTable.length === 0) {
//     console.log("Still Loading...");
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Presence Updates</h1>
//       <table border="1" style={{ width: "100%", textAlign: "left" }}>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Presence Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {initialUserTable.map((user) => (
//             <tr key={user.id}>
//               <td>{user.name}</td>
//               <td>{user.email}</td>
//               <td>{user.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// //export default PresenceUpdates;