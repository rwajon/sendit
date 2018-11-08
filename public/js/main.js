function menuAsideToggle() {

  var button = document.getElementById('menu-aside-toggle-btn');
  var menu = document.getElementById('menu-aside');
  var section = document.getElementsByTagName('section')[0];

  if (!document.getElementById('menu-aside').innerHTML) {
    menu.style.display = 'none';
    section.style.margin = '0';
    section.style.width = '100%';
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
  menuAsideToggle();
  cancelOrder();
});