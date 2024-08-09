import axios from "axios";

export const RegisterEvent = async (register) => {
  const { data } = await axios.post("/api/event/register", register);
  return data;
};

export const DeleteEvent = async (event_id) => {
  const { data } = await axios.delete(`/api/event/delete/${event_id}`);
  return data;
};

export const fetchEvents = async (controller) => {
  const { data } = await axios.post("/api/event/fetch", {
    signal: controller.signal,
  });
  return data;
};

export const updateEvent = async (selectedEditEvent) => {
  const name = selectedEditEvent.name;
  const year = selectedEditEvent.year;
  const id = selectedEditEvent.id;

  const { data } = await axios.put(`/api/event/update/${id}`, { name, year });
  return data;
};
