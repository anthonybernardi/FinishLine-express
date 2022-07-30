import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import userRouter from './routes/users.routes';

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(express.json());

app.use('/users', userRouter);

app.get('/getAllProjects', async (_req, res) => {
  const projects = await prisma.project.findMany();
  console.log(projects);
  res.json({ projects });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
