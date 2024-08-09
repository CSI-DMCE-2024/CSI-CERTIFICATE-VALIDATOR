import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./SideNavigation.css";
import FolderIcon from "@mui/icons-material/Folder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useStateContext } from "../../context/StateContext";

const SideNavigation = () => {
  const [value, setValue] = useState(0);

  const { removeToken } = useStateContext();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="d-flex flex-column h-100 justify-content-between">
      <div className="">
        <h4 className="px-4 my-3">CSI DMCE</h4>
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
          />

          <Tab
            icon={<NoteAddIcon />}
            iconPosition="start"
            label="Generate Certificate"
            component={NavLink}
            to="/generate-certificate"
          />
        </Tabs>
      </div>

      <div className="logout">
        <button onClick={removeToken}>Logout</button>
      </div>
    </div>
  );
};

export default SideNavigation;
