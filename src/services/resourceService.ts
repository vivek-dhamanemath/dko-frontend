import { api } from "@/src/lib/api";

export interface Resource {
    id: string;
    url: string;
    title: string;
    note: string;
    category: string;
    tags: string[];
    createdAt: string;
    isArchived: boolean;
}

export interface CreateResourceRequest {
    url: string;
    title: string;
    note: string;
    category: string;
    tags: string[];
}

export interface UpdateResourceRequest {
    url: string;
    title: string;
    note: string;
    category: string;
    tags: string[];
}

export const resourceService = {
    getAll: async (archived: boolean = false) => {
        const response = await api.get<Resource[]>(`/resources?archived=${archived}`);
        return response.data;
    },

    getFiltered: async (filters: any) => {
        const response = await api.post<Resource[]>("/resources/filter", filters);
        return response.data;
    },

    create: async (data: CreateResourceRequest) => {
        const response = await api.post<Resource>("/resources", data);
        return response.data;
    },

    update: async (id: string, data: UpdateResourceRequest) => {
        const response = await api.put<Resource>(`/resources/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/resources/${id}`);
    },

    toggleArchive: async (id: string) => {
        const response = await api.put<Resource>(`/resources/${id}/archive`);
        return response.data;
    }
};
