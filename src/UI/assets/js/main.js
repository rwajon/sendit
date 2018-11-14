window.document.addEventListener('DOMContentLoaded', main);

function main() {
  // include header
  include(document.querySelector('header'), 'includes/header.html', displayLoad, false);

  // include nav
  include(document.querySelector('nav'), 'includes/nav.html', displayLoad, false);

  // include user-menu-aside
  document.getElementById('user-menu-aside') ? include(document.getElementById('user-menu-aside'), 'includes/user_menu_aside.html', displayLoad, false) : null;

  // include addmin-menu-aside
  document.getElementById('admin-menu-aside') ? include(document.getElementById('admin-menu-aside'), 'includes/admin_menu_aside.html', displayLoad, false) : null;

  // include footer
  include(document.querySelector('footer'), 'includes/footer.html', displayLoad, false);

  // section height
  document.querySelector('section').style.minHeight = `${window.innerHeight - 195}px`;

  // display boody after loading all required components
  document.querySelector('body').style.display = 'block';

  //
  if (document.getElementById('user-menu-aside')) {
    userMenuAsideToggle();
  } else if (document.getElementById('admin-menu-aside')) {
    adminMenuAsideToggle();
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

function displayLoad(el, res) {
  el.innerHTML = res.responseText;
}

function appendLoad(el, res) {
  el.innerHTML += res.responseText;
}

function includeMenuAsideUser(request) {
  const menu_aside = document.getElementById('menu-aside-user');

  menu_aside.innerHTML = request.responseText;
}


function userMenuAsideToggle() {
  const button = document.getElementById('menu-aside-toggle-btn');
  const menu = document.getElementById('user-menu-aside');
  const section = document.getElementsByTagName('section')[0];

  if (!document.getElementById('user-menu-aside').innerHTML || window.outerWidth < 768) {
    menu.style.display = 'none';
    section.style.margin = '0';
    section.style.width = '100%';
  }

  if (document.getElementById('user-menu-aside').innerHTML && window.outerWidth > 768) {
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

function adminMenuAsideToggle() {
  const button = document.getElementById('menu-aside-toggle-btn');
  const menu = document.getElementById('admin-menu-aside');
  const section = document.getElementsByTagName('section')[0];

  if (!document.getElementById('admin-menu-aside').innerHTML || window.outerWidth < 768) {
    menu.style.display = 'none';
    section.style.margin = '0';
    section.style.width = '100%';
  }

  if (document.getElementById('admin-menu-aside').innerHTML && window.outerWidth > 768) {
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
