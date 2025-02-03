import api from './api'

interface RegisterParams {
    firstName: string;
    lastName: string;
    serie: string;
    phone: string;
    birth: string;
    email: string;
    password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

const authService = {
    register: async (params: RegisterParams) => {
      const res = await api.post("/auth/register", params).catch((error) => {
        if (error.response.status === 400) {
          return "ERRO AQUI EM POST REGISTER"+error.response;
        }
        return error;
      });
      console.log(res)
      return res;
    },
    // forgotPassword: async ({email} : LoginParams) => {
    //   const res = await api.post("/users/forgotPassword")
    // },
    login: async (params: LoginParams) => {
      const res = await api.post("/auth/login", params).catch((error) => {
        if (error.response.status === 400 || error.response.status === 401) {
          return error.response
        }
        return error
      })

      if (res.status === 200) {
        sessionStorage.setItem("vocenotadez-token", res.data.token)
      }
      
      return res
    },
    confirmEmail: async (token: string) => {
      try {
        const res = await api.post(`/confirmEmail?token=${token}`); // Passe o token como parte do corpo da requisição
        return res; // Retorna a resposta da API
      } catch (error: any) {
        if (error.response) { // Verifica se a resposta do erro existe
          if (error.response.status === 400 || error.response.status === 401) {
            return error.response; // Retorna a resposta de erro para o frontend
          }
        }
        // Caso o erro não tenha sido uma resposta HTTP, você pode registrar e lançar o erro
        console.error('Erro ao confirmar email:', error);
        throw error; // Relança o erro para o frontend lidar
      }
    }
  };
  
  export default authService;