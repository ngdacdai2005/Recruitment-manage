export interface QueryConfig {
  staleTime: number;
  cacheTime: number;
  retry: number;
  refetchOnWindowFocus: boolean;
}

export const queryConfig: QueryConfig = {
  staleTime: 1000 * 60 * 5, // 5 minutes
  cacheTime: 1000 * 60 * 30, // 30 minutes
  retry: 1,
  refetchOnWindowFocus: false,
};

export default queryConfig;
