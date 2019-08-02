[![Build Status](https://travis-ci.com/rwajon/sendit.svg?branch=develop)](https://travis-ci.com/rwajon/sendit)
[![Coverage Status](https://coveralls.io/repos/github/rwajon/sendit/badge.svg?branch=develop)](https://coveralls.io/github/rwajon/sendit?branch=develop)
<a href="https://codeclimate.com/github/rwajon/sendit/maintainability"><img src="https://api.codeclimate.com/v1/badges/bb0ad823d32c6fb7e947/maintainability" /></a>
<a href="https://codeclimate.com/github/rwajon/sendit/test_coverage"><img src="https://api.codeclimate.com/v1/badges/bb0ad823d32c6fb7e947/test_coverage" /></a>

# SendIT
[SendIT](https://rwajon.github.io/sendit/UI/) is a courier service that helps users deliver parcels to different destinations.
SendIT provides courier quotes based on weight categories.

## Website
[https://rwajon.github.io/sendit/UI/](https://rwajon.github.io/sendit/UI/)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
Prerequisites
```
Node 11.x
```
```
NPM 6.x
```

### Installing
After cloning this repo, cd into it and an type  `npm install` in the CLI to install all the required packages.
If you have Node.js and npm installed, you can start the app with this command `npm start`.

```
rwajon@kali:~/sendit# npm install
```

```
rwajon@kali:~/sendit# npm start
```

## Running the tests
Testing libraries used are ***Mocha*** and ***Chai***.
After cloning this repo, cd into it and an type  `npm run test` in the CLI

## Deployment
To deploy this project on heroku use the following commands:
```
git remote set-url heroku <repo git>
```
```
git push -u origin master
```

## Contributing
When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

## Versioning
For the versions available, see the [tags on this repository](https://github.com/rwajon/sendit/releases/tag/v1.0).

## Documentation
For the documentation, find it [here](https://rwajon-sendit.herokuapp.com/api/v1/docs)

## Authors
* **Rwabahizi Jonathan**

## License
This project is licensed under the MIT License.

## Acknowledgments
* Thanks to Olawale Aladeusi for his post on using PostgreSQL with NodeJS
* Olivier Esuka Muselemu
* Jean Luc Abayo