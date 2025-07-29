import useResource from './useResource';
import { fetchProducts } from '../utils/fetchProducts';

const useProducts = (autoFetch = true, timeout = 10000) => {
  const { data, loading, error, refetch } = useResource(fetchProducts, autoFetch, timeout);
  return { data, loading, error, refetch };
};

export default useProducts;
