import helmet from 'helmet';
import express from 'express';
import router from './routes/router';

const app = express();

app.use(helmet());

app.use(router);

export default app;
