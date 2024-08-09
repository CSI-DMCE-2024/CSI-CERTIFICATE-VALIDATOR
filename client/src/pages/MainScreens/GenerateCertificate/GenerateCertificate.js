import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { useStateContext } from "../../../context/StateContext";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { RegisterCertificate } from "../../../utils/Certificate";

const initialState = {
  name: "",
  year: new Date().getFullYear(),
  position: "",
  event: "",
  date: dayjs(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  ),
  nameError: false,
  positionError: false,
  eventError: false,
};

const GenerateCertificate = () => {
  const { events, positionOption, toggleMobileNav, toggleLoading } =
    useStateContext();

  const [register, setRegister] = useState(initialState);

  const handleInputChange = (field, value) => {
    if (field === "name") {
      setRegister({
        ...register,
        name: value,
        nameError: false,
      });
    } else {
      setRegister({
        ...register,
        [field]: value,
        [`${field}Error`]: false,
      });
    }
  };

  return (
    <div className="generate">
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
        <h2>Generate Certificate</h2>
      </div>
      <div className="container-fluid my-3">
        <Box component="form" noValidate autoComplete="off">
          <div className="row gy-4">
            <div className="col-md-6 col-lg-8 d-flex align-items-end">
              <TextField
                style={{ width: "100%" }}
                id="standard-basic"
                label="Certified to (Name)"
                variant="standard"
                value={register.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={register.nameError}
                helperText={register.nameError ? "Name cannot be empty" : ""}
              />
            </div>
            <div className="col-md-6 col-lg-4 d-flex align-items-end">
              <FormControl
                variant="standard"
                sx={{ minWidth: 120, width: "100%" }}
                className="mt-3"
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Event Year
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={register.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  label="Year"
                >
                  {events?.map((years) => {
                    return (
                      <MenuItem key={years.year} value={years.year}>
                        {years.year}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="col-md-6 col-lg-4 d-flex align-items-end">
              <FormControl
                variant="standard"
                sx={{ minWidth: 120, width: "100%" }}
                className="mt-3"
              >
                <InputLabel id="event-label">Event</InputLabel>
                <Select
                  labelId="event-label"
                  id="event-select"
                  value={register.event}
                  onChange={(e) => handleInputChange("event", e.target.value)}
                  label="Event"
                  error={register.eventError}
                  helperText={
                    register.eventError ? "Event cannot be empty" : ""
                  }
                >
                  {events
                    ?.filter((years) => years.year === register.year)
                    .map((years) => {
                      return years.events.map((event) => (
                        <MenuItem key={event._id} value={event._id}>
                          {event.name}
                        </MenuItem>
                      ));
                    })}
                </Select>
              </FormControl>
            </div>
            <div className="col-md-6 col-lg-4 d-flex align-items-end">
              <FormControl
                variant="standard"
                sx={{ minWidth: 120, width: "100%" }}
                className="mt-3"
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Position
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={register.position}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                  label="Position"
                  error={register.positionError}
                  helperText={
                    register.positionError ? "Position cannot be empty" : ""
                  }
                >
                  {positionOption.map((pos) => (
                    <MenuItem key={pos.value} value={pos.value}>
                      {pos.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="col-md-6 col-lg-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    sx={{
                      ".css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                    variant="standard"
                    className="w-100 custom-date-picker"
                    label="Certificate Date"
                    format="DD/MM/YYYY"
                    value={register.date}
                    onChange={(value) => handleInputChange("date", value)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
        </Box>
      </div>
      <div className="mt-5 w-100 d-flex align-items-center justify-content-center">
        <Button
          variant="contained"
          style={{ borderRadius: "12px", padding: "10px 50px" }}
          onClick={async () => {
            const { name, position, event } = register;
            if (!name.trim() || !position.trim() || !event.trim()) {
              return setRegister({
                ...register,
                nameError: !name.trim(),
                positionError: !position.trim(),
                eventError: !event.trim(),
              });
            }
            toggleLoading(true);
            try {
              await RegisterCertificate(register);
              setRegister(initialState);
            } catch (err) {
              alert(err.response?.data.message || err.message || err);
            }
            toggleLoading(false);
          }}
        >
          Generate Certificate
        </Button>
      </div>
    </div>
  );
};

export default GenerateCertificate;
