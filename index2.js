//import module 
const { nextISSTimesForMyLocation } = require('./iss_promised');

//converts data that's humans readable
const printPassTimes = function(passTimes) {
  // Next pass at {risetime in date format} for {duration} seconds!
  for (const pass of passTimes) {
    //set date to beginning of time
    const date = new Date(0);
    //set seconds for the specified date
    date.setUTCSeconds(pass.risetime);
    console.log(`Next pass at ${date} for ${pass.duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes)
  })
  .catch((error) => {
    console.log("It didnt't work:", error);
  });