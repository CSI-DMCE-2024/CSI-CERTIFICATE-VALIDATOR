import { useState, useEffect } from "react";
import { fetchEvents, DeleteEvent } from "../utils/Event";

function useEvents(isLogin, fetchFlag, removeToken, toggleLoading) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      toggleLoading(true);

      try {
        const data = await fetchEvents(controller, setEvents);
        setEvents(data.data);
      } catch (err) {
        if (err.name === "CanceledError") return;
        if (err.response?.data.name === "Unauthorized") {
          toggleLoading(false);
          return removeToken();
        }
        alert(err.response?.data.message || err.message || err);
      }
      toggleLoading(false);
    })();

    return () => controller.abort();
  }, [isLogin, fetchFlag]);

  const DeleteOneEvent = async (e, year, event_id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    toggleLoading(true);
    try {
      await DeleteEvent(event_id);
      setEvents(
        events.filter((years) => {
          if (years.year === year) {
            years.events = years.events.filter(
              (event) => event._id !== event_id
            );
          }
          if (years.events.length === 0) {
            return false;
          }
          return years;
        })
      );
    } catch (err) {
      alert(err.response?.data.message || err.message || err);
    }
    toggleLoading(false);
  };

  return {
    events,
    DeleteOneEvent,
  };
}

export default useEvents;
