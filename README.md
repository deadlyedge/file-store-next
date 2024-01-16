## purpose

this project is sort of review, for my coding skills, just for fun.

this repo require a working mongodb uri to run, set it in enviroment.

I thought it may useful when someone have a vps and want to add a bit more
workload to it, and may make some test work easier.

I choose mongodb with gridFS support, because I love mongo, and I have had a mongodb running, and it looks less code to write.

## tech stacks

 - mongodb
 - nextjs
 - typescript
 - clerk

sharp should be installed and the version must NOT be 0.33!
 `npm install sharp@0.32.6`

use both API routes and server actions for practise.

## enviroments

 - MONGO_URI: {working database}
 - BASE_URL: 
 - MONGODB_URI: mongodb://
 - MONGO_DB_NAME: file_server_next
 - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 
 - CLERK_SECRET_KEY: 
 - NEXT_PUBLIC_CLERK_SIGN_IN_URL: /sign-in
 - NEXT_PUBLIC_CLERK_SIGN_UP_URL: /sign-up
 - NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: /
 - NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: /
 - ADMIN_EMAIL: 


## TODO

 - ~~auto fresh after upload is mess, only work locally with small file, fix it!~~
 - ~~add timestamp for server log~~
 - ~~responsive page re-design for mobiles~~
 - review filenames and variables
 - port master version to 'mini' version or base-auth
 - ~~admin delete database confirmations~~
 - ~~and dashboard delete confirmations~~
 - shorten the get link by add an api