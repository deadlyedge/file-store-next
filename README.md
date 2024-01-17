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

here's my building compose file.

```yaml
version: "3.8"

services:

  file_server:
    image: "xdream76/file-server-next"
    container_name: "file-server-next"
    restart: unless-stopped
    ports:
      - "3001:3000"
    volumes:
      - /etc/localtime:/etc/localtime:ro
    environment:
      TZ: Asia/Hong_Kong

      # need this for returning correct file link.
      BASE_URL: https://file.zick.me
      MONGODB_URI: mongodb://your.mongodb.url

      # clerk part, makes life easier. just register there.
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      CLERK_SECRET_KEY:
      NEXT_PUBLIC_CLERK_SIGN_IN_URL: /sign-in
      NEXT_PUBLIC_CLERK_SIGN_UP_URL: /sign-up
      NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: /
      NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: /

      # need this for admin panel and this should match your login account
      ADMIN_EMAIL: xdream@gmail.com

```

## TODO

 - ~~add timestamp for server log~~
 - ~~responsive page re-design for mobiles~~
 - ~~admin delete database confirmations~~
 - ~~and dashboard delete confirmations~~
 - ~~shorten the get link by add an api~~
 - auto fresh after upload is mess, only work locally with small file, fix it!
 - review filenames and variables
 - port master version to 'mini' version or base-auth
 - ~~make a decent home page~~
 - /get route is deprecating