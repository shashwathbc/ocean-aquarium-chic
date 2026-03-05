import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Product } from '@/store/useCartStore';

interface GetProductsResponse {
    success: boolean;
    data: Product[];
}

const fetchProducts = async (): Promise<Product[]> => {
    const { data } = await api.get<GetProductsResponse>('/products');
    return data.data;
};

export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    });
};
