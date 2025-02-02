export const imageKit = () => ({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  baseFolder: process.env.IMAGEKIT_BASE_FOLDER,
});
