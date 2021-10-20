// Import the required libraries - HubSpot NodeJS API client
const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  
  // Secrets can be accessed via environment variables.
  // Make sure to add your API key under "Secrets" above.
  const hubspotClient = new hubspot.Client({
    apiKey: process.env.HAPIKEY
  });
  
  hubspotClient.crm.contacts.basicApi.getById(event.object.objectId)
    .then(results => {
    
      //Generate random referrer ID using Math.random() and store in variable
      /* 
        IMPORTANT: There is a chance for a duplicate number to occur using Math.random(). this is just intended as an example. 
        Some ways to protect against this would be to use the CRM Search API to check if any other contact already has that ID and 
        if they do generate a new one. Alternatively you could look to create your own unique code using the current date in conjunction with Math.random()
      */
      var referrerID = Math.floor(Math.random() * 1000);
      
      callback({
        outputFields: {
          referrer_id: referrerID //Store the referrerID as a data output field
        }
      });
    })
    .catch(err => {
      console.error(err);
    });
}