# Sportradar DevOps Challenge

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This exercise is in-lieu of a traditional whiteboard/algorithm style type interview. Not only will this exercise serve as our initial evaluation of your skills, it will also be a center-piece to further conversations we will have with you. We respect your time and the fact that you have a life and possibly a day-job, so put in as much time as you feel will be a fair representation of your skills.  However, this exercise is purposefully open ended and can be an opportunity for you to show off. Hopefully this is something you can have fun with.

While the approach you take to meeting the above objectives is up to you, here are a couple of things we will expect:

* **Continuous Integration** - Using free Gitlab actions (or another tool), implement continuous integration on each commit. Every time a new commit is added to the repo (feature branch or master), a pipeline should be kicked off to run linting and tests.
* **Continuous Delivery** - Using the same tool as above, include a step to deploy the app when merge requests/pull requests are merged to master. Since we won't be actually be deploying, use a simple command to output a message indicating the app is deploying, ie `echo "deploy prod"`.
* Should be able to run the pipelines and view results in CI/CD tool
* Should be able to also run tests fully locally (this currently works)
* Create a new README with details on how the CI/CD process works.

**Bonus**
* Add more quality gates to pipeline (code quality tool, mutant testing tools, dependency vulnerability tools)
* Update the `serverless.yml` file to deploy this function as a lambda.
* Update the `serverless.yml` file to hypothetically create an AWS db cluster. Expose the connection string and use it in the lambda created above.

Please do not create a pull-request against this repository; you should create your own project/repository.  Also--while not required--it would be nice to have access to your commit history (i.e. don't squash) through github. However if you are not comfortable with this for any reason, submitting a zip file with the contents of the project is acceptable as well.

This project is written in NodeJs 14. You'll need to install NodeJs 14 locally to run it. Here are the commands after installing NodeJs. You can see this all in the package.json file.

- `npm install` will install the node module dependencies
- `npm run start-test-db` will create local containerized postgres to run tests locally
- `npm run migrate` will run migrations on local db
- `npm test` will run tests locally
