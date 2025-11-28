import app from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name:"duxbkctqn",
  api_key:"331592443698673",
  api_secret:"8-8_9YnfWTKWsLupGXjKgAhnozE",
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
