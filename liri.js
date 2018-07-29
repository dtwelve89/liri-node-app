// Required Files
require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");

// NPM Requirements
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");

// Unique Keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Global Variables
var command = process.argv[2];
var media = process.argv.slice(3).join(" ");
var divider = "\n------------------------------------------------------------\n\n";

// Switch Command Function
function liriApp() {
    switch (command) {
        case "my-tweets":
            tweetThis();
            break;
        
        case "spotify-this-song":
            if (!media) {
                media = "The Sign Ace of Base";
            }
            spotifyThis();
            break;
        
        case "movie-this":
            if (!media) {
                media = "Mr. Nobody";
            }
            omdbThis();
            break;
        
        case "do-what-it-says":
            doThis();
            break;
    }
}

// Twitter Command Function
function tweetThis() {
    
    // Run a request to the Twitter API for last 20 user tweets
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

                var tweetData = [
                    "Tweet: " + data[i].text,
                    "Tweeted On: " + data[i].created_at
                ].join("\n\n");

                // Append showData and the divider to log.txt, print showData to the console
                fs.appendFile("log.txt", tweetData + divider, function(err) {
                    if (err) throw err;
                });
                console.log(tweetData);
            }
        }
    });
}

// Spotify Command Function
function spotifyThis() {

    // Run a search to the Spotify API with the song specified
    spotify.search({ type: 'track', query: media }, function(error, data) {

        //If the request is unsuccessful
        if (error) {
          return console.log('Error occurred: ' + error);
        }

        // If the request is successful
        if (!error) {

            // Parse the body of the site and recover desired fields
            var results = data.tracks.items[0];

            var songData = [
                "Artist(s): " + results.artists[0].name,
                "Song Name: " + results.name,
                "Preview URL: " + results.external_urls.spotify,
                "From the Album: " + results.album.name
            ].join("\n\n");

            // Append songData and the divider to log.txt, print songData to the console
            fs.appendFile("log.txt", songData + divider, function(err) {
                if (err) throw err;
                console.log(songData);
            });
        }
    });
}

// OMDB Command Function
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

            var movieData = [
                "Title: " + data.Title,
                "Release Year: " + data.Year,
                "IMDB Rating: " + data.imdbRating,
                "Rotten Tomatoes Rating: " + data.Ratings[1].Value,
                "Country of Production: " + data.Country,
                "Language: " + data.Language,
                "Plot: " + data.Plot,
                "Actors: " + data.Actors
            ].join("\n\n");

            // Append movieData and the divider to log.txt, print movieData to the console
            fs.appendFile("log.txt", movieData + divider, function(err) {
                if (err) throw err;
                console.log(movieData);
            });
        }
    });
}

// Do What it Says Command Function
function doThis() {
    
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        command = dataArr[0];
        media = dataArr[1];

        liriApp();
    });
}

// Initializer
liriApp();