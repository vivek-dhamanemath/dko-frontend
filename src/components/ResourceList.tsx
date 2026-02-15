"use client";

import { useEffect, useState } from "react";
import { Resource, resourceService } from "../services/resourceService";
import ResourceCard from "./ResourceCard";
import EditResourceModal from "./EditResourceModal";
import { Loader2 } from "lucide-react";

interface ResourceListProps {
    filters?: any;
}

export default function ResourceList({ filters }: ResourceListProps) {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);

    useEffect(() => {
        loadResources();
    }, [filters]);

    const loadResources = async () => {
        try {
            setLoading(true);
            const data = filters
                ? await resourceService.getFiltered(filters)
                : await resourceService.getAll();
            setResources(data);
        } catch (error) {
            console.error("Failed to load resources", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this resource?")) return;

        // Optimistic update
        const previousResources = [...resources];
        setResources(prev => prev.filter(r => r.id !== id));

        try {
            await resourceService.delete(id);
        } catch (error) {
            console.error("Failed to delete resource", error);
            // Revert on failure
            setResources(previousResources);
            alert("Failed to delete resource");
        }
    };

    const handleUpdate = async (id: string, data: any) => {
        try {
            const updated = await resourceService.update(id, data);
            setResources(prev => prev.map(r => r.id === id ? updated : r));
        } catch (error) {
            console.error("Failed to update resource", error);
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Loading resources...</p>
            </div>
        );
    }

    if (resources.length === 0) {
        return (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-slate-500 font-medium">No resources found</p>
                <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or add a new resource</p>
            </div>
        );
    }

    const availableCategories = Array.from(new Set(resources.map(r => r.category).filter(Boolean)));

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {resources.map(resource => (
                    <ResourceCard
                        key={resource.id}
                        resource={resource}
                        onEdit={setEditingResource}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {editingResource && (
                <EditResourceModal
                    resource={editingResource}
                    isOpen={!!editingResource}
                    onClose={() => setEditingResource(null)}
                    onSave={handleUpdate}
                    availableCategories={availableCategories}
                />
            )}
        </>
    );
}
