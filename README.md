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

## API Usage

you should get the token from `/dashboard` first.  In fact, if you don't want to 
develop things base on this little tiny project, the api routes is not necessary
at all. But, as I always said, this is a learning project, so I must do as much as 
I can.

### /api/list

a GET method should be like:

```URL
http://localhost:3000/api/list?token=3dd4077f-634f-45a9-baea-05e268ee9348
```

### /api/delete

a POST method, a JSON like:

```JSON
{
	"fileIds": [
		"65a8a899d7a7275cde8639fe",
		"65a73dc3d5daae4a1ff1d88b"
	],
	"token": "3dd4077f-634f-45a9-baea-05e268ee9348"
}
```

 should be post to:

```URL
http://localhost:3000/api/delete
```

### /api/upload

a POST method, a FormData stucture like:

```typescript
    const formData = new FormData()
    const files: File[] = Array.from(acceptedFiles ?? [])
    for (const file of files) {
      formData.append(file.name, file)
    }
```
which means an Array of File with {filename: file} pair should be posted to the api
with token in headers.

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
 - /get route is deprecating (maybe not)
 - add token verification for apis
 - filename unicode support