var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Halcyon17',
    database: 'cptelecom'
});

connection.connect(function(err) {
    if(err) {
        console.log("error connecting to database. check db settings");
        throw err
    } else {
        console.log("Database is connected");
    }
});

connection.query("DROP TABLE IF EXISTS test", function(err) {
    var context = {};
    var createString = " CREATE TABLE test("  +
        "id INT PRIMARY KEY AUTO_INCREMENT";

    connection.query(createString, function(err) {
        console.log("table reset");
    });
});

module.exports = connection;
