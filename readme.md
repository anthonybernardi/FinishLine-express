## Setup
1. set up the database like in pm-dashboard-v2
2. get the same .env file from pm-dashboard-v2 but put it in src/backend/
3. npm install -g yarn (if you don't have yarn installed already)
4. npm install -g ts-node
5. yarn install
6. yarn run prisma:reset
7. yarn run start

## Pros
- higher versions of a lot of packages (prisma v4)
- express is so easy to write
- express takes away a ton of boilerplate on the backend
- the yarn monorepo is like what we do with utils but it works way better
- frontend can stay the same mostly
- can use nodemon which redeploys locally on save


## Cons
- as of now, I can't get the frontend to work lol probably because of different versions?
- a real con is that deploying might be a mess
- might be more expensive, not sure about this though
- have to migrate all our issues and stuff to a new repo


##### Credit
I stole the template for this from here: https://github.com/eliyabar/react-cra-express-typescript-monorepo
