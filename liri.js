// Require Files
require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var nodeArg = process.argv;
var command = process.argv[2];
var media = [];

for (var i = 3; i < nodeArg.length; i++) {
    media.push(nodeArg[i]);
}

switch (command) {
    case "my-tweets":
      tweetThis();
      break;
    
    case "spotify-this-song":
      spotifyThis();
      break;
    
    case "movie-this":
      omdbThis();
      break;
    
    case "do-what-it-says":
      doThis();
      break;
}
    
function tweetThis() {
    
    var queryUrl = "https://api.twitter.com/1.1/statuses/user_timeline.json?count=20";
    
    client.request(queryUrl, function(error, response, body) {
        
        //If the request is unsuccessful
        if (error) {
            return console.log(error);
        }
        
        // If the request is successful
        if (!error && response.statusCode === 200) {

            var data = JSON.parse(body);
            
            for (var i = 0; i < data.length; i++) {
                console.log("Tweet: " + data[i].text + "\nTweeted On: " + data[i].created_at + "\n---------------------");
            }
        }
    });
}

function spotifyThis() {
    
    spotify.search({ type: 'track', query: media }, function(err, data) {
        
        //If the request is unsuccessful
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        // Parse the body of the site and recover desired fields
        var results = data.tracks.items[0];

        console.log("Artist(s): " + results.artists[0].name + "\nSong Title: " + results.name + "\nSample URL: " + results.external_urls.spotify + "\nAlbum: " + results.album.name);
    });
}

function omdbThis() {

    // Run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + media + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {

        //If the request is unsuccessful
        if (error) {
            return console.log(error);
        }

        // If the request is successful
        if (!error && response.statusCode === 200) {
        
            // Parse the body of the site and recover desired fields
            var data = JSON.parse(body);

            console.log("Title: " + data.Title + "\nRelease Year: " + data.Year + "\nIMDB Rating: " + data.imdbRating + "\nRotten Tomatoes Rating: " + data.Ratings[1].Value + "\nCountry of Production: " + data.Country + "\nLanguage: " + data.Language + "\nPlot: " + data.Plot + "\nActors: " + data.Actors);
        }
    });
}

function doThis() {
    
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }

        // We will then print the contents of data
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        console.log(dataArr);
    });
}