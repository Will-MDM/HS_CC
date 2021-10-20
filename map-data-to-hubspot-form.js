function writeFormFieldData(mappingsObject, dataObject) {
    var mappingsObject = mappingsObject
    const changeEvent = new Event('change');
    var mappedFieldsArray = Object.keys(mappingsObject);
    var returnedDataArray = Object.keys(dataObject);
    var fieldsToUpdate = mappedFieldsArray.filter(item => returnedDataArray.includes(item));
    fieldsToUpdate.map(function(dataObjectFieldName) {
        var hsFieldName = mappingsObject[dataObjectFieldName];
        fieldToUpdate = document.querySelector(`[name="${hsFieldName}"]`);
        if (fieldToUpdate == null) {
            console.log('invalid field name')
        } 
        else {
            fieldToUpdate.value = dataObject[dataObjectFieldName];
            fieldToUpdate.dispatchEvent(changeEvent)
        }
    })
}

//sample data object
const data = {
    companyAddress: "25 1st St",
    companyCity: "Cambridge",
    companyCountry: "USA",
    companyCounty: "Suffolk",
    companyMsa: "Cambrride,MA",
    companyName: "HubSpot, Inc",
    companyState: "MA",
    phone: "companyTelephone",
    companyZip5: "02141",
    employeesAtLocationNum: "3000",
    employeesInAllLocations: "Large",
    employeesInAllLocationsNum: "5000"
}
//sample mapping object
var fieldMap = {
    companyName: "company",
    companyAddress: "address",
    companyCity: "city",
    companyState: "state",
    companyZip5: "zip",
    companyCountry: "country",
    employeesAtLocationNum: "numberofemployees",
    phone: "companyTelephone"
}
//call function after page load, including 
//the field mapping object and data object
window.addEventListener('load', (event) => {
    writeFormFieldData(fieldMap, data)
});