let HOST = 'https://rwajon-sendit.herokuapp.com';

if (window.location.href.indexOf('http://localhost:3000') >= 0) {
  HOST = 'http://localhost:3000';
}

function backTop() {
  if (window.location.href.indexOf('#') < 0) {
    window.location.replace(`${window.location.href}#`);
  } else if (window.location.href.indexOf('#') > 0) {
    window.location.replace(window.location.href);
  }
  return true;
}

function checkInput(input) {
  if (input && input.match(/[a-z0-9]{2}/i) && !input.match(/[!$%*|}{:><?~`_&#^=]/)) {
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
      const paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      paramName = paramName.toLowerCase();
      // if (typeof paramValue === 'string') { paramValue = paramValue.toLowerCase(); }

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

function modalBox(modal) {
  this.modal = modal || null;

  if (this.modal) {
    this.modal.style.display = 'block';

    const close = document.querySelectorAll(`#${this.modal.getAttribute('id')} .close`);

    close.forEach((closeBtn) => {
      closeBtn.addEventListener('click', () => {
        this.modal.style.display = 'none';
      });
    });

    window.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.modal.style.display = 'none';
      }
    });
  }
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

async function sendData(METHOD, URL, data = {}, resType = 'text', token = '') {
  try {
    const request = new Request(URL, {
      method: METHOD,
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

async function loadHeader() {
  const header = document.querySelector('#header');
  const result = await getData('includes/header.html', 'text');

  if (result) {
    if (header) {
      header.innerHTML = result;
    }
  }
}

async function loadNav() {
  const nav = document.querySelector('#nav');
  const result = await getData('includes/nav.html', 'text');

  if (result) {
    if (nav) {
      nav.innerHTML = result;
    }
  }
}

async function loadMenuAside() {
  const userMenuAside = document.querySelector('#user-menu-aside') || null;
  const adminMenuAside = document.querySelector('#admin-menu-aside') || null;
  const resultUser = await getData('includes/user_menu_aside.html', 'text');
  const resultAdmin = await getData('includes/admin_menu_aside.html', 'text');

  if (resultUser || resultAdmin) {
    if (userMenuAside) {
      userMenuAside.innerHTML = resultUser;
    } else if (adminMenuAside) {
      adminMenuAside.innerHTML = resultAdmin;
    }
  }
}

async function loadFooter() {
  const footer = document.querySelector('#footer');
  const result = await getData('includes/footer.html', 'text');

  if (result) {
    if (footer) {
      footer.innerHTML = result;
    }
  }
}

function signup(userType) {
  if (document.querySelector(`#${userType}-signup`)) {
    document.querySelector(`#${userType}-signup form`).addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = document.querySelector('button[type="submit"]');
      const firstName = document.querySelector('form [name="firstName"]').value;
      const lastName = document.querySelector('form [name="lastName"]').value;
      const userName = document.querySelector('form [name="userName"]').value;
      const phone = document.querySelector('form [name="phone"]').value;
      const password = document.querySelector('form [name="password"]').value;
      const confirmPassword = document.querySelector('form [name="confirmPassword"]').value;
      const email = document.querySelector('form [name="email"]').value || '';
      const country = document.querySelector('form [name="country"]').value || '';
      const city = document.querySelector('form [name="city"]').value || '';
      const address = document.querySelector('form [name="address"]').value || '';

      if (password !== confirmPassword) {
        document.querySelector('form [name="password"]').classList += 'error';
        document.querySelector('form [name="confirmPassword"]').classList += 'error';
        return false;
      }

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

        const URL = `${HOST}/api/v1/${userType === 'admin' ? 'admins' : 'auth'}/signup`;
        const result = await sendData('POST', URL, data, 'json');

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
            backTop();
          }
        }
      }

      return true;
    });
  }
}

function signin(userType) {
  if (document.querySelector(`#${userType}-signin`)) {
    document.querySelector(`#${userType}-signin form`).addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = document.querySelector('button[type="submit"]');
      const userName = document.querySelector('form [name="userName"]').value;
      const password = document.querySelector('form [name="password"]').value;

      if (checkInput(userName) && checkInput(password)) {
        btn.children[0].classList = '';
        const data = {
          userName,
          password,
        };

        const URL = `${HOST}/api/v1/${userType === 'admin' ? 'admins' : 'auth'}/login`;
        const result = await sendData('POST', URL, data, 'json');

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
    document.querySelector(`#${userType}Profile`).classList.replace('hidden', 'show');
  } else if (document.querySelector(`#${userType}Profile`) && !localStorage.getItem(`${userType}`)) {
    if (userType === 'user') {
      window.location.replace('signin.html');
    } else if (userType === 'admin') {
      window.location.replace('admin_signin.html');
    }
  }
}

function signOut() {
  const signOutBtn = document.querySelector('#signOut') || null;

  if (signOutBtn) {
    const userType = signOutBtn.getAttribute('name');

    signOutBtn.addEventListener('click', () => {
      signOut(signOutBtn.getAttribute('name'));
      if (localStorage.getItem(`${userType}Token`)) {
        localStorage.removeItem(`${userType}Token`);
      }
      if (localStorage.getItem(userType)) {
        localStorage.removeItem(userType);
      }

      window.location.replace('index.html');
    });
  }
}

function createOrder() {
  if (document.querySelector('#createOrder') && localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user'));
    document.querySelector('form [name="senderCountry"]').value = user.country;
    document.querySelector('form [name="senderCity"]').value = user.city;
    document.querySelector('form [name="senderAddress"]').value = user.address;

    document.querySelector('#createOrder form').addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = document.querySelector('button[type="submit"]');
      const product = document.querySelector('form [name="product"]').value || null;
      const weight = document.querySelector('form [name="weight"]').value || null;
      const quantity = document.querySelector('form [name="quantity"]').value || null;
      const receiverCountry = document.querySelector('form [name="receiverCountry"]').value || null;
      const receiverCity = document.querySelector('form [name="receiverCity"]').value || null;
      const receiverAddress = document.querySelector('form [name="receiverAddress"]').value || null;
      const receiverName = document.querySelector('form [name="receiverName"]').value || null;
      const receiverPhone = document.querySelector('form [name="receiverPhone"]').value || null;
      const receiverEmail = document.querySelector('form [name="receiverEmail"]').value || null;
      const senderCountry = document.querySelector('form [name="senderCountry"]').value || null;
      const senderCity = document.querySelector('form [name="senderCity"]').value || null;
      const senderAddress = document.querySelector('form [name="senderAddress"]').value || null;

      if (product && weight && quantity && receiverCountry && receiverName
        && receiverPhone && senderCountry) {
        btn.children[0].classList = '';
        const price = (quantity * weight) * 1.5;
        const data = {
          product,
          weight,
          quantity,
          price,
          receiverCountry,
          receiverCity,
          receiverAddress,
          receiverName,
          receiverPhone,
          receiverEmail,
          senderCountry,
          senderCity,
          senderAddress,
        };

        const token = localStorage.getItem('userToken') || null;
        const URL = `${HOST}/api/v1/parcels`;
        const result = await sendData('POST', URL, data, 'json', token);

        if (result) {
          btn.children[0].classList = 'hidden';

          if (result && !result.error) {
            window.location.replace(`order.html?id=${result.order.id}`);
          } else if (result && result.error) {
            document.querySelector('.message').innerHTML = result.error;
            document.querySelector('.message').classList += ' message-error';
            document.querySelector('.message').classList.replace('hidden', 'show');
            backTop();
          }
        }
      }
    });
  }
}

async function getOrders(userType, orderType = '') {
  if (userType && localStorage.getItem(userType) && localStorage.getItem(`${userType}Token`)) {
    const token = localStorage.getItem(`${userType}Token`);
    const userId = JSON.parse(localStorage.getItem(userType)).id;
    let URL = '';

    if (orderType) {
      this.orderType = orderType;
    } else {
      this.orderType = '';
    }

    if (userType === 'user') {
      URL = `${HOST}/api/v1/users/${userId}/parcels/${this.orderType}`;
    } else if (userType === 'admin') {
      URL = `${HOST}/api/v1/parcels/${this.orderType}`;
    }

    const result = await getData(URL, 'json', token);

    return result;
  }

  return false;
}

async function odersNumber(userType = 'user') {
  if (document.querySelector(`#${userType}-menu-aside`) && localStorage.getItem(userType) && localStorage.getItem(`${userType}Token`)) {
    const result = await getOrders(userType);
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

    document.querySelectorAll(`#${userType}-menu-aside .badge`)[0].innerHTML = pending;
    document.querySelectorAll(`#${userType}-menu-aside .badge`)[1].innerHTML = inTransit;
    document.querySelectorAll(`#${userType}-menu-aside .badge`)[2].innerHTML = delivered;
  }
  return true;
}

async function getOrder(parcelId, userType = 'user') {
  if (userType && parcelId && localStorage.getItem(userType) && localStorage.getItem(`${userType}Token`)) {
    const token = localStorage.getItem(`${userType}Token`);
    const URL = `${HOST}/api/v1/parcels/${parcelId}`;
    const result = await getData(URL, 'json', token);

    return result;
  }

  return false;
}

function searchOrder(userType = 'user') {
  if (document.querySelector('#searchOrder')) {
    document.querySelector('#searchOrder').addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = document.querySelector('#searchOrder button[type="submit"]');
      const parcelId = document.querySelector('#searchOrder [name="id"]').value || null;

      if (parcelId) {
        btn.children[1].classList = '';
        const result = await getOrder(parcelId, userType);

        if (result && !result.error) {
          let table = `
          <table class="table table-bordered table-hover smooth-shadow atm abm text-center">
            <thead class="table-head">
              <th>#</th>
              <th>Product</th>
              <th class="hidden-xs">Quantity</th>
              <th class="hidden-xs">Weight</th>
              <th class="hidden-xs">Price</th>
              <th>Status</th>
              <th></th>
            </thead>
            <tr>
              <td>${result.order.orderId}</td>
              <td>${result.order.product}</td>
              <td class="hidden-xs">${result.order.quantity}</td>
              <td class="hidden-xs">${result.order.weight}</td>
              <td class="hidden-xs">USD ${result.order.price}</td>`;

          if (result.order.status === 'pending') {
            table += `
              <td>
                <span class="btn btn-default smooth-shadow">${result.order.status}</span>
              </td>`;
          }

          if (result.order.status === 'in transit') {
            table += `
              <td>
                <span class="btn btn-warning smooth-shadow">${result.order.status}</span>
              </td>`;
          }

          if (result.order.status === 'delivered') {
            table += `
              <td>
                <span class="btn btn-success smooth-shadow">${result.order.status}</span>
              </td>`;
          }

          table += `
              <td class='text-left'>
                <a href="${userType === 'admin' ? 'admin_' : ''}order.html?id=${result.order.orderId}" class="btn btn-default smooth-shadow" title="details">
                  <i class="fas fa-info-circle"></i>
                </a>`;

          if (result.order.status !== 'delivered' || userType === 'admin') {
            table += `
                <a href="${userType === 'admin' ? 'admin_' : ''}modify_order.html?id=${result.order.orderId}" class="btn btn-default smooth-shadow" title="modify">
                  <i class="fas fa-edit"></i>
                </a>`;
          }

          if (result.order.status !== 'delivered' && userType === 'user') {
            table += `
                <a href="#" id="${result.order.orderId}" class="btn btn-danger smooth-shadow cancelOrder" title="cancel">
                  <i class="fas fa-trash-alt"></i>
                </a>`;
          }

          table += `
              </td>
            </tr>`;

          table += `
            </table>
          </div>`;

          document.querySelector(`#${userType}Orders table`).innerHTML = table;
          btn.children[1].classList = 'hidden';
        } else if (result && result.error) {
          btn.children[1].classList = 'hidden';
          document.querySelector('#parcelsModal .modal-body').innerHTML = `
          <p class="text-center text-danger">
            ${result.error}
          </p>`;

          document.querySelector('#parcelsModal .ok').style.display = 'none';
          modalBox(document.querySelector('#parcelsModal'));
        }
      }
    });
  }
}

async function showOrders(orderType = '', userType = 'user') {
  if (document.querySelector(`#${userType}Orders`)) {
    const result = await getOrders(userType, orderType);
    let title = '';

    if (result && !result.error) {
      const orders = orderType ? result[orderType] : result.parcels;

      if (orderType === 'pending') {
        title = 'Pending order(s)';
      } else if (orderType === 'inTransit') {
        title = 'Parcel(s) in transit';
      } else if (orderType === 'delivered') {
        title = 'Delivered parcel(s)';
      } else {
        title = 'All order(s)';
      }

      let table = `
      <div class="table-responsive">
        <h1 class="add-padding btn">${title}</h1>
        <form method="get" id="searchOrder">
            <input class="form-inline smooth-shadow" name='id' placeholder="search" autocomplete="off">
            <button type="submit" class="btn btn-turquoise smooth-shadow">
              <i class="fas fa-search"></i>
              <img class="hidden" src="assets/images/loading.svg" style="height:20px; vertical-align: top; margin-top: -5px">
            </button>
        </form>
        <table class="table table-bordered table-hover smooth-shadow atm abm text-center">
          <thead class="table-head">
            <th>#</th>
            <th>Product</th>
            <th class="hidden-xs">Quantity</th>
            <th class="hidden-xs">Weight</th>
            <th class="hidden-xs">Price</th>
            <th>Status</th>
            <th></th>
          </thead>`;

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
              <a href="${userType === 'admin' ? 'admin_' : ''}order.html?id=${order.id}" class="btn btn-default smooth-shadow" title="details">
                <i class="fas fa-info-circle"></i>
              </a>`;

        if (order.status !== 'delivered' || userType === 'admin') {
          table += `
                <a href="${userType === 'admin' ? 'admin_' : ''}modify_order.html?id=${order.id}" class="btn btn-default smooth-shadow" title="modify">
                  <i class="fas fa-edit"></i>
                </a>`;
        }

        if (order.status !== 'delivered' && userType === 'user') {
          table += `
                <a href="#" id="${order.id}" class="btn btn-danger smooth-shadow cancelOrder" title="cancel">
                  <i class="fas fa-trash-alt"></i>
                </a>`;
        }

        table += `
            </td>
          </tr>`;
      });

      table += `
        </table>
      </div>`;

      document.querySelector(`#${userType}Orders`).innerHTML = '';
      document.querySelector(`#${userType}Orders`).innerHTML += table;
    } else {
      document.querySelector(`#${userType}Orders`).innerHTML = '';
      document.querySelector(`#${userType}Orders`).innerHTML = `
      <div class="add-padding atm message-error text-center">
        ${result.error}
      </div>`;
    }
  }
  return true;
}

async function parcelDetails(parcelId, userType = 'user') {
  if (document.querySelector(`#${userType}ParcelDetails`)) {
    console.log(userType)
    const result = await getOrder(parcelId, userType);

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
    } else if (result.error) {
      document.querySelector(`#${userType}ParcelDetails`).classList = 'hidden';
      document.querySelector('.message').innerHTML = result.error;
      document.querySelector('.message').classList += ' message-error';
      document.querySelector('.message').classList.replace('hidden', 'show');
    } else {
      document.querySelector(`#${userType}ParcelDetails`).classList = 'hidden';
      document.querySelector('.message').innerHTML = 'Order ID not specified';
      document.querySelector('.message').classList += ' message-error';
      document.querySelector('.message').classList.replace('hidden', 'show');
    }
  }
  return true;
}

async function modifyOrder(parcelId, userType = 'user') {
  if (parcelId && document.querySelector(`#${userType}ModifyOrder`)) {
    const result = await getOrder(parcelId, userType);

    if (result && !result.error) {
      const { order } = result;
      document.querySelector('#orderId').innerHTML = `Order #${order.orderId}`;

      if (document.querySelector('form [name="currentCountry"]')) {
        document.querySelector('form [name="currentCountry"]').value = order.receiver.country;
      }
      if (document.querySelector('form [name="currentCity"]')) {
        document.querySelector('form [name="currentCity"]').value = order.receiver.city;
      }
      if (document.querySelector('form [name="currentAddress"]')) {
        document.querySelector('form [name="currentAddress"]').value = order.receiver.address;
      }
      if (document.querySelector('form [name="currentStatus"]')) {
        document.querySelector('form [name="currentStatus"]').value = order.status;
      }

      document.querySelectorAll(`#${userType}ModifyOrder form`).forEach((form) => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          const btn = document.querySelector(`#${e.target.getAttribute('id')} button[type="submit"]`);
          const country = (document.querySelector('form [name="country"]') && document.querySelector('form [name="country"]').value) || null;
          const city = (document.querySelector('form [name="city"]') && document.querySelector('form [name="city"]').value) || null;
          const address = (document.querySelector('form [name="address"]') && document.querySelector('form [name="address"]').value) || null;
          const status = (document.querySelector('form [name="status"]') && document.querySelector('form [name="status"]').value) || null;

          if (checkInput(country) || checkInput(city)
            || checkInput(address) || checkInput(status)) {
            const data = {
              country,
              city,
              address,
              status,
            };

            btn.children[0].classList.replace('hidden', 'show');
            const token = localStorage.getItem(`${userType}Token`);
            const URL = `${HOST}/api/v1/parcels/${parcelId}/${e.target.getAttribute('id')}`;
            this.result = await sendData('PUT', URL, data, 'json', token);

            if (this.result && !this.result.error) {
              btn.children[0].classList.replace('show', 'hidden');
              if (document.querySelector('form [name="currentCountry"]')) {
                document.querySelector('form [name="currentCountry"]').value = this.result.changed.receiverCountry;
              }
              if (document.querySelector('form [name="currentCity"]')) {
                document.querySelector('form [name="currentCity"]').value = this.result.changed.receiverCity;
              }
              if (document.querySelector('form [name="currentAddress"]')) {
                document.querySelector('form [name="currentAddress"]').value = this.result.changed.receiverAddress;
              }
              if (document.querySelector('form [name="currentStatus"]')) {
                document.querySelector('form [name="currentStatus"]').value = this.result.changed.status;
              }

              document.querySelector('.message').innerHTML = 'Destination changed';
              document.querySelector('.message').classList += ' message-success';
              document.querySelector('.message').classList.replace('hidden', 'show');
              odersNumber('user');
              odersNumber('admin');
              backTop();
            } else if (this.result.error) {
              btn.children[0].classList.replace('show', 'hidden');
              document.querySelector('.message').innerHTML = this.result.error;
              document.querySelector('.message').classList += ' message-error';
              document.querySelector('.message').classList.replace('hidden', 'show');
              backTop();
            }
          }
        });
      });
    } else if (result.error) {
      document.querySelector(`#${userType}ModifyOrder`).classList = 'hidden';
      document.querySelector('.message').innerHTML = result.error;
      document.querySelector('.message').classList += ' message-error';
      document.querySelector('.message').classList.replace('hidden', 'show');
    }
  } else if (!parcelId && document.querySelector(`#${userType}ModifyOrder`)) {
    document.querySelector(`#${userType}ModifyOrder`).classList = 'hidden';
    document.querySelector('.message').innerHTML = 'Order ID not specified';
    document.querySelector('.message').classList += ' message-error';
    document.querySelector('.message').classList.replace('hidden', 'show');
  }
  return true;
}

function cancelOrder(userType = 'user') {
  if (document.querySelectorAll('.cancelOrder').length > 0) {
    const btns = document.querySelectorAll('.cancelOrder');

    btns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        this.btn = btn;

        document.querySelector('#parcelsModal .modal-body').innerHTML = `
        <p class="text-center">
          Do you want to cancel this order?
        </p>`;

        document.querySelector('#parcelsModal .ok').style.display = 'inline-block';
        modalBox(document.querySelector('#parcelsModal'));

        document.querySelector('#parcelsModal .ok').addEventListener('click', async () => {
          this.btn.style.cursor = 'not-allowed';
          this.btn.parentNode.parentNode.style.opacity = '0.1';
          const parcelId = btn.getAttribute('id');
          const token = localStorage.getItem(`${userType}Token`);
          const URL = `${HOST}/api/v1/parcels/${parcelId}/cancel`;
          this.result = await sendData('PUT', URL, { status: 'cancel' }, 'json', token);

          if (this.result && !this.result.error) {
            odersNumber('user');
            odersNumber('admin');
            btn.parentNode.parentNode.remove();
          } else if (this.result && this.result.error) {
            document.querySelector('#parcelsModal .modal-body').innerHTML = `
            <p class="text-center text-danger">
              ${this.result.error}
            </p>`;

            document.querySelector('#parcelsModal .ok').style.display = 'none';
            modalBox(document.querySelector('#parcelsModal'));

            this.btn.style.cursor = 'pointer';
            this.btn.parentNode.parentNode.style.opacity = '1';
          }
        });
      });
    });
  }
}

function showHeader(header) {
  if (header) {
    this.header = header;
    this.header.style.position = 'fixed';
    this.header.style.top = '0';
    this.header.style.width = window.outerWidth < 768 ? `${window.outerWidth}px` : '100%';

    if (localStorage.getItem('user') && document.querySelector('#user-top')) {
      const user = JSON.parse(localStorage.getItem('user'));
      document.querySelector('#user-top').setAttribute('href', 'user.html');
      document.querySelector('#user-top b').innerHTML = user.userName;
    }

    if (localStorage.getItem('admin') && !document.querySelector('#admin-top')) {
      const admin = JSON.parse(localStorage.getItem('admin'));
      document.querySelector('#header').innerHTML += `
      <a id="admin-top" href="admin.html">
        <b>${admin.userName}</b>
        <h3 class="fas fa-user-circle"></h3>
      </a>`;
    }

    if (!localStorage.getItem('userToken') && document.querySelector('#user-top')) {
      document.querySelector('#user-top').setAttribute('href', 'signin.html');
    }

    this.header.style.display = 'block';
  }
}

function showNav(header, nav) {
  if (nav && header) {
    this.nav = nav;
    this.nav.style.position = 'fixed';
    this.nav.style.top = `${header.offsetHeight}px`;
    this.nav.style.width = window.outerWidth < 768 ? `${window.outerWidth}px` : '100%';
    this.nav.style.display = window.outerWidth < 768 ? 'block' : 'none';
  }
}

function showMenuAside(header, nav, menuAside) {
  if (header && nav && menuAside) {
    this.menuAside = menuAside;
    this.menuAside.style.position = 'fixed';
    this.menuAside.style.top = `${header.outerHeight + nav.outerHeight}px`;
    this.menuAside.style.minHeight = `${window.innerHeight}px`;
    this.menuAside.style.width = window.outerWidth < 768 ? `${window.outerWidth / 1.5}px` : '20%';
    this.menuAside.style.display = window.outerWidth > 768 ? 'block' : 'none';
  }
}

function toggleMenuAside() {
  const btn = document.querySelector('#menu-aside-toggle-btn') || null;
  const menuAside = document.querySelector('#user-menu-aside') || document.querySelector('#admin-menu-aside') || null;

  if (btn && menuAside) {
    btn.addEventListener('click', () => {
      if (window.outerWidth < 768) {
        menuAside.style.display = menuAside.style.display === 'none' ? 'block' : 'none';
        btn.innerHTML = menuAside.style.display === 'none' ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
      }

      document.querySelector('#section').addEventListener('click', () => {
        btn.innerHTML = '<i class="fas fa-bars"></i>';
        menuAside.style.display = 'none';
      });
    });
  }
}

function showSection(header, nav, menuAside, section) {
  if (header && section) {
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

function showFooter(header, nav, menuAside, section, footer) {
  if (header && section && footer) {
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

function loadPagePartDone() {
  const header = document.querySelector('#header') || null;
  const nav = document.querySelector('#nav') || null;
  const menuAside = document.querySelector('#user-menu-aside') || document.querySelector('#admin-menu-aside') || null;
  const section = document.querySelector('#section') || null;
  const footer = document.querySelector('#footer') || null;

  showHeader(header);
  showNav(header, nav);
  showMenuAside(header, nav, menuAside);
  showSection(header, nav, menuAside, section);
  showFooter(header, nav, menuAside, section, footer);

  window.addEventListener('resize', () => {
    showHeader(header);
    showNav(header, nav);
    showMenuAside(header, nav, menuAside);
    showSection(header, nav, menuAside, section);
    showFooter(header, nav, menuAside, section, footer);

    if (window.outerWidth < 768) {
      const btn = document.querySelector('#menu-aside-toggle-btn') || null;

      if (btn && menuAside) {
        menuAside.style.display = 'none';
        btn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }
  });
}

window.document.addEventListener('DOMContentLoaded', () => {
  // load header
  loadHeader().then(() => {
    loadPagePartDone();
  });

  // load nav
  loadNav().then(() => {
    loadPagePartDone();
  });

  // load menu aside
  loadMenuAside().then(() => {
    loadPagePartDone();
  }).then(() => {
    toggleMenuAside();
    odersNumber('user');
    odersNumber('admin');
    signOut();
  });

  // load footer
  loadFooter().then(() => {
    loadPagePartDone();
  });

  signup('user');
  signin('user');
  signup('admin');
  signin('admin');
  showProfile('user');
  showProfile('admin');
  createOrder();
  showOrders(urlParams(window.location.href).type, 'user').then(() => {
    cancelOrder('user');
    searchOrder('user');
  });
  showOrders(urlParams(window.location.href).type, 'admin').then(() => {
    searchOrder('admin');
  });
  parcelDetails(urlParams(window.location.href).id, 'user');
  parcelDetails(urlParams(window.location.href).id, 'admin');
  modifyOrder(urlParams(window.location.href).id, 'user');
  modifyOrder(urlParams(window.location.href).id, 'admin');
});
