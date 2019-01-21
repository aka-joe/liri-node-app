// Initialize Spotify API with ID & secret
require("dotenv").config();
var keys = require("./keys");
var spotifyAPI = require("node-spotify-api");
var spotify = new spotifyAPI(keys.spotify);

// Require AXIOS, MOMENT, FS
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

