/* eslint-disable */
import { sequelize, Weather } from './model';

const upsert = (values, id) => {
  return Weather.findOne({ where: { id: id } }).then(obj => {
    if (obj) {
      // update
      return obj.update(values);
    } else {
      // insert
      return insertCityWeather(values);
    }
  });
};

const insertCityWeather = data => {
  return sequelize
    .sync()
    .then(() =>
      Weather.create({
        id: data.id, //2643743,
        city: data.city, //"Pune",
        temperature: data.temperature, //32,
        temp_min: data.temp_min, //32,
        temp_max: data.temp_max, //32,
        country: data.country, //"IN",
        description: data.description, //"few clouds",
        windSpeed: data.windSpeed, //"1.96 ",
        coordLat: data.coordLat, //"18.52",
        coordLon: data.coordLon, //"73.85",
        clouds: data.clouds,
        pressure: data.pressure,
        humidity: data.humidity,
        sunrise: data.sunrise,
        sunset: data.sunset
      })
    )
    .then(Weather.findAll().then(items => {}));
};

const listAll = async function() {
  let prom = Weather.findAll();
  return prom.then(records => {
    return records.map(item => item.toJSON());
  });
};

export { insertCityWeather, listAll, upsert };
