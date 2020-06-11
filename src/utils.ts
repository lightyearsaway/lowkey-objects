const ID_KEY = "latest-id";

export const getNextId = () => {
  const nextId = Number(window.localStorage.getItem(ID_KEY) || 0) + 1;

  window.localStorage.setItem(ID_KEY, `${nextId}`);
  return nextId;
};
