# Chef Co-Pilot

Group 3 - Quaranteam

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## Backend
First make sure you have docker running on your computer. Then run the following commands:

```bash
cd flask-api
docker build -t team3backend:latest .
docker run --rm -p 5000:5000 team3backend
```

If successful, a Flask backend is now running on your localhost:5000. Please make sure you have your 
Flask backend running before starting your frontend code.

After quitting the container, make sure you stop it by running `docker stop` followed by its container ID.


## Frontend
### Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

### Provided Scripts

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Add the route

so the route register will be in the file `/config/config.js` add the json in the route attribute

### Add new page

all the page will be in the `/src/page` folder, you can copy the existing folder to make as a template

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code with Jest

```bash
npm run test:jest
```

### Test python backend API

since the backend and frontend are in the same folder the pytest will scan entire folder

so I move the test in the flask-api folder to reduce the overhead. Use following command to run the test:

```
cd flask-api
python -m pytest -s
```

## More

To install the nodejs follow the [link](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04#Installing%20Using%20a%20PPA)

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).
