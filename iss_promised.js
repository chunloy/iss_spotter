//import module
const request = require('request-promise-native');

//function definitions
const fetchMyIP = function() {
  return request('https://api.ipify.org/?format=json');
};

const fetchCoordsByIP = function(ipJSON) {
  const IP = JSON.parse(ipJSON).ip;
  return request(`https://freegeoip.app/json/?${IP}`);
};

const fetchISSFlyOverTimes = function(coordsJSON) {
  const coordsObj = JSON.parse(coordsJSON);
  const { latitude, longitude } = coordsObj;
  return request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then((ipJSON) => fetchCoordsByIP(ipJSON))
    .then((coordsJSON) => fetchISSFlyOverTimes(coordsJSON))
    .then((flyTimesJSON) => {
      const { response } = JSON.parse(flyTimesJSON);
      return response;
    });

};

//export module;
module.exports = { nextISSTimesForMyLocation };