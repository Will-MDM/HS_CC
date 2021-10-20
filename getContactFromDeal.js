const hubspot = require('@hubspot/api-client');

exports.main = (event, callback) => {
  const hubspotClient = new hubspot.Client({
    apiKey: process.env.HAPIKEY
  });
 
  const thisObjectId = event.object.objectId;
  
   hubspotClient.crm.deals.associationsApi.getAll(thisObjectId, "contact")
    .then(results => results.body.results[0].id)
     .then(linkedContactId => {
		hubspotClient.crm.contacts.basicApi.getById(linkedContactId, ["lastname", "firstname"])
         .then(results => {
          
          console.log("info of result", results.body);
          
          let name = results.body.properties.firstname + (results.body.properties.lastname ? " " + results.body.properties.lastname : "")
          
          console.log(
            "======== infos to return",
            name, results.body.properties.hs_object_id
          )
          callback({
            outputFields: {
              contactName: name,
              contactId: results.body.properties.hs_object_id
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


