export const databaseConfig = () => ({
  databaseUrl: process.env.DATABASE_URL,
  logging: process.env.NODE_ENV === 'development',
});
