## Demo Credit Wallet Service


## Database Management

- [mysql](https://www.mysql.com/)
- [knex](http://knexjs.org/) query builder

## ER Diagram of the database design

![ER Diagram for DB](/mock/databaseDesign.png)

## Naming convention used in application

- Database variable and 3rd party parameters e.g in snake_case
- Application variable in camalCase

## Payment gateway used 
- [flutterwave](https://flutterwave.com/ng/)


## Folder Structure
```
├── config                          # env vars etc
|── bin              
    ├── www.js                      # server entry file
├── controller                      # Express route controllers for all the endpoints of the app
├── migrations                      # migration files 
├── mock                            # mock image
├── model                           # database adapter 
├── routes                          # route controllers for all the endpoints of the app 
├── services                        # utility file
├── test                            # test file
├── README.md
├── app.js                          # server file
├── knexfile.js                     # Knex config file
```
## Backend
- [Nginx](https://www.nginx.com/) used as reverse proxy
