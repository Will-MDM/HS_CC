// custom js for customer mapping with contacts

var buildOriginalAddress = function () {
  var elements = [];
  
  if (originalObject.properties.address) {
    elements.push(originalObject.properties.address);
  }
  if (originalObject.properties.city) {
    elements.push(originalObject.properties.city);
  }
  
  if (originalObject.properties.state) {
    elements.push(originalObject.properties.state);
  }
  
  if (originalObject.properties.zip) {
    elements.push(originalObject.properties.zip);
  }
  
  if (originalObject.properties.country) {
    elements.push(originalObject.properties.country);
  }
  
  return elements.join(', ');
}

if (fromVendor) {
  if ('properties' in originalObject) {
    transformedObject.original_address = buildOriginalAddress();
    transformedObject.is_accurate = false;
  }
}  else {
  delete transformedObject.properties.lastmodifieddate;
}

done(transformedObject);