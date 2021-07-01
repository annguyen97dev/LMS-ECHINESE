import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "next-auth/client";
import configApi from "~/appConfig";

function getUrl(config) {
  if (config.baseURL) {
    return config.url.replace(config.baseURL, "").split("?")[0];
  }
  return config.url;
}

export const authHeader_X = async () => {
  const session = await getSession();
  if (session && session.accessToken) {
    return { "x-access-token": session.accessToken };
  } else {
    return {};
  }
};
export const authHeader_Bearer = async () => {
  const session = await getSession();

  if (session && session.accessToken) {
    return { Authorization: "Bearer " + session.accessToken };
  } else {
    return {};
  }
};
export const instance = axios.create({
  baseURL: configApi.API_URL,
  headers: {
    Accept: "application/json",
  },
});

instance.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const url = getUrl(config);
    console.log("url AxiosRequestConfig - ", url);
    console.log(
      `%c ${config.method.toUpperCase()} - ${url}:`,
      "color: #0086b3; font-weight: bold",
      config
    );

    return config;
  },
  (error) => {
    console.log(
      `%c ${error.response.status}  :`,
      "color: red; font-weight: bold",
      error.response.data
    );
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  // async (response) => {
  //   console.log(
  //     `%c ${response.status} - ${getUrl(response.config)}:`,
  //     "color: #008000; font-weight: bold",
  //     response
  //   );

  //   return response;
  // },
  function (error) {
    if (error.response) {
      // server trả response về là lỗi code đã handle
      console.log(
        `%c ${error.response.status}  :`,
        "color: red; font-weight: bold",
        error.response.data
      );
      return Promise.reject({
        status: error.response.status,
        message: error.response.data.message,
      });
    } else if (error.request) {
      // request mãi mãi ko thấy response
      // `error.request` là XMLHttpRequest trong website còn nodejs là http.ClientRequest
      console.log(
        `%c ${JSON.stringify(error)}  :`,
        "color: red; font-weight: bold",
        error.response.data
      );
      return Promise.reject(error.request);
    } else {
      // có gì đó sai sai, hình như là hàm request sai
      console.log(
        `%c ${JSON.stringify(error)}  :`,
        "color: red; font-weight: bold",
        "có gì đó sai sai, hình như là setting sai"
      );
      return Promise.reject(error);
    }
  }
);
