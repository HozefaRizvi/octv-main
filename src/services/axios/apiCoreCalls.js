import axios from 'axios';
import {baseURL, appCode} from './eps';
import {getUserToken, getActiveProfile} from '../dataManager';

export const getUrl = path => baseURL + path;

export const getData = async relativeUrl => {
  const accessToken = await getUserToken();
  const activeProfile = await getActiveProfile();
  if (!accessToken) {
    throw new Error('User data or token not found');
  }
  const url = getUrl(relativeUrl);
  const options = {
    headers: {
      hplatform: 'mobile',
      huserCode: accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      happCode: appCode,
      huserprofile: activeProfile?.id || '',
    },
  };
  //console.log("Url",url,"Get Header",options)
  try {
    const response = await axios.get(url, options);

    return response;
  } catch (err) {
    // console.log('Error : ', err);
    return null;
  }
};

export const getDataAnonimously = async relativeUrl => {
  const accessToken = await getUserToken();
  const url = getUrl(relativeUrl);
  const activeProfile = await getActiveProfile();

  const options = {
    headers: {
      hplatform: 'mobile',
      huserCode: accessToken || '',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      happCode: appCode,
      huserprofile: activeProfile?.id || '',
    },
  };
  // console.log('Core call Data : ', data);
  // console.log('Core call Headers : ', options);
  // console.log('Core call URL : ', url);
  try {
    const response = await axios.get(url, options);
    return response;
  } catch (err) {
    // console.log('Error : ', err);
    return null;
  }
};

export const postData = async (relativeUrl, data,customHeader={}) => {
  const accessToken = await getUserToken();
  if (!accessToken) {
    throw new Error('User data or token not found');
  }
  const activeProfile = await getActiveProfile();

  const url = getUrl(relativeUrl);
  const options = {
    headers: {
      hplatform: 'mobile',
      huserCode: accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      happCode: appCode,
      huserprofile: activeProfile?.id || '',
      ...customHeader
    },
  };
  
  try {
    const response = await axios.post(url, data, options);
    return response;
  } catch (err) {
    // console.log('Error : ', err);
    return null;
  }
};

export const postDataAnonimously = async (
  relativeUrl,
  data,
  moreHeaders = {},
) => {
  const url = getUrl(relativeUrl);
  const activeProfile = await getActiveProfile();

  const options = {
    headers: {
      hplatform: 'mobile',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      happCode: appCode,
      huserprofile: activeProfile?.id || '',
      ...moreHeaders,
    },
  };
  // console.log('Core call Data : ', data);
  // console.log('Core call Headers : ', options);
  // console.log('Core call URL : ', url);
  try {
    const response = await axios.post(url, data, options);
    return response;
  } catch (err) {
    // console.log('Error : ', err);
    return null;
  }
};

export const deleteData = async (relativeUrl, moreHeaders = {}) => {
  const accessToken = await getUserToken();
  if (!accessToken) {
    throw new Error('User data or token not found');
  }
  const url = getUrl(relativeUrl);
  const options = {
    headers: {
      huserCode: accessToken,
      hplatform: 'mobile',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      happCode: appCode,
      ...moreHeaders,
    },
  };
  // console.log('Core call Data : ', data);
  // console.log('Core call Headers : ', options);
  // console.log('Core call URL : ', url);
  try {
    const response = await axios.delete(url, options);
    return response;
  } catch (err) {
    // console.log('Error : ', err);
    return null;
  }
};

export const getVastTag = async url => {
  const options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.get(url, options);
    return response;
  } catch (err) {
    // console.log('Error : ', err);
    return null;
  }
};
