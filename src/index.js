import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` TinyLink server running on http://localhost:${PORT}`);
  console.log(` API: http://localhost:${PORT}/api/urls`);
});
