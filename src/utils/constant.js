export const ORG_ID = "41747e53-f6ed-4d26-8361-11b6c1de9b00";
export const ACCESS_TOKEN = "Zjk4YWExYjktNGVmNS00YWZkLThiNTktN2VmYzgyYTBhOGI0YzJiYzAzOWEtZWU2_PE93_41747e53-f6ed-4d26-8361-11b6c1de9b00";
export const API_URL = "https://webexapis.com";

/*
Note that above token is a Service App token ("My First Service app" from rlagana7.webex@gmail.com)
SAs need to have the spark:all scope in order to work with the JS SDK.
I'm manually refreshing this token periodically so it might be expired by the time you use this app
You can add your own dev portal token too if you want, works fine with that too. Make sure it's a test user
and not the Cisco org as this hasn't been tested with a large org like that yet (never got there in testing)
*/