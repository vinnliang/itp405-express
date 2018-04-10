const request = require('request');

module.exports = {
  get(url, token) {
    return new Promise(function(resolve, reject) {
      request({
        url: url,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }, function(error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(body));
        }
      });
    });
  }
};
