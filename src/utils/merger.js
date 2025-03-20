/*
Function below merging matching user records between users and presenceData arrays into one single array. Each array has a different
key identifier, "id" in users array and "subject" in presenceData array. Both represent the same user ID field so I'm 
just mapping both into one single array that we can then use to display the full data in the table/dashboard.
*/

export function mergeMatchingRecords(usersIn, presenceDataIn) {
    const map = new Map();
            
    // Store first array in a Map using key1 as the identifier
    usersIn.forEach(item => {
        map.set(item["id"], item); // Store object with keyID as reference
    });

    // Find matches in the second array and merge data
    const initialRecords = presenceDataIn.statusList;
    const matchedRecords = initialRecords.filter(item => map.has(item["subject"])) // Check if keySubject exists in map
    .map(item => {
        const match = map.get(item["subject"]); // Get corresponding record from usersIn
        return {
            id: item["subject"], // Use id value (or id, they should be the same)
            name: match.displayName, // From usersIn
            email: match.emails[0].value, // From presenceDataIn
            status: item.status // Example: take extra data from usersIn
        };
    });

    console.log("Matched Records are: ", matchedRecords);
    return matchedRecords;
}
  