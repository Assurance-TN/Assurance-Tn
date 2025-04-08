const {User}=require ("../database/connection")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');

module.exports={
    registerUser: async(req,res)=>{
        const {userName,email,password,imageUrl,role}=req.body
        try {
            const allowedRoles=['admin','client','Manager','Employe']
            if(!allowedRoles.includes(role)){
                return res.status(400).json({message:"Invalid role"})
            }
            const existingUser=await User.findOne({where:{email}})
            if(existingUser){
                return res.status(400).json({message:"User already exists"})
            }
            const hashedPassword=await bcrypt.hash(password,10)
            const newUser=await User.create({userName,email,password:hashedPassword,imageUrl,role})
            res.status(201).json({message:"User registered successfully",user:newUser})
        } catch (error) {
            console.error("Error registering user:",error)
            res.status(500).json({message:"Internal server error"})
        }
    },
    loginUser: async(req, res) => {
        const { email, password } = req.body;
        try {
            // Add logging to debug
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

            // Log successful login
            console.log("Login successful for user:", user.id);

            return res.status(200).json({
                message: "Login successful",
                user: {
                    id: user.id,
                    userName: user.userName,
                    email: user.email,
                    role: user.role,
                    imageUrl: user.imageUrl ? `http://localhost:3000${user.imageUrl}` : null
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
    deleteUser:async(req,res)=>{
        const {id}=req.params
        try {
            const user=await User.findByPk(id)
            if(!user){
                return res.status(404).json({message:"User not found"})
            }
            await user.destroy()
            res.status(200).json({message:"User deleted successfully"})
        } catch (error) {
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

            // Update basic info
            if (req.body.userName) user.userName = req.body.userName;
            if (req.body.email) user.email = req.body.email;

            // Handle password update
            if (req.body.password) {
                user.password = await bcrypt.hash(req.body.password, 10);
            }

            // Handle file upload
            if (req.file) {
                // Delete old image if exists
                if (user.imageUrl) {
                    const oldImagePath = path.join(__diruserName, '..', user.imageUrl.replace('http://localhost:3000', ''));
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }

                // Store the relative path in the database
                const imageUrl = `/uploads/${req.file.fileuserName}`;
                user.imageUrl = imageUrl;
            }

            await user.save();

            // Return user with full URL for the frontend
            const userResponse = {
                id: user.id,
                userName: user.userName,
                email: user.email,
                imageUrl: user.imageUrl ? `http://localhost:3000${user.imageUrl}` : null,
                role: user.role
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
                imageUrl: user.imageUrl ? `http://localhost:3000${user.imageUrl}` : null
            };
            
            res.status(200).json(userResponse);
        } catch (error) {
            console.error("Error fetching current user:", error);
            res.status(500).json({ message: "Server error" });
        }
    },
}