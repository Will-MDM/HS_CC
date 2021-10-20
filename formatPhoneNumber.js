const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  // Secrets can be accessed with environment variables.
  // Make sure to add your API key under "Secrets" above.
  const hubspotClient = new hubspot.Client({
    apiKey: process.env.HAPIKEY
  });
  
  hubspotClient.crm.contacts.basicApi.getById(event.object.objectId, ["phone"])
    .then(results => {
      let phone = results.body.properties.phone;
 
      var formattedNumber = formatPhoneNumber(phone);
      console.log(formattedNumber);
    
      callback({
        outputFields: {
          formattedNumber: formattedNumber
        }
      });
    })
    .catch(err => {
      console.error(err);
      // We will automatically retry when the code fails because of a rate limiting error from the HubSpot API.
      throw err;
    });
}

// Function takes string input and using regular expression returns a formatted number
function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
}