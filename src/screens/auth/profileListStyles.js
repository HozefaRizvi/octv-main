import {StyleSheet} from 'react-native';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: '7%',
    alignItems: 'center',
    marginTop: '20%',
  },
  header: {
    paddingVertical: 20,
    alignSelf: 'flex-start',
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  logo: {
    width: '62%',
    height: 70,
  },
  heading: {
    fontSize: 41,
    fontWeight: '600',
    marginTop: '10%',
  },
  listContainer: {
    flex: 1,
    marginTop: '10%',
  },
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    height: 125,
    width: 125,
    borderRadius: 62.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  btnTxt: {
    fontSize: 22,
  },
  list: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listItemCOntainer: {
    height: 120,
    width: '25%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    marginHorizontal: 12,
  },

  profAvatar: {
    height: 70,
    width: 70,
  },
  listBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    width: 70,
    borderRadius: 37.5,
  },
  listBtnTxt: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    width: '90%',
  },
  rmBtnContainer: {
    position: 'absolute',
    zIndex: 2,
    right: -5,
    top: 2,
    height: 23,
    width: 23,
    borderRadius: 11.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
