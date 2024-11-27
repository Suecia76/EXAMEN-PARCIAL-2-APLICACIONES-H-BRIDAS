import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.SECRET;

const auth = (req, res, next) => {
  const getToken = req.headers.authorization;

  if (getToken) {
    const token = getToken.split(" ")[1];

    jwt.verify(token, secretKey, (err, payload) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = { id: payload.id, email: payload.email };
      next();
    });
  } else {
    return res.sendStatus(401);
  }
};

export default auth;
