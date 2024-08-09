import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { AuthCertificate } from "../../../utils/Certificate";
import { useStateContext } from "../../../context/StateContext";
import Certificate from "../../../assets/certificate.png";
import dayjs from "dayjs";
import QRCode from "react-qr-code";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { toPng } from "html-to-image";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import Button from "@mui/material/Button";

const VerifyCertificate = () => {
  const { uid } = useParams();
  const { toggleLoading } = useStateContext();
  const navigate = useNavigate();

  const [certificateData, setCertificateData] = useState(null);
  const qr_code = useRef(null);
  const certificate = useRef(null);
  const url = useRef(`${window.location.origin}/verify-certificate/${uid}`);

  const htmlToImageConvert = (certificate) => {
    toPng(certificate.current, {
      cacheBust: false,
      // width: 200,
      // height: 200,
      style: {
        transform: "none",
      },
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download =
          certificateData?.event + "-" + certificateData?.name + ".png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        alert(err.message || "Something went wrong");
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      toggleLoading(true);
      try {
        const data = await AuthCertificate(controller, uid);
        setCertificateData(data.data);
        data.data?.position !== 0 &&
          setTimeout(() => {
            startConfetti();
          }, 500);
      } catch (err) {
        if (err.name === "CanceledError") return;
        alert(err.response?.data.message || err.message || err);
        navigate(-1);
      }
      toggleLoading(false);
    })();

    return () => {
      controller.abort();
    };
  }, [uid]);

  function startConfetti() {
    const startTime = Date.now();
    const duration = 2 * 1000;

    const interval = setInterval(() => {
      const timePassed = Date.now() - startTime;
      if (timePassed < duration) {
        const randomX = Math.random();
        const randomY = Math.random();
        confetti({
          particleCount: 50,
          origin: { x: randomX, y: randomY },
        });
      } else {
        clearInterval(interval);
      }
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
    }, duration);
  }

  const getPositionText = (position) => {
    if (position === 0) {
      return "participation";
    } else if (position === 1) {
      return "1st";
    } else if (position === 2) {
      return "2nd";
    } else if (position === 3) {
      return "3rd";
    } else {
      return "";
    }
  };

  return (
    <div className="auth-certi flex-column">
      <button
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          border: "none",
        }}
        onClick={() => navigate("/verify-certificate")}
      >
        <ChevronLeftIcon
          style={{
            fontSize: "2rem",
          }}
        />
      </button>

      {certificateData && (
        <>
          <div className="certificate" ref={certificate}>
            <img
              src={Certificate}
              alt=""
              className="img-fluid"
              style={{ userSelect: "none" }}
            />
            <p
              id="title"
              style={{
                fontSize: `min(3.5vw, 40px)`,
              }}
            >
              Certificate of{" "}
              {certificateData?.position === 0
                ? "Participation"
                : "Achievement"}
            </p>
            <p id="name">{certificateData?.name}</p>
            {certificateData?.position === 0 ? (
              <p id="desc">
                for participation in the <b>{certificateData?.event}</b>{" "}
                organized by CSI-CATT DMCE on{" "}
                {dayjs(certificateData?.date).format("DD MMMM YYYY")}, at Datta
                Meghe College of Engineering, Airoli.
              </p>
            ) : (
              <p id="desc">
                for achieving the{" "}
                <b>{getPositionText(certificateData?.position)} position</b> at{" "}
                <b>{certificateData?.event}</b> organized by CSI-CATT DMCE on{" "}
                {dayjs(certificateData?.date).format("DD MMMM YYYY")}, at Datta
                Meghe College of Engineering, Airoli.
              </p>
            )}
            <p id="uid">Certificate ID : {certificateData?.uid}</p>
            <p id="position-tag">
              {certificateData?.position === 0
                ? ""
                : getPositionText(certificateData?.position)}{" "}
            </p>
            <div id="qr_code_id" ref={qr_code}>
              <QRCode
                size={200}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={url.current || ""}
                viewBox={`0 0 200 200`}
              />
            </div>
          </div>
          <Button
            onClick={() => htmlToImageConvert(certificate)}
            variant="contained"
            color="primary"
            style={{
              marginTop: "20px",
              borderRadius: "14px",
              padding: "10px 18px",
            }}
            disableElevation
          >
            Download Certificate
          </Button>
        </>
      )}
    </div>
  );
};

export default VerifyCertificate;
