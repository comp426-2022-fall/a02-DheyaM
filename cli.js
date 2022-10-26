#!/usr/bin/env node

import moment from "moment-timezone";
import fetch from "node-fetch";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

// timezone
const timezone = moment.tz.guess()

// help
if (argv.h) {
	console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -t TIME_ZONE\n    -h            Show this help message and exit.\n    -n, -s        Latitude: N positive; S negative.\n    -e, -w        Longitude: E positive; W negative.\n    -t            Time zone: uses tz.guess() from moment-timezone by default.\n    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n    -j            Echo pretty JSON from open-meteo API and exit.");
    process.exit(0);
}

// check if input is in bounds
if (argv.n || argv.s || argv.e || argv.w){
	if (argv.n < 0 || argv.s > 0){
		console.log("Latitude must be in range");
		process.exit(0);
	}
	if (argv.e < 0 || argv.w > 0){
		console.log("Longitude must be in range");
		process.exit(0);
	}
}


// latitude and longitude
var latitude = 0;
var longitude = 0;

if (argv.n) {
	latitude = argv.n;
}

if (argv.s) {
	latitude = (argv.s) * (-1);
}

if (argv.w) {
	longitude = argv.w * (-1);
}
if (argv.e) {
	longitude = argv.e;
}
if (argv.t) {
    timezone = argv.t;
}
timezone.replace("/", "%2");

if(!latitude) {
	console.log("Latitude must be in range");
	process.exit(0);
} else if (!longitude) {
	console.log("Longitude must be in range");
	process.exit(0);
}

// Make a request
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&daily=precipitation_hours&timezone='+timezone);

// Get data from request
const data = await response.json();

// json
if (argv.j) {
	console.log(data);
	process.exit(0);
}

// days
const days = argv.d;

if (data.daily.precipitation_hours[days] == 0) {
	console.log("You will not need your galoshes")
} else {
	console.log("You might need your galoshes")
}
if (days == 0) {
	console.log(" today.")
} else if (days > 1) {
    console.log(" in " + days + " days.")
} else {
    console.log(" tomorrow.")
}
process.exit(0);