import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Show, CreateShowData } from '../types/show';
import api from '../services/api';

export const useShows = () => {
    return useQuery({
        queryKey: ['shows'],
        queryFn: async (): Promise<Show[]> => {
            const response = await api.get('/shows');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useUpcomingShows = () => {
    return useQuery({
        queryKey: ['upcoming-shows'],
        queryFn: async (): Promise<{ shows: Show[]; count: number; hasUpcomingShows: boolean }> => {
            const response = await api.get('/shows/upcoming');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCreateShow = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (showData: CreateShowData): Promise<Show> => {
            const response = await api.post('/shows', showData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shows'] });
        },
    });
};

export const useUpdateShow = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, showData }: { id: string; showData: Partial<CreateShowData> }): Promise<Show> => {
            const response = await api.put(`/shows/${id}`, showData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shows'] });
        },
    });
};

export const useDeleteShow = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await api.delete(`/shows/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shows'] });
        },
    });
}; 