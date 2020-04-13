# skillshare-nodejs
Repository for the Node.js Master Class course at Skillshare.com. This repository contains the code for the exercices proposed during the course.

Check out the repository for the course: https://github.com/pirple/The-NodeJS-Master-Class

The original code for this course contains all three products under the same `app` folder. While coding along the instructor, I have decided to split my code into the three different folders. This has implied duplicating _some_ of the code, but that can be easily refactored.

My goal was to have a demo of different types of product that can be done with Node.js:
- HTTP API (`api`)
- Web-based GUI using templates (`gui`)
- Command Line Interface REPL program (`cli`)

Check `misc` folder for extra examples on other Node.js modules.

## Start working

Start docker running node image:

```
make run
```

_Enter_ docker using:

```
make bash
```

## Start the API:

Once the docker is running. Start the API executing one of the following commands:

```
make api
```
or
```
make api-debug
```

## Start the GUI:

Once the API is running. Start the GUI executing one of the following commands:

```
make gui
```
or
```
make gui-debug
```

## Start the CLI:

Once the API is running. Start the CLI executing one of the following commands:

```
make cli
```
or
```
make cli-debug
```

## Debugger example

Execute this command to start up the debugger:
```
make example-debugger
```

Once in the debugger try out `cont`, `repl` commands.

More info: https://nodejs.org/dist/latest-v12.x/docs/api/debugger.html#debugger_command_reference

## Test the application

To execute the tests just run:

```
make test
```
