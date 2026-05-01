# Vue Blog

Simple blog app using Sails.js + Vue 2 + PostgreSQL.

## Stack

* Node used - ^24.12
* Sails.js
* Vue 2 (no build step, using http-vue-loader)
* EJS
* PostgreSQL

## Features

* signup / login
* password reset
* posts (create, edit, delete)
* comments
* pagination

First 10 posts are rendered on server, others are loaded with Vue.

## Setup
```bash
git clone https://github.com/ornsteindss/vue-blog.git
cd vue-blog
npm install

createdb blogvue

cp .env.example .env

npm run dev
```
Open http://localhost:1337

## API

/auth/signup
/auth/login
/api/posts
/api/comments

## Structure

server/ — backend
assets/ — vue
views/ — ejs

## Notes

* JWT is stored in cookies
* password reset link is printed in console in dev using ethereal test account
* posts use soft delete
