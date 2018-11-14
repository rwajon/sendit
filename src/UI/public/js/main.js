function menuAsideToggle() {
  const button = document.getElementById('menu-aside-toggle-btn');
  const menu = document.getElementById('menu-aside');
  const section = document.getElementsByTagName('section')[0];

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

  button.addEventListener('click', () => {
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
  const buttons = document.getElementsByClassName('cancel-order');

  Array.from(buttons).forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const remove = confirm('Do you want to cancel this order?');
      if (remove === true) {
        const request = new XMLHttpRequest();
        request.open('PUT', button.href, true);
        request.send(null);

        request.onload = () => {
          button.parentNode.parentNode.style.opacity="0.2";
          button.style.cursor="not-allowed";
        }

        request.onloadend = () => {
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
  const request = new XMLHttpRequest();
  request.open('GET', '/users/parcels/count', true);
  request.send(null);

  request.onreadystatechange = () => {
    if (request.status === 200) {
      const parcels = JSON.parse(request.responseText);

      if (parcels.pending || parcels.inTransit || parcels.delivered) {
        document.getElementsByClassName('pending')[0].innerHTML = parcels.pending || 0;
        document.getElementsByClassName('in-transit')[0].innerHTML = parcels.inTransit || 0;
        document.getElementsByClassName('delivered')[0].innerHTML = parcels.delivered || 0;
      }
    }
  };
}

window.document.addEventListener('DOMContentLoaded', () => {
  menuAsideToggle();
  cancelOrder();
  parcelsCount();
});
