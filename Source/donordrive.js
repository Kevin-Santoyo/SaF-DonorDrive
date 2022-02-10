



localStorage.setItem("etagTotal", "");
localStorage.setItem("etagDonation", "");
localStorage.setItem("etagRecent", "");
localStorage.setItem("etagList", "");


if (getCookie('recentDonation')) {
	var donationCookie = getCookie('recentDonation');
	localStorage.setItem("recentDonation", donationCookie);
} else {
	localStorage.setItem("recentDonation", "");
}

var participantID = "478869";
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
		.then(function (response) {
			if (response.status == 304) {
				return false;
			} else {
				response.json().then(data => {
					currentDonations = '$' + data.sumDonations;
					fundraiserGoal = '$' + data.fundraisingGoal;
					goalTarget = document.getElementById("goal");
					goalTarget.innerHTML = currentDonations + " / " + fundraiserGoal;
				});
				var etag = response.headers.get('etag');
				localStorage.setItem("etagTotal", etag);
				return true;
			}
		}).catch(function (err) {
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
		.then(function (response) {
			if (response.status == 304) {
				return false;
			} else {
				response.json().then(data => {
					var data = data[0];
					donorName = donorNameFilter(data.displayName);
					donorAmount = "$" + data.amount;
					updateDonation(donorName, donorAmount);
					var etag = response.headers.get('etag');
					localStorage.setItem("etagDonation", etag);
					return true;
				});
			}
		}).catch(function (err) {
			console.error(` Err: ${err}`);
		});
}

function updateDonation(name, amount) {

	var donorGroup = document.getElementById("donation");


	donorGroup.children[0].innerHTML = 'Recent Donor: ' + name + '<span id="amt">' + amount + '</span>';

}

function appendDonation(name, amount, message, sequence) {

	var divContainer = document.createElement('div');
	divContainer.id = "donation" + sequence;
	divContainer.classList.add("popup");

	var nameH1 = document.createElement('h1');
	nameH1.innerHTML = name;

	var amountH2 = document.createElement('h2');
	amountH2.innerHTML = "<span class='text'>Donated </span>" + amount;

	var messageparagragh = document.createElement('p');
	messageparagragh.innerHTML = message;
	messageparagragh.classList.add("text");


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
		.then(function (response) {
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
		}).catch(function (err) {
			console.error(` Err: ${err}`);
		});

}

function donationPopup(donations) {

	const announcementLength = 5000;

	for (let i = donations.length - 1; i >= 0; i--) {
		currentIntervals += 1
		setTimeout(function () {
			var divCheck = document.getElementsByClassName('popup');
			if (divCheck.length > 0) {
				divCheck[0].remove();
			}
			var donorName = donorNameFilterPopup(donations[i].displayName);
			var donorAmount = "$" + donations[i].amount;
			var donorMessage = donations[i].message || '';
			appendDonation(donorName, donorAmount, donorMessage, i);
			audio.play();
			fadeIn(document.getElementById('donation' + i));
			localStorage.setItem('recentDonation', donations[i].donationID);
			document.cookie = "recentDonation=" + donations[i].donationID + "; expires=Thu, 31 Dec 2099 23:59:59 GMT";
			currentIntervals -= 1;
			sendJSON(donations[i]);
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
				if (input.length > 14) {
					input = input.substr(0, 10) + '...';
					return input;
				} else {
					return input
				}
			} else {
				var firstString = input.substring(0, spaceIdx);
				if (firstString.length > 14) {
					firstString = firstString.substr(0, 10) + '...';
					return firstString;
				} else {
					return firstString;
				}
			}
		}
	} else {
		return "Anonymous Donor";
	}

}

function donorNameFilterPopup(input) {

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

function makeDonationList() {

	const donationHeaders = new Headers({
		'If-none-match': localStorage.getItem('etagList')
	});

	const requestDonations = new Request(donationLink, {
		method: 'GET',
		headers: donationHeaders,
		mode: 'cors',
		cache: 'default',
	});

	var donotable = document.createElement("table");

	fetch(requestDonations)
		.then(function (response) {
			if (response.status == 304) {
				return false;
			} else {
				response.json().then(data => {
					for (donor in data) {
						let row = donotable.insertRow();
						row.insertCell(0).textContent = data[donor].displayName;
						row.insertCell(1).textContent = '$' + data[donor].amount;
						row.insertCell(2).textContent = data[donor].message;
					}
					audio.volume = .3
					var listTarget = document.getElementById("list");
					listTarget.innerHTML = "";
					listTarget.appendChild(donotable);
					console.log("Table Write Successful");
					audio.play();
					var etag = response.headers.get('etag');
					localStorage.setItem('etagList', etag);
				});
			}
		}).catch(function (err) {
			console.error(` Err: ${err}`);
		});

}

function countdownTimer() {

	var countDate = new Date("Feb 19, 2022 10:00:00").getTime();

	var x = setInterval(function () {

		var now = new Date().getTime();

		var distance = countDate - now;

		if (distance > 0) {

		} else if (distance < 0) {
			distance = (now - countDate);
		}
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		console.log(days);
		if (days == 0) {
			days = '';
		} else if(days == 1) {
			days = "1 Day "
		} else if(days > 1) {
			days = days + " Days "
		}
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		if (hours < 10) {
			hours = '0' + hours;
		}
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		if (seconds < 10) {
			seconds = '0' + seconds;
		}
		document.getElementById("countdown").innerHTML = days + "" + hours + ":" + minutes + ":" + seconds + "";

	}, 1000);
}

function fetchJSON() {
	fetch('donation.json')
		.then(response => response.json())
		.then(data => {
			return data;
		});
}

function sendJSON(data) {
	var fd = new FormData();

	fd.append("json", JSON.stringify(data));
	fetch("receive.php", {
		method: "POST",
		body: fd
	});
}

function fadeOut(element) {
	var op = 1;
	var timer = setInterval(function () {
		if (op <= 0.1) {
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
		if (op >= .95) {
			clearInterval(timer);
		}
		element.style.opacity = op;
		element.style.filter = 'alpha(opacity=' + op * 100 + ")";
		op += op * 0.05;
	}, 15);
	var timer2 = setInterval(function () {
		if (op >= 1) {
			clearInterval(timer2);
			fadeOut(element);
		}
		element.style.opacity = op;
		element.style.filter = 'alpha(opacity=' + op * 100 + ")";
		op += op * 0.01;
	}, 4000);
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return false;
}



