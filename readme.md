# About
This is a copy of the [pm-dashboard-v2](https://github.com/Northeastern-Electric-Racing/PM-Dashboard-v2) but as a yarn monorepo with express on the backend. The goal is to make developers' lives easier with a better monorepo structure and a simpler and more understandable backend. As of now it works  locally except I haven't done all the endpoints. But other than that the frontend works and the endpoints I have done also work.

I've also done a test version of deploying it. The backend isn't linked to a database and the frontend doesn't have the Google Auth env variable so you can't login but I'm pretty sure it works. Either way, both are set up to autodeploy based off of changes to this repository which is great.

Here's the [backend](http://finishlineexpresstest-env.eba-6y4pbqnh.us-east-2.elasticbeanstalk.com/) and here's the [frontend](https://resonant-platypus-dff12b.netlify.app/login).


## Local Setup
1. set up the database like in pm-dashboard-v2
2. get the same .env file from pm-dashboard-v2 but put it in src/backend/
3. npm install -g yarn
4. npm install -g ts-node (this shouldn't be needed anymore since i added it as a dev dependency)
5. yarn install
6. yarn prisma:reset
7. yarn start


## Still Todo
Honestly nothing, everything is in place. Devops being fully automatic was all we really needed. For this to be production worthy, we'd have to finish out all the endpoints and make sure I didn't change anything too weird. But as of right now, this can be used to compare against what we currently have without wondering what the hypothetical devops will be like because I already did it.


## Should We Use This?
Maybe! Writing the backend on this is so easy that I never want to go back to netlify ngl. But also devops are already a weak point for us so that could be frustrating. I've written out some pros and cons below that we can think about. My personal conclusion is that this will do so much for lowering the learning curve and member retention that we might just have to suck it up and figure out the devops.

UPDATE: Now that I've done the devops I'm way more convinced that we should do it.


### Pros
- higher version of prisma
- express is so easy to write
- express takes away a ton of boilerplate on the backend
- can use helper functions to abstract out code on the backend
- the yarn monorepo is like what we do with utils but it works way better
- frontend stays the same
- backend redeploys locally on save
- we can point at the exact same database from before


### Cons
- ~~deploying might be a mess~~
- have to migrate all our issues and stuff to a new repo
- slightly weird issue with VSCode where it the automatic test runner fails when running tests but manually running them works


##### Credit
I stole the template for this from here: https://github.com/eliyabar/react-cra-express-typescript-monorepo
