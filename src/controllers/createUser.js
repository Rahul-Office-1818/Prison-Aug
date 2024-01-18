import User from "../models/User.js";

const isExist = async () => {
    const user = await User.findOne({ where: { username: "user" } });
    if(!user) User.create({ username: "user", password: "user@123" });
}


export default isExist;