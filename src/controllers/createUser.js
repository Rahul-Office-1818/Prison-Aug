import User from "../models/User.js";

const isExist = async () => {
    try {
        const user = await User.findOne({ where: { username: "user" } });
        if (!user) {
            User.create({ username: "user", password: "user@123" });
            console.log(`[!] User created! \n [+] username : user \n [+] Password : user@123`);
            return;
        } 
    } catch (error) {
        console.error("User not created!", error);
        process.exit();
    }
}


export default isExist;