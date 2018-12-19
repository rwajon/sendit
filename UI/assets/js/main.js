const PAGE_PARTS = [];
let HOST = 'http://192.168.43.20:3000';
const HOSTS = [
  'http://localhost:3000',
  'http://192.168.43.20:3000',
  'https://rwajon-sendit.herokuapp.com',
  'https://rwajon.github.io/sendit/UI',
];

HOSTS.forEach((h) => {
  if (window.location.href.indexOf(h) >= 0) {
    HOST = h;
  }
});

function checkInput(input) {
  if (input.match(/[a-z0-9]{2}/i) && !input.match(/[!$%*|}{:><?~`_&#^=]/)) {
    return true;
  }
  return false;
}

// https://www.sitepoint.com/get-url-parameters-with-javascript/
function urlParams(url) {
  const obj = {};
  let queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  if (queryString) {
    [queryString] = queryString.split('#');
    const arr = queryString.split('&');

    for (let i = 0; i < arr.length; i += 1) {
      const a = arr[i].split('=');

      let paramName = a[0];
      let paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') { paramValue = paramValue.toLowerCase(); }

      if (paramName.match(/\[(\d+)?\]$/)) {
        const key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) { obj[key] = []; }

        if (paramName.match(/\[\d+\]$/)) {
          const index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          obj[key].push(paramValue);
        }
      } else if (!obj[paramName]) {
        obj[paramName] = paramValue;
      } else if (obj[paramName] && typeof obj[paramName] === 'string') {
        obj[paramName] = [obj[paramName]];
        obj[paramName].push(paramValue);
      } else {
        obj[paramName].push(paramValue);
      }
    }
  }
  return obj;
}

async function getData(URL, resType = 'text', token = '') {
  try {
    const request = new Request(URL, {
      method: 'GET',
      mode: 'cors',
      cache: 'reload',
      headers: {
        'x-access-token': token,
      },
    });

    let result = '';
    const response = await fetch(request);

    if (resType === 'json') {
      result = await response.json();
      return result;
    }
    result = await response.text();
    return result;
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
        'Content-Type': 'application/json; charset=utf-8',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    });

    let result = '';
    const response = await fetch(request);

    if (resType === 'json') {
      result = await response.json();
      return result;
    }
    result = await response.text();
    return result;
  } catch (e) {
    throw Error(e);
  }
}

function signup(userType) {
  if (document.querySelector(`#${userType}-signup`)) {
    document.querySelector('form[action="signup.html"]').addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = document.querySelector('button[type="submit"]');
      const firstName = document.querySelector('#firstName').value;
      const lastName = document.querySelector('#lastName').value;
      const userName = document.querySelector('#userName').value;
      const phone = document.querySelector('#phone').value;
      const password = document.querySelector('#password').value;
      const email = document.querySelector('#email').value || '';
      const country = document.querySelector('#country').value || '';
      const city = document.querySelector('#city').value || '';
      const address = document.querySelector('#address').value || '';

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

        const URL = `${HOST}/api/v1/${userType === 'admin' ? 'admins' : 'auth'}/login`;
        const result = await postData(URL, data, 'json');

        if (result) {
          btn.children[0].classList = 'hidden';

          if (result.token) {
            localStorage.setItem(`${userType}Token`, result.token);
            localStorage.setItem(`${userType}`, JSON.stringify(result[`${userType === 'admin' ? 'newAdmin' : 'newUser'}`]));
            window.location.replace(`${userType}.html`);
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

function signin(userType) {
  if (document.querySelector(`#${userType}-signin`)) {
    document.querySelector('form[action="signin.html"]').addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = document.querySelector('button[type="submit"]');
      const userName = document.getElementById('userName').value;
      const password = document.getElementById('password').value;

      if (checkInput(userName) && checkInput(password)) {
        btn.children[0].classList = '';
        const data = {
          userName,
          password,
        };

        const URL = `${HOST}/api/v1/${userType === 'admin' ? 'admins' : 'auth'}/login`;
        const result = await postData(URL, data, 'json');

        if (result) {
          btn.children[0].classList = 'hidden';

          if (result.token) {
            localStorage.setItem(`${userType}Token`, result.token);
            localStorage.setItem(`${userType}`, JSON.stringify(result[userType]));
            window.location.replace(`${userType}.html`);
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

function showProfile(userType) {
  if (document.querySelector(`#${userType}Profile`) && localStorage.getItem(`${userType}`)) {
    const user = JSON.parse(localStorage.getItem(`${userType}`));
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

function signOut(userType) {
  if (localStorage.getItem(`${userType}Token`)) {
    localStorage.removeItem(`${userType}Token`);
  }
  if (localStorage.getItem(userType)) {
    localStorage.removeItem(userType);
  }

  window.location.replace('index.html');
}

async function getOrders(userType, orderType = 'all') {
  if (userType === 'user' && localStorage.getItem('user') && localStorage.getItem('userToken')) {
    const token = localStorage.getItem('userToken');
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const URL = `${HOST}/api/v1/users/${userId}/parcels/${orderType === 'all' ? '' : orderType}`;
    const result = await getData(URL, 'json', token);

    return result;
  }

  return false;
}

async function getOrder(userType, parcelId) {
  if (userType && parcelId && localStorage.getItem(userType) && localStorage.getItem(`${userType}Token`)) {
    const token = localStorage.getItem(`${userType}Token`);
    const URL = `${HOST}/api/v1/parcels/${parcelId}`;
    const result = await getData(URL, 'json', token);

    return result;
  }

  return false;
}

async function showUserOrdersNumber() {
  if (localStorage.getItem('user') && localStorage.getItem('userToken')) {
    const result = await getOrders('user');
    let pending = 0;
    let inTransit = 0;
    let delivered = 0;

    if (!result.error) {
      const orders = result.parcels;

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

async function showOrders(userType, orderType = 'all') {
  if (document.querySelector(`#${orderType}Orders`)) {
    const result = await getOrders(userType, orderType);

    if (result && !result.error) {
      let table = '';
      const orders = orderType === 'all' ? result.parcels : result[orderType];

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
            <a href="order_details.html?id=${order.id}" class="btn btn-default smooth-shadow" title="Order details">
              <i class="fas fa-info-circle"></i>
            </a>`;

        if (order.status !== 'delivered') {
          table += `
            <a href="modify_order.html?id=${order.id}" class="btn btn-default smooth-shadow" title="Modify order">
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

      document.querySelector(`#${orderType}Orders table`).innerHTML += table;
    } else {
      document.querySelector(`#${orderType}Orders table`).innerHTML = '';
      document.querySelector(`#${orderType}Orders .message`).innerHTML = result.error;
      document.querySelector(`#${orderType}Orders .message`).classList += ' message-error';
      document.querySelector(`#${orderType}Orders .message`).classList.replace('hidden', 'show');
    }
  }
  return true;
}

async function parcelDetails(userType, parcelId) {
  if (document.querySelector('#parcelDetails')) {
    const result = await getOrder(userType, parcelId);

    if (result && !result.error) {
      const { order } = result;
      document.querySelector('#orderId').innerHTML = `Order #${order.orderId}`;
      document.querySelector('#product').firstChild.innerHTML = order.product;
      document.querySelector('#weight').firstChild.innerHTML = order.weight;
      document.querySelector('#quantity').firstChild.innerHTML = order.quantity;
      document.querySelector('#price').firstChild.innerHTML = `USD ${order.price}`;
      document.querySelector('#status').firstChild.innerHTML = order.status;
      document.querySelector('#pickupLocation').firstChild.innerHTML = order.sender.country;
      document.querySelector('#pickupLocation').firstChild.innerHTML += order.sender.city ? `, ${order.sender.city}` : '';
      document.querySelector('#pickupLocation').firstChild.innerHTML += order.sender.address ? ` - ${order.sender.address}` : '';
      document.querySelector('#destination').firstChild.innerHTML = order.receiver.country;
      document.querySelector('#destination').firstChild.innerHTML += order.receiver.city ? `, ${order.receiver.city}` : '';
      document.querySelector('#destination').firstChild.innerHTML += order.receiver.address ? ` - ${order.receiver.address}` : '';
      document.querySelector('#presentLocation').firstChild.innerHTML = order.location;
      document.querySelector('#senderName').firstChild.innerHTML = `${order.sender.firstName} ${order.sender.lastName}`;
      document.querySelector('#senderPhone').firstChild.innerHTML = order.sender.phone;
      document.querySelector('#senderEmail').firstChild.innerHTML = order.sender.email;
      document.querySelector('#senderCountry').firstChild.innerHTML = order.sender.country;
      document.querySelector('#senderCity').firstChild.innerHTML = order.sender.city;
      document.querySelector('#senderAddress').firstChild.innerHTML = order.sender.address;
      document.querySelector('#receiverName').firstChild.innerHTML = order.receiver.name;
      document.querySelector('#receiverPhone').firstChild.innerHTML = order.receiver.phone;
      document.querySelector('#receiverEmail').firstChild.innerHTML = order.receiver.email;
      document.querySelector('#receiverCountry').firstChild.innerHTML = order.receiver.country;
      document.querySelector('#receiverCity').firstChild.innerHTML = order.receiver.city;
      document.querySelector('#receiverAddress').firstChild.innerHTML = order.receiver.address;
    } else if (result) {
      document.querySelector('#parcelDetails').classList = 'hidden';
      document.querySelector('.message').innerHTML = result.error;
      document.querySelector('.message').classList += ' message-error';
      document.querySelector('.message').classList.replace('hidden', 'show');
    } else {
      document.querySelector('#parcelDetails').classList = 'hidden';
      document.querySelector('.message').innerHTML = 'Order ID not specified';
      document.querySelector('.message').classList += ' message-error';
      document.querySelector('.message').classList.replace('hidden', 'show');
    }
  }
  return true;
}

function toggleMenuAside() {
  const btn = document.querySelector('#menu-aside-toggle-btn') || null;
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
    this.header = header;
    this.header.style.position = 'fixed';
    this.header.style.top = '0';
    this.header.style.width = window.outerWidth < 768 ? `${window.outerWidth}px` : '100%';

    if (localStorage.getItem('user') && document.querySelector('#user-top')) {
      const user = JSON.parse(localStorage.getItem('user'));
      document.querySelector('#user-top').setAttribute('href', 'user.html');
      document.querySelector('#user-top b').innerHTML = user.userName;
    }

    if (localStorage.getItem('admin') && document.querySelector('#user-top')) {
      const admin = JSON.parse(localStorage.getItem('admin'));
      document.querySelector('#user-top').setAttribute('href', 'admin.html');
      document.querySelector('#user-top b').innerHTML = admin.userName;
    }

    if (!localStorage.getItem('userToken') && document.querySelector('#user-top')) {
      document.querySelector('#user-top').setAttribute('href', 'signin.html');
    }

    this.header.style.display = 'block';
  }
}

function showNav(header, nav) {
  if (nav && PAGE_PARTS.indexOf('header') >= 0 && PAGE_PARTS.indexOf('nav') >= 0) {
    this.nav = nav;
    this.nav.style.position = 'fixed';
    this.nav.style.top = `${header.offsetHeight}px`;
    this.nav.style.width = window.outerWidth < 768 ? `${window.outerWidth}px` : '100%';
    this.nav.style.display = window.outerWidth < 768 ? 'block' : 'none';
  }
}

function showMenuAside(header, nav, menuAside) {
  if (menuAside && PAGE_PARTS.indexOf('header') >= 0
    && PAGE_PARTS.indexOf('nav') >= 0 && PAGE_PARTS.indexOf('menuAside') >= 0) {
    // show number of orders
    showUserOrdersNumber();
    this.menuAside = menuAside;
    this.menuAside.style.position = 'fixed';
    this.menuAside.style.top = `${header.outerHeight + nav.outerHeight}px`;
    this.menuAside.style.minHeight = `${window.innerHeight}px`;
    this.menuAside.style.width = window.outerWidth < 768 ? `${window.outerWidth / 1.5}px` : '20%';
    this.menuAside.style.display = window.outerWidth > 768 ? 'block' : 'none';

    // toggle menu aside
    if (document.querySelector('#menu-aside-toggle-btn')) {
      document.querySelector('#menu-aside-toggle-btn').addEventListener('click', () => {
        toggleMenuAside();
      });
    }
    // signOut
    if (document.querySelector('#signOut')) {
      document.querySelector('#signOut').addEventListener('click', () => {
        signOut(document.querySelector('#signOut').getAttribute('name'));
      });
    }
  }
}

function showSection(header, nav, menuAside, section) {
  if (section && PAGE_PARTS.indexOf('header') >= 0 && PAGE_PARTS.indexOf('nav') >= 0
    && PAGE_PARTS.indexOf('menuAside') >= 0 && PAGE_PARTS.indexOf('section')) {
    signup('user');
    signin('user');
    signup('admin');
    signin('admin');
    showProfile('user');
    showProfile('admin');
    showOrders('user');
    showOrders('user', 'pending');
    showOrders('user', 'inTransit');
    showOrders('user', 'delivered');
    parcelDetails('user', urlParams(window.location.href).id);

    this.section = section;

    if (nav) {
      this.section.style.minHeight = `${window.innerHeight - ((header.offsetHeight + nav.offsetHeight) * 2)}px`;
    } else {
      this.section.style.minHeight = `${window.innerHeight - (header.offsetHeight * 3)}px`;
    }

    if (menuAside) {
      this.section.style.width = window.outerWidth < 768 ? `${window.outerWidth}px` : '79%';
    } else {
      this.section.style.width = window.outerWidth < 768 ? `${window.outerWidth}px` : '100%';
    }

    this.section.style.marginLeft = (nav && window.outerWidth > 768) ? `${menuAside.offsetWidth}px` : 0;
    this.section.style.marginTop = nav ? `${header.offsetHeight + nav.offsetHeight}px` : `${header.offsetHeight}px`;
    this.section.style.display = 'block';
  }
}

function showFooter(header, nav, menuAside, footer) {
  if (footer && PAGE_PARTS.indexOf('header') >= 0 && PAGE_PARTS.indexOf('nav') >= 0
    && PAGE_PARTS.indexOf('menuAside') >= 0 && PAGE_PARTS.indexOf('section')) {
    this.footer = footer;

    if (menuAside) {
      this.footer.style.width = window.outerWidth < 768 ? `${window.outerWidth}px` : '79%';
    } else {
      this.footer.style.width = window.outerWidth < 768 ? `${window.outerWidth}px` : '100%';
    }

    this.footer.style.marginLeft = (nav && window.outerWidth > 768) ? `${menuAside.offsetWidth}px` : 0;
    this.footer.style.display = 'block';
  }
}

function showIncludedParts() {
  const header = document.getElementById('header') || null;
  const nav = document.getElementById('nav') || null;
  const menuAside = document.getElementById('user-menu-aside') || document.getElementById('admin-menu-aside') || null;
  const section = document.getElementById('section') || null;
  const footer = document.getElementById('footer') || null;

  showHeader(header);
  showNav(header, nav);
  showMenuAside(header, nav, menuAside);
  showSection(header, nav, menuAside, section);
  showFooter(header, nav, menuAside, footer);
}

function loadPagePartEnd(part) {
  if (part) { PAGE_PARTS.push(part); }

  showIncludedParts();

  window.addEventListener('resize', () => {
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
  const header = document.getElementById('header');
  const result = await getData('includes/header.html', 'text');

  if (result) {
    if (header) {
      header.innerHTML = result;
    }

    loadPagePartEnd('header');
  }
}

async function loadNav() {
  const nav = document.getElementById('nav');
  const result = await getData('includes/nav.html', 'text');

  if (result) {
    if (nav) {
      nav.innerHTML = result;
    }

    loadPagePartEnd('nav');
  }
}

async function loadMenuAside() {
  const userMenuAside = document.getElementById('user-menu-aside') || null;
  const adminMenuAside = document.getElementById('admin-menu-aside') || null;
  const resultUser = await getData('includes/user_menu_aside.html', 'text');
  const resultAdmin = await getData('includes/admin_menu_aside.html', 'text');

  if (resultUser || resultAdmin) {
    if (userMenuAside) {
      userMenuAside.innerHTML = resultUser;
    } else if (adminMenuAside) {
      adminMenuAside.innerHTML = resultAdmin;
    }

    loadPagePartEnd('menuAside');
  }
}

async function loadFooter() {
  const footer = document.getElementById('footer');
  const result = await getData('includes/footer.html', 'text');

  if (result) {
    if (footer) {
      footer.innerHTML = result;
    }

    loadPagePartEnd('footer');
  }
}

window.document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
  loadNav();
  loadMenuAside();
  loadFooter();
});
