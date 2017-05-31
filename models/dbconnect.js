var mysql = require('mysql');

//attempted this to get my mysql working, it may need to come out, you appear to have done it differently
var pool = mysql.createPool({
    host: 'localhost',
    user: 'student',
    password: 'default',
    database: 'student',
    connectionLimit: 10
});

pool.getConnection(function(err) {
    if(err) {
        console.log("error connecting to database. check db settings");
        throw err
    } else {
        console.log("Database connected");
    }
});

/*connection.pool.query("INSERT INTO review (review, company, rating, user) VALUES (?, ?, ?, ?,), " [req.query.review, req.query.company, req.query.rating, req.query.user], function(err, rows){
    if(err) throw err;
    else{

        // process rows
    }
}
*/

pool.query("DROP TABLE IF EXISTS review", function(err) {
    var createString = "CREATE TABLE review("  +
        "id INT PRIMARY KEY AUTO_INCREMENT," +
        "review TEXT," + 
        "company VARCHAR(255)," +
        "user VARCHAR(255)," +
        "rating INT)";

    pool.query(createString, function(err) {
        if(err) throw err;
    });
}); 

//pool.query()

module.exports.pool = pool;
