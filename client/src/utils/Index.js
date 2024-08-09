import axios from "axios";

const Login = async (login) => {
  const { data } = await axios.post("/api/login", login);
  const token = data.data.accessToken;
  if (!token) {
    throw new Error("Invalid token");
  }
  return token;
};

export { Login };
