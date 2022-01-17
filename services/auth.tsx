// login(): POST {username, password} & save JWT to Local Storage
// logout(): remove JWT from Local Storage
// register(): POST {username, email, password}
// getCurrentUser(): get stored user information (including JWT)

// import axios from "axios";
import { instance } from './instance';
const FormData = require('form-data');
export const login = async (params) => {
	try {
		const formData = new FormData();

		formData.append('username', params.username);
		formData.append('password', params.password);

		const res = await instance.post('/api/Account/LoginV2', formData, {
			headers: formData.getHeaders()
		});

		return res;
	} catch (error) {
		console.log('login error', error);
		return Promise.reject(error);
	}
};

export const registerAPI = async (params: { username: String; email: String; password: String; roles: Array<String> }) => {
	try {
		const res = await instance.post('/auth/signup', params);
		return res;
	} catch (error) {
		console.log('register error', error);
		return Promise.reject(error);
	}
};

export const GoogleLogin = async (params) => {
	try {
		var myHeaders = new Headers();
		myHeaders.append('token', params?.tokenId);

		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			redirect: 'follow'
		};

		let res = '';

		// @ts-ignore
		await fetch(_.API_URL + '/api/LoginByGoogleAccount', requestOptions)
			.then((response) => response.text())
			.then((result) => {
				res = JSON.parse(result);
			})
			.catch((error) => console.log('error', error));

		return res;
	} catch (error) {
		console.log('login error', error);
		return Promise.reject(error);
	}
};
