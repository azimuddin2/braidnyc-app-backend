export const generateServiceId = (): string => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 1000-9999
  return `#SVC-${randomNumber}`;
};
