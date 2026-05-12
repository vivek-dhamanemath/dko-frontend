import "./globals.css";
import { ThemeProvider } from "@/src/context/ThemeContext";

export const metadata = {
    title: "DKO — Developer Knowledge Organizer",
    description: "Save, organize, and search your developer resources",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
