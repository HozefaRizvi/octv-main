import {
  fetchAuthorizedHomeData,
  fetchHomeData,
  fetcPaginationQualityData,
  fetcPaginationRatingData,
  fetcPaginationAdvisoryData,
  fetcPaginationLanguageData,
  fetcPaginationYearData,
  fetcPaginationCategoryData,
  fetcPaginationTagsData,
  fetcPaginationGenreData,
} from '../../services/axios/apiManager';

export const getHomeData = async slug => {
  try {
    const response = await fetchHomeData(slug);
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

export const getAuthorizedHomeData = async () => {
  try {
    const response = await fetchAuthorizedHomeData();
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

export const populateTabBar = async movie => {
  const temp = [];
  if (movie?.show) {
    temp.push('Seasons');
    // setData(prev => [...prev, 'Seasons']);
  }
  if (
    movie?.cast?.length > 0 ||
    movie?.writers?.length > 0 ||
    movie?.producers?.length > 0 ||
    movie?.directors?.length > 0
  ) {
    temp.push('Cast');
  }
  if (movie?.languages.length > 0) {
    temp.push('Languages');
  }
  if (movie?.advisories.length > 0) {
    temp.push('Advisories');
  }
  if (movie?.tags.length > 0) {
    temp.push('Tags');
  }
  if (movie?.genre.length > 0) {
    temp.push('Genre');
  }
  if (movie?.reviews || movie.video_rating === 'Enable') {
    temp.push('Reviews');
  }
  if (movie?.relatedStreams.length > 0) {
    temp.push('You Might Also Like');
  }
  return temp;
};

export const getStreamsByQuality = async (
  id,
  setQdata,
  setStreams,
  setLoading,
  setMeta,
) => {
  try {
    setLoading(true);
    const data = await fetcPaginationQualityData(id);
    setQdata(data?.quality);
    if (data?.streams?.data) {
      setStreams(prevStreams => [...prevStreams, ...data.streams.data]);
      setMeta(data?.streams?.meta);
    }
  } catch (error) {
    console.log('Error upon loading more stream by quality, ', error);
  } finally {
    setLoading(false);
  }
};

export const getNextPageByQuality = async (
  id,
  setStreams,
  setLoadingMore,
  setMeta,
  current_page,
) => {
  try {
    setLoadingMore(true);
    const data = await fetcPaginationQualityData(id, current_page);
    if (data?.streams?.data && data?.streams?.meta) {
      setStreams(prevStreams => [...prevStreams, ...data.streams.data]);
      setMeta(data.streams.meta);
    }
  } catch (error) {
    console.log('Error upon loading more streams by Quality', error);
  } finally {
    setLoadingMore(false);
  }
};

export const getStreamsByRating = async (
  id,
  setRating,
  setStreams,
  setLoading,
  setMeta,
) => {
  try {
    setLoading(true);
    const data = await fetcPaginationRatingData(id);
    setRating(data?.rating);
    if (data?.streams?.data) {
      setStreams(prevStreams => [...prevStreams, ...data.streams.data]);
      setMeta(data?.streams?.meta);
    }
  } catch (error) {
    console.log('Error upon loading more stream by quality, ', error);
  } finally {
    setLoading(false);
  }
};

export const getNextPageByRating = async (
  id,
  setStreams,
  setLoadingMore,
  setMeta,
  current_page,
) => {
  try {
    setLoadingMore(true);
    const data = await fetcPaginationRatingData(id, current_page);
    if (data?.streams?.data && data?.streams?.meta) {
      setStreams(prevStreams => [...prevStreams, ...data.streams.data]);
      setMeta(data.streams.meta);
    }
  } catch (error) {
    console.log('Error upon loading more streams by Quality', error);
  } finally {
    setLoadingMore(false);
  }
};

export const getStreamsByLanguage = async (
  id,
  setRating,
  setStreams,
  setLoading,
  setMeta,
) => {
  try {
    setLoading(true);
    const data = await fetcPaginationLanguageData(id);
    setRating(data?.Language);
    if (data?.streams?.data) {
      setStreams(prevStreams => [...prevStreams, ...data.streams.data]);
      setMeta(data?.streams?.meta);
    }
  } catch (error) {
    console.log('Error upon loading more stream by quality, ', error);
  } finally {
    setLoading(false);
  }
};

export const getNextPageByLanguage = async (
  id,
  setStreams,
  setLoadingMore,
  setMeta,
  current_page,
) => {
  try {
    setLoadingMore(true);
    const data = await fetcPaginationLanguageData(id, current_page);
    if (data?.streams?.data && data?.streams?.meta) {
      setStreams(prevStreams => [...prevStreams, ...data.streams.data]);
      setMeta(data.streams.meta);
    }
  } catch (error) {
    console.log('Error upon loading more streams by Quality', error);
  } finally {
    setLoadingMore(false);
  }
};

export const getStreamsByAdvisory = async (
  id,
  setRating,
  setStreams,
  setLoading,
  setMeta,
) => {
  try {
    setLoading(true);
    const data = await fetcPaginationAdvisoryData(id);
    setRating(data?.Language);
    if (data?.streams?.data) {
      setStreams(prevStreams => [...prevStreams, ...data.streams.data]);
      setMeta(data?.streams?.meta);
    }
  } catch (error) {
    console.log('Error upon loading more stream by quality, ', error);
  } finally {
    setLoading(false);
  }
};

export const getNextPageByAdvisory = async (
  id,
  setStreams,
  setLoadingMore,
  setMeta,
  current_page,
) => {
  try {
    setLoadingMore(true);
    const data = await fetcPaginationAdvisoryData(id, current_page);
    if (data?.streams?.data && data?.streams?.meta) {
      setStreams(prevStreams => [...prevStreams, ...data.streams.data]);
      setMeta(data.streams.meta);
    }
  } catch (error) {
    console.log('Error upon loading more streams by Quality', error);
  } finally {
    setLoadingMore(false);
  }
};

export const getStreamsByCategory = async (
  id,
  setRating,
  setStreams,
  setLoading,
  setMeta,
) => {
  try {
    setLoading(true);
    const data = await fetcPaginationCategoryData(id);
    setRating(data?.categories);
    if (data?.streams?.data) {
      setStreams(prevStreams => [...prevStreams, ...data.streams.data]);
      setMeta(data?.streams?.meta);
    }
  } catch (error) {
    console.log('Error upon loading more stream by quality, ', error);
  } finally {
    setLoading(false);
  }
};

export const getNextPageByCategory = async (
  id,
  setStreams,
  setLoadingMore,
  setMeta,
  current_page,
) => {
  try {
    setLoadingMore(true);
    const data = await fetcPaginationCategoryData(id, current_page);
    if (data?.streams?.data && data?.streams?.meta) {
      setStreams(prevStreams => [...prevStreams, ...data.streams.data]);
      setMeta(data.streams.meta);
    }
  } catch (error) {
    console.log('Error upon loading more streams by Quality', error);
  } finally {
    setLoadingMore(false);
  }
};

export const getStreamsByTags = async (
  id,
  setRating,
  setStreams,
  setLoading,
  setMeta,
) => {
  try {
    setLoading(true);
    const data = await fetcPaginationTagsData(id);
    setRating(data?.Tag);
    if (data?.streams?.data) {
      setStreams(prevStreams => [...prevStreams, ...data.streams.data]);
      setMeta(data?.streams?.meta);
    }
  } catch (error) {
    console.log('Error upon loading more stream by quality, ', error);
  } finally {
    setLoading(false);
  }
};

export const getNextPageByTags = async (
  id,
  setStreams,
  setLoadingMore,
  setMeta,
  current_page,
) => {
  try {
    setLoadingMore(true);
    const data = await fetcPaginationTagsData(id, current_page);
    if (data?.streams?.data && data?.streams?.meta) {
      setStreams(prevStreams => [...prevStreams, ...data.streams.data]);
      setMeta(data.streams.meta);
    }
  } catch (error) {
    console.log('Error upon loading more streams by Quality', error);
  } finally {
    setLoadingMore(false);
  }
};

export const getStreamsByGenre = async (
  id,
  setRating,
  setStreams,
  setLoading,
  setMeta,
) => {
  try {
    setLoading(true);
    const data = await fetcPaginationGenreData(id);
    setRating(data?.genre);
    if (data?.genres?.data) {
      setStreams(prevStreams => [...prevStreams, ...data.genres.data]);
      setMeta(data?.genres?.meta);
    }
  } catch (error) {
    console.log('Error upon loading more stream by quality, ', error);
  } finally {
    setLoading(false);
  }
};

export const getNextPageByGenre = async (
  id,
  setStreams,
  setLoadingMore,
  setMeta,
  current_page,
) => {
  try {
    setLoadingMore(true);
    const data = await fetcPaginationGenreData(id, current_page);
    if (data?.genres?.data && data?.genres?.meta) {
      setStreams(prevStreams => [...prevStreams, ...data.genres.data]);
      setMeta(data.genres.meta);
    }
  } catch (error) {
    console.log('Error upon loading more streams by Quality', error);
  } finally {
    setLoadingMore(false);
  }
};

export const getStreamsByYear = async (id, setMovies, setLoading, setMeta) => {
  try {
    setLoading(true);
    const data = await fetcPaginationYearData(id);
    if (data?.data?.data) {
      setMovies(prevStreams => [...prevStreams, ...data.data.data]);
      setMeta(data?.data?.meta);
    }
  } catch (error) {
    console.log('Error upon loading more stream by quality, ', error);
  } finally {
    setLoading(false);
  }
};

export const getNextPageByYear = async (
  id,
  setMovies,
  setLoadingMore,
  setMeta,
  current_page,
) => {
  try {
    setLoadingMore(true);
    const data = await fetcPaginationYearData(id, current_page);
    if (data?.data?.data && data?.data?.meta) {
      setMovies(prevStreams => [...prevStreams, ...data.data?.data]);
      setMeta(data?.data?.meta);
    }
  } catch (error) {
    console.log('Error upon loading more streams by Quality', error);
  } finally {
    setLoadingMore(false);
  }
};
