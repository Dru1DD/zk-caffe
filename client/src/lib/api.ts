const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function makeApiCall(endpoint: string, data?: any, method: 'GET' | 'POST' = 'POST') {
    const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };

    if (data && method === 'POST') {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, options);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'API request failed');
    }
    return response.json();
}


export const createLoyaltyCardAPI = (sender: string, imageUrl: string) =>
    makeApiCall('/api/caffee/loyalty-card/create', { sender, imageUrl });

export const getLoyaltyCardAPI = (cardId: string) =>
    makeApiCall(`/api/caffee/loyalty-card/${cardId}`, undefined, 'GET');

export const addStampAPI = (sender: string, cardId: string, newImageUrl: string) =>
    makeApiCall('/api/caffee/stamp/add', { sender, cardId, newImageUrl });


export const buyCoffeeAPI = (
    sender: string,
    cardId: string,
    coinId: string,
    coinType?: string
) =>
    makeApiCall('/api/caffee/coffee/buy', { sender, cardId, coinId, coinType });

export const redeemFreeCoffeeAPI = (sender: string, cardId: string) =>
    makeApiCall('/api/caffee/coffee/redeem', { sender, cardId });


export const getCafeConfigAPI = () =>
    makeApiCall('/api/caffee/config', undefined, 'GET');

export const updateConfigAPI = (sender: string, newPrice: number, newTreasury: string) =>
    makeApiCall('/api/caffee/config/update', { sender, newPrice, newTreasury });


export const executeTransactionAPI = (digest: string, signature: string) =>
    makeApiCall('/api/caffee/transaction/execute', { digest, signature });

export const createStampAPI = (sender: string) => {
    console.warn('createStampAPI is deprecated. Use createLoyaltyCardAPI instead.');
    return createLoyaltyCardAPI(sender, 'https://i.imgur.com/a/7Zq1yqt');
};

