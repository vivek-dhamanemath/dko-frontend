import { api } from "../lib/api";

export interface Collection {
    id: string;
    name: string;
    createdAt: string;
}

const collectionService = {
    async getCollections(): Promise<Collection[]> {
        const response = await api.get<Collection[]>("/collections");
        return response.data;
    },

    async createCollection(name: string): Promise<Collection> {
        const response = await api.post<Collection>("/collections", name, {
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        return response.data;
    },

    async addResourceToCollection(collectionId: string, resourceId: string): Promise<void> {
        await api.post(`/collections/${collectionId}/add/${resourceId}`);
    },

    async removeResourceFromCollection(collectionId: string, resourceId: string): Promise<void> {
        await api.delete(`/collections/${collectionId}/remove/${resourceId}`);
    },

    async addResourcesToCollection(collectionId: string, resourceIds: string[]): Promise<void> {
        await api.post(`/collections/${collectionId}/add-multiple`, resourceIds);
    },

    async deleteCollection(collectionId: string): Promise<void> {
        await api.delete(`/collections/${collectionId}`);
    }
};

export default collectionService;
