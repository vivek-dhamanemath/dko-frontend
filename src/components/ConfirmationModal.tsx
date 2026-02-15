"use client";

import { X, AlertTriangle, Trash2 } from "lucide-react";
import { useEffect } from "react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    isDestructive = true
}: ConfirmationModalProps) {
    // Handle Esc key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-fade-in">
            <div
                className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header/Icon */}
                <div className="pt-8 pb-4 flex flex-col items-center text-center px-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isDestructive ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                        }`}>
                        <AlertTriangle className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="p-6 flex flex-col gap-2">
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-[0.98] ${isDestructive
                                ? "bg-red-600 text-white hover:bg-red-700 shadow-red-500/20"
                                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20"
                            }`}
                    >
                        {confirmLabel}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
