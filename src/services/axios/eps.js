// //Staging
// export const baseURL = 'https://octv.xyz/api/f/v3/';

import { globalAppCode } from "../../../AppCode";

// //Live Credentials
export const baseURL = 'https://onlinechannel.io/api/f/v3/';
export const supaBaseUrl = 'https://srmqacfupcwjnmzvtdsn.supabase.co/functions/v1/update-server';
// export const P_KEY =
//   'pk_test_51Py6kWHInNTlTUGPM5l30Odo4AOb48C48enPnOsKrw9xhueHWeYlC0lpnRRvtbwMNosFC3UWEZY4c48MsuohS5F700Lyxn0hSm';
  export const P_KEY =
  'pk_live_51NOor0JpbVpnO98ApI1qxGZzlmIQXaUZUCmHe1HEIsDYE5YS7oAbqynr68dWqLkW9mMD9jR6hDmDqHOjW3t7MrIn00WHfO8ne9';
export const appCode = globalAppCode; //54137662273ec8298e3dfd76e8d2533a for christmas main 
export const GPMerchId = 'BCR2DN4T2PGK7G2K';
export const GPMerchName = 'OnlinneChannel.TV';
export const eps = {
  manageAppUser: 'mngappusrs',
  register: 'mngappusrs',
  // login: 'mngappusrs?user_data=${user_data}&user_device=mobile',
  login: 'mngappusrs?user_data=MTQ2LjY2LjE1Ni4w',
  changePassword: 'mngappusrs',
  forgotPassword: 'mngappusrs',
  deleteAccount: 'mngappusrs',
  contact: '/contact',
  streamseries: 'getseriesdetails/${code}',
  masterFeed: 'masterfeed',
  home: 'home',
  genre: 'genre',
  streamsByGenre: 'genre/${id}?page=${page}',
  streamByVibe: 'moodbased/${id}',
  movies: 'movies',
  series: 'series',
  kids: 'kids',
  shorts: 'shorts',
  classics: 'classics',
  academy: 'academy',
  espanol: 'espanol',
  favs: 'mngfavitems',
  icff: 'icff',
  streamdetail: 'streamdetail?code=${code}',
  watchHistory: 'watch/history',
  yearDetail: 'year/${year}?page=${page}',
  genreDetail: 'genre/${genre}?page=${page}',
  ratingDetails: 'rating/${rating}?page=${page}',
  qualityDetails: 'quality/${quality}?page=${page}',
  languageDetail: 'language/${language}?page=${page}',
  advisoryDetail: 'contentadvisory/${contentadvisory}?page=${page}',
  tagsDeatil: 'tag/${tag}?page=${page}',
  categoryDeatil: 'category/${category}?page=${page}',
  perosnData: 'person/${person}',
  transactioHistory: 'getsubscriptionhistory',
  search: 'search?keyword=${query}&requestAction=search',
  storeProfile: 'user/store/profiles',
  getProfiles: 'user/profiles?id=${userId}',
  deleteProfile: 'user/profiles/destroy/${id}',
  editProfile: 'user/edit/profiles/${id}',
  playerDetails: 'getitemplayerdetail/${code}?user_data=${idAddress}',
  checkPass: 'check/stream/password',
  reviewOnStream: 'userrating/store',
  followPersonToggle: 'toggle/follow',
  subplans: 'subscription/plan',
  stripePaymentIntent: 'stripe/payment-intent',
  paypalCreateOrder: 'paypal/create-order',
  storePaymentDetails: 'store/payment',
  saveWatchedTime: 'stream/duration',
  enableAlerts: 'channel/subscribe',
  checkAlerts: 'channel/subscribe/check',
  getCoupon: 'coupon',
  badgeDetail:'badge/details'
};
