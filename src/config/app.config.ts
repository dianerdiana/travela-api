export const appConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',
  lang: process.env.LANG || 'en',
});
