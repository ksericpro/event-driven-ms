const express = require("express")

const app = express()

var config_file = "";
var appRoot = process.cwd();
var env="development";
config_file = appRoot + `/config/${env}.json`;

//Process Environment
const path = require('path');
const fs = require('fs');
console.log(`Environment=${env}, Config File=${config_file}`);
var config;
try {
  if (fs.existsSync(config_file)) {
      console.log(`${config_file} exists`);
      var data = fs.readFileSync(config_file, 'utf8');
      //console.log(`content=${data}`);
      config = convertJson(data);
      console.log("config=",config);
      if (!config) {
          console.log("configuration file error");
          process.exit();
      }
      process.env.REDIS = JSON.stringify(config.REDIS);
  } else {
    console.log(`${config_file} does not exists`);
    process.exit();
  }
} catch(err) {
  console.error(err.stack)
}

function convertJson(str) {
  try {
   return JSON.parse(str);
  } catch (e) {
    return "";
  }
}

const port = process.env.PORT || config.PORT;
const prefix = config.PREFIX;
var REDIS_UTILS = require('./utils/redis_utils');

app.get(`/`, (req,res) => {
  res.send("alive");
})

app.get(`/${prefix}`, (req,res) => {
  res.send("This is the server's silly response…");
})

app.get(`/${prefix}/ping`, (req,res) => {
  res.send("ping");
})

async function main() {
  //Redis
  console.log("[Redis]::init");
  await REDIS_UTILS.connect((status) => {
    if (status){
      logger.info("[Redis]::Connected successfully.");
      /*var list = Object.keys(config.REDIS.topics)
      list.forEach(function(objKey) {
          var item = config.REDIS.topics[objKey];
          console.log("processing redis configuration:", item);
          REDIS_UTILS.subscribe_message(item.topic);
      });
      REDIS_UTILS.subscribe_message_handler(redis_handler);*/
    } else {
      logger.error("[Redis]::Connection error.");
    }
  });

  process.on('SIGINT', function() {
    console.log('Ctrl C detected');
    REDIS_UTILS.close();
    process.exit();
  });

  //REDIS_UTILS.publish_message("/hello", "test");

  app.listen(port,() => {
    console.log(`Listening@${prefix}:${port}`);
  });
}

main().then(() => console.log('Started successfully')).catch((ex) => console.log(ex.message));
