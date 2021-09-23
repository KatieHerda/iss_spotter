/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

//Function that fetches an IP address
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API

  request('https://api.ipify.org?format=json', (error, response, body) => {
    //error can be set if invalid domain, user is offline, etc.
    if (error) {
      return callback(error, null);
    }

    //if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const data = JSON.parse(body);
    //extract just the data, not the full object
    callback(null, data.ip);

    //confirm IP address is a string
    //console.log(typeof data.ip);
  });
};


//Function that takes in an IP address and returns the latitude and longitude for it.
const fetchCoordsByIP = function(ip, callback) {
  request('https://freegeoip.app/json/', (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    //if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coodinates for IP. Response: ${body}`;
      return callback(Error(msg), null);
    }

    //data restructuring
    const {longitude, latitude} = JSON.parse(body);
  
    callback(null, {longitude, latitude});
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP };