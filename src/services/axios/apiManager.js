import {getDeviceId} from '../dataManager';
import {
  getData,
  getDataAnonimously,
  postData,
  postDataAnonimously,
  deleteData,
  getVastTag,
} from './apiCoreCalls';
import {eps} from './eps';

export const fetchVastTag = async url => {
  try {
    const response = await getVastTag(url);
    return response;
  } catch (error) {
    console.log('ERROR upo geting Vast tag : ', error);
    return null;
  }
};
export const fetcConfigData = async () => {
  try {
    const response = await getDataAnonimously(eps.masterFeed);
    return response;
  } catch (err) {
    console.log('ERROR upon fetcConfigData data : ', err);
    return null;
  }
};
export const login = async (data = {}) => {
  try {
    // const deviceId = await getDeviceId();
    // const response = await postDataAnonimously(
    //   eps.login.replace('${user_data}', deviceId || ''),
    //   data,
    // );
    const response = await postDataAnonimously(eps.login, data);
    return response;
  } catch (err) {
    console.log('ERROR upon login : ', err);
    return null;
  }
};
export const registerUser = async data => {
  try {
    const response = await postDataAnonimously(eps.deleteAccount, data);
    return response;
  } catch (err) {
    console.log('ERROR upon logout : ', err);
    return null;
  }
};
export const resendOTP = async data => {
  try {
    const response = await postDataAnonimously(eps.manageAppUser, data);
    return response;
  } catch (err) {
    console.log('ERROR upon logout : ', err);
    return null;
  }
};
export const ValidateOTP = async data => {
  try {
    const response = await postDataAnonimously(eps.manageAppUser, data);
    return response;
  } catch (err) {
    console.log('ERROR upon logout : ', err);
    return null;
  }
};
export const deleteUserAccount = async data => {
  try {
    const response = await postData(eps.register, data);
    return response;
  } catch (err) {
    console.log('ERROR upon logout : ', err);
    return null;
  }
};
export const fetchStreamSeriesData = async code => {
  try {
    const response = await getDataAnonimously(
      eps.streamseries.replace('${code}', code),
    );
    // console.log('streams:###',response)
    return response;
  } catch (err) {
    console.log('APIManger Error fetchStreamData data : ', err);
    return null;
  }
};

export const fetchHomeData = async slug => {
  try {
    const response = await getDataAnonimously(slug);
    return response.data;
  } catch (err) {
    console.log('ERROR upon fetchHomeData data : ', err);
    return null;
  }
};
export const fetchAuthorizedHomeData = async () => {
  try {
    const response = await getData(eps.home);
    return response.data;
  } catch (err) {
    console.log('ERROR upon fetchAuthorizedHomeData data : ', err);
    return null;
  }
};
export const fetchGenreData = async () => {
  try {
    const response = await getDataAnonimously(eps.genre);
    return response.data;
  } catch (err) {
    console.log('ERROR upon fetchGenreData data : ', err);
    return null;
  }
};
export const fetchStreamsByGenre = async (id, page = 1,categoryType) => {
  try {
    const response = await getDataAnonimously(
      categoryType==="genre" ? eps.streamsByGenre.replace('${id}', id).replace('${page}', page):eps.streamByVibe.replace('${id}', id)
    );
    console.log("response of vibe",response)
    return response.data;
  } catch (err) {
    console.log('ERROR upon fetchStreamsByGenre data : ', err);
    return null;
  }
};
export const fetchMoviesData = async () => {
  try {
    const response = await getDataAnonimously(eps.movies);
    return response.data;
  } catch (err) {
    console.log('ERROR upon fetchMoviesData data : ', err);
    return null;
  }
};
export const fetchSeriesData = async () => {
  try {
    const response = await getDataAnonimously(eps.series);
    return response.data;
  } catch (err) {
    console.log('ERROR upon fetchMoviesData in apiMangaer : ', err);
    return null;
  }
};
export const fetchKidsData = async () => {
  try {
    const response = await getDataAnonimously(eps.kids);
    return response.data;
  } catch (err) {
    console.log('ERROR upon fetchKidsData data : ', err);
    return null;
  }
};
export const fetchShortsData = async () => {
  try {
    const response = await getDataAnonimously(eps.shorts);
    return response.data;
  } catch (err) {
    console.log('ERROR upon fetchShortsData data : ', err);
    return null;
  }
};
export const fetchClassicsData = async () => {
  try {
    const response = await getDataAnonimously(eps.classics);
    return response.data;
  } catch (err) {
    console.log('ERROR upon fetchClassicsData data : ', err);
    return null;
  }
};
export const fetchAcademyData = async () => {
  try {
    const response = await getDataAnonimously(eps.academy);
    return response.data;
  } catch (err) {
    console.log('ERROR upon fetchAcademyData data : ', err);
    return null;
  }
};
export const fetchEspanolData = async () => {
  try {
    const response = await getDataAnonimously(eps.espanol);
    return response.data;
  } catch (err) {
    console.log('ERROR upon fetchEspanolData data : ', err);
    return null;
  }
};

export const fetchICFFData = async () => {
  try {
    const response = await getDataAnonimously(eps.icff);
    return response.data;
  } catch (err) {
    console.log('ERROR upon fetchICFFData data : ', err);
    return null;
  }
};

export const fetchStreamData = async code => {
  try {
    const response = await getDataAnonimously(
      eps.streamdetail.replace('${code}', code),
    );
    return response;
  } catch (err) {
    console.log('APIManger Error fetchStreamData data : ', err);
    return null;
  }
};

export const fetchWatchHistory = async () => {
  try {
    const response = await getData(eps.watchHistory);
    return response;
  } catch (err) {
    console.log('ERROR upon fetching Watch History : ', err);
    return null;
  }
};
export const fetcPaginationYearData = async (id, page = 1) => {
  try {
    const response = await getDataAnonimously(
      eps.yearDetail.replace('${year}', id).replace('${page}', page),
    );
    return response;
  } catch (err) {
    console.log('ERROR upon fetcPaginationYearData data : ', err);
    return {data: [], nextPage: null};
  }
};
export const fetcPaginationRatingData = async (id, page = 1) => {
  try {
    const response = await getDataAnonimously(
      eps.ratingDetails.replace('${rating}', id).replace('${page}', page),
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching rating data:', error);
    return null;
  }
};
export const fetcPaginationGenreData = async (id, page = 1) => {
  try {
    const response = await getDataAnonimously(
      eps.genreDetail.replace('${genre}', id).replace('${page}', page),
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching genre data:', error);
    return null;
  }
};
export const fetcPlayerData = async (
  code,
  ipAddress,
) => {
  // console.log('Fetched ip addredd:', ipAddress);
  try {
    const response = await getDataAnonimously(
      eps.playerDetails
        .replace('${code}', code)
        .replace('${idAddress}', ipAddress),
    );

    return response;
  } catch (error) {
    console.error('Error fetching Player stream:', error);
    return null;
  }
};
export const fetcPersonData = async person => {
  try {
    const response = await getDataAnonimously(
      eps.perosnData.replace('${person}', person),
    );
    // console.log("Fetched response", response);

    return response;
  } catch (error) {
    console.error('Error fetching Person Data:', error);
    return null;
  }
};
export const fetcPaginationQualityData = async (id, page = 1) => {
  try {
    const response = await getDataAnonimously(
      eps.qualityDetails.replace('${quality}', id).replace('${page}', page),
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching quality data:', error);
  }
};
export const fetcPaginationLanguageData = async (id, page = 1) => {
  try {
    const response = await getDataAnonimously(
      eps.languageDetail.replace('${language}', id).replace('${page}', page),
      {params: {page: page}},
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching language data:', error);
  }
};
export const fetcPaginationAdvisoryData = async (id, page = 1) => {
  try {
    const response = await getDataAnonimously(
      eps.advisoryDetail
        .replace('${contentadvisory}', id)
        .replace('${page}', page),
      {params: {page: page}},
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching contentadvisory data:', error);
  }
};
export const fetcPaginationCategoryData = async (id, page = 1) => {
  try {
    const response = await getDataAnonimously(
      eps.categoryDeatil.replace('${category}', id).replace('${page}', page),
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching quality data:', error);
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const fetcPaginationTagsData = async (id, page = 1) => {
  try {
    const response = await getDataAnonimously(
      eps.tagsDeatil.replace('${tag}', id).replace('${page}', page),
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching quality data:', error);
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const fetchTransactionHistory = async () => {
  try {
    const response = await getData(eps.transactioHistory);
    return response;
  } catch (err) {
    console.log('ERROR upon fetching Transaction History : ', err);
    return null;
  }
};

export const changePassword = async data => {
  try {
    const response = await postDataAnonimously(eps.changePassword, data);
    return response;
  } catch (err) {
    console.log('ERROR upon Change Password : ', err);
    return null;
  }
};
export const forgotPassword = async data => {
  try {
    const response = await postDataAnonimously(eps.forgotPassword, data);
    return response;
  } catch (err) {
    console.log('ERROR upon Forgot Password : ', err);
    return null;
  }
};

export const fetchSearched = async query => {
  try {
    const response = await getDataAnonimously(
      eps.search.replace('${query}', query),
    );
    return response;
  } catch (err) {
    console.log('ERROR upon fetchSearched data : ', err);
    return null;
  }
};

export const fetchStoredProfiles = async (userId = 0) => {
  try {
    const response = await getData(
      eps.getProfiles.replace('${userId}', userId),
    );
    return response;
  } catch (err) {
    console.log('ERROR upon fetching Stored Profiles : ', err);
    return null;
  }
};

export const createProfile = async data => {
  try {
    const response = await postData(eps.storeProfile, data);
    return response;
  } catch (err) {
    console.log('ERROR upon Creating New Profile : ', err);
    return null;
  }
};
export const deleteProfile = async (id = 0) => {
  try {
    const response = await deleteData(eps.deleteProfile.replace('${id}', id));
    return response;
  } catch (err) {
    console.log('ERROR upon Deleting Profile : ', err);
    return null;
  }
};

export const editUserProfile = async (id, data) => {
  try {
    const response = await postData(eps.editProfile.replace('${id}', id), data);
    return response;
  } catch (err) {
    console.log('ERROR upon Edit Profile : ', err);
    return null;
  }
};
export const postReviewOnStream = async data => {
  try {
    const response = await postData(eps.reviewOnStream, data);
    return response;
  } catch (err) {
    console.log('ERROR upon Edit Profile : ', err);
    return null;
  }
};
export const postCheckPasswordStream = async data => {
  try {
    const response = await postDataAnonimously(eps.checkPass, data);
    return response;
  } catch (err) {
    console.log('ERROR upon checking Password : ', err);
    return null;
  }
};

export const followUnFollowPerson = async data => {
  try {
    const response = await postData(eps.followPersonToggle, data);
    return response;
  } catch (err) {
    console.log('ERROR upon Follow/Unfollow a person : ', err);
    return null;
  }
};

export const fetchSubPlans = async (userId = 0) => {
  try {
    const response = await getData(eps.subplans);
    return response;
  } catch (err) {
    console.log('ERROR upon fetchSubPlans Profiles : ', err);
    return null;
  }
};

export const fetchStripePaymentIntent = async data => {
  try {
    const response = await postData(eps.stripePaymentIntent, data);
    return response;
  } catch (err) {
    console.log('ERROR upon Follow/Unfollow a person : ', err);
    return null;
  }
};
export const fetchPayPalPaymentIntent = async data => {
  try {
    const response = await postData(eps.paypalCreateOrder, data);
    return response;
  } catch (err) {
    console.log('ERROR upon Follow/Unfollow a person : ', err);
    return null;
  }
};
export const fetchFavsData = async data => {
  try {
    const response = await postData(eps.favs, data);
    return response.data;
  } catch (err) {
    console.log('ERROR upon fetchFavsData data : ', err);
    return null;
  }
};

export const storePaymentDetails = async data => {
  try {
    const response = await postData(eps.storePaymentDetails, data);
    return response;
  } catch (err) {
    console.log('ERROR upon storePaymentDetails data : ', err);
    return null;
  }
};

export const saveWathedTime = async data => {
  try {
    const response = await postData(eps.saveWatchedTime, data);
    return response;
  } catch (err) {
    console.log('ERROR upon saveWathedTime data : ', err);
    return null;
  }
};

export const toggleEnableAlerts = async (data = {}) => {
  try {
    const response = await postData(eps.enableAlerts, data);
    return response;
  } catch (err) {
    console.log('ERROR upon toggleEnableAlerts data : ', err);
    return null;
  }
};

export const checkAlertsEnabled = async (userId = 0) => {
  try {
    const response = await getData(eps.checkAlerts);
    return response;
  } catch (err) {
    console.log('ERROR upon checkAlertsEnabled : ', err);
    return null;
  }
};

export const fetchCoupon = async (data = {}) => {
  try {
    const response = await postData(eps.getCoupon, data);
    return response;
  } catch (err) {
    console.log('ERROR upon toggleEnableAlerts data : ', err);
    return null;
  }
};