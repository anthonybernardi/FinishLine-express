import express from 'express';
import cors from 'cors';
import userRouter from './src/routes/users.routes';
import projectRouter from './src/routes/projects.routes';

const app = express();
const port = process.env.PORT || 3001;

const options: cors.CorsOptions = {
  origin: ['http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  preflightContinue: false,
  allowedHeaders: ['Content-Type', 'X-Requested-With', 'XMLHttpRequest']
};

app.use(cors(options));
app.use(express.json());

app.use('/users', userRouter);
app.use('/projects', projectRouter);

app.use('/', (_req, res) => {
  res.json('ligma');
});

app.listen(port, () => {
  console.log(`FinishLine listening at http://localhost:${port}`);
});
