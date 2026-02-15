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
    isDeleted: boolean;
    isPinned: boolean;
    deletedAt: string | null;
    collections: { id: string; name: string }[];
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
    },

    togglePin: async (id: string) => {
        const response = await api.put<Resource>(`/resources/${id}/pin`);
        return response.data;
    },

    fetchMetadata: async (url: string) => {
        const response = await api.get<{ title: string; faviconUrl: string }>(`/resources/metadata?url=${encodeURIComponent(url)}`);
        return response.data;
    },

    bulkDelete: async (ids: string[]) => {
        await api.post("/resources/bulk-delete", ids);
    },

    bulkArchive: async (ids: string[], archive: boolean) => {
        await api.put(`/resources/bulk/archive?archive=${archive}`, ids);
    },

    // Trash
    getTrash: async () => {
        const response = await api.get<Resource[]>("/resources/trash");
        return response.data;
    },

    restore: async (id: string) => {
        const response = await api.put<Resource>(`/resources/${id}/restore`);
        return response.data;
    },

    permanentDelete: async (id: string) => {
        await api.delete(`/resources/${id}/permanent`);
    },

    emptyTrash: async () => {
        await api.delete("/resources/trash/empty");
    },

    // Stats
    getStats: async () => {
        const response = await api.get<{ lifetime: number; active: number; archived: number; deleted: number }>("/resources/stats");
        return response.data;
    }
};

