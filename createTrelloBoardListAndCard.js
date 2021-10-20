const hubspot = require('@hubspot/api-client');
const request = require('request');

exports.main = (event, callback) => {

    const hubspotClient = new hubspot.Client({
        apiKey: process.env.HAPIKEY
    });

    hubspotClient.crm.deals.basicApi.getById(event.object.objectId, ["dealname"])
        .then(results => {

            let dealName = results.body.properties.dealname;

            // 1. CREATE BOARD
            var options = {
                "method": "POST",
                "url": "https://api.trello.com/1/boards/?key=" + process.env.TRELLO_KEY + "&token=" + process.env.TRELLO_TOKEN + "&name=" + dealName + "&defaultLists=false"
            };

            request(options, function (error, response, body) {
                console.log("BOARD CREATED: " + JSON.parse(body));
                let boardId = JSON.parse(body).id;

                // 2. CREATE LIST(S) ON BOARD
                options = {
                    "method": "POST",
                    "url": "https://api.trello.com/1/lists?key=" + process.env.TRELLO_KEY + "&token=" + process.env.TRELLO_TOKEN + "&name=Stage1&idBoard=" + boardId  //Stage 1
                };
                request(options, function (error, response, body) {
                    console.log("LIST CREATED: " + response.body);
                    let listId = JSON.parse(body).id;

                    // 3. CREATE CARD ON LIST
                    options = {
                        "method": "POST",
                        "url": "https://api.trello.com/1/cards?key=" + process.env.TRELLO_KEY + "&token=" + process.env.TRELLO_TOKEN + "&idList=" + listId + "&name=Test%20Card&desc=This%20is%20a%20test&due=2021-11-18T12:40:33.931Z&dueComplete=false"
                    };
                    request(options, function (error, response, body) {
                        console.log("CARD CREATED: " + JSON.parse(response.body))
                    });

                });

                options = {
                    "method": "POST",
                    "url": "https://api.trello.com/1/lists?key=" + process.env.TRELLO_KEY + "&token=" + process.env.TRELLO_TOKEN + "&name=Stage2&idBoard=" + boardId  //Stage 2
                };
                request(options, function (error, response, body) {
                    console.log("LIST CREATED: " + response.body);
                });

                options = {
                    "method": "POST",
                    "url": "https://api.trello.com/1/lists?key=" + process.env.TRELLO_KEY + "&token=" + process.env.TRELLO_TOKEN + "&name=Stage3&idBoard=" + boardId  //Stage 3
                };
                request(options, function (error, response, body) {
                    console.log("LIST CREATED: " + response.body);
                });

                options = {
                    "method": "POST",
                    "url": "https://api.trello.com/1/lists?key=" + process.env.TRELLO_KEY + "&token=" + process.env.TRELLO_TOKEN + "&name=Stage4&idBoard=" + boardId  //Stage 4
                };
                request(options, function (error, response, body) {
                    console.log("LIST CREATED: " + response.body);
                });
            });
        })
        .catch(err => {
            console.error(err);
        });
}