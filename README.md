# Sportradar DevOps Challenge

This repository has CI/CD workflows run in github actions.

## CI [![CI](https://github.com/yotixify/devops-challenge/actions/workflows/ci.yml/badge.svg)](https://github.com/yotixify/devops-challenge/actions/workflows/ci.yml)

A CI workflow consisting of the following steps runs whenever a pull request is created.
  - Unit Tests
  - Snyk Dependency vulnerability testing
  - Bridgecrew Scan

## CD [![Deploy](https://github.com/yotixify/devops-challenge/actions/workflows/cd.yml/badge.svg)](https://github.com/yotixify/devops-challenge/actions/workflows/cd.yml)

A CD workflow is run whenever a merge to `main` occurs. It will run the following steps:
  - Unit Tests
  - Snyk Dependency vulnerability testing
  - Bridgecrew Scanning
  - Deploy
