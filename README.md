
# Raising The Bar

Raising The Bar is bartop simulator which allows anyone to improve their bartending skills right at home

## Technology Stack 
```
React
Spring Boot/MVC
MongoDB

Maven

```
## SETUP
The application comes with a prebuild Dockerfile and scripts to setup the database, and app server for a testing enviornment.
```
1. docker network create raisingthebar
2. /docker-database/build.sh
3. /docker-database/start.sh
4. /build.sh
5. Copy raisingthebar-"version".war to /docker-appserver
6. Rename raisingthebar-"version".war to raisingthebar.war
7. /docker-appserver/build.sh
8. /docker-appserver/start.sh
```

## Other
Currently appserver defaults to port 8080 and puts the applications at :url:/raisingthebar

Working on javacode during developmetn is made much easier by changing "<packaging>war</packaging>" in pom.xml to <packaging>jar</packaging> 

## Current Maintainer

* **[Austin Joseph](https://github.com/austin-joseph)**

## Original Authors

* **[Austin Joseph](https://github.com/austin-joseph)**
* **[Anil Ramsoomye](https://github.com/AnilRamsoomye)**
* **[Edmund Liang](https://github.com/edmundliang)**
* **[Kyung Chul Cho](https://github.com/jkc7848)**
