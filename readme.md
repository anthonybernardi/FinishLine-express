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


## Cons
- as of now, I can't get the frontend to work lol
- a real con is that deploying might be a mess


##### Credit
I stole the template for this from here: https://github.com/eliyabar/react-cra-express-typescript-monorepo
