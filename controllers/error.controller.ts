import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export interface IErrorWithStatus extends Error {
  status?: number;
  codeName?: string;
}
// creating custom error classs by extending Node's built-in Error class for raising custom error specific scenario
// class CharacterCountExceeded extends Error {
//   // parent error
//   constructor(post_id, content) {
//     super();
//     this.name = this.constructor.name; // good practice

//     if (this instanceof LongTitleError)
//       // checking if title or body
//       this.type = "title";
//     else if (this instanceof LongBodyError) this.type = "body";

//     this.message = `The character count of post (id: ${post_id}) ${this.type} is too long. (${content.length} characters)`; // detailed error message
//     this.statusCode = 500; // error code for responding to client
//   }
// }

// extending to child error classes
// class LongTitleError extends CharacterCountExceeded {}
// class LongBodyError extends CharacterCountExceeded {}

// const { LongTitleError, LongBodyError } = require("./errors");
// router.get("/user-posts", (req, res, next) => {
//   fetch("https://jsonplaceholder.typicode.com/posts")
//     .then((res) => res.json())
//     .then((posts) => {
//       for (post of posts) {
//         if (post.title.length > 100)
//           throw new LongTitleError(post.id, post.body);
//         if (post.body.length > 220) throw new LongBodyError(post.id, post.body);
//       }
//       console.log(posts);
//       res.header("Content-Type", "application/json");
//       res.send(JSON.stringify(posts, null, 4)); // pretty print
//     })
//     .catch((err) => next(err));
// });

// it will catch only implicit 404 request to the server
export const missedRouteCatcher = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // assuming 404 error as nothing else responded
  // generating custom 404 Not Found error

  const err: IErrorWithStatus = new Error("Endpoint does not exist.");
  err.status = 404;
  next(err);
};

export const errorLogger = (
  err: IErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(
    `[ErrorLogger] got [${err.name}][${err.codeName}]:`,
    err.message
  ); // or using any fancy logging library
  next(err);
};

export const respond404WithClientSupportedContentType = (
  err: IErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.status != 404) {
    next(err);
    return;
  }
  // respond with rendered HTML markup to the client
  if (req.accepts("html")) {
    // return res.status(404).render("<h1>404 Not Found</h1>");
    res.status(404).json({
      message: err.message || "oops! something broke in the server",
      errorStack: err.stack,
      completeError: err,
    });
    return;
  }

  // respond with json
  if (req.accepts("json")) {
    res.status(404).json({ error: err.message });
    return;
  }

  // default to plain-text. send()
  res.status(404).type("txt").send(err.message);
  return;
};

// it will catch all the error thrown explicitly by libraries or developer
// the error must be passed to error handling middleware by controllers user next(er)
export const errorResponder = (
  err: IErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // In case if error occurred and response has already been sent to the client by the server at some point.
  // then you must pass error-handling to the express default-error-handling
  if (res.headersSent) {
    return next(err);
  }

  const messageForDeveloper = {
    message: err.message || "oops! something broke",
    errorStack: err.stack, // use this only in development environment. Probably you won't be debugging in production.
    completeError: err,
  };

  const messageForUser = {
    message: err.message || "oops! something broke",
  };

  return res.status(err.status || 500).json(messageForDeveloper);
};

export const handleUnhandledRejection = () => {
  process.on("unhandledRejection", (error) => {
    if (error instanceof Error) {
      console.log("[unhandledRejection Logger]", error.message);
      return;
    }
  });
};
