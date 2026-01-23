const request = require('supertest');

request('https://automationintesting.online')
  .get('/booking')
  .end((err, res) => {
    request('https://automationintesting.online')
      .post('/booking')
      .send({
      })
      .end((err, res) => {
        console.log(res.statusCode);
      });
  });