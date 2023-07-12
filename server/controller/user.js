import express from "express";
import jwt from"jsonwebtoken";
import authenticate from"../middleware/authenticate.js";
import User from"../model/user.js";
import dotenv from "dotenv"

const router = express.Router();

dotenv.config()

const newToken = (user) => {
  const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY);
  return token;
};

router.get("/", authenticate, async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

router.post("/", async (req, res) => {
  try {
    let user = await User.create(req.body);
    let token = newToken(user);
    return res.status(200).send({ user, token });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let user = await User.find(req.params.id).lean().exec();
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});
router.delete("/", authenticate, async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.id).lean().exec();
    // let user = await User.deleteMany({}).lean().exec();
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    console.log('entet post login');
    if (!user) return res.status(400).send("email not exist");
    let match = user.checkPassword(req.body.password);
    if (!match) return res.status(400).send("password is wrong");
    let token = newToken(user);
    return res.status(200).send({ user, token });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

export default router;
