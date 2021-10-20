// Import the Hubspot NodeJS Client Library - this will allow us to use the HubSpot APIs
const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  
  // Instantiate a new HubSpot API client using the HAPI key (secret)
  const hubspotClient = new hubspot.Client({
    apiKey: process.env.HAPIKEY
  });
  
  // Retrive the currently enrolled contacts custom "ID" property
  hubspotClient.crm.contacts.basicApi.getById(event.object.objectId, ["custom_id"])
    .then(results => {
	// Get data from the results and store in variables
	let customID = results.body.properties.custom_id;
    
	// Create search criteria   
	const filter = { propertyName: 'custom_id', operator: 'EQ', value: customID }
	const filterGroup = { filters:	[filter] 	}
        const sort = JSON.stringify({ propertyName: 'name', direction: 'DESCENDING'})
        const properties = ['custom_id']
        const limit = 1
        const after = 0
        
        const searchCriteria = {
          filterGroups: [filterGroup],
          sorts: [sort],
          properties,
          limit,
          after
        }
    
      // Search the CRM for Companies matching "ID" variable defined earlier
      hubspotClient.crm.companies.searchApi.doSearch(searchCriteria).then(searchCompanyResponse => {
           hubspotClient.crm.companies.associationsApi.create(searchCompanyResponse.body.results[0].id,'contacts', event.object.objectId,'company_to_contact');
      });
   
      callback({outputFields: {}});
    
    })
    .catch(err => {
      console.error(err);
    });
}