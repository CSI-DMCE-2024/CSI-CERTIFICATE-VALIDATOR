const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const EventModel = require("../models/event.model");
const CertificateModel = require("../models/certificate.model");
const ShortUniqueId = require("short-unique-id");

const { randomUUID } = new ShortUniqueId({ length: 12 });

const uidGenerator = async () => {
  try {
    const uid = await randomUUID();

    const certificate = await CertificateModel.findOne({ uid });
    return certificate ? uidGenerator() : uid;
  } catch (err) {
    throw new ApiError(
      "Something went wrong while generating uid",
      500,
      "FunctionError"
    );
  }
};

const Register = async (req, res, next) => {
  try {
    const { event_id, name, position, date } = req.body;

    const event = await EventModel.findById(event_id);
    if (!event) {
      throw new ApiError("Event is not registered yet", 404, "NotFound");
    }

    const certificate = await CertificateModel.findOne({ name, event_id });
    if (certificate) {
      throw new ApiError(
        "Participant name already registered",
        400,
        "BadRequest"
      );
    }

    const uid = await uidGenerator();

    const response = await CertificateModel.create({
      event_id,
      uid,
      name,
      position,
      date,
    });
    return res.json(
      new ApiResponse(response, "Certificate registered successfully", 201)
    );
  } catch (err) {
    next(err);
  }
};

const Delete = async (req, res, next) => {
  try {
    const { certificate_id } = req.params;

    await CertificateModel.findByIdAndDelete(certificate_id);
    return res.json(
      new ApiResponse(null, "Certificate deleted successfully", 200)
    );
  } catch (err) {
    next(err);
  }
};

const Fetch = async (req, res, next) => {
  try {
    const { certificate_id } = req.params;

    const certificate = await CertificateModel.findById(certificate_id).lean();
    return res.json(
      new ApiResponse(certificate, "Certificate fetched successfully", 200)
    );
  } catch (err) {
    next(err);
  }
};

const FetchEvent = async (req, res, next) => {
  try {
    const { event_id } = req.params;

    const event = await EventModel.findById(event_id).lean();
    const certificates = await CertificateModel.find({ event_id })
      .sort({
        createdAt: -1,
      })
      .lean();
    return res.json(
      new ApiResponse(
        {
          event: event?.name,
          certificates,
        },
        "Certificates fetched successfully",
        200
      )
    );
  } catch (err) {
    next(err);
  }
};

const Update = async (req, res, next) => {
  try {
    const { certificate_id } = req.params;

    await CertificateModel.findByIdAndUpdate(certificate_id, req.body);
    return res.json(
      new ApiResponse(null, "Certificate updated successfully", 200)
    );
  } catch (err) {
    next(err);
  }
};

const Verify = async (req, res, next) => {
  try {
    const { uid } = req.params;

    const certificate = await CertificateModel.findOne({ uid }).lean();
    if (!certificate) {
      throw new ApiError("Certificate not found", 404, "NotFound");
    }

    const event = await EventModel.findById(certificate.event_id).lean();

    return res.json(
      new ApiResponse(
        { ...certificate, event: event?.name },
        "Certificate fetched successfully",
        200
      )
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  Register,
  Delete,
  Fetch,
  FetchEvent,
  Update,
  Verify,
};
