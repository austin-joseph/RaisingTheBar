# Raising The Bar

Raising The Bar is bartop simulator which allows anyone to improve their bartending skills right at home.

## Technology Stack 
```
React(React Router, Material UI, Bootstap)
Spring Boot/MVC
MongoDB
Tomcat 8
```
## SETUP
Raising The Bar comes with a Dockerfile and scripts to run the application server. 
To setup the enviorment for testing, change the "homepage" field in the client/package.json file from "/raisingthebar" to "/"
Make sure you change your database configuarion from the default raisingthebar-database to whatever your database location might be.
```
1. docker network create raisingthebar
2. ./docker-database/build.sh
3. ./docker-database/start.sh
4. ./build.sh
5. ./build.sh
6. ./start.sh
```

## Primary Developer

* **[Austin Joseph](https://github.com/austin-joseph)**

## Original Authors

* **[Austin Joseph](https://github.com/austin-joseph)**
* **[Anil Ramsoomye](https://github.com/AnilRamsoomye)**
* **[Edmund Liang](https://github.com/edmundliang)**
* **[Kyung Chul Cho](https://github.com/jkc7848)**
