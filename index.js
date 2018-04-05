var request = require("request");
var log = require("fancy-log");
var colors = require("ansi-colors");

var API_URL = "https://www.cloudflare.com/api_json.html";
var PLUGIN = "gulp-cloudflare";

module.exports = function(options) {
	"use strict";
	if (!options) {
		log(colors.red(PLUGIN + " " + "config file is not defined"));
		return;
	}
	if (!options.token || !options.email || !options.zone) {
		log(colors.red(PLUGIN + " " + "These options are not valid."));
		return;
	}
	if (options.skip) {
		return;
	}

	var options = {
		token: "token",
		email: "email",
		zone: "zone"
	};
	var cloudflareOptions = {
		url:
			"https://api.cloudflare.com/client/v4/" +
			options.zone +
			"/purge_cache",
		method: "GET",
		headers: {
			"X-Auth-Email": options.email,
			"X-Auth-Key": options.token
			// "Content-Type": "application/json" // redundant
		},
		json: { purge_everything: true }
	};

	request.post(cloudflareOptions, function CloudFlareResponse(err, res) {
		if (err) {
			log(colors.red(PLUGIN + " " + err.message));
			return;
		}
		if (!res && !res.statusCode) {
			log(colors.red(PLUGIN + " " + "Clodflare server not responding:("));
			return;
		}
		if (res.statusCode !== 200 || res.body.result === "error") {
			var errorMessage = "Not able to purge cache.";
			if (res.body && res.body.msg) {
				errorMessage = res.body.msg;
			}
			log(colors.red(PLUGIN + " " + errorMessage));
		}
		if (res.body.success === true) {
			var message = "Successfully purged cache.";
			log(colors.red(PLUGIN + " " + message));
		}
	});
};
