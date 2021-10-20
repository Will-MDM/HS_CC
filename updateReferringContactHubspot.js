// Import the required libraries - in this instance the HubSpot NodeJS API client
const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  
  // Create a new instance of the HubSpot client
  const hubspotClient = new hubspot.Client({
    apiKey: process.env.HAPIKEY
  });
  
  //Use the client to get the referrer_id from the currently enrolled object (Deal).
  hubspotClient.crm.deals.basicApi.getById(event.object.objectId, ["referrer_id"])
    .then(results => {
      let dealReferrerID = results.body.properties.referrer_id; //Deal Referrer ID
  
    //Using the CRM Search API - query the CRM for a contact with a matching refferer_id
    const filter = { propertyName: 'referrer_id', operator: 'EQ', value: dealReferrerID }
    const filterGroup = { filters: [filter] }
    const sort = JSON.stringify({ propertyName: 'referrer_id', direction: 'DESCENDING' })
    const properties = ['referrer_id', 'total_referrals', 'firstname', 'lastname']
    const limit = 100
    const after = 0

    const publicObjectSearchRequest = {
        filterGroups: [filterGroup],
        sorts: [sort],
        properties,
        limit,
        after,
    }
    
  //Make the request to the CRM Search API with attributes defined above
 	hubspotClient.crm.contacts.searchApi.doSearch(publicObjectSearchRequest).then(results =>{
         let contactId = results.body.results[0].id;
         let totalReferrals = 0;
         if(results.body.results[0].properties.total_referrals === null || results.body.results[0].properties.total_referrals === undefined || results.body.results[0].properties.total_referrals === ""){
           totalReferrals = 0;
         }else{
           totalReferrals = parseInt(results.body.results[0].properties.total_referrals)
         }
          
         // Add "1" to the referrals. We'll update the number property on the contact record
         let totalReferralsUpdated = totalReferrals + 1;
    
         // Get the current date - we will use this to update the date property on the contact record
      	 var d = new Date();
      	 d.setUTCHours(0,0,0,0);
         
         // Use the HubSpot client to update the "total_referrals" and "recent_referral_date" property
         hubspotClient.crm.contacts.basicApi.update(contactId, {"properties":{"total_referrals": totalReferralsUpdated, "recent_referral_date": d}});
    });
  });
}   