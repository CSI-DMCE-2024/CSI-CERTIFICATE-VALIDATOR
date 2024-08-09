const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const EventModel = require("../models/event.model");

const Register = async (req, res, next) => {
  try {
    const { name, year } = req.body;

    const event = await EventModel.findOne({
      name,
      year,
    });
    if (event) {
      throw new ApiError("Event already registered", 400, "BadRequest");
    }

    const response = await EventModel.create({
      name,
      year,
    });
    return res.json(
      new ApiResponse(response, "Event registered successfully", 201)
    );
  } catch (err) {
    next(err);
  }
};

const Delete = async (req, res, next) => {
  try {
    const { event_id } = req.params;

    await EventModel.findByIdAndDelete(event_id);
    return res.json(new ApiResponse(null, "Event deleted successfully", 200));
  } catch (err) {
    next(err);
  }
};

const Fetch = async (req, res, next) => {
  try {
    const { event_id } = req.params;

    const event = await EventModel.findById(event_id).lean();
    return res.json(new ApiResponse(event, "Event fetched successfully", 200));
  } catch (err) {
    next(err);
  }
};

const FetchYear = async (req, res, next) => {
  try {
    const events = await EventModel.aggregate([
      {
        $group: {
          _id: "$year",
          events: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id",
          events: 1,
        },
      },
      {
        $sort: { year: -1 },
      },
    ]);
    return res.json(
      new ApiResponse(events, "Events fetched successfully", 200)
    );
  } catch (err) {
    next(err);
  }
};

const FetchAll = async (req, res, next) => {
  try {
    const events = await EventModel.find()
      .sort({ year: -1 })
      .select(["_id", "name"]);
    return res.json(
      new ApiResponse(events, "Events fetched successfully", 200)
    );
  } catch (err) {
    next(err);
  }
};

const Update = async (req, res, next) => {
  try {
    const { event_id } = req.params;

    await EventModel.findByIdAndUpdate(event_id, req.body);
    return res.json(new ApiResponse(null, "Event updated successfully", 200));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  Register,
  Delete,
  Fetch,
  FetchYear,
  FetchAll,
  Update,
};
