const User = require('../models/user');
const axios=require('axios');
const userController = {};

userController.register = async (req, res) => {
    const { name, email, phone_no, profession, password, address } = req.body;

    // Replace 'YOUR_API_KEY' with your actual Google Geocoding API key
    const apiKey = 'AIzaSyAPdjKgyf0GJinLBzVBDa8ESe0nAcpTyGE';
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const geocodeResponse = await axios.get(geocodeUrl);
        const { results } = geocodeResponse.data;

        console.log("kkk")
        console.log(geocodeResponse.data);
        if (results.length === 0) {
            return res.status(400).send('Invalid address');
        }

        const { lat, lng } = results[0].geometry.location;

        const userData = {
            name,
            email,
            phone_no,
            profession,
            password,
            latitude: lat,
            longitude: lng
        };

        User.create(userData, (err, result) => {
            if (err) {
                return res.status(500).send('Error registering user');
            }
            res.render('login');
        });

    } catch (error) {
        res.status(500).send('Error fetching location');
    }
};

userController.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).send('Server error');
        }

        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        if (user.password !== password) {
            return res.status(401).send('Invalid email or password');
        }

        res.send('Login successful');
    });
};

module.exports = userController;
