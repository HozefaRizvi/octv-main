import {StyleSheet, Dimensions} from 'react-native';
import { useColorContext } from '../../services/state/colorsContext';

const {width} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: width * 0.68,
    marginTop: 60,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recBackground: {
    width: '100%',
    height: 240,
    bottom: 120,
  },
  topOverlay: {
    // position: 'absolute',
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
    bottom: 255,
  },
  sharebtn: {
    width: '60%',
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    width: 13,
    height: 15,
  },
  shareTxt: {
    fontSize: 10,
    fontWeight: 'regular',
    marginTop: 5,
  },
  detailsContainer: {
    padding: '7%',
    flexDirection: 'row',
    marginTop: 232,
    bottom: 220,
    // marginLeft: 30,
    justifyContent: 'space-between',
  },
  movieDetails: {
    width: '85%',
    height: 80,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 250,
    padding: '5%',
  },
  movieDetails2: {
    // padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  movieSubTitle: {
    fontSize: 14,
    fontWeight: '600',
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
    fontSize: 8,
    fontWeight: '500',
  },
  movieDate: {
    fontSize: 14,
    marginLeft: 35,
    fontWeight: 'semibold',
    bottom: 260,
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft:40
  },
  playIcon: {
    width: 50,
    height: 50,
  },
});
