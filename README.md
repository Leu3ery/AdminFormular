# Admin Panel for quest rooms

## Environment Variables

Create a file named `.env` in the **root** of your project (alongside `package.json` and `swagger.yaml`) with the following contents:

```ini
PORT=8000
JWT_SECRET_ADMIN=jwt_secret
PASSWORD_SALT=4
SUPERADMIN_DATA={ "firstName":"Super", "lastName":"Admin", "username":"superadmin", "password":"superadmin", "isSuperAdmin":true}
```

# Installation

1. Clone the repository:

```
git clone https://github.com/Leu3ery/AdminFormular.git
cd your-repo
```

2. Install dependencies:

```
npm install
```

# Startup

From the project root:

```
cd src
mkdir public
node server.js
```

The server will start on http://localhost:8000 by default.

# API Documentation

All API endpoints, schemas, and auth settings are defined in the swagger.yaml file at the project root. To view:

1. Open your preferred Swagger/OpenAPI viewer (e.g. Swagger UI).

2. Load swagger.yaml from the project root.