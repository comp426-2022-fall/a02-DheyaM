#!/usr/bin/env node

import moment from "moment-timezone";
import fetch from "node-fetch";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

// timezone
const timezone = moment.tz.guess()

// help
if (argv.h) {
    console.log("Usage: $0 [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE")
    console.log("  -h\t\tShow this help message and exit.")
    console.log("  -n, -s\tLatitude: N positive; S negative.")
    console.log("  -e, -w\tLongitude: E positive; W negative.")
    console.log("  -z\t\tTime zone: uses /etc/timezone by default.")
    console.log("  -d 0-6\tDay to retrieve weather: 0 is today; defaults to 1.")
    console.log("  -j\t\tEcho pretty JSON from open-meteo API and exit.");
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