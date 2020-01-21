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
// app.use('/api/ticket', contactRoutes);
// app.use('/api/service', emailRoutes);
// app.use('/api/pay', emailRoutes);


app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

export default app;

// import express from 'express';
// import os from 'os';
// import bodyParser from 'body-parser';
// import audienceRoutes from './server/routes/AudienceRoutes';
// import contactRoutes from './server/routes/ContactRoutes';
// import emailRoutes from './server/routes/EmailRoutes';
// import database from './server/src/models';


// config.config();

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// const port = process.env.PORT || 8000;

// app.use('/v1/audience', audienceRoutes);
// app.use('/v1/contact', contactRoutes);
// app.use('/v1/email', emailRoutes);

// // when a random route is inputed
// app.get('*', (req, res) => res.status(200).send({
//    message: 'Welcome to Email API.'
// }));

// database.sequelize.sync().then(() => {
//    app.listen(port, () => {
//       console.log(`Server is running on PORT ${port}`);
//    });
// });

// export default app;