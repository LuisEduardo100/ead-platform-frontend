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
    }
}