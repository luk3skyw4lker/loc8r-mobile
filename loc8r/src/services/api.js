<<<<<<< HEAD
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mysterious-depths-49888.herokuapp.com/api',
  validateStatus: function(status) {
    return status >= 200 || status <= 304 ? true : false;
  },
  timeout: 2000
});

export default api;
=======
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mysterious-depths-49888.herokuapp.com/api',
  validateStatus: function (status) {
    return status >= 200 || status <= 304 ? true : false
  },
  timeout: 2000
});

export default api;
>>>>>>> bb51e2cd17157e74aa1cff3aa008e04bf0c8bbb9
