import {StyleSheet, Dimensions} from 'react-native';

const width = Dimensions.get('screen').width;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
   
  },
  scrol: {},
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
  movieDetails: {
    paddingHorizontal: '7%',
    paddingVertical: '5%',
    width: '100%',
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 20,
    
    fontWeight: '500',
    marginTop:10,
    marginBottom:10,
    padding:2,
    marginLeft:5
    
  },
  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 20,
  },
  movieDetails2: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  movieSubTitle: {
    fontSize: 14,
    
    fontWeight: '600',
    marginVertical: 5,
  },
  hDButton: {
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
   
    marginLeft: 10,
    borderRadius: 3,
  },
  pGButton: {
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
  
    marginLeft: 10,
    borderRadius: 3,
  },
  boxStyle: {
    fontSize: 12,
    fontWeight: '500',
   
  },
  sharebtn: {
    width: 29,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
    left: 75,
  },
  shareButton: {
    width: 13,
    height: 15,
  },
  shareTxt: {
    fontSize: 10,
    fontWeight: 'regular',
   
  },
  Overview2: {
    fontSize: 13,
    lineHeight: 15,
    
    paddingHorizontal: '7%',
    marginBottom: '2%',
  },
  suggestedSection: {
    padding: 5,
  },
  suggestion: {
    fontSize: 18,
    fontWeight: '700',
   
    marginLeft: 30,
  },
  suggestionsScrollView: {
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
  },
  potraitContainer: {
    height: 130,
    width: (width / 100) * 48,
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 3,
    // backgroundColor: colors.theme,
  },
  portraitImage: {
    height: undefined,
    width: '100%',
    borderRadius: 5,
    aspectRatio: 16 / 9.2,
    zIndex: 2,
  },
  streamTitle3: {
    
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 23,
  },
});
