import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/config/firebase';

const withProtectedRoute = (Component: any) => {
    const WrappedComponent = (props: any) => {
        const router = useRouter();

        useEffect(() => {
            if (!auth.currentUser) {
                router.push("/signin");
            }
        }, [router]);

        return <Component {...props} />;
    };

    WrappedComponent.displayName = `withProtectedRoute(${Component.displayName || Component.name || 'Component'})`;

    return WrappedComponent;
};

export default withProtectedRoute;
