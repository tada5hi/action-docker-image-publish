# DockerRelease 🎍

This repository contains a GitHub action, to
`build`, `tag` and `push` docker images, under certain conditions.

## Usage

```yaml
uses: tada5hi/action-docker-release@master
with:
    # Name of Dockerfile
    # Default: Dockerfile
    dockerFileName: ''

    # Relative path to DockerFile
    # Default: ''
    dockerFilePath: ''

    # Prefix for matching git tags
    # Default: ''
    gitTagPrefix: ''

    # Glob pattern to ignore files & directories
    # Default: ''
    ignores: ''

    # Relative path to check for changes
    # Default: ''
    path: ''

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
    # Default: ''
    registryTag: ''
    
    # Token to access GitHub API
    # Default: ${{ github.token }}
    token: ''
```
