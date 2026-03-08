import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

interface GetSettingsResponse {
    success: boolean;
    data: {
        shopLocation: string;
        heroBackground: string;
        address: string;
        mapLocation: string;
        phone: string;
        websiteName: string;
    };
}

const fetchSettings = async () => {
    const { data } = await api.get<GetSettingsResponse>('/settings');
    return data.data;
};

export const useSettings = () => {
    return useQuery({
        queryKey: ['settings'],
        queryFn: fetchSettings,
        staleTime: 1000 * 60 * 10, // Data is fresh for 10 minutes
    });
};
