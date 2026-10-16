export function authorizeModification(req, res, next) {
  const { role, id } = req.user;

  if (role === "parent") {
    return next();
  }

  if (role === "child" && String(req.params.userId) === String(id)) {
    return next();
  }

  return res.status(403).json({ error: "Access denied" });
}