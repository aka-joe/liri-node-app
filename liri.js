// Initialize Spotify API with ID & secret
require("dotenv").config();
var keys = require("./keys");
var spotifyAPI = require("node-spotify-api");
var spotify = new spotifyAPI(keys.spotify);

// Require AXIOS, MOMENT, FS
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var red = "\x1b[31m";
var green = "\x1b[32m";
var blue = "\x1b[34m";
var reset = "\x1b[0m";
var divider = "\n\n--------------------------------------------------------------\n" + reset;


// User Input
var cmd = process.argv[2].toLowerCase();
var term = process.argv.slice(3).join(" ");
checkCommand(cmd);

// Check user input
function checkCommand(x) {
    switch (x) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-what-it-says":
            doWhat();
            break;
        default:
            console.log("\nPlease enter one of these commands:\n\nspotify-this-song\nmovie-this\ndo-what-it-says");
    };
};

// Concert
function concertThis() {

    if (term === "") {
        term = "Chris Tomlin";
    };

    var URL = `https://api.seatgeek.com/2/events?q=${term}&client_id=MTQ5NzI0Njl8MTU0ODEyNDcyOS44NA`;

    axios.get(URL)
        .then(function (response) {
            if (typeof response !== 'undefined') {
                var data = response.data.events[0];
                var result = [
                    red + "TITLE : " + reset + data.title,
                    red + "WHERE : " + reset + data.venue.address + ", " + data.venue.extended_address,

                    // Use MOMENT to set format of date
                    red + "WHEN  : " + reset + moment(data.datetime_local).format('LLLL')
                ].join("\n") + red + divider + reset;
            } else {
                var result = "Couldn't find any event. Please try again..." + red + divider + reset;
            };
            logTXT(result , red);
        })
        .catch(function (err) {
            console.error(err);
        });
};

// Spotify
function spotifyThisSong() {

    if (term === "") {
        term = "The Sign Ace of Base";
    };

    spotify.search({
        type: "track",
        query: term,
        limit: 1
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var dataResult = data.tracks.items[0];

        if (typeof dataResult !== 'undefined') {
            var result = [
                green + "ARTIST  : " + reset + dataResult.album.artists[0].name,
                green + "TITLE   : " + reset + dataResult.name,
                green + "PREVIEW : " + reset + dataResult.external_urls.spotify,
                green + "ALBUM   : " + reset + dataResult.album.name
            ].join("\n") + green + divider + reset;
        } else {
            var result = "Couldn't find any song. Please try again..." + green + divider + reset;
        };
        logTXT(result, green);
    });
};

// OMDB
function movieThis() {

    if (term === "") {
        term = "Mr. Nobody";
    };

    var URL = `http://www.omdbapi.com/?t=${term}&y=&plot=short&apikey=trilogy`;

    axios.get(URL)
        .then(function (response) {
            if (response != false) {
                var result = [
                    blue + "TITLE   : " + reset + response.data.Title,
                    blue + "YEAR    : " + reset + response.data.Year,
                    blue + "COUNTRY : " + reset + response.data.Country,
                    blue + "LANGUAGE: " + reset + response.data.Language,
                    blue + "ACTORS  : " + reset + response.data.Actors,
                    blue + "PLOT    : " + reset + response.data.Plot,
                    blue + "INTERNET MOVIE DB RATING: " + reset + response.data.Ratings[0].Value,
                    blue + "ROTTEN TOMATOES RATING  : " + reset + response.data.Ratings[1].Value
                ].join("\n") + blue + divider + reset;
            } else {
                var result = "Couldn't find any movie. Please try again..." + blue + divider + reset;
            };
            logTXT(result, blue);
        })
        .catch(function (err) {
            console.error(err);
        });
};

// do-what-it-says
function doWhat() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) throw err;

        var data = data.split(",");
        cmd = data[0].toLowerCase();
        term = data.slice(1).join(" ");

        checkCommand(cmd);
    });
};

// Console log output and append to Log.txt
function logTXT(result, color) {
    fs.appendFile("log.txt", `node liri.js ${process.argv.slice(2).join(" ")}\n\n${result}\n`, function (err) {
        if (err) throw err;
        console.log(`${color}${divider}${reset}\n${result}`);
    });
};