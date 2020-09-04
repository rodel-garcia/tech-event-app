const fs = require('fs');
const eventsData = JSON.parse(fs.readFileSync(__dirname + '/data/events.json'));
const citiesData = JSON.parse(fs.readFileSync(__dirname + '/data/cities.json'));

module.exports = () => {
  eventsData.map((event) => {
    event.city = citiesData.find((city) => city.id === event.city).name;
  });

  return { events: eventsData, events_length: { total: eventsData.length } };
};
