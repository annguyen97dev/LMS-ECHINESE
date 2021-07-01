import { instance } from './instance';

export const getPublicContent = async () => {
  try {
    const res = await instance.get('/test/all');
    return res;
  } catch (error) {
    console.log('getPublicContent error', error);
    return Promise.reject(error);
  }
}

export const getUserBoard  = async () => { 
  try {
    const res = await instance.get('/test/user');
    return res;
  } catch (error) {
    console.log('getUserBoard error', error);
    return Promise.reject(error);
  }
}
 
export const getModeratorBoard  = async () =>{
  
  try {
    const res = await instance.get('/test/mod');
    return res;
  } catch (error) {
    console.log('getModeratorBoard error', error);
    return Promise.reject(error);
  }
}

export const getAdminBoard  = async () =>{
  
  try {
    const res = await instance.get('/test/admin');
    return res;
  } catch (error) {
    console.log('getAdminBoard error', error);
    return Promise.reject(error);
  }
}
