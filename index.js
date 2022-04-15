// index.js
const { nextISSTimesForMyLocation } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log('It worked! Returned IP:', ip);
// });

// fetchCoordsByIP('193.19.109.195', (error, coordinates) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log('It worked! Returned coordinates:', coordinates);


// });

// fetchISSFlyOverTimes({ latitude: '34.0544', longitude: '-118.2441' }, (error, flytimes) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log('It worked! Returned fly times:', flytimes);
// });

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

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("it didn't work!", error);
  }
  //print out details
  printPassTimes(passTimes);
});