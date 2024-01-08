const config = {
    "ENV": process.env.NODE_ENV || "development",
    "PORT": Number(process.env.APP_PORT) || 8000,
    "LOG_FOLDER": "logs",
    "API_VERSION": "/api/v1",
    "APP_NAME" : "/user",
    "APP_FULL_NAME": "Some Solution Event Driven User MS",
    "APP_VERSION": "1.0.0",
    "APP_LAST_RELEASED_DATE": "15/12/2023",
    "MAX_FILE_SIZE": "50mb",
    "AMQP_URL": "amqps://epacexed:OHvwqlBldc_l8D524xK6ySt_XZ_py4-9@mustang.rmq.cloudamqp.com/epacexed",
    "QUEUE_NAME": "event_driven"
};

export default config;