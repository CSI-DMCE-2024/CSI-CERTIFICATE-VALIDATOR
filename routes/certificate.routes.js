const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const fieldHandler = require("../middlewares/fieldHandler.middleware");
const {
  Register: RegisterCertificate,
  Delete: DeleteCertificate,
  Fetch: FetchCertificate,
  FetchEvent: FetchEventCertificate,
  Update: UpdateCertificate,
  Verify: VerifyCertificate,
} = require("../controllers/certificate.controller");
const auth = require("../middlewares/auth.middleware");

router.post(
  "/verify/:uid",
  param("uid").trim().notEmpty().withMessage("uid is required"),
  fieldHandler,
  VerifyCertificate
);

router.use(auth);

router.post(
  "/register",
  body("event_id").trim().notEmpty().withMessage("event id is required"),
  body("name").trim().notEmpty().withMessage("name is required"),
  body("position").trim().notEmpty().withMessage("position is required"),
  body("date")
    .trim()
    .notEmpty()
    .withMessage("date is required")
    .isDate()
    .withMessage("date should be a date"),
  fieldHandler,
  RegisterCertificate
);

router.delete(
  "/delete/:certificate_id",
  param("certificate_id")
    .trim()
    .notEmpty()
    .withMessage("certificate id is required"),
  fieldHandler,
  DeleteCertificate
);

router.post(
  "/fetch/:certificate_id",
  param("certificate_id")
    .trim()
    .notEmpty()
    .withMessage("certificate id is required"),
  fieldHandler,
  FetchCertificate
);

router.post(
  "/fetch/event/:event_id",
  param("event_id").trim().notEmpty().withMessage("event id is required"),
  fieldHandler,
  FetchEventCertificate
);

router.put(
  "/update/:certificate_id",
  param("certificate_id")
    .trim()
    .notEmpty()
    .withMessage("certificate id is required"),
  fieldHandler,
  UpdateCertificate
);

module.exports = router;
