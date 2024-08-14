const mysql = require("mysql");

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mhnawara",
    database: "myboard",
});

conn.connect((err) => {
    if (err) throw err;
    console.log("db연결 와 다행이다");
});

module.exports = conn;