



localStorage.setItem("etag", "");


function getDonationInfo() {
	
	const myHeaders = new Headers({
		'If-none-match': localStorage.getItem('etag')
	});
	
	const requestInfo = new Request('https://extralife.donordrive.com/api/participants/448764', {
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
			}
		}).catch(function(err) {
				console.error(` Err: ${err}`);
			});
	
}



