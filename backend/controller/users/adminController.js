import Admins from "../../model/adminSchema.js";


const create = async (req, res) => {
    try {
        const body = req.body;
        console.log(req.body);

        if (!body?.name || !body?.email || !body?.password) {
            return res.status(500).send({ message: "Invalid" });
        }

const admins = await Admins.create({

            name: body.name,
            email: body.email,
            password: body.password
        });
        res.status(201).send({ data: admins, message: "admin has been created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "failed to fetch admin" });
    }
};

export  { create };
