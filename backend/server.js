// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection failed:', err));

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNo: { type: String, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    course: { type: [String], required: true },
    imageUrl: { type: String },
    createDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error occurred during registration:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        res.status(200).json({ message: 'Login successful', user: { id: user._id, username: user.username } });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/employees', upload.single('image'), async (req, res) => {
    const { name, email, mobileNo, designation, gender, course } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const newEmployee = new Employee({ name, email, mobileNo, designation, gender, course, imageUrl });
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ message: 'Failed to create employee.', error: err.message });
    }
});

app.delete('/api/employees/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Employee deleted' });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/employees/:id', upload.single('image'), async (req, res) => {
    const { name, mobileNo, designation, gender, course } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined; // Handle the uploaded image

    try {
        // Find the employee by ID and update
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id, // Search by ID
            {
                name,
                mobileNo,
                designation,
                gender,
                course,
                imageUrl // Update the imageUrl if a new image is uploaded
            },
            { new: true } // Return the updated document
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' }); // Handle not found case
        }

        res.status(200).json(updatedEmployee); // Respond with the updated employee
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ message: 'Failed to update employee.', error: err.message });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
