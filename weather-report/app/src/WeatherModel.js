/* eslint-disable */
import { sequelize, Weather } from './model';

const upsert = (values, id) => {
  return Weather.findOne({ where: { id: id } }).then(obj => {
    if (obj) {
      // update
      return obj.update(values, {where: {id:id} });
    } else {
      // insert
      return insertCityWeather(values);
    }
  });
};

const upSertForeCast = async (values, city) => {
  let w = await Weather.findOne({ where: { city : city } });
  return w.update({foreCast : values }, { where: { city : city } })
}

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
        sunset: data.sunset,
        foreCast : ""
      })
    )
    .then(Weather.findAll().then(items => {}));
};

//Offline weather search
const searchWeather = city => {
  return Weather.findOne({
    where :
          {
            city : sequelize.where(sequelize.fn('LOWER', sequelize.col('city')), 'LIKE', '%' + city + '%')
          }
  }).then(obj => obj.toJSON());
}

export { insertCityWeather, upSertForeCast, upsert, searchWeather };
