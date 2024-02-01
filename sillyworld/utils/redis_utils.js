//var LOGGER = require('../logger/loggerutils.js');
//var logger = LOGGER.getLogger();
const redis = require('redis');
var redis_config = JSON.parse(process.env.REDIS);
var redis_port = redis_config.port;
var redis_server = redis_config.server;
var redis_topic = redis_config.topics;
console.log("[Redis]process.env.REDIS="+JSON.stringify(redis_config));

let redis_client;
let redis_timerId;
const retry_interval = 5000;
let CONNECTED = false;

async function connect(callback){
    console.log("[Redis]::Connecting.."+ redis_server + ":"+ redis_port);
    try {
      console.log("1");
      redis_client = await redis.createClient(redis_port, redis_server);
      console.log(redis_client);
      console.log("2")
      redis_client.on("error", function(err) {
         console.log("[Redis]::"+err);
         clearInterval(redis_timerId);
         redis_timerId = setInterval(() => connect(callback), retry_interval);
         CONNECTED = false;
         callback(false);
      });
      redis_client.on("connect", function(msg) {
         clearInterval(redis_timerId);
         CONNECTED = true;
         callback(true)
      });
    } catch(e){
        console.error(e);
    }
}

function get(){
    return redis_client;
}

function close(){
    console.log("[Redis]::Disconnect redis client.");
    redis_client.end(true);
    CONNECTED = false;
}

function find_topic(key){
   var topics = redis_config.topics;
   for(var i=0; i < topics.length; i++){
     var topic = topics[i];
     if (topic.key==key){
       return topic.topic;
     }
   }
   return null;
}

publish_message = function(topic, message) {
  if (!CONNECTED) {console.error("[Redis]::Redis is not connected!"); return;}
    console.log("Publishing Message " + message + " to topic  "+topic);
  if ((message) && (topic)) redis_client.publish(topic, message);
}

subscribe_message = function(topic) {
  if (!CONNECTED) {console.error("[Redis]::Redis is not connected!"); return;}
  if (!topic){logger.error("Topic is null!"); return;}
  console.log("[Redis]::Subscribing to "+topic);
  redis_client.subscribe(topic);
}

subscribe_message_handler = function(callback){
    if (!CONNECTED) {console.error("[Redis]::Redis is not connected!"); return;}
    redis_client.on("message",(channel,message) => {
        console.log("[redis]::Channel="+channel)
        callback(channel, message);
    });
}

module.exports = {
    connect,
    get,
    close,
    publish_message,
    subscribe_message,
    subscribe_message_handler,
    find_topic
};