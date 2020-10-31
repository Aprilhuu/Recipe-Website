# Flask Backend
This is a small file transfer backend built in Flask. For now, it is responsible for reading 
specific recipe JSON data and transfer it to frontend for rendering. In future releases, it 
will communicate with MongoDB to fetch a variety of data.

## Build & Start
`Dockerfile` located in the `flask-api` directory of this project.
To build the image, please make sure you are in `flask-api`. Then run:

`docker build -t team3backend:latest .`

To start a container, run:

`docker run --rm -p 5000:5000 team3backend`

After quitting the container, make sure you stop it by running `docker stop` followed by its container ID.
