import axios from "axios";
import https from "https";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server (inside Kubernetes)
    return axios.create({
      baseURL:
        "https://ticketing-micro.shop/",
      headers: req.headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // ✅ bypass self-signed SSL
    });
  } else {
    // We are on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};
