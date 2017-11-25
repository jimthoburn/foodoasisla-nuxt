'use strict';

(function () {

	/* OPTIONAL: Show a random image behind the introduction
 ----------------------------------------------- */
	var images = ['/assets/images/photos/locations/daily-organics/1.jpg', '/assets/images/photos/locations/daily-organics/2.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/1.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/2.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/3.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/4.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/5.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/6.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/7.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/8.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/9.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/10.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/11.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/12.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/13.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/14.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/15.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/16.jpg', '/assets/images/photos/farmers-market/santa-monica-downtown/17.jpg'];
	var min = 0;
	var max = images.length - 1;
	var random = Math.floor(Math.random() * (max - min + 1) + min);
	var introduction = document.querySelector('.introduction');
	introduction.style.backgroundImage = 'url(' + images[random] + ')';

	var template = document.getElementById('photo-credit-template');
	introduction.insertAdjacentHTML('beforeend', template.innerHTML);
	var creditLink = document.querySelector('.photo-credit a');

	var data = {
		'santa-monica': {
			url: '/farmers-market/santa-monica-downtown/',
			name: 'Santa Monica Farmers’ Market'
		},
		'daily-organics': {
			url: '/locations/daily-organics/',
			name: 'Daily Organics'
		}
	};

	var id = images[random].indexOf('santa-monica') >= 0 ? 'santa-monica' : 'daily-organics';

	creditLink.textContent = data[id].name;
	creditLink.href = data[id].url;
})();

(function () {

	/* OPTIONAL: Add a class name of “scrolled-up” to the body if the introduction (including the logo) is visible.
 ----------------------------------------------- */

	if (!('addEventListener' in window) || !('scrollY' in window) || !('classList' in document.body)) return; // Do we have the features we need?

	function update(e) {
		if (window.scrollY < 300) {
			document.body.classList.add('scrolled-up');
		} else {
			document.body.classList.remove('scrolled-up');
		}
	}

	update();

	(function () {
		var throttle = void 0;
		window.addEventListener('scroll', function () {
			if (throttle) clearTimeout(throttle);
			throttle = setTimeout(update, 10);
		}, false);
	})();

	/* OPTIONAL: Handle slow loading content and resizing windows.
 ----------------------------------------------- */
	window.addEventListener('load', update, false);

	(function () {
		var throttle = void 0;
		window.addEventListener('resize', function () {
			if (throttle) clearTimeout(throttle);
			throttle = setTimeout(update, 100);
		}, false);
	})();
})();