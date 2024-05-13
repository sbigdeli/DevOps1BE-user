import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/user';


const verify = (token: string) => {
  const secretKey = process.env.TOKEN_SECRET_KEY as string;

  try {
    const decoded: any = jwt.verify(token, secretKey); // Asegúrate de importar jwt si no lo has hecho

    if (decoded && typeof decoded === 'object' && 'userId' in decoded) {
      const userId = decoded.userId;
      return userId;
    } else {
      throw new Error('Error decoding the token');
    }
  } catch (error) {
    return null;
  }
};


const generateToken = (userId: string) => {
  const payload = {
    userId
  };

  const secretKey: string = process.env.TOKEN_SECRET_KEY as string;

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({ username: user.username, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ error: 'Username in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error('Register error: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Successful logout' });
};

export const verifyToken = async (req: Request, res: Response) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'JWT not present' });
  }

  const decodedToken = verify(token);

  if (!decodedToken) {
    return res.status(401).json({ error: 'Invalid JWT' });
  }
  console.log(decodedToken)
  res.status(200).json({ userId: decodedToken });
};
