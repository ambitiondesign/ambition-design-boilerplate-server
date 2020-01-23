import express from 'express';
import cors from 'cors';
import os from 'os';
import authRoutes from './routes/AuthRoutes';
import userRoutes from './routes/UserRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

export default app;
