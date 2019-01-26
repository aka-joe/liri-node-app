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
var divider = "\n--------------------------------------------------------------\n";


// User Input
var cmd = process.argv[2];
var term = process.argv.slice(3).join(" ");
checkCommand();

// Check user input
function checkCommand() {
    if (cmd) { cmd = cmd.toLowerCase() };

    switch (cmd) {
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
            console.log(divider + "PLEASE ENTER ONE OF THESE COMMANDS:\n"
                + red + "\nconcert-this"
                + green + "\nspotify-this-song"
                + blue + "\nmovie-this"
                + reset + "\ndo-what-it-says" + divider);
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

                // Use MOMENT to set format of date
                var when = moment(data.datetime_local).format('LLLL');

                var result1 = "node liri.js " + process.argv.slice(2).join(" ") + "\n\n" + [
                    "TITLE : " + data.title,
                    "WHERE : " + data.venue.address + ", " + data.venue.extended_address,
                    "WHEN  : " + when
                ].join("\n");
                var result2 = red + divider + reset + [
                    red + "TITLE : " + reset + data.title,
                    red + "WHERE : " + reset + data.venue.address + ", " + data.venue.extended_address,
                    red + "WHEN  : " + reset + when
                ].join("\n") + red + divider + reset;
            } else {
                var result1 = "Couldn't find any event. Please try again...";
                var result2 = red + divider + reset + result1 + red + divider + reset;
            };
            logTXT(result1, result2);
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
            var result1 = "node liri.js " + process.argv.slice(2).join(" ") + "\n\n" + [
                "ARTIST  : " + dataResult.album.artists[0].name,
                "TITLE   : " + dataResult.name,
                "PREVIEW : " + dataResult.external_urls.spotify,
                "ALBUM   : " + dataResult.album.name
            ].join("\n");
            var result2 = green + divider + reset + [
                green + "ARTIST  : " + reset + dataResult.album.artists[0].name,
                green + "TITLE   : " + reset + dataResult.name,
                green + "PREVIEW : " + reset + dataResult.external_urls.spotify,
                green + "ALBUM   : " + reset + dataResult.album.name
            ].join("\n") + green + divider + reset;
        } else {
            var result1 = "Couldn't find any song. Please try again...";
            var result2 = green + divider + reset + result1 + green + divider + reset;
        };
        logTXT(result1, result2);
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
                var result1 = "node liri.js " + process.argv.slice(2).join(" ") + "\n\n" + [
                    "TITLE   : " + response.data.Title,
                    "YEAR    : " + response.data.Year,
                    "COUNTRY : " + response.data.Country,
                    "LANGUAGE: " + response.data.Language,
                    "ACTORS  : " + response.data.Actors,
                    "PLOT    : " + response.data.Plot,
                    "INTERNET MOVIE DB RATING: " + response.data.Ratings[0].Value,
                    "ROTTEN TOMATOES RATING  : " + response.data.Ratings[1].Value
                ].join("\n");
                var result2 = blue + divider + reset + [
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
                var result1 = "Couldn't find any movie. Please try again...";
                var result2 = blue + divider + reset + result1 + blue + divider + reset;
            };
            logTXT(result1, result2);
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
        cmd = data[0];
        term = data.slice(1).join(" ");

        checkCommand();
    });
};

// Console log output and append to Log.txt
function logTXT(result1, result2) {
    fs.appendFile("log.txt", `${result1}\n${divider}\n`, function (err) {
        if (err) throw err;
        console.log(result2);
    });
};