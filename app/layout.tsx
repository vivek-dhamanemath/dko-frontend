import "./globals.css";

export const metadata = {
    title: "Enterprise Auth | DKO",
    description: "Secure login and registration for Developer Knowledge Organizer",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>{children}</body>
        </html>
    )
}
