export type SubscriptionPlan = {
    title: string;
    prices: {
        monthly: number;
        yearly: number;
    };
    stripeIds: {
        monthly: string | null;
        yearly: string | null;
    };
};

export type UserSubscriptionPlan = SubscriptionPlan & {
    stripeCustomerId: string,
    stripeSubscriptionId: string,
    stripePriceId: string,
    stripeCurrentPeriodEnd: number;
    isPaid: boolean;
    interval: "month" | "year" | null;
    isCanceled?: boolean;
};

