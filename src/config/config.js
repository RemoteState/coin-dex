const config = {
    "development": {
        "username": process.env.DEV_DB_USERNAME,
        "password": process.env.DEV_DB_PASSWORD,
        "database": process.env.DEV_DATABASE,
        "host": process.env.DEV_DB_HOST,
        "dialect": process.env.DEV_DB_DIALECT
    },
    "test": {
        "username": "postgres",
        "password": "123",
        "database": "lightning",
        "host":"127.0.0.1",
        "dialect": "postgres",
        "port" : 5436
        //"port": 5434
    },
    "production": {
        "username": process.env.PROD_DB_USERNAME,
        "password": process.env.PROD_DB_PASSWORD,
        "database": process.env.PROD_DATABASE,
        "host": process.env.PROD_DB_HOST,
        "dialect": process.env.PROD_DB_DIALECT
    }
}
module.exports = config;
