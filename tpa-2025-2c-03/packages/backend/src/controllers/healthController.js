export function getHealth(req, res) {
    const health = {
      status: "OK!",
      uptime: process.uptime(),
      timestamp: new Date()
    }
    res.status(200).json(health);
}