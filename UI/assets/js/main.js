async function getData(URL, resType = 'text', token = '') {
  try {
    const request = new Request(URL, {
      method: 'GET',
      mode: 'cors',
      cache: 'reload',
      credentials: 'include',
      headers: {
        'x-access-token': token
      }
    });

    let data = '';
    const response = await fetch(request);

    if (response.ok) {
      if (resType === 'json') {
        data = await response.json();
        return data;
      } else {
        data = await response.text();
        return data;
      }
    } else {
      throw Error(response.statusText);
    }
  } catch (e) {
    throw Error(e);
  }
}

function toggleMenuAside(el) {
  const btn = el || document.getElementById('menu-aside-toggle-btn');
  const menuAside = document.getElementById('user-menu-aside') || document.getElementById('admin-menu-aside');

  if (window.outerWidth < 768) {
    menuAside.style.display = menuAside.style.display === 'none' ? 'block' : 'none';
    btn.innerHTML = menuAside.style.display === 'none' ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
  }

  document.getElementById('section').addEventListener('click', () => {
    btn.innerHTML = '<i class="fas fa-bars"></i>';
    menuAside.style.display = 'none';
  });
}

function showHeader(header) {
  if (header && PAGE_PARTS.indexOf('header') >= 0) {
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.width = window.outerWidth < 768 ? `${window.outerWidth}px` : '100%';
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
    toggleMenuAside();
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

window.document.addEventListener('DOMContentLoaded', () => {
  PAGE_PARTS = [];

  loadHeader();
  loadNav();
  loadMenuAside();
  loadFooter();
});