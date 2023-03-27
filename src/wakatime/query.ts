import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';
import { WAKA_TIME_AUTH_URL, WAKA_TIME_URL } from '../utils/constants';

dotenv.config()

const setAuthentication = () => {

}

const authenticate = () => {
    
}

export const getUserStats = async (): Promise<any> => {
    const config = axios.create({
        baseURL: WAKA_TIME_AUTH_URL,
        headers: {
            Authorization: `Basic ${Buffer.from(process.env.WAKATIME_TOKEN!).toString('base64')}`
        }
    });

    
}