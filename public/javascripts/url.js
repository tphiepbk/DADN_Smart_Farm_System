const username = "tphiepbk"
const my_aio_key = "aio_Lzjf98yFKjage19nOWPKGJHENd1U";

const soil_humidity_sensor_key = "de-smart-farm.de-smart-farm-soil-humidity-sensor"
const light_sensor_key = "de-smart-farm.de-smart-farm-light-sensor"
const water_pump_relay_key = "de-smart-farm.de-smart-farm-water-pump-relay"
const light_relay_key = "de-smart-farm.de-smart-farm-light-relay"
const air_humidity_sensor_key = "de-smart-farm.de-smart-farm-air-humidity-sensor"
const temperature_sensor_key = "de-smart-farm.de-smart-farm-temperature-sensor"

const get_soilUrl = () => {
    const soil_url = `https://io.adafruit.com/api/v2/${username}/feeds/${soil_humidity_sensor_key}/data.json?X-AIO-Key=${my_aio_key}`;
    return soil_url;
}

const get_lightRelayUrl = () => {
    const light_relay_url = `https://io.adafruit.com/api/v2/${username}/feeds/${light_relay_key}/data.json?X-AIO-Key=${my_aio_key}`;
    return light_relay_url;
}

const get_waterPumpRelayUrl = () => {
    const water_pump_relay_url = `https://io.adafruit.com/api/v2/${username}/feeds/${water_pump_relay_key}/data.json?X-AIO-Key=${my_aio_key}`;
    return water_pump_relay_url;
}

const get_lightUrl = () => {
    const light_url = `https://io.adafruit.com/api/v2/${username}/feeds/${light_sensor_key}/data.json?X-AIO-Key=${my_aio_key}`;
    return light_url;
}

const get_tempUrl = () => {
    const temp_url = `https://io.adafruit.com/api/v2/${username}/feeds/${temperature_sensor_key}/data.json?X-AIO-Key=${my_aio_key}`;
    return temp_url;
}

const get_humidUrl = () => {
    const humid_url = `https://io.adafruit.com/api/v2/${username}/feeds/${air_humidity_sensor_key}/data.json?X-AIO-Key=${my_aio_key}`;
    return humid_url;
}
