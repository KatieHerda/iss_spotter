/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const URL = 'https://api.ipify.org?format=json';


//Function that fetches an IP address
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API

  request(URL, (error, response, body) => {
    //error can be set if invalid domain, user is offline, etc.
    if (error) {
      return callback(error, null);
    }

    //if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    //extract just the data, not the full object
    callback(null, data.ip);

    //confirm IP address is a string
    //console.log(typeof data.ip);
  });
};


module.exports = { fetchMyIP };