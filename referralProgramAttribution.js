const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {

  const hubspotClient = new hubspot.Client({
    apiKey: process.env.HAPIKEY
  });
  
  //1) Get the enrolled deal - referrer_id property value
  hubspotClient.crm.contacts.basicApi.getById(event.object.objectId, ["referrer"])
    .then(results => {
      let referrer = results.body.properties.referrer; //contact Referrer ID
  
   //2) Search for the contact using the deals referrer_id and update
    const filter = { propertyName: 'referrer_id', operator: 'EQ', value: referrer }
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

 	hubspotClient.crm.contacts.searchApi.doSearch(publicObjectSearchRequest).then(results =>{
         let contactId = results.body.results[0].id;
         let totalReferrals = 0;
         if(results.body.results[0].properties.total_referrals === null || results.body.results[0].properties.total_referrals === undefined || results.body.results[0].properties.total_referrals === ""){
           totalReferrals = 0;
         }else{
           totalReferrals = parseInt(results.body.results[0].properties.total_referrals)
         }
      
         let totalReferralsUpdated = totalReferrals + 1;
      
      	var d = new Date();
      	d.setUTCHours(0,0,0,0);
      
         hubspotClient.crm.contacts.basicApi.update(contactId, {"properties":{"total_referrals": totalReferralsUpdated, "recent_referral_date": d}});
    });
  });
}   