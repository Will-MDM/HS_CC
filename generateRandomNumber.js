const hubspot = require('@hubspot/api-client');
var Promise = require("bluebird");
var randomNumber = require("random-number-csprng");

exports.main = (event, callback) => {
  
 	Promise.try(function() {
   
         return randomNumber(1, 2);
      
 	}).then(function(number) {
    	
      console.log("Your sample number:", number);
      
        callback({
        	outputFields: {
           		sampleNumber: number
    		}
        });
      
     }).catch({code: "RandomGenerationError"}, function(err) {
		console.log("Something went wrong!");
 	});
}