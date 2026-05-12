import { useState, useCallback } from "react";
import { resourceService, Resource, PaginatedResponse } from "@/src/services/resourceService";
import collectionService, { Collection } from "@/src/services/collectionService";

interface UseResourcesProps {
    archivedOnly?: boolean;
    trashOnly?: boolean;
    collectionId?: string;
}

export function useResources({ archivedOnly = false, trashOnly = false, collectionId }: UseResourcesProps) {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [collections, setCollections] = useState<Collection[]>([]);

    const showMessage = useCallback((msg: string, type: "success" | "error" = "success") => {
        if (type === "error") {
            setError(msg);
            setTimeout(() => setError(""), 3000);
        } else {
            setSuccessMessage(msg);
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    }, []);

    const loadResources = useCallback(async (page: number = 0, size: number = 20) => {
        try {
            setLoading(true);
            if (trashOnly) {
                const data = await resourceService.getTrash();
                setResources(data);
                setTotalElements(data.length);
                setTotalPages(1);
            } else {
                const response: PaginatedResponse = await resourceService.getFiltered({
                    categories: [],
                    tags: [],
                    dateRange: "",
                    sources: [],
                    isArchived: archivedOnly,
                    collectionId: collectionId || undefined,
                    page,
                    size
                });
                setResources(response.content);
                setTotalElements(response.totalElements);
                setTotalPages(response.totalPages);
            }
        } catch (err) {
            console.error("Failed to load resources:", err);
            showMessage("Failed to load resources", "error");
        } finally {
            setLoading(false);
        }
    }, [archivedOnly, trashOnly, collectionId, showMessage]);

    const loadCollections = useCallback(async () => {
        try {
            const data = await collectionService.getCollections();
            setCollections(data);
        } catch (err) {
            console.error("Failed to load collections:", err);
        }
    }, []);

    const handleDelete = useCallback(async (id: string) => {
        const previousResources = [...resources];
        setResources(prev => prev.filter(r => r.id !== id));
        try {
            await resourceService.delete(id);
        } catch {
            setResources(previousResources);
            showMessage("Failed to delete resource", "error");
        }
    }, [resources, showMessage]);

    const handleArchive = useCallback(async (id: string, isCurrentlyArchived: boolean) => {
        const previousResources = [...resources];
        setResources(prev => prev.filter(r => r.id !== id));
        try {
            await resourceService.toggleArchive(id);
            showMessage(isCurrentlyArchived ? "Resource unarchived" : "Resource archived");
        } catch {
            setResources(previousResources);
            showMessage("Failed to update archive status", "error");
        }
    }, [resources, showMessage]);

    const handleUpdate = useCallback(async (id: string, data: any) => {
        try {
            const updated = await resourceService.update(id, data);
            setResources(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
        } catch {
            showMessage("Failed to update resource", "error");
            throw new Error("Update failed");
        }
    }, [showMessage]);

    const handleTogglePin = useCallback(async (id: string) => {
        const resource = resources.find(r => r.id === id);
        if (!resource) return;

        setResources(prev => prev.map(r =>
            r.id === id ? { ...r, isPinned: !r.isPinned } : r
        ));
        try {
            await resourceService.togglePin(id);
        } catch {
            setResources(prev => prev.map(r =>
                r.id === id ? { ...r, isPinned: resource.isPinned } : r
            ));
            showMessage("Failed to update pin status", "error");
        }
    }, [resources, showMessage]);

    const handleRestore = useCallback(async (id: string) => {
        try {
            setLoading(true);
            await resourceService.restore(id);
            showMessage("Resource restored successfully");
            await loadResources();
        } catch {
            showMessage("Failed to restore resource", "error");
        } finally {
            setLoading(false);
        }
    }, [loadResources, showMessage]);

    const handlePermanentDelete = useCallback(async (id: string) => {
        try {
            setLoading(true);
            await resourceService.permanentDelete(id);
            showMessage("Resource permanently deleted");
            await loadResources();
        } catch {
            showMessage("Failed to permanently delete resource", "error");
        } finally {
            setLoading(false);
        }
    }, [loadResources, showMessage]);

    const handleEmptyTrash = useCallback(async () => {
        try {
            setLoading(true);
            await resourceService.emptyTrash();
            showMessage("Trash emptied successfully");
            await loadResources();
        } catch {
            showMessage("Failed to empty trash", "error");
        } finally {
            setLoading(false);
        }
    }, [loadResources, showMessage]);

    const handleBulkArchive = useCallback(async (selectedIds: Set<string>, isArchived: boolean) => {
        try {
            setLoading(true);
            const ids = Array.from(selectedIds);
            await resourceService.bulkArchive(ids, !isArchived);
            showMessage(`${ids.length} resources ${isArchived ? 'restored' : 'archived'}`);
            await loadResources();
        } catch {
            showMessage("Bulk action failed", "error");
        } finally {
            setLoading(false);
        }
    }, [loadResources, showMessage]);

    const handleBulkDelete = useCallback(async (selectedIds: Set<string>) => {
        try {
            setLoading(true);
            const ids = Array.from(selectedIds);
            await resourceService.bulkDelete(ids);
            showMessage(`${ids.length} resources deleted`);
            await loadResources();
        } catch {
            showMessage("Bulk action failed", "error");
        } finally {
            setLoading(false);
        }
    }, [loadResources, showMessage]);

    const handleAddToCollection = useCallback(async (collectionId: string, resourceId: string) => {
        try {
            await collectionService.addResourceToCollection(collectionId, resourceId);
            await loadResources();
        } catch {
            showMessage("Failed to add to folder", "error");
        }
    }, [loadResources, showMessage]);

    const handleBulkAddToCollection = useCallback(async (targetCollectionId: string, selectedIds: Set<string>) => {
        try {
            setLoading(true);
            const ids = Array.from(selectedIds);
            await collectionService.addResourcesToCollection(targetCollectionId, ids);
            showMessage(`${ids.length} resources added to folder`);
            await loadResources();
        } catch {
            showMessage("Bulk action failed", "error");
        } finally {
            setLoading(false);
        }
    }, [loadResources, showMessage]);

    const handleRemoveFromCollection = useCallback(async (targetCollectionId: string, resourceId: string) => {
        try {
            await collectionService.removeResourceFromCollection(targetCollectionId, resourceId);
            await loadResources();
        } catch {
            showMessage("Failed to remove from folder", "error");
        }
    }, [loadResources, showMessage]);

    return {
        resources,
        loading,
        error,
        successMessage,
        totalElements,
        totalPages,
        collections,
        loadResources,
        loadCollections,
        handleDelete,
        handleArchive,
        handleUpdate,
        handleTogglePin,
        handleRestore,
        handlePermanentDelete,
        handleEmptyTrash,
        handleBulkArchive,
        handleBulkDelete,
        handleAddToCollection,
        handleBulkAddToCollection,
        handleRemoveFromCollection,
        showMessage,
        setError,
    };
}
