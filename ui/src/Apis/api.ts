import axios from 'axios'

const API_BASE_URL = 'http://localhost:4001'

const api = axios.create({
  baseURL: API_BASE_URL,
})

export const NetworthFinder = axios.create({ baseURL: `${API_BASE_URL}/networth` })
export const Networth_TimeFinder = axios.create({ baseURL: `${API_BASE_URL}/networth/time` })
export const BusinessFinder = axios.create({ baseURL: `${API_BASE_URL}/business` })
export const Business_TimeFinder = axios.create({ baseURL: `${API_BASE_URL}/business/time` })
export const Investment_TimeFinder = axios.create({ baseURL: `${API_BASE_URL}/investment` })
export const Goal_UltimateFinder = axios.create({ baseURL: `${API_BASE_URL}/goal/ultimate` })
export const Goal_OtherFinder = axios.create({ baseURL: `${API_BASE_URL}/goal/other` })
export const Skill_TypeFinder = axios.create({ baseURL: `${API_BASE_URL}/skill/type` })
export const SkillFinder = axios.create({ baseURL: `${API_BASE_URL}/skill` })
export const Trading_TimeFinder = axios.create({ baseURL: `${API_BASE_URL}/trading` })
export const AssetFinder = axios.create({ baseURL: `${API_BASE_URL}/asset` })

export default api
