import {StyleSheet, Dimensions} from 'react-native';
import { useColorContext } from '../../services/state/colorsContext';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
const {width} = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterBackground: {
    width: w('98%'),
    height: h('30%'),
    alignSelf: 'center',
  },
  recBackground: {
    padding: 5,
  },
  topOverlay: {
    top: 40,
    left: 20,
    right: 20,
  },
  backButton: {
    width: 10,
    height: 17,
  },
  shareBox: {
    padding: '5%',
    flexDirection: 'row',
    width: '30%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  sharebtn: {
    width: '60%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSection: {
    height: '60%',
    width: '100%',
    alignItems: 'center',
  },
  shareButton: {
    width: 15,
    height: 17,
  },
  shareTxt: {
    fontSize: 10,
    fontWeight: 'regular',
    marginTop: 7,
  },
  detailsContainer: {
    padding: '2%',
  },
  movieTitle: {
    fontSize: 25,
    fontWeight: '700',
  },
  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '2%',
  },
  movieDetails2: {
    // padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  movieSubTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 5,
  },
  hDButton: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderRadius: 3,
  },
  pGButton: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderRadius: 3,
  },
  boxStyle: {
    fontSize: 12,
    fontWeight: '500',
  },
  movieDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: 8,
    paddingVertical: 7,
    marginVertical: 7,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playText: {
    fontSize: 20,
    fontWeight: 'semibold',
    marginLeft: 5,
  },
  Overview: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '500',
    marginLeft: 30,
    marginTop: 30,
  },
  description: {
    padding: 5,
  },
  Overview2: {
    fontSize: 12,
    fontWeight: 'regular',
    paddingHorizontal: 7,
  },
  infoSection: {
    width: 333,
    height: 273,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 30,
  },
  infoText: {
    fontSize: 12,
    fontWeight: 'regular',
    marginTop: 5,
  },
  suggestedSection: {
    padding: 5,
  },
  suggestion: {
    fontSize: 18,
    fontWeight: 'medium',
    marginLeft: '7%',
    marginTop: '10%',
  },
  suggestionsScrollView: {
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 30,
  },
  portraitImage: {
    width: 164,
    height: 102,
    borderRadius: 5,
    marginRight: 10,
  },
  streamTitle3: {

    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 23,
  },
  sectionHeader: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  seasonSection: {
    padding: 3,
  },
  seasonButton: {
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  seasonButtonActive: {
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedSeasonButton: {
    // backgroundColor: colors.dull,
  },
  seasonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  episodesContainer: {
    marginTop: 20,
    marginBottom: 5,
    marginLeft: '8%',
  },
});
