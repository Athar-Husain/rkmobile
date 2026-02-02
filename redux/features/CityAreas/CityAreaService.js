import axios from 'axios'
import { BASE_API_URL } from '../../../utils/baseurl'
import { TokenManager } from '../../../utils/tokenManager'

/* ===============================
   Configuration
================================ */
const CITY_AREA_URL = `${BASE_API_URL}/api/locations`

/* ===============================
   Axios Instance
================================ */
const axiosInstance = axios.create({
    baseURL: CITY_AREA_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

/* ===============================
   Attach Token Interceptor
================================ */
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await TokenManager.getToken()
        const isValid = await TokenManager.isValid()

        if (token && isValid) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

/* ===============================
   CityArea Service
================================ */
const CityAreaService = {
    /* ----------- ADMIN ----------- */

    createCity: (data) =>
        axiosInstance.post('/city', data).then((res) => res.data),

    addAreasToCity: (cityId, data) =>
        axiosInstance
            .post(`/addAreasToCity/${cityId}/areas`, data)
            .then((res) => res.data),

    removeAreaFromCity: (cityId, areaId) =>
        axiosInstance
            .delete(`/removeAreaFromCity/${cityId}/area/${areaId}`)
            .then((res) => res.data),

    toggleCityStatus: (cityId) =>
        axiosInstance
            .patch(`/toggleCityStatus/${cityId}/status`)
            .then((res) => res.data),

    toggleAreaStatus: (cityId, areaId) =>
        axiosInstance
            .patch(`/toggleAreaStatus/${cityId}/area/${areaId}/status`)
            .then((res) => res.data),

    /* ----------- PUBLIC ----------- */

    getAllCitiesWithAreas: () =>
        axiosInstance.get('/getAllCitiesWithAreas').then((res) => res.data),

    getCityDetails: (cityId) =>
        axiosInstance.get(`/getCityDetails/${cityId}`).then((res) => res.data),

    /* ----------- USER / MOBILE ----------- */

    getCities: () => axiosInstance.get('/getcities').then((res) => res.data),

    getAreasByCity: (cityId) =>
        axiosInstance
            .get(`/getareasbycity/${cityId}/areas`)
            .then((res) => res.data),

    validateCityArea: (data) =>
        axiosInstance.post('/location/validate', data).then((res) => res.data),

    searchCities: (query) =>
        axiosInstance
            .get('/searchCities', { params: { query } })
            .then((res) => res.data),

    checkAvailability: (data) =>
        axiosInstance.post('/check-availability', data).then((res) => res.data),
}

export default CityAreaService
