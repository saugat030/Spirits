import type { NextFunction, Request, Response } from "express";

export const validateLocalSignup = (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    console.log("validateLocalSignup reached");
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
        console.log("Invalid signup credentials.");   
        return res.status(400).json({ 
            success: false, 
            message: "Name, email, and password are required. Please try again." 
        });
    }    
    next();
};