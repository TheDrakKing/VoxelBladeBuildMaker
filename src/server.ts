import express from "express";
import serverRoute from "./routes/serverRoute";

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());
// Set the view engine to EJS
app.set("view engine", "ejs");

// Define where the EJS templates are located
app.set("views", "./views"); // './views' is the default directory
//app.use(express.json());
//app.use("/trades", tradesRouter); // Mount the router to the "/trades" base path
app.use("/api", serverRoute);

app.use(express.static("public"));
app.use(express.static("dist"));
app.use(express.static("image"));

app.use("/dist", express.static("dist")); // Serve files in 'dist' under '/dist' path
app.use("/image", express.static("image")); // Serve files in 'image' under '/image' path

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
