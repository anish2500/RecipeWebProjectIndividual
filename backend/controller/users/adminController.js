import Admins from "../../model/adminSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const create = async (req, res) => {
    try {
        const body = req.body;
        console.log(req.body);

        if (!body?.name || !body?.email || !body?.password) {
            return res.status(500).send({ message: "Invalid" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(body.password, 10);

        const admins = await Admins.create({
            name: body.name,
            email: body.email,
            password: hashedPassword
        });

        // Remove password from response
        const adminResponse = {
            adminId: admins.adminId,
            name: admins.name,
            email: admins.email
        };

        res.status(201).send({ data: adminResponse, message: "admin has been created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "failed to create admin" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find admin
        const admin = await Admins.findOne({ where: { email } });
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin.adminId, email: admin.email, role: 'admin' },
            process.env.secretkey,
            { expiresIn: process.env.expiresIn }
        );

        res.status(200).json({
            data: {
                access_token: token,
                user: {
                    adminId: admin.adminId,
                    name: admin.name,
                    email: admin.email,
                    role: 'admin'
                }
            },
            message: "Login successful"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed" });
    }
};

export { create, login };


