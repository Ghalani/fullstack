# README
### Ruby version

Ruby 2.2.4

### System dependencies

Rails 4.2.5.1

PostgreSQL

### Configuration
You'll need to set 2 environment variables to your computer

For use PG username, replace "YOUR_USERNAME" with yours
```sh
echo 'export MESTPANAPI_DB_USERNAME= YOUR_USERNAME' >> ~/.bashrc
```

for your PG password, replace "YOUR_PASSWORD" with yours.
```sh
echo 'export MESTPANAPI_DB_PASSWORD= YOUR_PASSWORD' >> ~/.bashrc
```
### Database creation
```sh
rake db:create
```

### Database initialization
```sh
rake db:migrate
```

### To modify the home page

You need to work with only 2 files:
```sh
app/views/home/index.html.erb and

app/assets/stylesheets/home.scss
```

### How to run the test suite

### Services (job queues, cache servers, search engines, etc.)

### Deployment instructions
Frontend work should be done and pushed to the "frontend" branch.

To change branch
```sh
git checkout frontend
```
To push
```sh
git push origin frontend
```
