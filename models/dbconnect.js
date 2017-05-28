var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'oniddb.cws.oregonstate.edu',
    user: 'sandovja-db',
    password: 'hzfNMZJruf3S3GyQ',
    database: 'sandovja-db',
});

// web page url http://web.engr.oregonstate.edu/~sandovja/

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
