// import { createUser,allUsers,getOneUser,updateUser,deleteUser,registerUser} from "../controllers/user.controller.js";
import { Router } from "express";
import { registerUser } from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";

const router=Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1,
        },{
            name:"coverimage",
            maxCount:1,
        }
    ]),
    registerUser
)

// router.get("/register",registerUser);
// //Create User
// router.post("/user",createUser);

// //Get all users
// router.get("/user",allUsers);

// //Get One user
// router.get("/user/:id",getOneUser);

// //Update the user
// router.patch("/user/:id",updateUser);

// //Delete User
// router.delete("/user/:id",deleteUser);

// export default router;


