import axios from "axios";

export async function getShiprocketToken() {

  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: "aditya.coading@gmail.com",
      password: "qNW$vgquK&@2zHSTQLxB&jzYtzU3D$%2"
    }
  );

  return response.data.token;
}