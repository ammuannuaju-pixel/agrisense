import axios from "axios";

const BASE = `${import.meta.env.VITE_API_URL}/api`;

export const getAllReadings = () => axios.get(`${BASE}/sensors/readings/all`);
export const getFieldReading = (id) => axios.get(`${BASE}/sensors/reading/${id}`);
export const getAlerts = () => axios.get(`${BASE}/alerts`);
export const getWeather = (lat, lon) => axios.get(`${BASE}/weather?lat=${lat}&lon=${lon}`);