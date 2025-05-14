import {StyleSheet} from 'react-native';
import {colors} from '../../assets/colors';
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
  header: {
    alignItems: 'center',
    padding: 16,
    right: 180,
  },
  backButton: {
    width: 10,
    height: 17,
  },
  linearGradient: {
    height: 181,
    width: '46%',
    borderRadius: 12,
    alignItems: 'center',
    padding: 1.5,
    marginTop: 20,
    alignSelf: 'center',
  },
  backView: {
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    height: '100%',
    width: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  txt: {
    padding: 7,
    alignSelf: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 45,
    textAlign: 'center',

  },
  followbtn: {
    width: '30%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
  btnStyleInactive: {
    fontSize: 15,
    fontWeight: '500',
  },
  unfollowbtn: {
    width: '30%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 5,
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    textAlign: 'center'
  },
  txtMedia: {
    padding: 7,
    marginHorizontal: 20,
  },
  nameMedia: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 27,
    textAlign: 'left',
  },
  suggestionsScrollView: {
    marginVertical: 15,
  },
  portraitImage: {
    width: 164,
    height: undefined,
    borderRadius: 5,
    aspectRatio: 6 / 3.3,
    marginHorizontal: 5,
  },
  streamTitle3: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 23,
  },
});
