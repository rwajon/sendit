'use strict';

function menuAsideToggle() {
  var button = document.getElementById('menu-aside-toggle-btn');
  var menu = document.getElementById('menu-aside');
  var section = document.getElementsByTagName('section')[0];

  if (!document.getElementById('menu-aside').innerHTML || window.outerWidth < 768) {
    menu.style.display = 'none';
    section.style.margin = '0';
    section.style.width = '100%';
  }

  if (document.getElementById('menu-aside').innerHTML && window.outerWidth > 768) {
    menu.style.display = 'block';
    section.style.marginLeft = '20%';
    section.style.width = '80%';
  }

  button.addEventListener('click', function () {
    if (window.outerWidth > 768) {
      if (menu.style.display === 'none') {
        menu.style.display = 'block';
        section.style.marginLeft = '20%';
        section.style.width = '80%';
      } else {
        menu.style.display = 'none';
        section.style.margin = '0';
        section.style.width = '100%';
      }
    } else if (window.outerWidth < 768) {
      if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'block';
        section.style.margin = '0';
        section.style.width = '100%';
      } else {
        menu.style.display = 'none';
        section.style.margin = '0';
        section.style.width = '100%';
      }
    }
  });
}

function cancelOrder() {
  var buttons = document.getElementsByClassName('cancel-order');

  Array.from(buttons).forEach(function (button) {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      var remove = confirm('Do you want to cancel this order?');
      if (remove === true) {
        var request = new XMLHttpRequest();
        request.open('PUT', button.href, true);
        request.send(null);

        request.onload = function () {
          button.parentNode.parentNode.style.opacity = "0.2";
          button.style.cursor = "not-allowed";
        };

        request.onloadend = function () {
          if (request.status === 200) {
            if (request.responseText === 'cancelled') {
              parcelsCount();
              button.parentNode.parentNode.remove();
            }
          }
        };
      }
    });
  });
}

function parcelsCount() {
  var request = new XMLHttpRequest();
  request.open('GET', '/users/parcels/count', true);
  request.send(null);

  request.onreadystatechange = function () {
    if (request.status === 200) {
      var parcels = JSON.parse(request.responseText);

      if (parcels.pending || parcels.inTransit || parcels.delivered) {
        document.getElementsByClassName('pending')[0].innerHTML = parcels.pending || 0;
        document.getElementsByClassName('in-transit')[0].innerHTML = parcels.inTransit || 0;
        document.getElementsByClassName('delivered')[0].innerHTML = parcels.delivered || 0;
      }
    }
  };
}

window.document.addEventListener('DOMContentLoaded', function () {
  menuAsideToggle();
  cancelOrder();
  parcelsCount();
});