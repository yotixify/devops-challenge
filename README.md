# Sportradar DevOps Challenge

This repository has CI/CD workflows run in github actions.

## CI

A CI workflow consisting of the following steps runs whenever a pull request is created.
  - Unit Tests
  - Cloudformation Linting
  - Bridgecrew Scan

## CD

A CD workflow is run whenever a merge to `main` occurs. It will run the following steps:
  - Unit Tests
  - Cloudformation Linting
  - Bridgecrew Scanning
  - Deploy
