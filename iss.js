//import module
const request = require("request");

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  const URL = 'https://api.ipify.org/?format=json';
  request(URL, (error, response, data) => {
    //check for errors if any
    if (error) {
      callback(error, null);
      return;
    }

    //assume server error if non-200 status
    if (response.statusCode !== 200) {
      callback(Error(`Status code ${response.statusCode} when fetching IP. Response: ${data}`), null);
      return;
    }

    //parse data
    const ipObject = JSON.parse(data);
    callback(null, ipObject.ip);
  });
};

const fetchCoordsByIP = function(IP, callback) {
  const URL = `https://freegeoip.app/json/?${IP}`;
  request(URL, (error, response, data) => {

    //check for errors if any
    if (error) {
      callback(error, null);
      return;
    }

    //assume server error if non-200 status
    if (response.statusCode !== 200) {
      callback(Error(`Status code ${response.statusCode} when fetching coordinates for IP: ${data}`), null);
      return;
    }

    //parse data
    const coordinates = JSON.parse(data);
    const { latitude, longitude } = coordinates;
    callback(null, { latitude, longitude });
  });
};


/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const URL = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(URL, (error, response, data) => {
    //check for errors if any
    if (error) {
      callback(error, null);
      return;
    }

    //assume server error if non-200 status
    if (response.statusCode !== 200) {
      callback(Error(`Status code ${response.statusCode} when fetching fly times: ${data}`), null);
      return;
    }
    //parse data
    const flytimes = JSON.parse(data).response;
    callback(null, flytimes);
  });
};

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

    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coordinates, (error, flytimes) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, flytimes);
      });
    });
  });
}

//export module
module.exports = { nextISSTimesForMyLocation };