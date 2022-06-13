import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes/index";
import {
  missedRouteCatcher,
  errorLogger,
  errorResponder,
  respond404WithClientSupportedContentType,
  handleUnhandledRejection,
} from "./controllers/error.controller";

dotenv.config();

const cors = require("cors");

const app: Express = express();

// for parsing json data, is built-in replacement for body-parser middleware
app.use(express.json());
// for parsing x-www-form-data
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("tiny"));

const corsConfig = {
  // Access-Control-Allow-Origin i.e client address
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET", "PUT", "OPTIONS"],
  // Access-Control-Allow-Credentials
  credentials: true,
};

// enable options request for all headers and methods rather than only delete method.
app.options("*", cors(corsConfig));
app.use(cors(corsConfig));
app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello from the TypeScript world!</h1>");
});

//-------------------------------------------------------
// ALL ROUTERS
//-------------------------------------------------------
app.use(routes);

//-------------------------------------------------------
// ERROR-HANDLING
//-------------------------------------------------------
// if error(implicit or explicit) occurred, non-error-handling-middleware will be skipped and error-handling-middleware will be invoked
// all four arguments (err, req, res, next) are mandatory for constructing error-handling-middleware.
app.use(missedRouteCatcher);
app.use(errorLogger);
app.use(respond404WithClientSupportedContentType);
app.use(errorResponder);
handleUnhandledRejection();
// starting server
const httpPort = process.env.PORT || 2000;
app.listen(httpPort, () => {
  console.log(`Mock server is listening at ${httpPort} ⚡`);
});

export default express;
