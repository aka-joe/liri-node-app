// Initialize Spotify API with ID & secret
require("dotenv").config();
var keys = require("./keys");
var spotifyAPI = require("node-spotify-api");
var spotify = new spotifyAPI(keys.spotify);

// Require AXIOS, MOMENT, FS
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var divider = "\n--------------------------------------------------------------\n";

// User Input
var cmd = process.argv[2].toLowerCase();
var term = process.argv.slice(3).join(" ");

// Check user input
switch (cmd) {
    case "spotify-this-song":
        spotifyThisSong();
        break;
    case "movie-this":
        console.log("movie");
        break;
    case "do-what-it-says":
        console.log("do what it says");
        break;
    default:
        console.log("Please enter one of these commands:\nspotify-this-song\nmovie-this\ndo-what-it-says");
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

        var result = `${divider}\nArtist : ${data.tracks.items[0].album.artists[0].name}\nTitle  : ${data.tracks.items[0].name}\nPreview: ${data.tracks.items[0].external_urls.spotify}\nAlbum  : ${data.tracks.items[0].album.name}\n${divider}`;

        console.log(result);

        fs.appendFileSync("log.txt", process.argv.join(" ")+"\n"+result, function (error) {
            if (error) {
                console.log(error);
            };
        });
    });
};