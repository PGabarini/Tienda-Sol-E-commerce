export function sessionHandler(req,res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) res.status(401).json({ error: "Token no proporcionado" });

  const token = authHeader.split(" ")[1];
  if (!token) res.status(401).json({ error: "Token no proporcionado" });

  const decoded = jwt.decode(token);
  if (!decoded) res.status(401).json({ error: "Token no proporcionado" });

  const mongoId =
    decoded?.mongoId ||
    decoded?.attributes?.mongoId?.[0] ||
    decoded?.attributes?.mongoId;

  if (!mongoId) res.status(401).json({ error: "Token no proporcionado" });

  return mongoId;
}