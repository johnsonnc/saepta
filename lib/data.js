/**
 * data.js
 * schema, getters, setters, templates etc
 */

var redis = require("redis");
client = redis.createClient();

client.on("error", function(err) {
	console.log("Redis Client: Error" + err);
});


var schema = {
	userTemplate: function(a) {
		return {
			username: a.username,
			guid: a.guid,
			password: a.password,
			email: a.email,
			company: a.company,
			owns: {},
			participates: {},
			comments: {},
			tz: a.tz
		}
	},

	companyTemplate: function() {
		return {
			companyName: "string",
			companyGuid: "string",
			owner: {},
			owns: {},
			participate: {},
			invitesPending: {},
			invitesAccepted: {}
		}
	},

	meetingTemplate: function() {
		return {
			dateOf: "date",
			companyOwning: "string",
			userOwning: "string",
			details: "string", // things like wear a tie, conference dial in
			status: "string", // closed, open, planning, run-up
			dateCreated: "date",
			dateClosed: "date",
			participatingCompanies: {},
			participatingUsers: {},
			invitedUsers: {},
			invitedCompanies: {},
			associatedAgendaPlanned: {},
			associatedAgendaOpen: {},
			associatedAgendaClosed: {},
			tz: ""
		}
	},

	itemTemplate: function() {
		return {
			dateCreated: "",
			dateClosed: "",
			owningUser: "",
			owningCompany: "",
			votingOn: "",
			voting: {
				fore: "",
				against: "",
				abstain: ""
			},
			comments: {}, // userId :{ comment:, dateCreated:}
			owningAgenda: {},
			owningMeeting: {},
			itemTopic: "",
			itemTitle: "",
			itemTags: [], //tagcloud
			itemDescription: "", //topic?
			itemDetails: ""
		}
	},
	agendaTemplate: function() {
		return {
			dateCreated: "",
			dateReleased: "",
			dateClosed: "",
			dateApproved: "",
			dateOpen: "",
			dateAddressed: "", // same as meeting date.
			creatingCompany: "",
			creatingUser: "",
			lastModified: "",
			approvers: {}, // people who can approve it
			modifiers: {}, //people who can modifiy it
			itemsOnAgenda: {}, // our hierarchy - items dependant, dependant approval, order, etc.
			comments: {},
			description: {},
			title: {}
		}
	}
};
var data = {
	schema: schema,
	//create: create,
	//destroy: destroy,
	//update: update
};

module.exports = data;