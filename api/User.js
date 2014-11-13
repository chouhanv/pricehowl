var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var BSON = require('mongodb').BSONPure;
var checkIns = require("../models/checkIns");

var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

module.exports = { 
    name: "User",
	checkInHistory : function(req, res, next){
		var userID = req.params.userID;
		var db = req.db;

		db.collection("checkIns").aggregate(
			{$group : { _id :{$substr: ["$time", 0, 9]}, checkIn: { $push: "$$ROOT" } } },
			{$sort : { "_id" : -1} } , function(err, data){

			var i = -1;
			function nextGroup(){
				i++;
				if(i<data.length){
					var j = -1;
					
					function nextCheckInHistory(){
						j++;
						if(data[i].checkIn.length > j){
							formateDate(data[i].checkIn[j].time, function(convdt){
								data[i].date = convdt;
								delete data[i]._id;
								var isNext = true;
								if(data[i].checkIn[j].checkin_type == "r") data[i].checkIn[j].points = -(data[i].checkIn[j].points);
								delete data[i].checkIn[j]._id;
								delete data[i].checkIn[j].userId;
								delete data[i].checkIn[j].checkin_type;
								delete data[i].checkIn[j].time;
								if(data[i].checkIn[j].vendor_id != null) {
									isNext = false;
									findvendor(data[i].checkIn[j].vendor_id, function(err, vendor){
										if(err){
											console.log(err);
										} else if(vendor) {
											data[i].checkIn[j].vendor_logo = vendor.vendor_logo;
										}
										delete data[i].checkIn[j].vendor_id;
										nextCheckInHistory();
									});
								}
								if(isNext){
									delete data[i].checkIn[j].vendor_id;
									nextCheckInHistory();
								}
							});
								
						} else {
							nextGroup();
						}
					}
					nextCheckInHistory();
				} else {
					res.send(data);
				}
			}
			nextGroup();
			function findvendor(vendor_id, callback){
			db.collection("vendorsList").findOne({vendor_id : vendor_id}, function(err, vendor){
				if(err){
					callback(err);
				} else {
					callback(null, vendor);
				}
			});
			}

			function formateDate(dtstr, callback){
				dtstr = dtstr.replace(/\D/g," ");
				var dtcomps = dtstr.split(" ");
				dtcomps[1]--;
				var convdt = new Date(Date.UTC(dtcomps[0],dtcomps[1],dtcomps[2],dtcomps[3],dtcomps[4],dtcomps[5]));
				convdt = monthArray[convdt.getMonth()] + " " + (convdt.getDay()>9?convdt.getDay():("0"+convdt.getDay())) + ", " + convdt.getFullYear();
				callback(convdt);
			}
		});
		
		// db.collection("checkIns").find({"userId": userID}).sort({"time":-1}).toArray(function(err, user){
			
		// 	if(err) res.json({error:"Error"});
		// 	else {
		// 		var i = -1;
		// 		function nextCheckInHistory(){
		// 			i++;
		// 			if(user.length > i){
		// 				formateDate(user[i].time, function(convdt){
		// 					user[i].time = convdt;
		// 					var isNext = true;
		// 					if(user[i].checkin_type == "r") user[i].points = -(user[i].points);
		// 					if(user[i].vendor_id != null) {
		// 						isNext = false;
		// 						findvendor(user[i].vendor_id, function(err, vendor){
		// 							if(err){
		// 								console.log(err);
		// 							} else if(vendor) {
		// 								user[i].vendor_logo = vendor.vendor_logo;
		// 							}
		// 							nextCheckInHistory();
		// 						});
		// 					}
		// 					if(isNext) nextCheckInHistory();
		// 				});
							
		// 			} else {
		// 				res.json(user);
		// 			}
		// 		}
		// 		//nextCheckInHistory();

				
		// 	}
		// });

		

	}
};