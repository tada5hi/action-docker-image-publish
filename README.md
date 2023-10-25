# action-docker-image-publish 🎍

This repository contains a GitHub action, to
**build**, **tag** and **push** docker images, under certain conditions.

## Usage

```yaml
uses: tada5hi/action-docker-image-publish@master
with:
    # Name of Dockerfile
    # Default: Dockerfile
    dockerFileName: ''

    # Relative path to DockerFile
    # Default: ''
    dockerFilePath: ''
    
    # Whether to create an image tag for a git tag
    # Default: true
    gitTag: true

    # Prefix for matching git tags
    # Default: ''
    gitTagPrefix: ''

    # Default: ghcr.io
    registryHost: ''
    
    # Default: github.actor
    registryUser: ''
    
    # Default: ${{ github.token }}
    registryPassword: ''

    # Default: github.{user,org}
    registryProject: ''

    # Default: github.repo
    registryRepository: ''

    # Registry image tag (e.g. latest)
    # Default: 'latest'
    registryTag: ''
    
    # Token to access GitHub API
    # Default: ${{ github.token }}
    token: ''
```
