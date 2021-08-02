# holiday-extras-developer-api-task
## Installation

Use [HomeBrew](https://brew.sh/) to install [Node.js](https://nodejs.dev/).

```bash
brew install node
```
Install Dependencies.

```bash
npm install
npm i
```

## Lint

```bash
npm run lint
```
## Test

```bash
npm test
npm t
```

## Static Analysis
See report [here](https://sonarcloud.io/dashboard?id=ClaireH4721_holiday-extras-developer-api-task)
You can run sonarqube static analysis locally using the following steps:
* Run the following command:
```bash
npm run sonar
```
* Navigate to [localhost:9000/](http://localhost:9000/)
* Log in using admin details: Login: Admin, Password: Admin
* Navigate to your account > security
* Generate a new token
* Copy token and replace 'YOUR_KEY_GOES_HERE' in sonar-project.js
* Run the following command again:
```bash
npm run sonar
```

## Usage

```bash
npm start
```
### Curl
You can use the following curl commands to call the 'Users' API
##### Create New User
You can create a new user with the following command
```bash
curl --location --request POST 'http://localhost:5000/api/users/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "testuser@test.com",
    "givenName": "test",
    "familyName": "user"
}'
```
##### Read All Users
You can read all users with the following command
```bash
curl --location --request GET 'http://localhost:5000/api/users/'
```
##### Update User
You can update a user with the following command
```bash
curl --location --request PUT 'http://localhost:5000/api/users/{{id}} \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "testuser@test.com",
    "givenName": "test",
    "familyName": "user"
}'
```
##### Delete User
You can delete a user with the following command
```bash
curl --location --request DELETE 'http://localhost:5000/api/users/{{id}}'
```
### Postman
You can import the following postman collection and update the id variable to be the id you wish to update or delete.
[Postman Collection](Users.postman_collection.json)

### UI
You can access a local custom front end built to consume this api by following the README.md instructions [HERE](https://github.com/ClaireH4721/holiday-extras-developer-api-task-ui/blob/main/README.md)