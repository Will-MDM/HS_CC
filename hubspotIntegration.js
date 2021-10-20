/* eslint-disable no-console */
const moment = require('moment-timezone');
const hubspotClient = require('../config/hubspot');
const { hubSpotKey, hubspotPortalId, hubspotObjectType } = require('../config');
const { eventStatusValues, eventPrivacy } = require('./index');

// Basic HubSpot contact creation
const createHubspotContact = async (newUser, isInvited) => {
  try {
    const contactObj = {
      properties: {
        firstname: newUser.name,
        lastname: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        jobtitle: newUser.position,
        mobilephone: newUser.cellPhone,
        id_number: newUser.documentNumber,
        extension: newUser.ext,
        company: isInvited ? isInvited.client_name : null
      }
    };
    const createdContactResponse = await hubspotClient.crm.contacts.basicApi.create(contactObj);
    return createdContactResponse;
  } catch (error) {
    console.error('Contact creation has failed for HubSpot:', error);
  }
  return null;
};

// Basic Hubspot contact search
const searchHubspotContact = async userEmail => {
  try {
    // Filter by unique property email to search CONTACTID
    const filter = { propertyName: 'email', operator: 'EQ', value: userEmail };
    const filterGroup = { filters: [filter] };
    const sort = JSON.stringify({ propertyName: 'email', direction: 'DESCENDING' });
    const properties = ['email'];
    const payload = userEmail;
    const after = 0;
    const publicObjectSearchRequest = {
      filterGroups: [filterGroup],
      sorts: [sort],
      properties,
      payload,
      after
    };
    const contactSearchResult = await hubspotClient.crm.contacts.searchApi.doSearch(publicObjectSearchRequest);
    if (contactSearchResult && contactSearchResult.body.total === 0) {
      console.error('Search results does not match any contact on Hubspot.');
    }
    return contactSearchResult;
  } catch (error) {
    console.error('Contact search has failed for HubSpot:', error);
  }
  return null;
};

// Basic Hubspot update contact
const updateHubspotContact = async (updatedUserInfo, searchContactResult, locationNames) => {
  try {
    const contactObj = {
      properties: {
        firstname: updatedUserInfo.name,
        lastname: updatedUserInfo.lastName,
        id_number: updatedUserInfo.documentNumber,
        email: updatedUserInfo.email,
        phone: updatedUserInfo.phone,
        jobtitle: updatedUserInfo.position,
        mobilephone: updatedUserInfo.cellPhone,
        extension: updatedUserInfo.ext,
        country: locationNames ? locationNames[0] : '',
        state: locationNames ? locationNames[1] : '',
        city: locationNames ? locationNames[2] : ''
      }
    };
    if (searchContactResult && searchContactResult.body.total === 0) {
      console.error('Current contact does not match any record on Hubspot. Update is not possible.');
    }
    await hubspotClient.crm.contacts.basicApi.update(searchContactResult.body.results[0].id, contactObj);
  } catch (error) {
    console.error('Contact update has failed for HubSpot:', error);
  }
};

// Hubspot create company
const createHubspotCompany = async newClient => {
  try {
    // New Company Object
    const companyObj = {
      properties: {
        name: newClient.business_name,
        address: newClient.address,
        website: newClient.web_site,
        document_number: newClient.documentNumber,
        bussiness_email: newClient.bussiness_email,
        phone: newClient.contact_phone,
        base_de_datos_origen: 'Registros BIMBAU'
      }
    };
    const createdCompanyResponse = await hubspotClient.crm.companies.basicApi.create(companyObj);
    return createdCompanyResponse;
  } catch (error) {
    console.error('Company creation has failed for HubSpot:', error);
  }
  return null;
};

// Basic Hubspot company search
const searchHubspotCompany = async companyInfo => {
  try {
    // Filter by unique property NIT to search COMPANY ID
    const filter = { propertyName: 'document_number', operator: 'EQ', value: companyInfo.documentNumber };
    const filterGroup = { filters: [filter] };
    const properties = ['document_number'];
    const limit = 1;
    const after = 0;
    const publicObjectSearchRequest = {
      filterGroups: [filterGroup],
      properties,
      limit,
      after
    };
    const searchCompanyResult = await hubspotClient.crm.companies.searchApi.doSearch(publicObjectSearchRequest);
    if (searchCompanyResult && searchCompanyResult.body.total === 0) {
      console.error('Search results does not match any company on Hubspot.');
    }
    return searchCompanyResult;
  } catch (error) {
    console.error('Company search has failed for HubSpot:', error);
  }
  return null;
};

// Basic Hubspot company update
const updateHubspotCompany = async (updatedClient, searchedHubspotCompany) => {
  try {
    // Company object properties to update
    const companyObj = {
      properties: {
        name: updatedClient.business_name,
        address: updatedClient.address,
        website: updatedClient.web_site,
        document_number: updatedClient.documentNumber,
        bussiness_email: updatedClient.bussiness_email,
        facebook_company_page: updatedClient.social_networks[0],
        linkedin_company_page: updatedClient.social_networks[3]
      }
    };
    if (searchedHubspotCompany && searchedHubspotCompany.body.total === 0) {
      console.error('Current company does not match any record on Hubspot. Update is not possible.');
    }
    await hubspotClient.crm.companies.basicApi.update(searchedHubspotCompany.body.results[0].id, companyObj);
  } catch (error) {
    console.error('Company update has failed for HubSpot:', error);
  }
};

// Create company-contact association
const createAssociationToContact = async (companyHubspotId, contactHubspotId) => {
  try {
    // Create unidirectional association type 2 meaning company to contact
    await hubspotClient.crm.companies.associationsApi.create(companyHubspotId, 'contacts', contactHubspotId, '2');
  } catch (error) {
    console.error('Company to contact association has failed for HubSpot:', error);
  }
};

// Create contact-company association
const createAssociationToCompany = async (searchCompanyResult, createdContactInfo) => {
  try {
    if (searchCompanyResult && searchCompanyResult.body.total === 0) {
      console.error('This company  does not exist in Hubspot. Is not possible to create an association.');
    } else {
      // Create unidirectional association type 1 meaning contact TO company
      await hubspotClient.crm.contacts.associationsApi.create(createdContactInfo.body.id, 'companies', searchCompanyResult.body.results[0].id, '1');
    }
  } catch (error) {
    console.error('Contact to company association has failed for HubSpot:', error);
  }
};

// Create Hubspot tender object
const createHubspotTender = async publishedEvent => {
  try {
    await hubspotClient.apiRequest({
      method: 'POST',
      path: `/crm/v3/objects/${hubspotObjectType}?portalId=${hubspotPortalId}&hapikey=${hubSpotKey}`,
      body: {
        properties: {
          fecha_de_publicacion: moment(publishedEvent.publicated_at).locale('es').format('MMMM DD, YYYY'),
          estado: eventStatusValues[publishedEvent.status].value,
          id_licitacion: publishedEvent.id,
          nombre_licitacion: publishedEvent.event_name,
          tipo_de_participacion: eventPrivacy[publishedEvent.request_type].text
        }
      }
    });
  } catch (error) {
    console.error('Tender creation has failed for HubSpot:', error);
  }
};

// Create contact invited for tender only with email because does not belong to Bimbau directory yet
const createHubspotContactInvitationToTender = async invitedUserEmail => {
  try {
    const contactObj = {
      properties: {
        email: invitedUserEmail
      }
    };
    const createdContactResponse = await hubspotClient.crm.contacts.basicApi.create(contactObj);
    return createdContactResponse;
  } catch (error) {
    console.error('Contact creation by invitation to tender has failed for HubSpot:', error);
  }
  return null;
};

// Create contact to tender association
const createAssociationToTender = async (tenderHubsspotId, contactHubspotId) => {
  try {
    await hubspotClient.apiRequest({
      method: 'PUT',
      path: `/crm/v3/objects/${hubspotObjectType}/${tenderHubsspotId}/associations/contact/${contactHubspotId}/licitacion_to_contact?hapikey=${hubSpotKey}`
    });
  } catch (error) {
    console.error('Association contact to tender  has failed for HubSpot:', error);
  }
};

// Search tender object ID on Hubspot with unique bimbau tender ID
const searchHubspotTender = async bimTenderId => {
  try {
    const searchHubspotTenderInfo = await hubspotClient.apiRequest({
      method: 'POST',
      path: `/crm/v3/objects/${hubspotObjectType}/search?hapikey=${hubSpotKey}`,
      body: {
        filterGroups: [
          {
            filters: [
              {
                value: `${bimTenderId}`,
                propertyName: 'id_licitacion',
                operator: 'EQ'
              }
            ]
          }
        ],
        properties: ['id_licitacion']
      }
    });
    if (searchHubspotTenderInfo && searchHubspotTenderInfo.body.total === 0) {
      console.error('Current tender does not match any record on Hubspot.');
    }
    return searchHubspotTenderInfo;
  } catch (error) {
    console.error('Tender search has failed for HubSpot:', error);
  }
  return null;
};

module.exports = {
  createHubspotContact,
  searchHubspotCompany,
  createAssociationToCompany,
  searchHubspotContact,
  updateHubspotContact,
  createHubspotCompany,
  createAssociationToContact,
  updateHubspotCompany,
  createHubspotTender,
  createHubspotContactInvitationToTender,
  createAssociationToTender,
  searchHubspotTender
};
