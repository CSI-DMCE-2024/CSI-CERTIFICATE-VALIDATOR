import React, { useState } from "react";
import "./VerifyVertificate.css";
import CSILOGO from "../../../assets/csi_logo-bgn.png";
import { NavLink } from "react-router-dom";

const VerifyCertificateHome = () => {
  const [certificateId, setCertificateId] = useState("");

  const handleChange = (e) => {
    setCertificateId(e.target.value);
  };

  return (
    <div className="verify-home">
      <div className="container bg-light p-4 shadow">
        <div className="row">
          <div className="col-md-12">
            <div className="verify-home-content">
              <div className="d-flex align-items-center justify-content-center ">
                <img
                  src={CSILOGO}
                  alt="csi"
                  className="img-fluid"
                  style={{
                    aspectRatio: "1/1",
                    height: "55px",
                    marginRight: "10px",
                  }}
                />
                <h1>CSI DMCE</h1>
              </div>
              <p className="my-4">
                Verify the authenticity of your certificate by entering the
                certificate ID
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (certificateId?.trim().length === 12) {
                    window.location.href = `/verify-certificate/${certificateId}`;
                  } else {
                    alert("Enter valid certificate ID");
                  }
                }}
              >
                <div className="form-group">
                  <input
                    onChange={handleChange}
                    value={certificateId}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "14px",
                      border: "1px solid #ccc",
                      marginBottom: "10px",
                      fontSize: "20px",
                    }}
                    type="text"
                    className="form-control mt-4"
                    placeholder="Enter Certificate ID"
                  />
                </div>
                {certificateId?.trim().length === 12 && (
                  <NavLink to={`/verify-certificate/${certificateId}`}>
                    <button className="w-100">Verify</button>
                  </NavLink>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificateHome;
