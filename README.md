# Articles API using NestJS with MySQL database

## Getting Started

### Installation

Install NestCLI
    
    sudo npm i -g @nestjs/cli

Clone the repository

    git clone https://gitlab.com/sumitpore/articles-api.git

Switch to the repo folder

    cd article-api
    
Install dependencies
    
    npm install

### Database

The project uses [Typeorm](http://typeorm.io/) with a MySQL database.

Copy Typeorm config example file for database settings.

    cp ormconfig.json.example ormconfig.json
    
Set mysql database settings in `ormconfig.json`.

    {
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "your-mysql-username",
      "password": "your-mysql-password",
      "database": "nestjsrealworld",
      "entities": ["dist/**/**.entity{.ts,.js}"],
      "synchronize": true
    }
    
Tables will be automatically created when application starts

### Start the Server
To start the server run command
    
    npm run-script start:dev

This will open the application on port `6000`. Visit `http://localhost:6000` to access the application.


## Authentication
 
This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token.

API returns the `Token` on successful login request. This token should be passed for all requests that need authorised access. To pass the token in request, send header `Authorization` with value `'Bearer TOKEN_OBTAINED_ON_LOGIN_REQUEST'`. Replace `TOKEN_OBTAINED_ON_LOGIN_REQUEST` with actual token.

## API Postman Collection
Download the [Postman Collection here](https://www.getpostman.com/collections/eb1fbb7f1d2a05dc1d0c) and import it into the Postman  to understand how data needs to be passed to the API.

## Possible Actions with API
Role | Method | Endpoint | Action
--- | --- | --- | ---
Guest | GET | /articles/:slug | Get Article by Slug. It will return Article object only if that article is published. If article is in pending state, it will throw 404.
Guest | GET | /articles | Get List of All Published Articles.
Guest | POST | /users | Register as Author or Publisher.
Guest | POST | /users/login | Login to the account.
Logged In User | GET | /user | Returns details of the account.
Logged In User | PUT | /user | Update details of the logged in user.
Logged In User | DELETE | /user | Logged in user can delete own account.
Author | POST | /articles | Create new article. The article is not published immediately. It is saved in pending state. Guests can not view this article until a publisher publishes the article. **In create article request author can mention desired publisher. When the request is submitted, that article appears under respective publisher's pending articles list. Publisher can then take action on it and publish it.**
Author | GET | /articles/:slug | Returns article details. It will return details of any published article and any pending article written by Author. 
Author | PUT | /articles/:slug | Update article written by logged in Author.
Author | DELETE | /articles/:slug | Delete Article written by logged in Author.
Author | GET | /articles/pending | Returns list of all pending (aka unpublished) articles written by logged in Author.
Publisher | POST | /articles/publish/:slug | Publishes the article pending for his/her approval.
Publisher | GET | /articles/pending | Returns List of all Pending Articles of logged in publisher.
Publisher | GET | /articles/:slug | Returns article details. It will return details of any published article and any pending article which belong to logged in Publisher. 



