import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./MobileNavigation.css";
import FolderIcon from "@mui/icons-material/Folder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useStateContext } from "../../context/StateContext";

const SideNavigation = () => {
  const [value, setValue] = useState(0);
  const { mobileNav, toggleMobileNav, removeToken } = useStateContext();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={`mobileNav ${mobileNav === true ? "active" : ""}`}>
      <div
        className="d-flex w-100 align-items-center justify-content-between px-3 mb-3"
        style={{
          backgroundColor: "#1876D1",
          color: "#fff",
        }}
      >
        <div className="d-flex align-items-center">
          <IconButton
            aria-label="delete"
            size="large"
            className="close"
            style={{
              transform: "rotate(180deg)",
            }}
            onClick={removeToken}
          >
            <LogoutIcon style={{ color: "#fff" }} />
          </IconButton>
          <h4 className="my-3">CSI DMCE</h4>
        </div>
        <IconButton
          aria-label="delete"
          size="large"
          className="close"
          onClick={() => toggleMobileNav(false)}
        >
          <CloseIcon style={{ color: "#fff" }} />
        </IconButton>
      </div>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        className="navs"
      >
        <Tab
          icon={<FolderIcon />}
          iconPosition="start"
          label="Dashboard"
          component={NavLink}
          to="/dashboard"
          onClick={() => toggleMobileNav(false)}
        />

        <Tab
          icon={<NoteAddIcon />}
          iconPosition="start"
          label="Generate Certificate"
          component={NavLink}
          to="/generate-certificate"
          onClick={() => toggleMobileNav(false)}
        />
      </Tabs>
    </div>
  );
};

export default SideNavigation;
