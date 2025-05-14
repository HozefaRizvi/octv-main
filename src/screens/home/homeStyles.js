import {StyleSheet} from 'react-native';
import { useColorContext } from '../../services/state/colorsContext'

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
  carousel: {
    alignSelf: 'center',
  },
  posterImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
    alignSelf: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  // activeDot: {
  //   // backgroundColor: colors.theme,
  // },
  // inactiveDot: {
  //   // backgroundColor: colors.slideInActive,
  // },
  streamTitle: {
   
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
    // lineHeight: 1,
  },
  streamType: {
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 5,
  },
  btnContainer: {
    flexDirection: 'row',
  },
  bottomView: {
    width: '95%',
    height: 70,
    marginTop: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
  },
  bottmText: {
    padding: '1%',
    width: '60%',
    height: '100%',
    justifyContent: 'space-evenly',
  },
  hDButton: {
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  pGButton: {
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderRadius: 3,
  },
  boxStyle: {
    fontSize: 9,
    fontWeight: '500',
  },
});
