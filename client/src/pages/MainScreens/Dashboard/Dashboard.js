import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { NavLink } from "react-router-dom";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useStateContext } from "../../../context/StateContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { RegisterEvent, updateEvent } from "../../../utils/Event";

import "./Dashboard.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  maxWidth: "500px",
};

const initialState = {
  name: "",
  year: new Date().getFullYear(),
  nameError: false,
};

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 10; i <= currentYear + 1; i++) {
    years.push(i);
  }
  return years;
};

const Dashboard = () => {
  const { events, refreshFlag, toggleMobileNav, DeleteOneEvent } =
    useStateContext();

  const [open, setOpen] = useState(false);
  const [register, setRegister] = useState(initialState);
  const [editModal, setEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEditEvent, setSelectedEditEvent] = useState({
    name: "",
    year: "",
    id: null,
  });

  const handleMoreIconMouseEnter = (id) => {
    setSelectedEvent(id);
  };

  const handleMoreIconMouseLeave = () => {
    setSelectedEvent(null);
  };

  const handleEditEvent = (e, eventId, eventName, year) => {
    e.preventDefault();
    e.stopPropagation();
    setEditModal(true);
    setSelectedEditEvent({
      name: eventName,
      year: year,
      id: eventId,
    });
  };

  const handleClose = () => {
    setRegister(initialState);
    setOpen(false);
  };

  return (
    <div className="dashboard">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <IconButton
            aria-label="delete"
            size="large"
            className="d-md-none"
            onClick={() => {
              toggleMobileNav(true);
            }}
          >
            <MenuIcon
              style={{
                color: "#000000",
              }}
            />
          </IconButton>
          <h2>Dashboard</h2>
        </div>
        <Button
          disableElevation
          variant="contained"
          startIcon={<AddIcon />}
          style={{ borderRadius: "10px", textTransform: "capitalize" }}
          onClick={() => {
            setRegister({
              ...register,
              name: "",
            });
            setOpen(true);
          }}
        >
          Add Event
        </Button>
      </div>
      <div className="mt-3">
        {events?.map((year, index) => (
          <Accordion
            key={index}
            defaultExpanded={index === 0}
            style={{
              boxShadow: "none",
            }}
            sx={{
              "&.MuiAccordion-root::before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index + 1}-content`}
              id={`panel${index + 1}-header`}
            >
              <p className="title">{year.year}</p>
            </AccordionSummary>
            <Divider
              variant="middle"
              style={{
                backgroundColor: "#000000",
                opacity: "0.1",
                marginBottom: "6px",
              }}
            />

            <AccordionDetails>
              <div className="accordion-details">
                <div className="row">
                  {year?.events?.map((event) => (
                    <div
                      key={event._id}
                      className="accordion-details-item col-6 col-md-3 col-lg-2"
                    >
                      <NavLink to={`/event/${event._id}`}>
                        <div
                          className="folder-cover"
                          onMouseLeave={handleMoreIconMouseLeave}
                        >
                          <MoreVertIcon
                            className="more-icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedEvent(event._id);
                            }}
                            onMouseEnter={() =>
                              handleMoreIconMouseEnter(event._id)
                            }
                          />
                          {selectedEvent === event._id && (
                            <div
                              className="acc-menu"
                              onMouseLeave={handleMoreIconMouseLeave}
                              onClick={(e) =>
                                handleEditEvent(
                                  e,
                                  event._id,
                                  event.name,
                                  event.year
                                )
                              }
                            >
                              <button className="d-flex align-items-center justify-content-center">
                                Edit{" "}
                                <EditIcon
                                  style={{
                                    fontSize: "0.8rem",
                                    marginLeft: "4px",
                                  }}
                                />
                              </button>
                              <button
                                className="d-flex align-items-center justify-content-center"
                                onClick={(e) =>
                                  DeleteOneEvent(e, event.year, event._id)
                                }
                              >
                                Delete{" "}
                                <DeleteIcon
                                  style={{
                                    fontSize: "0.8rem",
                                    marginLeft: "4px",
                                  }}
                                />
                              </button>
                            </div>
                          )}

                          <FolderRoundedIcon className="folder-icon" />
                          <p className="accordion-details-item-title">
                            {event.name}
                          </p>
                        </div>
                      </NavLink>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="event-modal">
          <h4>Add Event</h4>
          <FormControl sx={{ minWidth: 120, width: "100%" }} className="mt-3">
            <TextField
              autoComplete="off"
              id="event-name"
              label="Event Name"
              variant="standard"
              sx={{ width: "100%" }}
              value={register.name}
              onChange={(e) =>
                setRegister({
                  ...register,
                  name: e.target.value,
                  nameError: false,
                })
              }
              error={register.nameError}
              helperText={register.nameError ? "Event Name is required" : ""}
            />
          </FormControl>
          <FormControl
            variant="standard"
            sx={{ minWidth: 120, width: "100%" }}
            className="mt-3"
          >
            <InputLabel id="demo-simple-select-standard-label">Year</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={register.year}
              onChange={(e) =>
                setRegister({ ...register, year: e.target.value })
              }
              label="Year"
            >
              {generateYearOptions()?.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            className="mt-4"
            disableElevation
            variant="contained"
            style={{ borderRadius: "10px", textTransform: "capitalize" }}
            onClick={async () => {
              if (!register.name.trim()) {
                return setRegister({ ...register, nameError: true });
              }
              try {
                await RegisterEvent(register);
                refreshFlag();
                handleClose();
              } catch (err) {
                alert(err.response?.data.message || err.message || err);
              }
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>
      {/* EDIT EVENT MODAL */}
      <Modal
        open={editModal}
        onClose={() => setEditModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="event-modal">
          <h4>Edit Event </h4>
          <FormControl sx={{ minWidth: 120, width: "100%" }} className="mt-3">
            <TextField
              autoComplete="off"
              id="event-name"
              label="Event Name"
              variant="standard"
              sx={{ width: "100%" }}
              value={selectedEditEvent.name}
              onChange={(e) => {
                setSelectedEditEvent({
                  ...selectedEditEvent,
                  name: e.target.value,
                });
              }}
              error={register.nameError}
              helperText={register.nameError ? "Event Name is required" : ""}
            />
          </FormControl>
          <FormControl
            variant="standard"
            sx={{ minWidth: 120, width: "100%" }}
            className="mt-3"
          >
            <InputLabel id="demo-simple-select-standard-label">Year</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={selectedEditEvent.year}
              onChange={(e) => {
                setSelectedEditEvent({
                  ...selectedEditEvent,
                  year: e.target.value,
                });
              }}
              label="Year"
            >
              {generateYearOptions()?.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            className="mt-4"
            disableElevation
            variant="contained"
            style={{ borderRadius: "10px", textTransform: "capitalize" }}
            onClick={async () => {
              if (!selectedEditEvent.name.trim()) {
                return setRegister({ ...register, nameError: true });
              }
              try {
                await updateEvent(selectedEditEvent);
                refreshFlag();
                setEditModal(false);
              } catch (err) {
                alert(err.response?.data.message || err.message || err);
              }
            }}
          >
            Update
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Dashboard;
