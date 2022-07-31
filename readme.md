# About
This is a copy of the [pm-dashboard-v2](https://github.com/Northeastern-Electric-Racing/PM-Dashboard-v2) but as a yarn monorepo with express on the backend. The goal is to make developers' lives easier with a better monorepo structure and a simpler and more understandable backend. As of now it works correctly locally except I haven't done all the endpoints and I sorta messed up some enums maybe. But other than that the frontend works perfectly and stuff and the endpoints I have done also work.

## Setup
1. set up the database like in pm-dashboard-v2
2. get the same .env file from pm-dashboard-v2 but put it in src/backend/
3. npm install -g yarn
4. npm install -g ts-node (this might not be needed anymore since i added it as a dev dependency)
5. yarn install
6. yarn run prisma:reset
7. yarn run start

## Still Todo
Here's what I still have todo to make this be a viable alternative:
- make tests work on the frontend
- fix some weird enum stuff on the backend
- copy over the rest of the endpoints
- figure out how deployment works

## Should We Use This?
Maybe! Writing the backend on this is so easy that I never want to go back to netlify ngl. But also devops are already a weak point for us so that could be frustrating. I've written out some pros and cons below that we can think about. My personal conclusion is that this will do so much for lowering the learning curve and member retention that we might just have to suck it up and figure out the devops.

### Pros
- higher versions of prisma
- express is so easy to write
- express takes away a ton of boilerplate on the backend
- can use helper functions to abstract out code on the backend
- the yarn monorepo is like what we do with utils but it works way better
- frontend can stay the same mostly
- can use nodemon which redeploys locally on save
- we can point at the exact same database from before

### Cons
- deploying might be a mess
- might be more expensive, not sure about this though
- have to migrate all our issues and stuff to a new repo

##### Credit
I stole the template for this from here: https://github.com/eliyabar/react-cra-express-typescript-monorepo
