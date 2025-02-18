import {User} from '../../model/userSchema.js';
import bcrypt from 'bcrypt';




const getAll = async (req, res) => {
    try {
        //fetching all the data from users table
        const users = await User.findAll();
        res.status(200).send({ data: users, message: "successfully fetched data" })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

const create = async (req, res) => {
    try {
        const body = req.body;
        console.log(req.body);
        
        //validation
        if (!body?.email || !body?.name || !body?.password)
            return res.status(500).send({ message: "Invalid payload" });

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);

        const users = await User.create({
            name: body.name,
            email: body.email,
            password: hashedPassword  // Save the hashed password instead of plain text
        });
        
        // Don't send password back in response
        const userResponse = {
            id: users.id,
            name: users.name,
            email: users.email
        };
        
        res.status(201).send({ data: userResponse, message: "successfully created user" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to create user' });
    }
};


const update = async (req, res) => {

    try {
        const { id = null } = req.params;
        const body = req.body;
        console.log(req.params)
        //checking if user exist or not
        const oldUser = await User.findOne({ where: { id } })
        if (!oldUser) {
            return res.status(500).send({ message: "User not found" });
        }
        oldUser.name = body.name;
        oldUser.password = body.password || oldUser.password;
        oldUser.email = body.email
        oldUser.save();
        res.status(201).send({ data: oldUser, message: "user updated successfully" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Failed to update users' });
    }
}

const getById = async (req, res) => {

    try {
        const { id = null } = req.params;
        const user = await User.findOne({ where: { id } })
        if (!user) {
            return res.status(500).send({ message: "User not found" });
        }
        res.status(201).send({ message: "user fetched successfully", data: user })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}


const delelteById = async (req, res) => {

    try {
        const { id = null } = req.params;
        const oldUser = await User.findOne({ where: { id } })

        //checking if user exist or not
        if (!oldUser) {
            return res.status(500).send({ message: "User not found" });
        }
        oldUser.destroy();
        res.status(201).send({ message: "user deleted successfully" })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}





export const userController = {getAll,create, update,getById, delelteById}