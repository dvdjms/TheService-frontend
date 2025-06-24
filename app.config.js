import dotenv from 'dotenv';

const ENV = process.env.APP_ENV || 'development';
dotenv.config({ path: `.env.${ENV}` });

export default ({ config }) => ({
    ...config,
    extra: {
        API_BASE_URL: process.env.API_BASE_URL,
    },
});
