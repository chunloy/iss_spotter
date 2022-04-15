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
  request(URL, (error, response, requestedData) => {
    //check for errors if any
    if (error) {
      callback(error, null);
      return;
    }

    //assume server error if non-200 status
    if (response.statusCode !== 200) {
      callback(Error(`Status code ${response.statusCode} when fetching IP. Response: ${requestedData}`), null);
      return;
    }

    //parse data
    const ipObject = JSON.parse(requestedData);
    callback(null, ipObject.ip);
  });
};

//export module
module.exports = { fetchMyIP };