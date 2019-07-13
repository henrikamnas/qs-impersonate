'use strict';

const fs = require('fs');
const config = require('./config.js');
const request = require('request');
const open = require('open');

/**
 * Our Qlik Sense Server information
 * Needs exported certificates from Qlik Sense QMC
 */
var r = request.defaults({
    rejectUnauthorized: false,
    cert: fs.readFileSync(__dirname + '/client.pem'),
    key: fs.readFileSync(__dirname + '/client_key.pem')
})

/**
 * Request ticket from QPS.
 * Adjust uri as needed.
 */
function getQlikSenseTicket(directory, user, callback) {    
    r.post({
        uri: `${config.engineHost}:4243/qps/ticket?xrfkey=abcdefghijklmnop`,
        body: JSON.stringify({
            "UserDirectory": directory,
            "UserId": user,
            "Attributes": []
        }),
        headers: {
            'x-qlik-xrfkey': 'abcdefghijklmnop',
            'content-type': 'application/json'
        }
    }, function(err, res, body) {
        if(err) return callback(err);

        var ticket = JSON.parse(body)['Ticket'];
        
        callback(null, ticket);       
    });
};

getQlikSenseTicket(config.userDirectory,config.userName, function(err, ticket) {
    if(!err) {
        // If we got a ticket redirect to hub with ticket appended
    //   console.log(`${config.host}/hub/?qlikTicket=${ticket}`);
      open(`${config.host}/hub/?qlikTicket=${ticket}`);
            
    } else {
        console.log('404');
        // handle error<
    }
});