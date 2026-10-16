import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  findById,
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

const router = Router();

router.use(authenticate);

function resolveUserId(raw) {
  const asNumber = Number(raw);
  if (!Number.isNaN(asNumber) && findById(asNumber)) return asNumber;
  return raw;
}

router.get("/:userId", (req, res) => {
  const list = getWatchlist(resolveUserId(req.params.userId));
  if (list === null) {
    return res.status(404).json({ error: "User not found." });
  }
  res.status(200).json(list);
});

router.post("/:userId/movies", authorizeModification, (req, res) => {
  const movie = addMovie(resolveUserId(req.params.userId), req.body || {});
  if (!movie) {
    return res.status(404).json({ error: "User not found." });
  }
  res.status(201).json(movie);
});

router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const movie = updateMovie(
    resolveUserId(req.params.userId),
    Number(req.params.movieId),
    req.body || {},
  );
  if (!movie) {
    return res.status(404).json({ error: "Movie not found." });
  }
  res.status(200).json(movie);
});

router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const removed = deleteMovie(
    resolveUserId(req.params.userId),
    Number(req.params.movieId),
  );
  if (!removed) {
    return res.status(404).json({ error: "Movie not found." });
  }
  res.status(200).json({ message: "Movie removed." });
});

export default router;
