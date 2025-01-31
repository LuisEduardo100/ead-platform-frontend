import api from "./api";


const emailSettings = {
    recoverPasswordEmail: async (email: string) => {
        try {
            const res = await api.post('/users/forgotPassword', {
                email, 
            });
            return res.data; 
        } catch (error) {
            console.error("Erro ao enviar email de recuperação de senha:", error);
            return null; 
        }
    },
    confirmEmail: async (token: string) => {
        try {
            const res = await api.post('/confirmEmail', {token})
            console.log(`Res from confirmEmail : ${res}`)
            return res
        } catch (error) {
            console.error("Erro ao enviar email de confirmação de conta:", error);
            return null
        }
    }
}

export default emailSettings