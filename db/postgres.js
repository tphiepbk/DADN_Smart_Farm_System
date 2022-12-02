const { Client } = require('pg')

const POSTGRESQL_CREDENDITALS = {
  user: "postgres",
  host: "localhost",
  database: "data_engineering",
  password: "password",
  port: 5432
}

const getDeviceId = async (deviceName, deviceType, area) => {
  const POSTGRESQL_CLIENT = new Client(POSTGRESQL_CREDENDITALS)

  let deviceId;

  await POSTGRESQL_CLIENT.connect();

  const query = `SELECT id FROM device where name='${deviceName}' and type='${deviceType}' and area_id='${area}'`;
  try {
    const res = await POSTGRESQL_CLIENT.query(query);
    deviceId = res.rows[0]["id"];
  } catch (e) {
    console.log(e);
  } finally {
    await POSTGRESQL_CLIENT.end();
  }

  return deviceId;
}


const saveDeviceData = async (deviceId, deviceListRecord, resolve) => {
  const POSTGRESQL_CLIENT = new Client(POSTGRESQL_CREDENDITALS)

  const deviceListRecord_query = deviceListRecord.map(record => `('${record.id}', '${record.created_at}', ${record.value}, ${deviceId})`);

  POSTGRESQL_CLIENT.connect();

  const query = `INSERT INTO device_data (id, time, value, device_id) VALUES ${deviceListRecord_query.toString()} ON CONFLICT DO NOTHING;`;

  POSTGRESQL_CLIENT.query(query, (err, res) => {
    if (err) {
      resolve("FAILED");
    } else {
      resolve("SUCCESS");
    }
    POSTGRESQL_CLIENT.end();
  })
}

const getLatestValueOfDevice = async (deviceId, callbackFn) => {
  const POSTGRESQL_CLIENT = new Client(POSTGRESQL_CREDENDITALS)

  POSTGRESQL_CLIENT.connect();

  const query = `SELECT value FROM device_data WHERE device_id=${deviceId} ORDER BY time DESC LIMIT 1`;
  console.log(query)

  POSTGRESQL_CLIENT.query(query, (err, res) => {
    if (err) {
      callbackFn("FAILED");
    } else {
      callbackFn(res.rows[0]);
    }
    POSTGRESQL_CLIENT.end();
  })
}

const getNLatestDataOfDevice = async (N, deviceId, callbackFn) => {
  const POSTGRESQL_CLIENT = new Client(POSTGRESQL_CREDENDITALS)

  POSTGRESQL_CLIENT.connect();

  const query = `SELECT * FROM device_data WHERE device_id=${deviceId} ORDER BY time DESC LIMIT ${N}`;
  console.log(query)

  POSTGRESQL_CLIENT.query(query, (err, res) => {
    if (err) {
      callbackFn("FAILED");
    } else {
      callbackFn(res.rows);
    }
    POSTGRESQL_CLIENT.end();
  })
}

const getLatestAggregateValueOfDevice = async (deviceId, callbackFn) => {
  const POSTGRESQL_CLIENT = new Client(POSTGRESQL_CREDENDITALS)

  POSTGRESQL_CLIENT.connect();

  const query = `SELECT avg FROM device_data_average_every_five_seconds WHERE device_id=${deviceId} limit 1`;
  console.log(query)

  POSTGRESQL_CLIENT.query(query, (err, res) => {
    if (err) {
      callbackFn("FAILED");
    } else {
      callbackFn(res.rows[0].avg);
    }
    POSTGRESQL_CLIENT.end();
  })
}

const getNLatestDeviceDataOfArea = async (N, areaId, callbackFn) => {
  const POSTGRESQL_CLIENT = new Client(POSTGRESQL_CREDENDITALS)

  POSTGRESQL_CLIENT.connect();

  const query = `SELECT * FROM device_data JOIN device ON device_data.device_id = device.id WHERE area_id=${areaId} ORDER BY time DESC LIMIT ${N}`;
  console.log(query)

  POSTGRESQL_CLIENT.query(query, (err, res) => {
    if (err) {
      callbackFn("FAILED");
    } else {
      callbackFn(res.rows);
    }
    POSTGRESQL_CLIENT.end();
  })
}

module.exports = {
  saveDeviceData,
  getDeviceId,
  getLatestValueOfDevice,
  getLatestAggregateValueOfDevice,
  getNLatestDeviceDataOfArea,
  getNLatestDataOfDevice
};