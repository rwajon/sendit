async function getData(URL, resType = 'text', token = '') {
  try {
    const request = new Request(URL, {
      method: 'GET',
      mode: 'cors',
      cache: 'reload',
      headers: {
        'x-access-token': token
      }
    });

    let result = '';
    const response = await fetch(request);

    if (resType === 'json') {
      result = await response.json();
      return result;
    } else {
      result = await response.text();
      return result;
    }
  } catch (e) {
    throw Error(e);
  }
}

async function postData(URL, data = {}, resType = 'text', token = '') {
  try {
    const request = new Request(URL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        'x-access-token': token
      },
      body: JSON.stringify(data),
    });

    let result = '';
    const response = await fetch(request);

    if (resType === 'json') {
      result = await response.json();
      return result;
    } else {
      result = await response.text();
      return result;
    }
  } catch (e) {
    throw Error(e);
  }
}

function checkInput(input) {
  if (input.match(/[a-z0-9]{2}/i) && !input.match(/[!$%*|}{:><?~`_&#^=]/)) {
    return true;
  }

  return false;
}

function toggleMenuAside(el) {
  const btn = el || document.getElementById('menu-aside-toggle-btn') || null;
  const menuAside = document.getElementById('user-menu-aside') || document.getElementById('admin-menu-aside') || null;

  if (btn && menuAside) {
    if (window.outerWidth < 768) {
      menuAside.style.display = menuAside.style.display === 'none' ? 'block' : 'none';
      btn.innerHTML = menuAside.style.display === 'none' ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
    }

    document.getElementById('section').addEventListener('click', () => {
      btn.innerHTML = '<i class="fas fa-bars"></i>';
      menuAside.style.display = 'none';
    });
  }
}

function showHeader(header) {
  if (header && PAGE_PARTS.indexOf('header') >= 0) {
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.width = window.outerWidth < 768 ? `${window.outerWidth}px` : '100%';

    if (!localStorage.getItem('token') && document.querySelector('#user-top')) {}

    if (localStorage.getItem('user') && document.querySelector('#user-top')) {
      const user = JSON.parse(localStorage.getItem('user'));
      document.querySelector('#user-top').setAttribute('href', 'user.html')
      document.querySelector('#user-top b').innerHTML = user.userName;

    }
    if (localStorage.getItem('admin') && document.querySelector('#user-top')) {
      const admin = JSON.parse(localStorage.getItem('admin'));
      document.querySelector('#user-top').setAttribute('href', 'admin.html')
      document.querySelector('#user-top b').innerHTML = admin.userName;

    }

    if (!localStorage.getItem('token') && document.querySelector('#user-top')) {
      document.querySelector('#user-top').setAttribute('href', 'signin.html')
    }

    header.style.display = 'block';
  }
}

function showNav(header, nav) {
  if (nav && PAGE_PARTS.indexOf('header') >= 0 && PAGE_PARTS.indexOf('nav') >= 0) {
    nav.style.position = 'fixed';
    nav.style.top = `${header.offsetHeight}px`;
    nav.style.width = window.outerWidth < 768 ? `${window.outerWidth}px` : '100%';
    nav.style.display = window.outerWidth < 768 ? 'block' : 'none';
  }
}

function showMenuAside(header, nav, menuAside) {
  if (menuAside && PAGE_PARTS.indexOf('header') >= 0 &&
    PAGE_PARTS.indexOf('nav') >= 0 && PAGE_PARTS.indexOf('menuAside') >= 0) {

    // show number of orders
    userOrdersCount(HOST);
    menuAside.style.position = 'fixed';
    menuAside.style.top = `${header.outerHeight + nav.outerHeight}px`
    menuAside.style.minHeight = `${window.innerHeight}px`;
    menuAside.style.width = window.outerWidth < 768 ? `${window.outerWidth/1.5}px` : '20%';
    menuAside.style.display = window.outerWidth > 768 ? 'block' : 'none';
  }
}

function showSection(header, nav, menuAside, section) {
  if (section && PAGE_PARTS.indexOf('header') >= 0 && PAGE_PARTS.indexOf('nav') >= 0 &&
    PAGE_PARTS.indexOf('menuAside') >= 0 && PAGE_PARTS.indexOf('section')) {

    if (nav) {
      section.style.minHeight = `${window.innerHeight - ((header.offsetHeight + nav.offsetHeight) * 2)}px`;
    } else {
      section.style.minHeight = `${window.innerHeight - (header.offsetHeight * 3)}px`;
    }

    if (menuAside) {
      section.style.width = window.outerWidth < 768 ? `${window.outerWidth}px` : '79%';
    } else {
      section.style.width = window.outerWidth < 768 ? `${window.outerWidth}px` : '100%';
    }

    section.style.marginLeft = (nav && window.outerWidth > 768) ? `${menuAside.offsetWidth}px` : 0;
    section.style.marginTop = nav ? `${header.offsetHeight + nav.offsetHeight}px` : `${header.offsetHeight}px`;
    section.style.display = 'block';
  }
}

function showFooter(header, nav, menuAside, footer) {
  if (footer && PAGE_PARTS.indexOf('header') >= 0 && PAGE_PARTS.indexOf('nav') >= 0 &&
    PAGE_PARTS.indexOf('menuAside') >= 0 && PAGE_PARTS.indexOf('section')) {

    if (menuAside) {
      footer.style.width = window.outerWidth < 768 ? `${window.outerWidth}px` : '79%';
    } else {
      footer.style.width = window.outerWidth < 768 ? `${window.outerWidth}px` : '100%';
    }

    footer.style.marginLeft = (nav && window.outerWidth > 768) ? `${menuAside.offsetWidth}px` : 0;
    footer.style.display = 'block';
  }
}

function showIncludedParts() {
  const header = document.getElementById('header') || null;
  const nav = document.getElementById('nav') || null;
  const menuAside = document.getElementById('user-menu-aside') || document.getElementById('admin-menu-aside') || null;
  const section = document.getElementById('section') || null;
  const footer = document.getElementById('footer') || null;

  // header
  showHeader(header);

  // nav
  showNav(header, nav);

  // menu-aside
  showMenuAside(header, nav, menuAside);

  // section
  showSection(header, nav, menuAside, section);

  // footer
  showFooter(header, nav, menuAside, footer);
}

function loadPagePartEnd(part) {
  if (part) { PAGE_PARTS.push(part); }

  showIncludedParts();

  window.addEventListener("resize", () => {
    showIncludedParts();

    if (window.outerWidth < 768) {
      const btn = document.getElementById('menu-aside-toggle-btn') || null;
      const menuAside = document.getElementById('user-menu-aside') || document.getElementById('admin-menu-aside') || null;

      if (btn && menuAside) {
        menuAside.style.display = 'none';
        btn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }
  });
}

async function loadHeader() {
  let header = document.getElementById('header');
  let result = await getData('includes/header.html', 'text');

  if (result) {
    loadPagePartEnd('header');
    if (header) {
      header.innerHTML = result;
    }
  }
}

async function loadNav() {
  let nav = document.getElementById('nav');
  let result = await getData('includes/nav.html', 'text');

  if (result) {
    loadPagePartEnd('nav');
    if (nav) {
      nav.innerHTML = result;
    }
  }
}

async function loadMenuAside() {
  let userMenuAside = document.getElementById('user-menu-aside') || null;
  let adminMenuAside = document.getElementById('admin-menu-aside') || null;
  let resultUser = await getData('includes/user_menu_aside.html', 'text');
  let resultAdmin = await getData('includes/admin_menu_aside.html', 'text');

  if (resultUser || resultAdmin) {
    loadPagePartEnd('menuAside');

    if (userMenuAside) {
      userMenuAside.innerHTML = resultUser;
    } else if (adminMenuAside) {
      adminMenuAside.innerHTML = resultAdmin;
    }
  }
}

async function loadFooter() {
  let footer = document.getElementById('footer');
  let result = await getData('includes/footer.html', 'text');

  if (result) {
    loadPagePartEnd('footer');
    if (footer) {
      footer.innerHTML = result;
    }
  }
}

function showProfile() {
  if (document.querySelector('#userProfile') && localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user'));
    document.querySelector('#firstName').innerHTML = user.firstName || '---';
    document.querySelector('#lastName').innerHTML = user.lastName || '---';
    document.querySelector('#userName').innerHTML = user.userName || '---';
    document.querySelector('#phone').innerHTML = user.phone || '---';
    document.querySelector('#email').innerHTML = user.email || '---';
    document.querySelector('#country').innerHTML = user.country || '---';
    document.querySelector('#city').innerHTML = user.city || '---';
    document.querySelector('#address').innerHTML = user.address || '---';
  }
}

function signup(URL) {
  if (document.querySelector('form[action="signup.html"]')) {
    document.querySelector('form[action="signup.html"]').addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = document.querySelector('button[type="submit"]');
      let firstName = document.querySelector('#firstName').value;
      let lastName = document.querySelector('#lastName').value;
      let userName = document.querySelector('#userName').value;
      let phone = document.querySelector('#phone').value;
      let password = document.querySelector('#password').value;
      let confirmPassword = document.querySelector('#confirmPassword').value;
      let email = document.querySelector('#email').value || '';
      let country = document.querySelector('#country').value || '';
      let city = document.querySelector('#city').value || '';
      let address = document.querySelector('#address').value || '';

      if (firstName && lastName && userName && password && phone) {
        btn.children[0].classList = '';
        const data = {
          firstName,
          lastName,
          userName,
          phone,
          password,
          email,
          country,
          city,
          address,
        };

        let result = await postData(URL, data, resType = 'json');;

        if (result) {
          btn.children[0].classList = 'hidden';

          if (result.token) {
            localStorage.setItem('user', JSON.stringify(result.newUser));
            localStorage.setItem('token', result.token);
            window.location.replace('user.html');

          } else if (result.error) {
            document.querySelector('.message').innerHTML = result.error;
            document.querySelector('.message').classList += ' message-error';
            document.querySelector('.message').classList.replace('hidden', 'show');
          }
        }
      }
    });
  }
  return true;
}

function signin(URL) {
  if (document.querySelector('form[action="signin.html"]')) {
    document.querySelector('form[action="signin.html"]').addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = document.querySelector('button[type="submit"]');
      let userName = document.getElementById('userName').value;
      let password = document.getElementById('password').value;

      if (checkInput(userName) && checkInput(password)) {
        btn.children[0].classList = '';
        const data = {
          userName,
          password,
        };

        let result = await postData(URL, data, resType = 'json');;

        if (result) {
          btn.children[0].classList = 'hidden';

          if (result.token) {
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('token', result.token);
            window.location.replace('user.html');

          } else if (result.error) {
            document.querySelector('.message').innerHTML = result.error;
            document.querySelector('.message').classList += ' message-error';
            document.querySelector('.message').classList.replace('hidden', 'show');
          }
        }
      }
    });
  }
  return true;
}

function signout(el) {
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token');
  }
  if (localStorage.getItem('user')) {
    localStorage.removeItem('user');
  }
  if (localStorage.getItem('admin')) {
    localStorage.removeItem('admin');
  }

  window.location.replace('signin.html');
}

async function userOrders(HOST, type) {
  if (document.querySelector(`#${type}Orders`) && localStorage.getItem('user') && localStorage.getItem('token')) {
    const token = localStorage.getItem('token');
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const URL = `${HOST}/api/v1/users/${userId}/parcels/${type === 'all' ? '' : type}`;
    const result = await getData(URL, resType = 'json', token);

    if (!result.error) {
      let table = '';
      let orders = type === 'all' ? result['parcels'] : result[type];

      orders.forEach((order) => {
        table += `
        <tr>
          <td>${order.id}</td>
          <td>${order.product}</td>
          <td class="hidden-xs">${order.qty}</td>
          <td class="hidden-xs">${order.weight}</td>
          <td class="hidden-xs">USD ${order.price}</td>`;

        if (order.status === 'pending') {
          table += `
          <td>
            <span class="btn btn-default smooth-shadow">${order.status}</span>
          </td>`;
        }

        if (order.status === 'in transit') {
          table += `
          <td>
            <span class="btn btn-warning smooth-shadow">${order.status}</span>
          </td>`;
        }

        if (order.status === 'delivered') {
          table += `
          <td>
            <span class="btn btn-success smooth-shadow">${order.status}</span>
          </td>`;
        }

        table += `
          <td class='text-left'>
            <a href="order_details.html" class="btn btn-default smooth-shadow" title="Order details">
              <i class="fas fa-info-circle"></i>
            </a>`;

        if (order.status !== 'delivered') {
          table += `
            <a href="modify_order.html" class="btn btn-default smooth-shadow" title="Modify order">
              <i class="fas fa-edit"></i>
            </a>
            <a href="#" class="btn btn-danger smooth-shadow" title="Cancel order">
              <i class="fas fa-trash-alt"></i>
            </a>`;
        }

        table += `
          </td>
        </tr>`;
      });

      document.querySelector(`#${type}Orders table`).innerHTML += table;

    } else {
      document.querySelector(`#${type}Orders table`).innerHTML = '';
      document.querySelector(`#${type}Orders .message`).innerHTML = result.error;
      document.querySelector(`#${type}Orders .message`).classList += ' message-error';
      document.querySelector(`#${type}Orders .message`).classList.replace('hidden', 'show');
    }
  }
  return true;
}

async function userOrdersCount(HOST) {
  if (localStorage.getItem('user') && localStorage.getItem('token')) {
    const token = localStorage.getItem('token');
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const URL = `${HOST}/api/v1/users/${userId}/parcels`;
    const result = await getData(URL, resType = 'json', token);
    let pending = inTransit = delivered = 0;

    if (!result.error) {
      let orders = result['parcels'];

      orders.forEach((order) => {
        if (order.status === 'pending') {
          pending += 1;
        }

        if (order.status === 'in transit') {
          inTransit += 1;
        }

        if (order.status === 'delivered') {
          delivered += 1;
        }
      });
    }

    document.querySelector('#user-menu-aside a[href="pending_orders.html"] .badge').innerHTML = pending;
    document.querySelector('#user-menu-aside a[href="parcels_in_transit.html"] .badge').innerHTML = inTransit;
    document.querySelector('#user-menu-aside a[href="delivered_parcels.html"] .badge').innerHTML = delivered;
  }
  return true;
}

window.document.addEventListener('DOMContentLoaded', () => {
  PAGE_PARTS = [];
  HOST = '';
  HOSTS = [
    'http://localhost:3000',
    'http://192.168.43.20:3000',
    'https://rwajon-sendit.herokuapp.com',
    'https://rwajon.github.io/sendit/UI',
  ];

  HOSTS.forEach(h => {
    if (window.location.href.indexOf(h) >= 0) {
      HOST = h;
    }
  });

  loadHeader();
  loadNav();
  loadMenuAside();
  loadFooter();
  signup(`${HOST}/api/v1/auth/signup`);
  signin(`${HOST}/api/v1/auth/login`);
  showProfile();
  userOrders(HOST, 'all');
  userOrders(HOST, 'pending');
  userOrders(HOST, 'inTransit');
  userOrders(HOST, 'delivered');
});