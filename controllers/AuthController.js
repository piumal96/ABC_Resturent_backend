const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log('No user found with this email:', email);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match for user:', email);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // If credentials are valid, store user data in the session
        req.session.user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        console.log('User logged in successfully:', user.username);
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error during logout:', err.message);
            return res.status(500).json({ msg: 'Could not log out, please try again.' });
        }
        console.log('User logged out successfully');
        res.status(200).json({ msg: 'Logged out successfully' });
    });
};
