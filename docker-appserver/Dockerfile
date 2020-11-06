FROM tomcat:8-jdk8
CMD ["rm","/usr/local/tomcat/webapps/root/"]
COPY raisingthebar.war /usr/local/tomcat/webapps/ROOT.war
CMD ["catalina.sh","run"]
