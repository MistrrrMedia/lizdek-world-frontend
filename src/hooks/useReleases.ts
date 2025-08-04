import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Release, CreateReleaseData } from '../types/release';
import api from '../services/api';

export const useReleases = () => {
    return useQuery({
        queryKey: ['releases'],
        queryFn: async (): Promise<Release[]> => {
            const response = await api.get('/releases');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useRelease = (urlTitle: string) => {
    return useQuery({
        queryKey: ['release', urlTitle],
        queryFn: async (): Promise<Release> => {
            const response = await api.get(`/releases/${urlTitle}`);
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!urlTitle,
    });
};

export const useCreateRelease = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (releaseData: CreateReleaseData): Promise<Release> => {
            const response = await api.post('/releases', releaseData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['releases'] });
        },
    });
};

export const useUpdateRelease = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, releaseData }: { id: string; releaseData: Partial<CreateReleaseData> }): Promise<Release> => {
            const response = await api.put(`/releases/${id}`, releaseData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['releases'] });
        },
    });
};

export const useDeleteRelease = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await api.delete(`/releases/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['releases'] });
        },
    });
}; 