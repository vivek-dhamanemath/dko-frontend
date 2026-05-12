"use client";

import { AlertTriangle } from "lucide-react";
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden animate-modal-pop border border-[#ebe4db]" onClick={(e) => e.stopPropagation()}>
                <div className="pt-8 pb-4 flex flex-col items-center text-center px-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-[17px] font-semibold text-[#1f1a14] mb-2">{title}</h3>
                    <p className="text-[13px] text-[#7d6e5c] leading-relaxed">{message}</p>
                </div>
                <div className="p-6 flex flex-col gap-2">
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`w-full py-2.5 rounded-lg font-semibold text-[13px] transition-all active:scale-[0.98] ${isDestructive
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-[#1f1a14] text-white hover:bg-[#3d3429]"
                            }`}
                    >
                        {confirmLabel}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-lg font-medium text-[13px] text-[#7d6e5c] hover:bg-[#faf8f5] transition-all"
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
