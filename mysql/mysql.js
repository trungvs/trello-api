var mysql = require('mysql2')
require('dotenv').config()


const MYSQL_DB = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})

module.exports = {MYSQL_DB}
