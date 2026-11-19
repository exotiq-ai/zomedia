const params = new URLSearchParams(location.search);
const details = document.querySelector('#access');
const returnTo = document.querySelector('input[name="returnTo"]');
// The server independently validates this value; never navigate directly from it here.
if (returnTo && params.get('returnTo')) returnTo.value = params.get('returnTo');
if (params.get('error') === 'password') {
  details.open = true;
  document.querySelector('#access-status').textContent = 'That password did not match. Please try again.';
  document.querySelector('#password').focus();
}
