import { useState, useEffect } from "react";
import { useStateContext } from "../context/StateContext";
import {
  fetchCertificates,
  DeleteCertificate,
  UpdateCertificate,
} from "../utils/Certificate";

function useCertificates(event_id) {
  const [certificates, setCertificates] = useState([]);
  const [event, setEvent] = useState("");
  const { removeToken } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const data = await fetchCertificates(
          event_id,
          controller,
          setCertificates,
          setEvent
        );
        setCertificates(data.data.certificates || []);
        setEvent(data.data.event || "");
      } catch (err) {
        if (err.name === "CanceledError") return;
        if (err.response?.data.name === "Unauthorized") {
          setLoading(false);
          return removeToken();
        }
        alert(err.response?.data.message || err.message || err);
      }
      setLoading(false);
    })();

    return () => controller.abort();
  }, [event_id, refresh]);

  const DeleteOneCertificate = async (certificate_id, apiRef) => {
    try {
      await DeleteCertificate(certificate_id);
      apiRef.current.updateRows([{ id: certificate_id, _action: "delete" }]);
    } catch (err) {
      setRefresh((prev) => !prev);
      alert(err.response?.data.message || err.message || err);
    }
  };

  const UpdateOneCertificate = async (newCertificate, setEditModal) => {
    setLoading(true);
    setEditModal(false);
    try {
      await UpdateCertificate(newCertificate);
      setCertificates(
        certificates.map((certificate) => {
          if (certificate._id === newCertificate.id) {
            return {
              ...certificate,
              name: newCertificate.name,
              position: newCertificate.position,
            };
          }
          return certificate;
        })
      );
    } catch (err) {
      setRefresh((prev) => !prev);
      alert(err.response?.data.message || err.message || err);
    }
    setLoading(false);
  };

  return {
    certificates,
    event,
    loading,
    DeleteOneCertificate,
    UpdateOneCertificate,
  };
}

export default useCertificates;
