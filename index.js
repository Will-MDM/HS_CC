//backend/routes/index.js:10
async function createHubspotContact(firstName, lastName, email) {
  let hubspotContact;
  try {
    hubspotContact = await axios.get(`https://api.hubapi.com/crm/v3/objects/contacts/${email}/?idProperty=email&hapikey=${hubspotKey}`);
  }
  catch {
    hubspotContact = await axios.post(`https://api.hubapi.com/crm/v3/objects/contacts?hapikey=${hubspotKey}`,
      {
        properties: {
          'firstname': firstName,
          'lastname': lastName,
          'email': email,
        }
      }
    );
  }

  return hubspotContact.data.id;
}