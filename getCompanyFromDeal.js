const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  const hubspotClient = new hubspot.Client({
    apiKey: process.env.HAPIKEY
  });
 
  const thisObjectId = event.object.objectId;
  
   hubspotClient.crm.deals.associationsApi.getAll(thisObjectId, "company")
    .then(results => results.body.results[0].id)
     .then(linkedCompanyId => {
		hubspotClient.crm.companies.basicApi.getById(linkedCompanyId, ["address", "address2", "zip", "city", "phone", "mobile_phone", "name"])
         .then(results => {
          let address = results.body.properties.address + (results.body.properties.address2 ? " " + results.body.properties.address2 : "") + " " + results.body.properties.zip + " " + results.body.properties.city
          let phone = results.body.properties.phone|| results.body.properties.mobile_phone;
          let name = results.body.properties.name;
          
          console.log(
            "======== infos to return",
            address, phone, name, results.body.properties.hs_object_id
          )
          callback({
            outputFields: {
              companyAddress: address,
              companyPhone: phone, 
              companyName: name,
              companyId: results.body.properties.hs_object_id
            }
          });
         })
         .catch(err => {
            console.log(err);
         })
    })
  .catch(err => {
    console.error(err)
  });
}
