import { SubscriptionPlan } from "@/types/subscription";

export const pricingData: SubscriptionPlan[] = [
    {
        title: 'Starter',
        prices: {
            monthly: 0,
            yearly: 0,
        },
        stripeIds: {
            monthly: null,
            yearly: null,
        },
    },
    {
        title: 'Pro',
        prices: {
            monthly: 9,
            yearly: 98,
        },
        stripeIds: {
            monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
            yearly: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
        },
    },
    {
        title: 'Enterprise',
        prices: {
            monthly: 50,
            yearly: 540,
        },
        stripeIds: {
            monthly: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
            yearly: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
        },
    },
];
