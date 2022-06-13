// Follow http methods name for naming convention for functions
import { NextFunction, Request, Response } from "express";
import {
  readMoviesCount,
  readMoviesById,
  createMovies,
  readAllMovies,
  updateMovies,
  deleteMovies as removeMovies,
} from "../services/movie.service";

export const getAllMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // // paginating user model
  // const page = parseInt(req.query.page, 10);
  // const limit = parseInt(req.query.limit, 10);
  // const { sort } = req.query;
  // const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  // const results: any = {};

  // // endIndex number is less than total Documents number, it means next page must be there
  // if (endIndex < (await findMoviesCount())) {
  //   results.next = {
  //     page: page + 1, // since index starts at 0
  //     limit: limit,
  //   };
  // }

  // // if 1 or more documents are skipped at the begining, it means previous page exists containing those skipped documents
  // if (startIndex > 0) {
  //   results.previous = {
  //     page: page - 1,
  //     limit: limit,
  //   };
  // }

  try {
    // results.results = await findAllMovies(sort, startIndex, limit);
    const results = await readAllMovies();

    if (results) {
      res.status(200).json(results);
      return;
    } else {
      res.status(404).end();
      return;
    }
    // logger.info(res);
  } catch (err) {
    next(err);
  }
};

export const getMoviesById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const movie = await readMoviesById(Number(id));
    if (movie) {
      res.status(200).json(movie);
      return;
    } else {
      res.status(404).end();
      return;
    }
  } catch (err) {
    next(err);
  }
};

export const postMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const movie = await createMovies(payload);
    res.status(200).json(movie);
    return movie;
  } catch (err) {
    next(err);
  }
};

// put replaces the entire document with the new one
// all new and old properties are recieved in the body
// new fields could be recieved.
export const putMovies = (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = "put";
    const { id } = req.params;
    const { id: excludingId, ...payload } = req.body;
    const movie = updateMovies(type, Number(id), payload);
    res.status(200).json(movie);
    return movie;
  } catch (err) {
    next(err);
  }
};

// patch replaces only the fields that are passed in the request
// only newly update field is recieved in the body
// only existing fields are affected
export const patchMovies = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const type = "patch";
    const { id } = req.params;
    const { id: excludingId, ...remainingPayload } = req.body;
    const movie = updateMovies(type, Number(id), remainingPayload);
    res.status(200).json(movie);
    return movie;
  } catch (err) {
    next(err);
  }
};

export const deleteMovies = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const movie = removeMovies(Number(id));
    res.status(204).json(movie);
    return;
  } catch (err) {
    next(err);
  }
};
