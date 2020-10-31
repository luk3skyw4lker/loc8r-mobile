import axios from 'axios';

const api = axios.create({
	baseURL: 'https://mysterious-depths-49888.herokuapp.com/api',
	validateStatus: function (status: number) {
		return status >= 200 || status <= 304 ? true : false;
	},
	timeout: 2000
});

export default api;
