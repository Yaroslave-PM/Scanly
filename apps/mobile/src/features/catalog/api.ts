import type { ProductCard, ProductSearchResponse } from '@scanly/contracts';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiGet } from '@/shared/api/client';

export const catalogKeys = {
  product: (id: string) => ['product', id] as const,
  search: (q: string) => ['products', 'search', q] as const,
};

export function useProduct(id: string) {
  return useQuery({
    queryKey: catalogKeys.product(id),
    queryFn: ({ signal }) => apiGet<ProductCard>(`/products/${id}`, signal),
  });
}

/** Пустой запрос отдаёт популярные товары с полной карточкой. */
export function useProductSearch(q: string, limit = 20) {
  return useInfiniteQuery({
    queryKey: [...catalogKeys.search(q), limit],
    queryFn: ({ pageParam, signal }) =>
      apiGet<ProductSearchResponse>(
        `/products/search?${new URLSearchParams({ q, page: String(pageParam), limit: String(limit) })}`,
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (last) => last.nextPage ?? undefined,
  });
}

export function fetchByBarcode(code: string) {
  return apiGet<ProductCard>(`/products/by-barcode/${encodeURIComponent(code)}`);
}
