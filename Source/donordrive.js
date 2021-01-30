



localStorage.setItem("etagTotal", "");
localStorage.setItem("etagDonation", "");
localStorage.setItem("recentDonation", "C662CD1CFD025D94");
localStorage.removeItem("etag");
var participantLink = 'https://extralife.donordrive.com/api/participants/448764';
var donationLink = 'https://extralife.donordrive.com/api/participants/448764/donations';
var vol = .5;
var audio = new Audio('audio/cash.mp3');
audio.volume = vol
var currentDonations
var fundraiserGoal
var goalTarger
var etag
var donorGroup
var donorName
var donorAmount
var donorMessage


function getDonationInfo() {
	
	const infoHeaders = new Headers({
		'If-none-match': localStorage.getItem('etagTotal')
	});
	
	const requestInfo = new Request(participantLink, {
		method: 'GET',
		headers: infoHeaders,
		mode: 'cors',
		cache: 'default',
	});
	
	fetch(requestInfo)
		.then(function(response) {
			if (response.status == 304) {
				console.log("No change");
				return false;
			} else {
				response.json().then(data => {
					currentDonations = data.sumDonations;
					fundraiserGoal = data.fundraisingGoal;
					goalTarget = document.getElementById("goal");
					goalTarget.innerHTML = currentDonations + " / " + fundraiserGoal;
				});
				var etag = response.headers.get('etag');
				localStorage.setItem("etagTotal", etag);
				return true;
			}
		}).catch(function(err) {
				console.error(` Err: ${err}`);
			});
	
}

function getDonationList() {
	
	const donationHeaders = new Headers({
		'If-none-match': localStorage.getItem('etagDonation')
	});
	
	const requestDonations = new Request(donationLink, {
		method: 'GET',
		headers: donationHeaders,
		mode: 'cors',
		cache: 'default',
	});

	fetch(requestDonations)
		.then(function(response) {
			if (response.status == 304) {
				console.log("No change");
				return false;
			} else {
				response.json().then(data => {
					var data = data[0];
					var donorGroup = document.getElementById("donation");
					donorName = donorNameFilter(data.displayName);
					donorAmount = "$" + data.amount;
					if (data.message) {
						donorMessage = data.message;
						donorGroup.children[2].innerHTML = donorMessage;
					}
					donorGroup.children[0].innerHTML = donorName;
					donorGroup.children[1].innerHTML = donorAmount;
					var etag = response.headers.get('etag');
					localStorage.setItem("etagDonation", etag);
					return true;
				});
			}
			}).catch(function(err) {
				console.error(` Err: ${err}`);
			});
}

function checkRecentDonations() {

	const donationHeaders = new Headers({
		'If-none-match': localStorage.getItem('etagDonation')
	});

	const requestDonations = new Request(donationLink, {
		method: 'GET',
		headers: donationHeaders,
		mode: 'cors',
		cache: 'default',
	});

	fetch(requestDonations)
		.then(function(response) {
			if (response.status == 304) {
				return false;
			} else {
				response.json().then(data => {
					var x = localStorage.recentDonation;
					let donationLog = [];
					console.log(data);
					for (donor in data) {
						console.log(x);
						console.log(data[donor].donationID);
						if (data[donor].donationID == x) {
							console.log(x + " match found");
							break;
						} else {
							console.log("donation ID is not a match");
							donationLog.push(data[donor]);
							console.log(donationLog);
						}
					}
				});
			}
		}).catch(function(err) {
			console.error(` Err: ${err}`);
		});

}

function donationPopup() {
	
	var donorGroup = document.getElementById("donation");
	if(getDonationList()) {
		console.log("true");
	} else {
		console.log("false");
	}
	audio.play();
	fadeIn(donorGroup);
}

function donorNameFilter(input) {
	
	if (input) {
		if (input == "Facebook Donor") {
			return "Facebook Donor";
		} else {
			var x = input.search(" ");
			if (x == -1) {
				return input;
			} else {
				var firstString = input.substring(0, x);
				return firstString;
			}
		}
	} else {
		return "Anonymous Donor";
	}
	
}

function countdownTimer() {
	
	var countDownDate = new Date("Feb 20, 2021 10:00:00").getTime();
	
	var x = setInterval(function() {
		
		var now = new Date().getTime();
		
		var distance = countDownDate - now;
		
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		
		document.getElementById("countdown").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
		
		if (distance < 0) {
			clearInterval(x);
			document.getElementById("countdown").innerHTML = "EXPIRED";
		}
	}, 1000);
}

function fadeOut(element) {
	var op = 1;
	var freeeze = 5;
	var timer = setInterval(function () {
		if (op <= 0.1){
			clearInterval(timer);
			element.style.display = 'none';
		}
		element.style.opacity = op;
		element.style.filter = 'alpha(opacity=' + op * 100 + ")";
		op -= op * 0.1;
	}, 50);
}

function fadeIn(element) {
    var op = 0.1;
	element.style.display = 'block';
    var timer = setInterval(function () {
		if (op >= .95){
			clearInterval(timer);
		}
		element.style.opacity = op;
		element.style.filter = 'alpha(opacity=' + op * 100 + ")";
		op += op * 0.05;
	}, 15);
	var timer2 = setInterval(function () {
		if (op >= 1){
			clearInterval(timer2);
			fadeOut(element);
		}
		element.style.opacity = op;
		element.style.filter = 'alpha(opacity=' + op * 100 + ")";
		op += op * 0.01;
	}, 4500);
}



