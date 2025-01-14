import api from "./api";


export default async function recoverPasswordEmail(email: string) {
    try {
        const res = await api.post('/users/forgotPassword', {
            email, 
        });
        return res.data; 
    } catch (error) {
        console.error("Erro ao enviar email de recuperação de senha:", error);
        return null; 
    }
}