const axios = require('axios');

async function bookRoom() {
  const res = await axios.get('https://automationintesting.online/booking');

  await axios.post('https://automationintesting.online/booking', {
  });

  console.log('No assertion or error handling');
}

bookRoom();