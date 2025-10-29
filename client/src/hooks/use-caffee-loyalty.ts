/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
    createLoyaltyCardAPI,
    addStampAPI,
    buyCoffeeAPI,
    redeemFreeCoffeeAPI,
    getLoyaltyCardAPI,
    getCafeConfigAPI,
    executeTransactionAPI,
} from '@/lib/api';


interface WalletContext {
    connected: boolean;
    address: string;
    signAndExecute: (tx: any) => Promise<{ digest: string; signature: string }>;
}

export function useCaffeeLoyalty(wallet: WalletContext) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTransaction = async (
        apiCall: () => Promise<any>,
        successMessage?: string
    ) => {
        if (!wallet.connected) {
            throw new Error('Wallet not connected');
        }

        setLoading(true);
        setError(null);

        try {
            const txData = await apiCall();

            const { digest, signature } = await wallet.signAndExecute(txData);

            const result = await executeTransactionAPI(digest, signature);

            return { success: true, data: result, message: successMessage };
        } catch (err) {
            const errorMessage = (err as Error).message || 'Transaction failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const createLoyaltyCard = async (imageUrl: string) => {
        return handleTransaction(
            () => createLoyaltyCardAPI(wallet.address, imageUrl),
            'Loyalty card created successfully'
        );
    };

    const addStamp = async (cardId: string, newImageUrl: string) => {
        return handleTransaction(
            () => addStampAPI(wallet.address, cardId, newImageUrl),
            'Stamp added successfully'
        );
    };

    const buyCoffee = async (cardId: string, coinId: string, coinType?: string) => {
        return handleTransaction(
            () => buyCoffeeAPI(wallet.address, cardId, coinId, coinType),
            'Coffee purchased successfully'
        );
    };

    const redeemFreeCoffee = async (cardId: string) => {
        return handleTransaction(
            () => redeemFreeCoffeeAPI(wallet.address, cardId),
            'Free coffee redeemed successfully'
        );
    };

    const getLoyaltyCard = async (cardId: string) => {
        setLoading(true);
        setError(null);
        try {
            const card = await getLoyaltyCardAPI(cardId);
            return { success: true, data: card };
        } catch (err) {
            const errorMessage = (err as Error).message || 'Failed to fetch loyalty card';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const getCafeConfig = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = await getCafeConfigAPI();
            return { success: true, data: config };
        } catch (err) {
            const errorMessage = (err as Error).message || 'Failed to fetch cafe config';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        createLoyaltyCard,
        addStamp,
        buyCoffee,
        redeemFreeCoffee,
        getLoyaltyCard,
        getCafeConfig,
    };
}
