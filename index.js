var express = require("express");
var app = express();

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://guest:dank@localhost:5432/restaurant";
const pool = new Pool({connectionString: connectionString});

app.set("port", (process.env.PORT || 5000));

app.get("/getRestaurant", getRestaurant);

app.listen(app.get("port"), function () {
    console.log("Now listening for connections on port: ", app.get("port"));
});

function getRestaurant(req, res) {
    console.log("Getting the restaurant information.");

    var id = req.query.id;
    console.log("Retrieving restaurant id", id);

    getTable(id, function(error, result) {
        if (error || result == null || result.length != 1) {
            res.status(500).json({success:false, data: error});
        } else {

            res.json(result[0]);
        }
    });
}

function getTable(id, callback) {
    console.log("get restaurant called with id: ", id);

    var sql = "SELECT * FROM restaurants WHERE id = $1::int";
    var params = [id];

    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("error with the database occured");
            console.log(err);
            callback(err, null);
        }

        console.log("Found database result: " + JSON.stringify(result.rows));

        callback(null, result.rows);
    });
}