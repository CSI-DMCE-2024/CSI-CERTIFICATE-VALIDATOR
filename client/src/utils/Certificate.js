import axios from "axios";
import dayjs from "dayjs";

export const RegisterCertificate = async (register) => {
  const { data } = await axios.post("/api/certificate/register", {
    ...register,
    date: dayjs(register.date).format("YYYY-MM-DD"),
    event_id: register.event,
  });

  return data;
};

export const DeleteCertificate = async (certificate_id) => {
  const { data } = await axios.delete(
    `/api/certificate/delete/${certificate_id}`
  );
  return data;
};

export const fetchCertificates = async (event_id, controller) => {
  const token = localStorage.getItem("accessToken");
  const { data } = await axios.post(`/api/certificate/fetch/event/${event_id}`, {
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const UpdateCertificate = async (newCertificate) => {
  const { data } = await axios.put(
    `/api/certificate/update/${newCertificate.id}`,
    {
      name: newCertificate.name,
      position: newCertificate.position,
    }
  );
  return data;
};

export const AuthCertificate = async (controller, uid) => {
  const { data } = await axios.get(`/api/certificate/verify/${uid}`, {
    signal: controller.signal,
  });

  return data;
};
