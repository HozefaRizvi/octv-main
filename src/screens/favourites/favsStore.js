import {fetchFavsData} from '../../services/axios/apiManager';

export const getFavsData = async () => {
  try {
    const response = await fetchFavsData();
    if (response && response.app) {
      return response.app;
    } else {
      return null;
    }
  } catch (e) {
    console.log('Error', e);
    return null;
  }
};
