import useResource from './useResource';
import { fetchUsers } from '../utils/fetchUsers';

const useUsers = (autoFetch = true, timeout = 10000) => {
  const { data, loading, error, refetch } = useResource(fetchUsers, autoFetch, timeout);
  return { data, loading, error, refetch };
};

export default useUsers;
