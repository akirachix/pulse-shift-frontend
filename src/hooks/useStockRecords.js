import useResource from './useResource';
import { fetchStockRecords } from '../utils/fetchStockRecords';

const useStockRecords = (autoFetch = true, timeout = 10000) => {
  const { data, loading, error, refetch } = useResource(fetchStockRecords, autoFetch, timeout);
  return { data, loading, error, refetch };
};

export default useStockRecords;
