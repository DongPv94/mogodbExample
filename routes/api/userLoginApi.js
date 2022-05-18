const { Router } = require("express");
const UserLoginDAO = require("../../models/UsersLogin");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;
const router = Router();

router.get("/", async (req, res) => {
  try {
    const results = await UserLoginDAO.find();
    if (!results) throw new Error("No result");
    const sorted = results.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    res.status(200).json(sorted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/findByID", async (req, res) => {
  try {
    console.log(req.query);
    var queryParams = req.query;
    var userID = queryParams.userID;
    var passwordCheck = queryParams.passInput;
    const result = await UserLoginDAO.find({ userID: userID });
    if (!result) throw new Error("No result");
    const checkPassword = bcrypt.compareSync(passwordCheck, result[0].password);
    res.status(200).json(checkPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const newItem = new UserLoginDAO(req.body);
  try {
    const itemSave = await newItem.save();
    if (!itemSave) throw new Error("Something went wrong saving the userLogin");
    res.status(200).json(itemSave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const userID = req.params.id;

  try {
    console.log(userID);
    console.log(req.body);
    if (req.body.password != null) {
      console.log("password <> null");
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const response = await UserLoginDAO.findOneAndUpdate(
      { userID: userID },
      req.body
    );
    if (!response) throw Error("Something went wrong ");
    const updated = { ...response._doc, ...req.body };
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const removed = await UserLoginDAO.findByIdAndDelete(id);
    if (!removed) throw Error("Something went wrong ");
    res.status(200).json(removed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
