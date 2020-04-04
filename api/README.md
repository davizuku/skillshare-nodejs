# RESTful API

## Goal

Allow users to enter URLs to be monitored and receive alerts when those resources _go down_ or _come back up_.

### Functionalities

- Allow users to sign-up and sign-in/out
- Send SMS alert to a user

### Requirements

1. The API listens on a PORT and accepts incoming HTTP requests for POST, GET, PUT, DELETE and HEAD
2. The API allows a client to connect, then create a new user, then edit and delete that user.
3. The API allows a user to _sign in_ which gives them a token that they can use for subsequent authenticated requests.
4. The API allows the user to _sign out_ which invalidates their token.
5. The API allows a signed-in user to user their tocken to create a new _check_, a task for the system to check that the given URL is _up_ or _down_. The user must be able to define what _up_ or _down_ is.
6. The API allows a signed-in user to edit or delete any of their checks. Limited to 5 checks.
7. In the background, workers perform all the _checks_ at the appropriate times, and send alerts to the users when a check changes its state from _up_ to _down_, or vice versa. Frequency once a minute.

#### Architecture

- SMSs will be send via Twilio API, without using a 3rd party library. Requests are made by hand (for teaching purposes)
- Persistence will be achieved by using filesystem as a key-value JSON docs.
