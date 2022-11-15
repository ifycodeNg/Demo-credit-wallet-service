## Demo Credit Wallet Service


## Database Management

- [mysql](https://www.mysql.com/)
- [knex](http://knexjs.org/) query builder

## ER Diagram of the database design

![ER Diagram for DB](/mock/databaseDesign.png)


## Folder Structure
```
├── config                          # env vars etc
|── bin              
    ├── www.js                      # server entry file
├── controller                      # Express route controllers for all the endpoints of the app
├── migrations                      # migration files 
├── mock                            # mock image
├── model                           # database adapter 
├── Routes                          # route controllers for all the endpoints of the app 
├── Services                        # All the business logic is here 
├── README.md
├── app.js                          # server file
├── knexfile.js                     # Knex config file
```