# DockerRelease

This repository contains a GitHub action, to
`build`, `tag` and `push` docker images, under certain conditions.

## Usage

```yaml
uses: tada5hi/action-docker-release@master
with:
    # Default: ${{ github.token }}
    token: ''

    # Default: Dockerfile
    dockerFileName: ''

    # Default: .
    dockerFilePath: ''

    # Default: .
    packagePath: ''

    # Default: latest
    imageTag: ''

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
```
