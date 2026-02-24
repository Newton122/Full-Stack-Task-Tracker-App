# Full-Stack-Task-Tracker-App

The Express/Mongo backend requires a couple of environment variables when deployed (Render, Heroku, etc.):

- `MONGODB_URL` – connection string for your MongoDB database
- `JWT_SECRET` – secret used for signing JSON Web Tokens

Make sure these are configured in your Render dashboard (or in a .env file for local development). The server logs an error and may crash if these are missing.

Routes are prefixed with `/api`:

```
POST /api/auth/register
POST /api/auth/login
GET  /api/todo/getToDo   (requires Authorization header)
POST /api/todo/saveToDo  (requires Authorization header)
PUT  /api/todo/updateToDo/:id  (requires Authorization header)
DELETE /api/todo/deleteToDo/:id (requires Authorization header)
```
