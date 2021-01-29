



localStorage.setItem("etag", "");
var participantLink = 'https://extralife.donordrive.com/api/participants/448764';
var donationLink = 'https://extralife.donordrive.com/api/participants/448764/donations?limit=1';


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
					var currentDonations = data.sumDonations;
					var fundraiserGoal = data.fundraisingGoal;
					var goalTarget = document.getElementById("goal");
					goalTarget.innerHTML = currentDonations + " / " + fundraiserGoal;
				});
				var etag = response.headers.get('etag');
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
				var donorGroup = document.getElementById("donation");
				var donorName = data.displayName;
				var donorAmount = data.amount;
				if (data.message) {
					var donorMessage = data.message;
					donorGroup.children[2].innerHTML = donorMessage;
				}
				donorGroup.children[0].innerHTML = donorName;
				donorGroup.children[1].innerHTML = donorAmount;					
			});
			}).catch(function(err) {
				console.error(` Err: ${err}`);
			});
}



