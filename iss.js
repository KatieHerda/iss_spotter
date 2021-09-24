const request = require('request');

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};


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

    const ip = JSON.parse(body).ip;
    //extract just the data, not the full object
    callback(null, ip);
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
    const {latitude, longitude} = JSON.parse(body);
  
    callback(null, {latitude, longitude});
  });
};

//Function the fetches ISS flyovers for a given location
const fetchISSFlyOverTimes = function(coordinates, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`, (error, response, body) => {

    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass time. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);

  });
};

// Only export nextISSTimesForMyLocation and not the other functions, they are not needed by external modules.
module.exports = { nextISSTimesForMyLocation };
