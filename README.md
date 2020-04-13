# skillshare-nodejs
Repository for the Node.js Master Class course at Skillshare.com. This repository contains the code for the exercices proposed during the course.

Check out the repository for the course: https://github.com/pirple/The-NodeJS-Master-Class

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
