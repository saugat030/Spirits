import type { NextFunction, Request, Response } from "express";

export const validateLocalSignup = (req: Request, res: Response, next: NextFunction):void => {
    const {name, email, password} = req.body;
    console.log("validateLocalSignup reached");
    
    if (!name || !email || !password) {
        console.log("Invalid signup credentials. ");
        res.status(401).json({ success: false, message: "Invalid signup credentials. Please try again." });
    }
    
    next();
};