const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    const saltRounds = 10;
    try {
        const { name, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ name: user.name, email: user.email });
    } catch (error) {
        if (error.code === 11000) {  // MongoDB duplicate key error code
            res.status(400).json({ message: 'USER ALREADY EXISTS!', error: error.message });
        } else {
            res.status(400).json({ message: 'Signup failed', error: error.message });
        }
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) throw new Error('Bad Credentials');

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) throw new Error('Bad Credentials');

        // For simplicity, we're sending user details:
        res.json({ name: user.name, email: user.email });
    } catch (error) {
        res.status(400).json({ message: 'Login failed', error: error.message });
    }
};
