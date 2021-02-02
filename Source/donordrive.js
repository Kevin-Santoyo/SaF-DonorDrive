



localStorage.setItem("etagTotal", "");
localStorage.setItem("etagDonation", "");
localStorage.setItem("etagRecent", "");

if (document.cookie) {
	var donationCookie = document.cookie;
	donationCookieArray = donationCookie.split("=");
	localStorage.setItem("recentDonation", donationCookieArray[1]);
	console.log(donationCookieArray[1]);
} else {
	localStorage.setItem("recentDonation", "");
}

localStorage.removeItem("etag");
var participantID = "448764";
var participantLink = 'https://extralife.donordrive.com/api/participants/' + participantID;
var donationLink = 'https://extralife.donordrive.com/api/participants/' + participantID + '/donations';
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
window.donationLog = new Array;
var currentIntervals = 0;


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
				return false;
			} else {
				response.json().then(data => {
					var data = data[0];
					donorName = donorNameFilter(data.displayName);
					donorAmount = "$" + data.amount;
					updateDonation(donorName, donorAmount, data.message);
					var etag = response.headers.get('etag');
					localStorage.setItem("etagDonation", etag);
					return true;
				});
			}
			}).catch(function(err) {
				console.error(` Err: ${err}`);
			});
}

function updateDonation(name, amount, message) {

	var donorGroup = document.getElementById("donation");

	if (message) {
		donorGroup.children[2].innerHTML = message;
	}

	donorGroup.children[0].innerHTML = name;
	donorGroup.children[1].innerHTML = amount;

}

function appendDonation(name, amount, message, sequence) {

	var divContainer = document.createElement('div');
	divContainer.id = "donation" + sequence;
	divContainer.classList.add ("popup");

	var nameH1 = document.createElement('h1');
	nameH1.innerHTML = name;

	var amountH2 = document.createElement('h2');
	amountH2.innerHTML = "<span class='text'>Donated </span>" + amount;

	var messageparagragh = document.createElement('p');
	messageparagragh.innerHTML = message;
	messageparagragh.classList.add ("text");


	divContainer.appendChild(nameH1);
	divContainer.appendChild(amountH2);
	divContainer.appendChild(messageparagragh);
	document.body.appendChild(divContainer);
}

function checkRecentDonations() {

	const donationHeaders = new Headers({
		'If-none-match': localStorage.getItem('etagRecent')
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
					var recentDonation = localStorage.getItem('recentDonation');
					for (donor in data) {
						if (data[donor].donationID !== recentDonation) {
							donationLog.push(data[donor]);
						} else {
							break;
						}
					}
					var etag = response.headers.get('etag');
					localStorage.setItem('etagRecent', etag);
					donationPopup(donationLog);
				});
			}
		}).catch(function(err) {
			console.error(` Err: ${err}`);
		});

}

function donationPopup(donations) {
	
	const announcementLength = 5000;

	console.log(donations);
	for (let i = donations.length - 1; i >= 0; i--) {
		currentIntervals += 1
		console.log(currentIntervals);
		setTimeout(function () {
			var divCheck = document.getElementsByClassName('popup');
			if (divCheck.length > 0) {
				divCheck[0].remove();
			}
			var donorName = donorNameFilter(donations[i].displayName);
			var donorAmount = "$" + donations[i].amount;
			var donorMessage = donations[i].message || '';
			appendDonation(donorName, donorAmount, donorMessage, i);
			audio.play();
			fadeIn(document.getElementById('donation' + i));
			localStorage.setItem('recentDonation', donations[i].donationID);
			document.cookie = "recentDonation=" + donations[i].donationID;
			currentIntervals -= 1;
		}, announcementLength * (currentIntervals - 1))
	}
	window.donationLog = [];
}

function donorNameFilter(input) {
	
	if (input) {
		if (input == "Facebook Donor") {
			return "Facebook Donor";
		} else {
			var spaceIdx = input.search(" ");
			if (spaceIdx == -1) {
				return input;
			} else {
				var firstString = input.substring(0, spaceIdx);
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
	}, 4000);
}



