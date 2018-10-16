// initial varibles and requires
require("dotenv").config();
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');
var moment = require('moment');
var fs = require('fs');
var input = process.argv;
var action = input[2];
var inputs = input[3];

// if statements for arguments
if (action === "concert-this") {
    bandsInTown(inputs)
}
if (action === "spotify-this-song") {
    spotify(inputs);
}
if (action === "movie-this") {
    movie(inputs)
}
if (action === "do-what-it-says") {
    doThis(inputs)

}

// spotify function for calling track information
function spotify(inputs) {

	var spotify = new Spotify(keys.spotify);
		if (!inputs){
        	inputs = 'The Sign - ace of base';
    	}
		spotify.search({ type: 'track', query: inputs }, function(err, data) {
			if (err){
	            console.log('Error occurred: ' + err);
	            return;
	        }

            var songInfo = data.tracks.items;
	        console.log("Artist(s): " + songInfo[0].artists[0].name);
	        console.log("Song Name: " + songInfo[0].name);
	        console.log("Preview Link: " + songInfo[0].preview_url);
	        console.log("Album: " + songInfo[0].album.name);
	});
};

// OMDB function for calling movie titles
function movie(inputs) {

	var queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=ced56c7c";

	request(queryUrl, function(error, response, body) {
		if (!inputs){
        	inputs = 'Mr Nobody';
    	}
		if (!error && response.statusCode === 200) {

		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors);
		}
	});
};

//bands in town function for pulling concert information
function bandsInTown(inputs) {

	var queryUrl = "https://rest.bandsintown.com/artists/" + inputs + "/events?app_id=codingbootcamp" 

	request(queryUrl, function(error, response, body) {
        
		if (!inputs){
        	inputs = 'Mr Nobody';
    	}
		if (!error && response.statusCode === 200) {

            var concert = JSON.parse(body)
            var date = moment(concert[0].datetime).format("MM/DD/YYYY")
		    console.log("Venue: " + concert[0].venue.name);
		    console.log("Location: " + concert[0].venue.city);
		    console.log("Time: " + date);
		    
		}
	});
};

// function to read random.txt file and run another function
function doThis () {
    fs.readFile('random.txt', "utf8", function(err, data){
        if (err) {
            return console.log(err);
        }
        var randomArr = data.split(",");

        if (randomArr[0] === "spotify-this-song") {
            var songName = randomArr[1].slice(1, -1);
            spotify(songName);
        }
        else if (randomArr[0] === "concert-this") {
            var bandName = randomArr[1].slice(1, -1);
            bandsInTown(bandName);
        }
        else if (randomArr[0] === "movie-this") {
            var movieName = randomArr[1].slice(1, -1);
            movie(movieName);
        }
    });  
};
