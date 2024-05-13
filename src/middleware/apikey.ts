import { Request, Response, NextFunction } from 'express';


export const verifyAPIKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['todos-api-key'];
    if (!apiKey) {
        return res.status(401).json({ error: 'No TODOS_API_KEY provided' });
    }

    const isValidAPIKey = apiKey === process.env.TODOS_API_KEY;

    if (!isValidAPIKey) {
        return res.status(401).json({ error: 'Invalid TODOS_API_KEY' });
    }

    next();
};