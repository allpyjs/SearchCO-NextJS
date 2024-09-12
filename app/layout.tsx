"use client";

import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "@/styles/index.css";

import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-themes";
import DashboardLayout from "@/components/DashboardLayout";
import LandingLayout from "@/components/LandingLayout"
import { usePathname } from 'next/navigation'
import { AuthContextProvider } from "@/contexts/authContext";

import ProtectedRoute from "@/components/ProtectedRouteWrapper";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
    children,
}: {
    children: any;
}) {
    const pathname = usePathname()

    const noLayoutRequired = ['/chatbot-iframe', '/userid-input', 'verify-email'];
    const landingLayoutRequired = ['/signin', '/signup', '/terms-of-service', '/privacy-policy', '/pricing', '/about', '/blog', '/document', '/features', '/api-document']
    const dashboardLayoutRequired = ['/blogs-post']

    const isNoLayoutRequired = noLayoutRequired.some(path => pathname.includes(path));
    const isLandingLayoutRequired = landingLayoutRequired.some(path => pathname.includes(path));
    const isDashboardLayoutRequired = dashboardLayoutRequired.some(path => pathname.includes(path));

    const getLayout = () => {
        if (isDashboardLayoutRequired) {
            return (
                <DashboardLayout>
                    {children}
                </DashboardLayout>
            );
        }
        if (isNoLayoutRequired) {
            return children;
        } else if (isLandingLayoutRequired) {
            return <LandingLayout>
                {children}
            </LandingLayout>
        }
        return (
            <div className="w-full">
                <DashboardLayout>
                    {children}
                </DashboardLayout>
            </div>
        );
    };

    return (
        <html suppressHydrationWarning lang="en">
            <head />
            <body className={`bg-[#FCFCFC] dark:bg-[#121723] ${inter.className} custom-scrollbar`}>
                <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
                    <AuthContextProvider>
                        <Providers>
                            {getLayout()}
                            <ScrollToTop />
                        </Providers>
                    </AuthContextProvider>
                </ThemeProvider>
            </body>
        </html >
    );
}