"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export default function AuthCallbackPage() {
    const router = useRouter();
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Supabase sends tokens in the URL hash fragment for email confirmations
                // The supabase client automatically picks up the hash and sets the session
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    setStatus("error");
                    setErrorMessage(error.message);
                    return;
                }

                if (data.session) {
                    setStatus("success");
                    // Redirect to dashboard after a brief success message
                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 1500);
                } else {
                    // Try to exchange the hash params — onAuthStateChange may handle it
                    const { data: { subscription } } = supabase.auth.onAuthStateChange(
                        (event, session) => {
                            if (event === "SIGNED_IN" && session) {
                                setStatus("success");
                                setTimeout(() => {
                                    router.push("/dashboard");
                                }, 1500);
                                subscription.unsubscribe();
                            }
                        }
                    );

                    // Give it a few seconds, then show error if nothing happens
                    setTimeout(() => {
                        setStatus((current) => {
                            if (current === "verifying") {
                                subscription.unsubscribe();
                                return "error";
                            }
                            return current;
                        });
                        setErrorMessage("Verification timed out. Please try again.");
                    }, 5000);
                }
            } catch (err) {
                setStatus("error");
                setErrorMessage("An unexpected error occurred during verification.");
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', system-ui, sans-serif",
            background: "#f8fafc",
        }}>
            <div style={{
                textAlign: "center",
                padding: "2rem",
                borderRadius: "12px",
                background: "white",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.06)",
                maxWidth: "400px",
                width: "100%",
            }}>
                {status === "verifying" && (
                    <>
                        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
                        <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1e293b" }}>
                            Verifying your email...
                        </h1>
                        <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
                            Please wait while we confirm your account.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✅</div>
                        <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#16a34a" }}>
                            Email verified!
                        </h1>
                        <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
                            Redirecting you to the dashboard...
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>❌</div>
                        <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#dc2626" }}>
                            Verification failed
                        </h1>
                        <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
                            {errorMessage || "Could not verify your email."}
                        </p>
                        <a
                            href="/login"
                            style={{
                                display: "inline-block",
                                marginTop: "1rem",
                                padding: "0.5rem 1rem",
                                background: "#6366f1",
                                color: "white",
                                borderRadius: "8px",
                                textDecoration: "none",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                            }}
                        >
                            Go to Login
                        </a>
                    </>
                )}
            </div>
        </div>
    );
}
