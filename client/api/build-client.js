import axios from "axios";

// ! the baseurls must be updated for prod build

const BuildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      baseURL: "http://localhost:4000",
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "http://localhost:4000",
    });
  }
};

export default BuildClient;
