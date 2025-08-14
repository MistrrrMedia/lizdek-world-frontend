import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ReleaseDetail } from '../types/release';

export const useReleaseDetail = (urlTitle: string | undefined) => {
    return useQuery({
        queryKey: ['release', urlTitle],
        queryFn: async (): Promise<ReleaseDetail> => {
            if (!urlTitle) {
                throw new Error('URL title is required');
            }
            const response = await api.get(`/releases/${urlTitle}`);
            return response.data;
        },
        enabled: !!urlTitle,
    });
}; 