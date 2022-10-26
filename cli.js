#!/usr/bin/env node

import moment from "moment-timezone";
import fetch from "node-fetch";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));

// help
if (args.h) {
	console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -t TIME_ZONE\n    -h            Show this help message and exit.\n    -n, -s        Latitude: N positive; S negative.\n    -e, -w        Longitude: E positive; W negative.\n    -t            Time zone: uses tz.guess() from moment-timezone by default.\n    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n    -j            Echo pretty JSON from open-meteo API and exit.");
    process.exit(0);
}

// timezone
var timezone = moment.tz.guess();
// latitude and longitude
var latitude;
var longitude;

if (args.n) {
	latitude = args.n;
}
if (args.s) {
	latitude = args.s * -1;
}
if (args.w) {
	longitude = args.w * -1;
}
if (args.e) {
	longitude = args.e;
}
if (args.t) {
    timezone = args.t;
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
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + String(latitude) + '&longitude=' + String(longitude) + '&hourly=temperature_2m&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone);
// Get data from request
const data = await response.json();

// json
if (args.j) {
	console.log(data);
	process.exit(0);
}

// days
const days = args.d;

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