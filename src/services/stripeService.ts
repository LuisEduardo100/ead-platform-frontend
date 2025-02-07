import api from "./api"


export const stripeService = {
    checkoutSessionLink: async()=>{
        const token = sessionStorage.getItem("vocenotadez-token")
        const sessionLink = await api.get('/subscribe', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return sessionLink.data
    },
    getCustomerPortalLink: async (customerId: string) => {
        const token = sessionStorage.getItem("vocenotadez-token");
        const response = await api.get(`/customers/${customerId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    getCheckoutInfo: async (sessionId: string) => {
        try {
            const response = await api.get(`/verify-session/${sessionId}`);
            
            if (!response.data.success) {
                throw new Error(response.data.error || 'Erro na verificação da sessão');
            }

            return {
                success: true,
                customerId: response.data.customerId,
                sessionDetails: response.data.sessionDetails
            };
        } catch (error) {
            console.error('Erro ao verificar sessão:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido',
                //@ts-ignore
                code: error.response?.data?.code || 'GEN001'
            };
        }
    }
}