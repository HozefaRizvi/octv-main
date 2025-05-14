import {
  fetchGenreData,
  fetchStreamsByGenre,
} from '../../services/axios/apiManager';

export const getGenreData = async () => {
  try {
    const response = await fetchGenreData();
    if (response && response.app) {
      return response.app;
    } else {
      return null;
    }
  } catch (e) {
    console.log('Error', e);
    return null;
  }
};

export const getStreamsByGenre = async (
  id,
  setStreamslist,
  setLoading,
  setMeta,
  setGenre,
  categoryType,
) => {
  try {
    const response = await fetchStreamsByGenre(id, 1, categoryType);
    if (categoryType === 'genre') {
      if (response?.genres?.data && response?.genres?.meta) {
        setStreamslist(response.genres.data);
        setMeta(response.genres.meta);
        setGenre(response.genre);
      }
    }
    else 
    { setStreamslist(response.moodbased.data);
        setMeta(response.moodbased.meta);
        setGenre(response.moodbased);

    }
  } catch (error) {
    console.log('Error On fetchStreamsByGenre in store: ', error);
  } finally {
    setLoading(false);
  }
};

export const getNextPage = async (
  id,
  setStreamslist,
  setLoadingMore,
  setMeta,
  current_page,
) => {
  try {
    setLoadingMore(true);
    const response = await fetchStreamsByGenre(id, current_page);
    if (response?.genres?.data && response?.genres?.meta) {
      setStreamslist(prev => [...prev, ...response.genres.data]);
      setMeta(response.genres.meta);
    }
  } catch (error) {
    console.log('Error On fetchStreamsByGenre in store: ', error);
  } finally {
    setLoadingMore(false);
  }
};
