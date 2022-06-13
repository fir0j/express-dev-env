// Follow http methods name for naming convention for functions
import { Request, Response, NextFunction } from "express";
import {
  readUsersCount,
  readUsersById,
  createUsers,
  readAllUsers,
  updateUsers,
  deleteUsers as removeUsers,
} from "../services/user.service";

export const getAllUsers = async (
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
  // if (endIndex < (await findUsersCount())) {
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
    // results.results = await findAllUsers(sort, startIndex, limit);
    const results = await readAllUsers();
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

export const getUsersById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await readUsersById(Number(id));
    if (user) {
      res.status(200).json(user);
      return;
    } else {
      res.status(404).end();
      return;
    }
  } catch (err) {
    next(err);
  }
};

export const postUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const user = await createUsers(payload);
    res.status(200).json(user);
    return user;
  } catch (err) {
    next(err);
  }
};

// put replaces the entire document with the new one
// new fields could be added
export const putUsers = (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = "put";
    const { id } = req.params;
    const { id: excludingId, ...payload } = req.body;
    const user = updateUsers(type, Number(id), payload);
    res.status(200).json(user);
    return user;
  } catch (err) {
    next(err);
  }
};

// patch replaces only the fields that are passed in the request
// only existing fields are updated
export const patchUsers = (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = "patch";
    const { id } = req.params;
    const { id: excludingId, ...remainingPayload } = req.body;
    const user = updateUsers(type, Number(id), remainingPayload);
    res.status(200).json(user);
    return user;
  } catch (err) {
    next(err);
  }
};

export const deleteUsers = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = removeUsers(Number(id));
    res.status(204).json(user);
    return;
  } catch (err) {
    next(err);
  }
};
