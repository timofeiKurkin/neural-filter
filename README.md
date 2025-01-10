## Introduce

This is the *frontend* and *backend* part of the diploma project **neural-filter**. This project demonstrates how neural networks can be applied to ensure information security. In this project, a neural network scans network traffic and looks for anomalies. You can train a neural network on your own dataset and achieve interesting results.

You can get more details in the [`diploma`](https://disk.yandex.ru/i/GaerzbprvIXZhw).

### Links
- [Frontend part]()
- [Backend part]()
- [Behance case](https://www.behance.net/gallery/201619595/Neural-Filter)
- [The written part of the diploma](https://disk.yandex.ru/i/GaerzbprvIXZhw)

![Preview](./neural-filter-frontend/app-photos/preview.png)

## Technologies

### Frontend
The **frontend part** of the application was developed using:
- [Next.JS v14](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/docs/intro)
- [Redux-Toolkit](https://redux-toolkit.js.org/)
- [React-Dropzone](https://react-dropzone.js.org/)
- [Motion](https://motion.dev/docs)

### Backend
The **backend part** of the application was developed using:
- [Django v.4.2](https://docs.djangoproject.com/en/4.2/)
- [Tensorflow v.2.16.1](https://www.tensorflow.org/)
- [Numpy v.1.26.4](https://numpy.org/)
- [Pandas v.2.2.1](https://pandas.pydata.org/)
- [Scikit-learn v.1.4.1](https://scikit-learn.org/stable/)
- [Matplotlib v.3.8.3](https://matplotlib.org/)
- [Keras v.3.2.1](https://keras.io/)
- [Psycopg v.3.1.18](https://www.psycopg.org/)
- [PyJWT v.2.8.0](https://pyjwt.readthedocs.io/en/stable/)
- [PostgreSQL:latest in the Docker](https://hub.docker.com/_/postgres)

**Note:** The backend part works **only on Linux**. There's no adaptation for Windows systems.

## Getting Started

### Frontend
After cloning the project from GitHub, install the necessary packages:

```bash
npm i
npm audit fix # you might need to run this after installing
```

Build the application:

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

Start the application:

```bash
npm run start
# or
yarn start
# or
pnpm start
# or
bun start
```

Open [http://localhost:3020](http://localhost:3020) in your browser to view the application. **Make sure that the backend part has already been started**. The app cannot function without the backend.

### Backend
First, create a Python virtual environment and activate it:

```bash
python3 -m venv venv
source venv/bin/activate
```

Then, install all the required packages from the `requirements.txt` file:

```bash
pip install -r requirements.txt
```

Configure the `.env` file in the root directory (above the frontend and backend folders) with PostgreSQL authentication settings:

```.env
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=postgres_password
POSTGRES_DB=postgres_db
```

Also, set the following lines to create a **superuser**:

```.env
SUPERUSER_NAME=admin
SUPERUSER_EMAIL=admin@gmail.com
SUPERUSER_PASSWORD=admin_password
```

You can modify the `docker-compose.yml` file according to your needs.

Run the project with the command:

```bash
python manage.py runserver 8080
```

The application will be available at [http://localhost:8080](http://localhost:8080).

## Application Pages

### 1. Authorization
The user must log in first. There is no registration page, so accounts must be pre-created when starting the *backend part*. Authorization is handled via a *JWT* token. The user receives a refresh token, which the server verifies.

![Login page](./neural-filter-frontend/app-photos/login.png)

### 2. Main Page
This introduction page provides key information about the application.

![Main Page](./neural-filter-frontend/app-photos/introduction.png)

### 3. All Traffic
This page allows users to monitor internet traffic in real time using WireShark. The user can select the desired network interface.
This page works via WebSocket. The server scans network traffic with Scapy and sends each network packet to the client.

![Page](./neural-filter-frontend/app-photos/all-traffic.png)

### 4. Network Anomalies
This page displays anomalies detected by the neural network. If no anomalies are found, a success status is shown.
The neural network operates on this page. Users can scan the current network interface only after starting the neural network at [http://localhost:8080/education-ai](http://localhost:8080/education-ai).

![Page](./neural-filter-frontend/app-photos/network-anomalies.png)

### 5. Education AI
On this page, users can train the neural network and monitor training metrics. Datasets with a maximum size of 1GB can be uploaded for training.
**Warning:** Use only `.pcap` traffic files.
The uploaded `.pcap` files are processed, generating a dataset for neural network model training. Up to 7 datasets can be used, but only one neural network model is employed.
The neural network's operation status is displayed in a dedicated block. The client and server communicate via WebSocket, enabling real-time monitoring of both the operation status and server connection.

![Page](./neural-filter-frontend/app-photos/education-ai.png)

### 6. Settings
This page allows users to change their password.

![Page](./neural-filter-frontend/app-photos/settings.png)
