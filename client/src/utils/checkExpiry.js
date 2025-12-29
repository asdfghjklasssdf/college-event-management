export const isSessionExpired = () => {
  const expiry = sessionStorage.getItem("expiry");

  if (!expiry) return true; 
  return Date.now() > parseInt(expiry);
};
