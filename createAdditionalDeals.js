const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {

  	// Setup the HubSpot API Client
    const hubspotClient = new hubspot.Client({
        apiKey: process.env.HAPIKEY
    });

  	// Use the client to pull information relating to the currently enrolled deal
    hubspotClient.crm.deals.basicApi.getById(event.object.objectId, ["contract_length", "amount", "closedate", "dealname"])
        .then(results => {
      
      		// Store the appropriate data relating to the currently enrolled deal in variables
            let contract_length = results.body.properties.contract_length; // This is the length of the contract and dictates how many deals we will create
            let amount = results.body.properties.amount; // This is the amount of the deal
            let closedate = results.body.properties.closedate; //This is the close date of the deal
            let dealname = results.body.properties.dealname; // This is the name of the deal
            let BatchInputSimplePublicObjectInput = "";

      		// Construct our request body
            let deals = [];
            for (let i = 1; i < contract_length; i++) {
                deals.push({
                    properties: {
                        "amount": amount,
                        "closedate": closedate,
                        "dealname": "MONTH " + i + ": " + dealname,
                        "dealstage": XXXXXX, // You will need to insert your own dealstage ID
                        "pipeline": XXXXXX  // You will need to insert your own pipeline ID
                    }
                })
            }

            BatchInputSimplePublicObjectInput = {
                inputs: deals
            };

            try {
                hubspotClient.crm.deals.batchApi.create(BatchInputSimplePublicObjectInput); // Make a request to batch create X deals
            } catch (e) {
                e.message === 'HTTP request failed' ?
                    console.error(JSON.stringify(e.response, null, 2)) :
                    console.error(e)
            }

            callback({
                outputFields: {}
            });
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
}