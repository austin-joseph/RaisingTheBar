FROM node:15.1 as build-client
WORKDIR /usr/src/app
COPY client/package.json client/yarn.lock ./
RUN yarn
COPY client/public/ ./public
COPY client/src/ ./src
RUN yarn build

FROM maven:3.6.3-adoptopenjdk-8 as build-server
WORKDIR /usr/src/app
COPY src/ ./src
COPY pom.xml ./
COPY --from=build-client /usr/src/app/build/ ./src/main/resources/static/
RUN mvn package

FROM tomcat:8-jdk8
CMD ["rm","/usr/local/tomcat/webapps/root/"]
COPY --from=build-server /usr/src/app/target/raisingthebar.war /usr/local/tomcat/webapps/ROOT.war
CMD ["catalina.sh","run"]
