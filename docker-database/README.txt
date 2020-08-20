Fairly simple

Its mongodb running in a container.

The most important part is that if you want to be able to connect from something outside the docker network you have to open a port 

Setup Steps:

1. docker network create raisingthebar
2. (Optional) add -p 27017:27017 to run config