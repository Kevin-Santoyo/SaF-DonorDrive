



localStorage.setItem("etag", "");
var participantLink = 'https://extralife.donordrive.com/api/participants/448764';
var donationLink = 'https://extralife.donordrive.com/api/participants/448764/donations?limit=1';
var currentDonations
var fundraiserGoal
var goalTarger
var etag
var donorGroup
var donorName
var donorAmount
var donorMessage

function getDonationInfo() {
	
	const myHeaders = new Headers({
		'If-none-match': localStorage.getItem('etag')
	});
	
	const requestInfo = new Request(participantLink, {
		method: 'GET',
		headers: myHeaders,
		mode: 'cors',
		cache: 'default',
	});
	
	fetch(requestInfo)
		.then(function(response) {
			if (response.status == 304) {
				console.log("Data unchanged");
			} else {
				response.json().then(data => {
					currentDonations = data.sumDonations;
					fundraiserGoal = data.fundraisingGoal;
					goalTarget = document.getElementById("goal");
					goalTarget.innerHTML = currentDonations + " / " + fundraiserGoal;
				});
				etag = response.headers.get('etag');
				localStorage.setItem("etag", etag);				
				console.log('Local storage updated');
				getDonationList();
			}
		}).catch(function(err) {
				console.error(` Err: ${err}`);
			});
	
}

function getDonationList() {
	
	const requestInfo = new Request(donationLink, {
		method: 'GET',
		mode: 'cors',
		cache: 'default',
	});
	
	fetch(requestInfo)
		.then(function(response) {
			response.json().then(data => {
				var data = data[0];
				donorGroup = document.getElementById("donation");
				if (data.displayName) {
					donorName = data.displayName;
				} else {
					donorName = "Anonymous Donor";
				}
				var donorAmount = data.amount;
				if (data.message) {
					donorMessage = data.message;
					donorGroup.children[2].innerHTML = donorMessage;
				}
				donorGroup.children[0].innerHTML = donorName;
				donorGroup.children[1].innerHTML = donorAmount;					
			});
			}).catch(function(err) {
				console.error(` Err: ${err}`);
			});
}


function countdownTimer() {
	
	var countDownDate = new Date("Feb 20, 2021 10:00:00").getTime();
	
	// Update the count down every 1 second
	var x = setInterval(function() {
		
		// Get today's date and time
		var now = new Date().getTime();
		
		// Find the distance between now and the count down date
		var distance = countDownDate - now;
		
		// Time calculations for days, hours, minutes and seconds
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		
		// Display the result in the element with id="demo"
		document.getElementById("countdown").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
		
		// If the count down is finished, write some text
		
		if (distance < 0) {
			clearInterval(x);
			document.getElementById("countdown").innerHTML = "EXPIRED";
		}
	}, 1000);
}