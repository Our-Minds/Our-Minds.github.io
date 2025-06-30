
// Performance utilities for faster loading

export const preloadRoute = (routeImport: () => Promise<any>) => {
  // Preload route component on hover or focus
  const link = document.createElement('link');
  link.rel = 'modulepreload';
  routeImport().catch(() => {}); // Preload but don't throw errors
};

export const prefetchData = (queryClient: any, queryKey: string[], queryFn: () => Promise<any>) => {
  queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const batchRequests = <T>(
  requests: (() => Promise<T>)[],
  batchSize: number = 3
): Promise<T[]> => {
  return new Promise(async (resolve, reject) => {
    const results: T[] = [];
    
    try {
      for (let i = 0; i < requests.length; i += batchSize) {
        const batch = requests.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(req => req()));
        results.push(...batchResults);
      }
      resolve(results);
    } catch (error) {
      reject(error);
    }
  });
};

export const memoizeQuery = <T>(
  fn: (...args: any[]) => Promise<T>,
  keyFn: (...args: any[]) => string,
  ttl: number = 5 * 60 * 1000 // 5 minutes
) => {
  const cache = new Map<string, { data: T; timestamp: number }>();
  
  return async (...args: any[]): Promise<T> => {
    const key = keyFn(...args);
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    
    const data = await fn(...args);
    cache.set(key, { data, timestamp: Date.now() });
    
    // Clean up old cache entries
    if (cache.size > 50) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    
    return data;
  };
};
