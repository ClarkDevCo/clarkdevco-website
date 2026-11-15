// Clark Development Company — site behavior
// 1. Mobile menu   2. Contact dialog   3. Inquiry form   4. Footer year

const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
const dialog = document.querySelector('#contact-dialog');

// 1. Mobile menu ---------------------------------------------------------
function setNav(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Close −' : 'Menu +';
}

menu.addEventListener('click', () => setNav(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setNav(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setNav(false); });
window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) setNav(false); });

// 2. Contact dialog ------------------------------------------------------
// Any element with data-contact opens it; data-topic preselects the topic.
document.querySelectorAll('[data-contact]').forEach(button => {
  button.addEventListener('click', () => {
    setNav(false);
    if (button.dataset.topic) document.querySelector('[name=topic]').value = button.dataset.topic;
    dialog.showModal();
  });
});

document.querySelector('.close').addEventListener('click', () => dialog.close());

// Close when clicking the dimmed backdrop outside the dialog box
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  const outside = event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
  if (outside) dialog.close();
});

// 3. Inquiry form ---------------------------------------------------------
// Opens the visitor's email app with the message addressed to Chris and Alex.
// (No server involved; nothing is stored on the website.)
const INQUIRY_TO = 'chris@clarkdevco.com,alex@clarkdevco.com';

document.querySelector('#inquiry').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const subject = `Website inquiry: ${data.get('topic')} (${data.get('name')})`;
  const body =
    `Name: ${data.get('name')}\n` +
    `Email: ${data.get('email')}\n` +
    `Topic: ${data.get('topic')}\n\n` +
    `${data.get('details')}\n`;

  window.location.href = `mailto:${INQUIRY_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  document.querySelector('#form-status').textContent =
    'Your email app should open with your message ready to send. If it doesn’t, email chris@clarkdevco.com or alex@clarkdevco.com directly.';
});

// 4. Footer year ---------------------------------------------------------
document.querySelector('#year').textContent = new Date().getFullYear();
