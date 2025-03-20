import React, { useState, useEffect, useCallback, useMemo } from "react";
import webex from "./utils/webex.js";
import { mergeMatchingRecords } from "./utils/merger.js";
import { usersJson } from "./utils/test.js";
import { fetchUsers } from "./utils/users.js"; // SCIM Users API utility
import Table from 'react-bootstrap/Table';

export default function PresenceUpdates() {
  console.log("🔄 Component is rendering...");

  const [initialUserPresence, setInitialUserPresence] = useState([]);
  const [initialUserTable, setInitialUserTable] = useState([]);

  const orgUsers = usersJson;//async () =>{ await fetchUsers();}
  const userIds = useMemo(() => orgUsers.map((user) => user.id), [orgUsers]);

  console.log("User IDs are: ", userIds);

  const initializePresence = useCallback((isMounted) => {
    if (!isMounted) return;

    console.log("Now attempting to list users' presence..");
    webex.internal.presence.list(userIds)
      .then((presenceDataListed) => {
        console.log("Presence Data obtained from List function. ", presenceDataListed);
        setInitialUserPresence(presenceDataListed);
      })
      .catch((error) => console.error("Error fetching presence data. Error: ", error));
  }, [userIds]);

  useEffect(() => {
    console.log("useEffect running...");
    let isMounted = true;
    initializePresence(isMounted);

    return () => {
      console.log("Cleaning up...");
      isMounted = false;
    };
  }, [initializePresence]);

  useEffect(() => {
    if (initialUserPresence.length !== 0 && initialUserPresence.statusList.length > 0) {
      console.log("Initial user presence updated. Constructing table...");
      const constructInitialTable = mergeMatchingRecords(orgUsers, initialUserPresence);
      setInitialUserTable(constructInitialTable);
    }
  }, [initialUserPresence]);

  useEffect(() => {
    if(userIds.length === 0){ 
      return;
    } // Avoid unnecessary subscription
  
    console.log("Subscribing to presence updates...");
  
    // Subscribe to presence changes
    webex.internal.presence.subscribe(userIds)
      .then(() => {
        console.log("Successfully subscribed to presence updates.");
      })
      .catch((error) => {
        console.error("Error subscribing to presence updates:", error);
      });
  
    // Listener for real-time presence updates
    const handlePresenceChange = (data) => {
      console.log("Presence update received:", data);
  
      setInitialUserTable((prevTable) =>
        prevTable.map((user) =>
          user.id === data.subject ? { ...user, status: data.status } : user
        )
      );
    };
  
    //event listener for apheleia is within mercury package
    webex.internal.mercury.on('event:apheleia.subscription_update', handlePresenceChange);
    
    // Cleanup: Unsubscribe from presence updates when component unmounts
    return () => {
      console.log("Unsubscribing from presence updates...");
      webex.internal.presence.unsubscribe(userIds)
        .then(() => console.log("Unsubscribed successfully"))
        .catch((error) => console.error("Error unsubscribing:", error));
  
      webex.internal.presence.off("event:change", handlePresenceChange);
    };
  }, [userIds]); // Runs only when `userIds` change

  if (initialUserTable.length === 0) {
    console.log("Still Loading...");
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Presence Updates</h1>
      <table striped bordered hover border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Presence Status</th>
          </tr>
        </thead>
        <tbody>
          {initialUserTable.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
