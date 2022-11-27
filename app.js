import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import coursesRouter from './router/courses.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import { sequelize } from './db/database.js';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

app.use('/courses', coursesRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
    res.sendStatus(404);
})


app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
})


sequelize.sync().then(() => {
    app.listen();
    app.listen(config.host.port);
    console.log('server processing');
});