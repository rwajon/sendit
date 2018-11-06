
/* function load(el, path, done, async) {
  const request = new XMLHttpRequest();

  if (async) {
    request.open('GET', path, true);
    request.send(null);

    request.onreadystatechange = () => {
      if (request.status === 200) {
        done(el, request);
      }
    };
  } else {
    request.open('GET', path, false);
    request.send(null);

    if (request.status === 200) {
      done(el, request);
    }
  }
} */

function menuAsideToggle() {
  if (document.getElementById('menu-aside')) {
    const button = document.getElementById('menu-aside-toggle-btn');
    const menu = document.querySelector('aside');

    button.addEventListener('click', () => {
      if (menu.style.display === 'block') {
        menu.style.display = 'none';
      } else {
        menu.style.display = 'block';
      }
    });
  } else {
    document.getElementById('menu-aside-toggle-btn').style.display = 'none';
  }
}

function cancelOrder() {
  const buttons = document.getElementsByClassName('cancel-order');

  Array.from(buttons).forEach((button) => {
    button.addEventListener('click', (e) => {
      const remove = confirm('Do you want to cancel this order?');
      if (remove === true) {
        return true;
      }
      e.preventDefault();
      return false;
    });
  });
}

window.document.addEventListener('DOMContentLoaded', () => {
  // section height
  // document.querySelector("section").style.minHeight = window.innerHeight - 195 + "px";

  menuAsideToggle();
  cancelOrder();
});
