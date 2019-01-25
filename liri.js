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
        movieThis();
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

        logTXT(result);
    });
};

// OMDB
function MovieThis() {

    if (term === "") {
        term = "Mr. Nobody";
    };

    var URL = `http://www.omdbapi.com/?t=${term}&y=&plot=short&apikey=trilogy`;

    axios.get(URL)
    .then(function(response) {
        var result = response.data;
        var data = [
            "Show    : " + result.name,
            "Genre(s): " + result.genres.join(" "),
            "Rating  : " + result.rating.average,
            "Network : " + result.network.name,
            "Summary : " + result.summary
        ].join("\n");

        // * Title of the movie.
        // * Year the movie came out.
        // * IMDB Rating of the movie.
        // * Rotten Tomatoes Rating of the movie.
        // * Country where the movie was produced.
        // * Language of the movie.
        // * Plot of the movie.
        // * Actors in the movie.


    })
    .catch(function(err) {
      console.error(err);
    });


    spotify.search({
        type: "track",
        query: term,
        limit: 1
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var result = [
            "Artist  : " + data.tracks.items[0].album.artists[0].name,
            "Title   : " + data.tracks.items[0].name,
            "Preview : " + data.tracks.items[0].external_urls.spotify,
            "Album   : " + data.tracks.items[0].album.name
        ].join("\n") + divider;

        logTXT(result);
    });
};

// Log.txt
function logTXT(result) {
    fs.appendFile("log.txt", `node liri.js ${process.argv.slice(2).join(" ")}\n\n${result}\n`, function (err) {
        if (err) throw err;
        console.log(result);
    });
};