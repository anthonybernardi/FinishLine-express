import express from 'express';
import userRouter from './routes/users.routes';
import projectRouter from './routes/projects.routes';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use('/users', userRouter);
app.use('/projects', projectRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
