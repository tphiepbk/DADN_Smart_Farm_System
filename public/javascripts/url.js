const CSE_BBC = "aio_eIzx84QrfGct3jkJM5aW02aKAIbB";
const CSE_BBC1 = "aio_GOii70J59sAf8pkCYFQzT9q6SIXk";
const my_key = "aio_iisO75vFLbGHWVtPofj308dOsBqf";


function get_tempHumidUrl() {
    const temp_humid_url = "https://io.adafruit.com/api/v2/CSE_BBC/feeds/bk-iot-temp-humid/data.json?X-AIO-Key=" + CSE_BBC;
    //const temp_humid_url = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-temp-humid/data.json?X-AIO-Key=" + my_key;
    return temp_humid_url;
}

function get_soilUrl() {
    const soil_url = "https://io.adafruit.com/api/v2/CSE_BBC/feeds/bk-iot-soil/data.json?X-AIO-Key=" + CSE_BBC;
    //const soil_url = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-soil/data.json?X-AIO-Key=" + my_key;
    return soil_url;
}

function get_lightRelayUrl() {
    const light_relay_url = "https://io.adafruit.com/api/v2/CSE_BBC1/feeds/bk-iot-relay/data.json?X-AIO-Key=" + CSE_BBC1;
    //const light_relay_url = "https://io.adafruit.com/api/v2/CSE_BBC1/feeds/bk-iot-light-relay/data.json?X-AIO-Key=" + my_key;
    return light_relay_url;
}

function get_waterPumpRelayUrl() {
    //const water_pump_relay_url = "https://io.adafruit.com/api/v2/CSE_BBC1/feeds/bk-iot-relay/data.json?X-AIO-Key=" + CSE_BBC1;
    const water_pump_relay_url = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-water-pump-relay/data.json?X-AIO-Key=" + my_key;
    return water_pump_relay_url;
}

function get_lightUrl() {
    const light_url = "https://io.adafruit.com/api/v2/CSE_BBC1/feeds/bk-iot-light/data.json?X-AIO-Key=" + CSE_BBC1;
    //const light_url = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light/data.json?X-AIO-Key=" + my_key;
    return light_url;
}