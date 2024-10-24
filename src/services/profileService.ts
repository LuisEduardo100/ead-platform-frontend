import api from './api'


interface UserParams {
    firstName: string;
    lastName: string;
    serie: string;
    phone: string;
    email: string;
    createdAt: string;
}
interface PasswordParams {
    currentPassword: string;
    newPassword: string;
}

const profileService = {
    fetchCurrent: async () => {
        const token = sessionStorage.getItem('vocenotadez-token')
        const res = await api.get("/users/current", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).catch((error) => { return error.response })
        return res.data
    },
    userUpdate: async (params: UserParams) => {
        const token = sessionStorage.getItem('vocenotadez-token')
        const res = await api.put("/users/current", params, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).catch((error) => {
            if (error.response.status === 400 || error.response.status === 401) {
                return error.response
            }
            return error
        })
        return res.status
    },
    passwordUpdate: async (params: PasswordParams) => {
        const token = sessionStorage.getItem('vocenotadez-token')

        const res = await api.put("/users/current/password", params, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch((error) => { return error.response })
        return res
    },
    searchUser: async () => {
        const res = await api.get("/users/current")
        return res
    },
    uploadProfilePicture: async (file: File) => {
        const token = sessionStorage.getItem('vocenotadez-token');
        const formData = new FormData();
        formData.append('profilePicture', file);
    
        const res = await api.post('/users/current/profileImage', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }).catch((error) => {
          return error.response;
        }); 
        return res.data;
      },
}

export default profileService