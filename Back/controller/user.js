const {User}=require ("../database/connection")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');

module.exports={
    registerUser: async(req,res)=>{
        const {userName, email, password, imageUrl, role = 'client', CIN, adresse, numéroTéléphone} = req.body
        try {
            const allowedRoles = ['admin', 'client', 'agent', 'superviseur']
            if(!allowedRoles.includes(role)){
                return res.status(400).json({message:"Invalid role"})
            }
            const existingUser = await User.findOne({where:{email}})
            if(existingUser){
                return res.status(400).json({message:"User already exists"})
            }
            const existingCIN = await User.findOne({where:{CIN}})
            if(existingCIN){
                return res.status(400).json({message:"CIN already exists"})
            }
            const hashedPassword = await bcrypt.hash(password,10)
            const newUser = await User.create({
                userName,
                email,
                password: hashedPassword,
                imageUrl,
                role,
                CIN,
                adresse,
                numéroTéléphone
            })
            res.status(201).json({message:"User registered successfully",user:newUser})
        } catch (error) {
            console.error("Error registering user:",error)
            res.status(500).json({message:"Internal server error"})
        }
    },
    addedUser: async(req,res)=>{
        const {userName, email, password, imageUrl, role, CIN, adresse, numéroTéléphone} = req.body
        try {
            if(req.user.role !== 'admin'){
                return res.status(403).json({message:"Access denied. Only admins can add users"})
            }
            
            const allowedRoles = ['client', 'agent', 'superviseur']
            if(!role || !allowedRoles.includes(role)){
                return res.status(400).json({message:"Invalid role. Only client, agent, or superviseur allowed"})
            }
            
            const existingUser = await User.findOne({where:{email}})
            if(existingUser){
                return res.status(400).json({message:"User already exists"})
            }
            
            const existingCIN = await User.findOne({where:{CIN}})
            if(existingCIN){
                return res.status(400).json({message:"CIN already exists"})
            }
            
            const hashedPassword = await bcrypt.hash(password,10)
            
            const newUser = await User.create({
                userName,
                email,
                password: hashedPassword,
                imageUrl,
                role,
                CIN,
                adresse,
                numéroTéléphone
            })
            
            res.status(201).json({message:"User added successfully",user:newUser})
        } catch (error) {
            console.error("Error adding user:",error)
            res.status(500).json({message:"Internal server error"})
        }
    },
    loginUser: async(req, res) => {
        const { email, password } = req.body;
        try {
            console.log("Login attempt for email:", email);

            const user = await User.findOne({ where: { email } });
            if (!user) {
                console.log("User not found with email:", email);
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log("Password validation result:", isPasswordValid);

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            if (!process.env.JWT_SECRET) {
                console.error("JWT_SECRET is not defined");
                throw new Error('JWT_SECRET is not defined');
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: "10d" }
            );

            console.log("Login successful for user:", user.id);

            return res.status(200).json({
                message: "Login successful",
                user: {
                    id: user.id,
                    userName: user.userName,
                    email: user.email,
                    role: user.role,
                    imageUrl: user.imageUrl ? `http://localhost:3000${user.imageUrl}` : null,
                    CIN: user.CIN,
                    adresse: user.adresse,
                    numéroTéléphone: user.numéroTéléphone
                },
                token
            });
        } catch (error) {
            console.error("Login error:", error);
            if (error.message === 'JWT_SECRET is not defined') {
                return res.status(500).json({
                    message: "Server configuration error",
                    error: "Authentication service unavailable"
                });
            }
            return res.status(500).json({
                message: "Failed to process login request",
                error: error.message || "Please try again later"
            });
        }
    },
    deleteUser: async(req,res)=>{
        const {id}=req.params
        try {
            // Check if user is an admin
            if(req.user.role !== 'admin'){
                return res.status(403).json({message:"Access denied. Only admins can delete users"})
            }
            
            const user=await User.findByPk(id)
            if(!user){
                return res.status(404).json({message:"User not found"})
            }
            
            // If user has an image, delete it from the filesystem
            if (user.imageUrl) {
                const imagePath = path.join(__dirname, '..', user.imageUrl.replace('http://localhost:3000', ''));
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            
            await user.destroy()
            res.status(200).json({message:"User deleted successfully"})
        } catch (error) {
            console.error("Error deleting user:", error)
            res.status(500).json({message:"Internal server error"})
        }
    },
    
    updateUser: async(req, res) => {
        const {id} = req.params;
        try {
            const user = await User.findByPk(id);
            if(!user) {
                return res.status(404).json({message: "User not found"});
            }
            
            // Only admins can update other users
            // Regular users can only update their own profile
            if (req.user.role !== 'admin' && req.user.userId !== user.id) {
                return res.status(403).json({message: "You can only update your own profile"});
            }
            
            // Admins can change roles, but only to client, agent, or superviseur
            if (req.body.role && req.user.role === 'admin') {
                const allowedRoles = ['client', 'agent', 'superviseur'];
                if (!allowedRoles.includes(req.body.role)) {
                    return res.status(400).json({message: "Invalid role. Only client, agent, or superviseur allowed"});
                }
                user.role = req.body.role;
            } else if (req.body.role) {
                // Non-admins cannot change roles
                return res.status(403).json({message: "You cannot change role"});
            }

            // Update basic info
            if (req.body.userName) user.userName = req.body.userName;
            if (req.body.email) user.email = req.body.email;
            if (req.body.CIN) user.CIN = req.body.CIN;
            if (req.body.adresse) user.adresse = req.body.adresse;
            if (req.body.numéroTéléphone) user.numéroTéléphone = req.body.numéroTéléphone;

            // Handle password update
            if (req.body.password) {
                user.password = await bcrypt.hash(req.body.password, 10);
            }

            // Handle file upload
            if (req.file) {
                // Delete old image if exists
                if (user.imageUrl) {
                    const oldImagePath = path.join(__dirname, '..', user.imageUrl.replace('http://localhost:3000', ''));
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }

                // Store the relative path in the database
                const imageUrl = `/uploads/${req.file.filename}`;
                user.imageUrl = imageUrl;
            }

            await user.save();

            // Return user with full URL for the frontend
            const userResponse = {
                id: user.id,
                userName: user.userName,
                email: user.email,
                imageUrl: user.imageUrl ? `http://localhost:3000${user.imageUrl}` : null,
                role: user.role,
                CIN: user.CIN,
                adresse: user.adresse,
                numéroTéléphone: user.numéroTéléphone
            };

            res.status(200).json({
                message: "User updated successfully",
                user: userResponse
            });
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ 
                message: "Error updating user",
                error: error.message 
            });
        }
    },
    currentUser: async (req, res) => {
        try {
            const user = await User.findOne({ where: { id: req.user.userId } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            
            const userResponse = {
                id: user.id,
                userName: user.userName,
                email: user.email,
                role: user.role,
                imageUrl: user.imageUrl ? `http://localhost:3000${user.imageUrl}` : null,
                CIN: user.CIN,
                adresse: user.adresse,
                numéroTéléphone: user.numéroTéléphone
            };
            
            res.status(200).json(userResponse);
        } catch (error) {
            console.error("Error fetching current user:", error);
            res.status(500).json({ message: "Server error" });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            // Check if user is an admin
            if(req.user.role !== 'admin'){
                return res.status(403).json({message:"Access denied. Only admins can view all users"})
            }
            
            const users = await User.findAll({
                attributes: ['id', 'userName', 'email', 'role', 'imageUrl', 'CIN', 'adresse', 'numéroTéléphone', 'createdAt']
            });
            
            // Process users to format imageUrl
            const formattedUsers = users.map(user => ({
                id: user.id,
                userName: user.userName,
                email: user.email,
                role: user.role,
                imageUrl: user.imageUrl ? `http://localhost:3000${user.imageUrl}` : null,
                CIN: user.CIN,
                adresse: user.adresse,
                numéroTéléphone: user.numéroTéléphone,
                createdAt: user.createdAt
            }));
            
            res.status(200).json(formattedUsers);
        } catch (error) {
            console.error("Error fetching all users:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
}