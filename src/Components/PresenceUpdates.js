import React, { useState, useEffect, useCallback, useMemo } from "react";
import webex from "../utils/webex.js";
import { mergeMatchingRecords } from "../utils/merger.js";
import { usersJson } from "../utils/test.js";
import { fetchUsers } from "../utils/users.js"; // SCIM Users API utility, temporarily unused
import Table from 'react-bootstrap/Table';

export default function PresenceUpdates() {
  console.log("🔄 Component is rendering...");

  // set state variables and function variables
  const [initialUserPresence, setInitialUserPresence] = useState([]);
  const [initialUserTable, setInitialUserTable] = useState([]);

  /*temporarily pulling user data from a JSON file 
  rather than fetchUsers() function within users.js module*/
  const orgUsers = usersJson;//async () =>{ await fetchUsers();}

  const userIds = useMemo(() => orgUsers.map((user) => user.id), [orgUsers]);

  console.log("User IDs are: ", userIds);

  // starting process of getting user presence
  const initializePresence = useCallback((isMounted) => {
    if (!isMounted) return;

    console.log("Now attempting to list users' presence..");

    //listing user presence with the SDK
    webex.internal.presence.list(userIds)
      .then((presenceDataListed) => {
        console.log("Presence Data obtained from List function. ", presenceDataListed);
        setInitialUserPresence(presenceDataListed);
      })
      .catch((error) => console.error("Error fetching presence data. Error: ", error));
  }, [userIds]);

  useEffect(() => {
    console.log("useEffect1 running...");
    let isMounted = true;
    initializePresence(isMounted);

    return () => {
      console.log("Cleaning up...");
      isMounted = false;
    };
  }, [initializePresence]);

  useEffect(() => {
    console.log("useEffect2 running...");
    // checking if user presence array has any items
    if (initialUserPresence.length !== 0 && initialUserPresence.statusList.length > 0) {
      console.log("Initial user presence updated. Constructing table...");

      // merging results from SCIM and Presence list to construct table for UI
      const constructInitialTable = mergeMatchingRecords(orgUsers, initialUserPresence);
      setInitialUserTable(constructInitialTable);
    }
  }, [initialUserPresence]);

  useEffect(() => {
    console.log("useEffect3 running...");
    if(userIds.length === 0){ 
      return;
    } // Avoid unnecessary subscription
  
    console.log("Subscribing to presence updates...");
  
    // Subscribe to presence changes
    /*The below subscribe() function isn't working properly unfortunately 
    it works intermittently but not reliable, hence the "parking" of this project*/
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
  }, [userIds, initialUserTable]); // Runs only when `userIds` and `initialUserTable` change

  if (initialUserTable.length === 0) {
    console.log("Still Loading...");
    return <div>Loading...</div>;
  }

  // returning render with initial values of the user table
  return (
    <div>
      <h1>Presence Updates</h1>
      <Table striped bordered hover>
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
      </Table>
    </div>
  );
}
