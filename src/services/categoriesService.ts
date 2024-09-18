import api from './api'
import { CourseType } from './courseService'

export type CategoryWithNoCourse = {
    id: number
    name: string
    position: number
}
export type CategoryType = {
    id: number
    name: string
    position: number
    courses?: CourseType[]
}

const categoriesService = {
    getCategories: async() => {
        const res = await api.get('/categories').catch((error)=>{return error.response})
        if (Array.isArray(res.data.categories)) {
            return res.data.categories
        } else {
            console.error('Categorias não são um array:', res.data.categories);
            return [];
        }
    },
    getCourses: async(id: number) => {
        const token = sessionStorage.getItem('vocenotadez-token')
        const res = await api.get(`/categories/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch((error)=>{return error.response})
        return res
    },
    getCategoriesForBranding: async() => {
        const res = await api.get('/categories').catch((error)=>{return error.response})
        return res.data.categories
    },
}

export default categoriesService