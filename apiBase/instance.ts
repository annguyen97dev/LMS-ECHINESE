import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession, signIn } from 'next-auth/client';
import _ from '~/appConfig';

function getUrl(config) {
	if (config.baseURL) {
		return config.url.replace(config.baseURL, '').split('?')[0];
	}
	return config.url;
}

export const authHeader_X = async () => {
	const session = await getSession();
	if (session && session.accessToken) {
		return { token: session.accessToken };
	} else {
		return {};
	}
};
export const authHeader_Bearer = async () => {
	const session = await getSession();

	if (session && session.accessToken) {
		return { Authorization: 'Bearer ' + session.accessToken };
	} else {
		return {};
	}
};
export const instance = axios.create({
	baseURL: _.API_URL,
	headers: {
		Accept: 'application/json'
	}
});

instance.interceptors.request.use(
	async (config: AxiosRequestConfig) => {
		const url = getUrl(config);
		if (!url.toString().includes('/auth/')) {
			const authHeader = await authHeader_X();
			config.headers = {
				...config.headers,
				...authHeader
			};
		}
		if (url !== '/api/Idioms/getRandoms' && url !== '/api/Rules') {
			console.log(`%c ${config.method.toUpperCase()} - ${url}:`, 'color: #0086b3; font-weight: bold', config);
		}
		return config;
	},
	(error) => {
		console.log(`%c ${error?.response?.status}  :`, 'color: red; font-weight: bold', error?.response?.data);
		return Promise.reject(error);
	}
);

const checkResponse = (error) => {
	switch (error?.response?.status) {
		case 401:
			// showNoti('danger', 'Bạn không có quyền truy cập');
			setTimeout(() => {
				signIn();
			}, 1000);
			break;
		case 403:
			alert('Bạn không có quyền thực hiện');
			break;
		case 400:
			console.log(error?.response?.message);

			break;
		default:
			console.log(`%c ${error?.response?.status}  :`, 'color: red; font-weight: bold', error?.response?.data);
	}
};

instance.interceptors.response.use(
	(response: AxiosResponse) => {
		let url = getUrl(response?.config);
		if (url !== '/api/Idioms/getRandoms' && url !== '/api/Rules') {
			console.log(` %c ${response?.status} - ${getUrl(response?.config)}:`, 'color: #008000; font-weight: bold', response);
		}
		return response;
	},
	function (error) {
		if (error.response) {
			checkResponse(error);
			// server trả response về là lỗi code đã handle
			console.log(`%c ${error?.response?.status}  :`, 'color: red; font-weight: bold', error?.response?.data);
			return Promise.reject({
				status: error?.response?.status,
				message: error?.response?.data?.message
			});
		} else if (error.request) {
			// request mãi mãi ko thấy response
			// `error.request` là XMLHttpRequest trong website còn nodejs là http.ClientRequest
			console.log(`%c ${JSON.stringify(error)}  :`, 'color: red; font-weight: bold', error?.response?.data);
			return Promise.reject(error.request);
		} else {
			// có gì đó sai sai, hình như là hàm request sai
			console.log(`%c ${JSON.stringify(error)}  :`, 'color: red; font-weight: bold', 'có gì đó sai sai, hình như là setting sai');
			return Promise.reject(error);
		}
	}
);

// const ShowError = (message: string) => {
//   const { showNoti } = useWrap();
//   useEffect(() => {
//     if (message) {
//       showNoti("danger", message);
//     }
//   }, [message]);
//   return {};
// };
