import useResource from './useResource';
import { fetchCategories } from '../utils/fetchCategories';

const useCategories = (autoFetch = true, timeout = 10000) => {
  const { data, loading, error, refetch } = useResource(fetchCategories, autoFetch, timeout);
  return { data, loading, error, refetch };
};

export default useCategories;
