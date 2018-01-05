const express = require('express');
const path = require('path');
const app = express();
const yargs = require('yargs');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

// Define the port to run on
app.set('port', 8000);

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');


const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

geocode.geocodeAddress(argv.address, (errorMessage, results) => {
  if (errorMessage) {
    console.log(errorMessage);
  } else {
    console.log(results.address);
    weather.getWeather(results.latitude, results.longitude, (errorMessage, weatherResults) => {
      if (errorMessage) {
        console.log(errorMessage);
      } else {
        console.log(`It's currently ${weatherResults.temperature}, but it feels like ${weatherResults.apparentTemperature}.`);
      }
      app.get('/', (req, res) => {

        res.render('home.hbs', {
          pageTitle: 'real temp',
          name: 'David',
          welcomeMessage: "today's weather",
          temp: `${weatherResults.temperature}°`,
          realTemp: `${weatherResults.apparentTemperature}°`,
          address: `In ${results.address}`
        });
      });
    });
  }
});



// Listen for requests
app.listen(8000, () => {
  console.log('Listening on 8000', 'http://localhost:8000');
})
