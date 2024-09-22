export const createUniqueUsername = (name: string) => {
  const fullName = name.split(" ").join("");
  const randomNum = Math.floor(Math.random() * 10000);
  return `${fullName.toLowerCase()}${randomNum}`;
};
