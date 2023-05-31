import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  year: { type: Number, required: true },
  rating: { type: Number, required: true },
  genres: [{ type: String, required: true }],
});

const movie = mongoose.model("movie", movieSchema);
export default movie;
