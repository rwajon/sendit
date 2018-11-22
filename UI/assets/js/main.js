window.document.addEventListener('DOMContentLoaded', main);

function main() {
  // include header
  if (document.querySelector('header')) {
    include(document.querySelector('header'), 'includes/header.html', displayLoad, false);
  }

  // include nav
  if (document.querySelector('nav')) {
    include(document.querySelector('nav'), 'includes/nav.html', displayLoad, false);
  }

  // include user-menu-aside
  if (document.getElementById('user-menu-aside')) {
    include(document.getElementById('user-menu-aside'), 'includes/user_menu_aside.html', displayLoad, false);
  }

  // include addmin-menu-aside
  if (document.getElementById('admin-menu-aside')) {
    include(document.getElementById('admin-menu-aside'), 'includes/admin_menu_aside.html', displayLoad, false);
  }

  // include footer
  if (document.querySelector('footer')) {
    include(document.querySelector('footer'), 'includes/footer.html', displayLoad, false);
  }

  // section height
  document.querySelector('section').style.minHeight = `${window.innerHeight - 150}px`;

  // display boody after loading all required components
  document.querySelector('body').style.display = 'block';

  // toogle menu aside
  if (document.querySelector('nav')) {
    menuAsideToggle();
  } else {
    document.getElementById('menu-aside-toggle-btn').style.display = 'none';
    document.querySelector('section').style.width = '100%';
    document.querySelector('section').style.margin = '0%';
  }
}

function include(el, path, done, async) {
  if (async) {
    var request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.send(null);

    request.onreadystatechange = () => {
      if (request.status == 200) {
        done(el, request);
      }
    };
  } else {
    var request = new XMLHttpRequest();
    request.open('GET', path, false);
    request.send(null);

    if (request.status === 200) {
      done(el, request);
    }
  }
}

function displayLoad(el, req) {
  el.innerHTML = req.responseText;
}

function appendLoad(el, req) {
  el.innerHTML += req.responseText;
}

function menuAsideToggle() {
  const button = document.getElementById('menu-aside-toggle-btn');
  const menu = document.querySelector('aside'); //document.getElementById('user-menu-aside');
  const section = document.getElementsByTagName('section')[0];

  if (!document.querySelector('aside').innerHTML || window.outerWidth < 768) {
    menu.style.display = 'none';
    section.style.margin = '0';
    section.style.width = '100%';
  }

  if (document.querySelector('aside').innerHTML && window.outerWidth > 768) {
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