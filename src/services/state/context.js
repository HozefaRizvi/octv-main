import React, {createContext, useContext, useState} from 'react';

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {
  const [state, setState] = useState({
    isLoggedIn: false,
    isLoading: true,
    user: {},
    announcement: {},
    logo: '',
    menus: [],
    userProfiles: [],
    allRatings: [],
    activeProfile: {},
    pendingRoute: {},
    alertsEnabled: false,
    ispasswordProtected: false,
    showSignUpButton: 'Y',
    showWatchHistory: 1,
    showManageProfiles: 1,
    isPaused: true,
    menuTabsOptions: {},
    slug: 'home',
    isTrailerPaused: false,
    isBypassLogin: '',
    isEmailVerificationEnabled:false,
    emailVerified:0,
    isGamifiedContentEnabled : false,
    byPassDetailScreen:false,
    categoryType:'genre',
    appColors:[]
  });

  return (
    <AppContext.Provider value={{state, setState}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
