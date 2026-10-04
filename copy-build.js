// Copies the React production build (client/dist) into the backend's "public" folder
const fs = require("fs");
const path = require("path");

const from = path.join(__dirname, "client", "dist");
const to = path.join(__dirname, "public");

// Stop if the React app has not been built yet
if (!fs.existsSync(from)) {
  console.error("client/dist not found. Build the React app first.");
  process.exit(1);
}

fs.rmSync(to, { recursive: true, force: true }); // remove the old public folder
fs.cpSync(from, to, { recursive: true });        // copy the new build
console.log("React build copied to the public folder.");
