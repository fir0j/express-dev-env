// Follow CRUD convention for name methods
import { IErrorWithStatus } from "../controllers/error.controller";
import database from "../database/index";

export const readAllUsers = async () => {
  try {
    const users = await database.users;
    return users;
  } catch (err) {
    throw err;
  }
};

export const readUsersById = async (id: number) => {
  try {
    const user = await database.users.find((item) => item.id === id);
    return user;
  } catch (err) {
    throw err;
  }
};

export const createUsers = async (payload: any) => {
  try {
    const payloadIndex = database.users.findIndex(
      (item) => item.id === payload.id
    );
    if (payloadIndex === -1) {
      await database.users.push(payload);
      return payload;
    } else {
      const err: IErrorWithStatus = new Error("Already Exists");
      err.status = 409;
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

export const updateUsers = async (
  type: "put" | "patch",
  id: number,
  payload: any
) => {
  try {
    if (!id || !payload || !Object.keys(payload).length) return;
    payload.id = id; // overwrite the id with the id passed in so that id is not changed
    const user: any = await database.users.find((item) => item.id === id);

    if (user) {
      const payloadIndex = database.users.findIndex((item) => item.id === id);
      if (type === "put") {
        // replace item at index with another item
        database.users.splice(payloadIndex, 1, payload);
        return database.users[payloadIndex];
      } else if (type === "patch") {
        // only change those fields which are available in the existing payload
        Object.keys(payload).forEach((key) => {
          if (key in user) user[key] = payload[key];
        });

        database.users.splice(payloadIndex, 1, user);
        return database.users[payloadIndex];
      } else {
        const err: IErrorWithStatus = new Error("Bad Request.");
        err.status = 400;
        throw err;
      }
    }
    throw new Error(`User ${payload.id} does not exist`);
  } catch (err) {
    throw err;
  }
};

export const deleteUsers = async (id: number) => {
  try {
    const payloadIndex = database.users.findIndex((item) => item.id === id);
    if (payloadIndex > -1) {
      // remove at index
      const deletedItem = database.users.splice(payloadIndex, 1);
      return deletedItem[0];
    }
    throw new Error(`User ${id} does not exist`);
  } catch (err) {
    throw err;
  }
};

export const readUsersCount = async () => {
  try {
    const count = await database.users.length;
    return count;
  } catch (err) {
    throw err;
  }
};
