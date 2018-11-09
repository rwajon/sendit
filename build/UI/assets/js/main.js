"use strict";

window.document.addEventListener('DOMContentLoaded', main);

function main() {
	// include header
	include(document.querySelector("header"), "includes/header.html", displayLoad, false);

	// include nav
	include(document.querySelector("nav"), "includes/nav.html", displayLoad, false);

	// include user-menu-aside
	document.getElementById('user-menu-aside') ? include(document.getElementById('user-menu-aside'), "includes/user_menu_aside.html", displayLoad, false) : null;

	// include addmin-menu-aside
	document.getElementById('admin-menu-aside') ? include(document.getElementById('admin-menu-aside'), "includes/admin_menu_aside.html", displayLoad, false) : null;

	// include footer
	include(document.querySelector("footer"), "includes/footer.html", displayLoad, false);

	// section height
	document.querySelector("section").style.minHeight = window.innerHeight - 195 + "px";

	// display boody after loading all required components
	document.querySelector("body").style.display = "block";

	menuAsideToggle();
}

function include(el, path, done, async) {
	if (async) {
		var request = new XMLHttpRequest();
		request.open("GET", path, true);
		request.send(null);

		request.onreadystatechange = function () {
			if (request.status == 200) {
				done(el, request);
			}
		};
	} else {
		var request = new XMLHttpRequest();
		request.open("GET", path, false);
		request.send(null);

		if (request.status == 200) {
			done(el, request);
		}
	}
}

function displayLoad(el, res) {
	el.innerHTML = res.responseText;
}

function appendLoad(el, res) {
	el.innerHTML += res.responseText;
}

function includeMenuAsideUser(request) {
	var menu_aside = document.getElementById("menu-aside-user");

	menu_aside.innerHTML = request.responseText;
}

function userMenuAsideToggle() {
	var button = document.getElementById('menu-aside-toggle-btn');
	var menu = document.getElementById('user-menu-aside');

	button.addEventListener("click", function (e) {
		if (menu.style.display == "block") {
			menu.style.display = "none";
		} else {
			menu.style.display = "block";
		}
	});
}

function menuAsideToggle() {
	if (document.getElementById('user-menu-aside') || document.getElementById('admin-menu-aside')) {
		var button = document.getElementById('menu-aside-toggle-btn');
		var menu = document.querySelector('aside');

		button.addEventListener("click", function (e) {
			if (menu.style.display == "block") {
				menu.style.display = "none";
			} else {
				menu.style.display = "block";
			}
		});
	} else {
		document.getElementById('menu-aside-toggle-btn').style.display = "none";
	}
}