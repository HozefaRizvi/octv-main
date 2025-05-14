import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '5%',
   
    paddingTop: '8%',
  },
  header: {
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  imgContainer: {
    height: 200,
    width: '100%',
    
    borderRadius: 12,
    marginTop: '2%',
    borderWidth: 2,
    
  },
  img: {
    height: '100%',
    width: '100%',
    borderRadius: 12,
  },
  summaryContainer: {
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
   
    marginTop: '5%',
  },
  heading: {
    fontSize: 22,
   
    fontWeight: '700',
    marginTop: 10,
  },
  name: {
    fontSize: 20,
   
    fontWeight: '700',
    marginVertical: 20,
  },
  keyValue: {
    flexDirection: 'row',
    marginTop: 5,
  },
  key: {
    fontSize: 15,
    
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
  
    fontWeight: '500',
  },
  cpnApplied: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cpnApldTxt: {
    fontSize: 20,
   
    fontWeight: '500',
  },
  couponContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  inputContainer: {
    width: '75%',
  },
  couponBtn: {
    height: 60,
    width: '23%',
    
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  couponBtnTxt: {
    fontSize: 15,
    fontWeight: '500',
   
  },
  ammountContainer: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 8,
   
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
 
  POptContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    alignItems: 'center',
    marginVertical: 10,
  },
  optContainer: {
    height: 46,
    width: 50,
    borderRadius: 5,
   
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    width: '32%',
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
   
    marginVertical: 15,
  },
  btnTxt: {
    fontSize: 11,
    fontWeight: '500',
   
  },
});
