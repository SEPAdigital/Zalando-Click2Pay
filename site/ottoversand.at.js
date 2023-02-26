
fetch('https://www.ottoversand.at/api/customer/v1/customer/status?force=true')
fetch('https://www.ottoversand.at/api/customer/v1/bookings/all')
fetch('https://www.ottoversand.at/api/customer/v1/bookings/invoice')
fetch('https://www.ottoversand.at/api/customer/v1/invoice/NO%3A2517964%3A2023-02-15')
fetch('https://www.ottoversand.at/api/customer/v1/customer')
fetch('https://www.ottoversand.at/api/customer/v1/customer/info')

const h = new Headers();
h.append('Content-Type', 'application/json');
h.append('x-ec-token', localStorage.getItem('sessionKey'));

fetch('https://www.ottoversand.at/api/customer/v1/customer/info', {
  method: 'GET',
  headers: h,
}).then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('API error');
    }
  })
  .then(response => {
    console.debug(response.debitBalance);
  }).catch(error => {
    console.error(error);
  });
