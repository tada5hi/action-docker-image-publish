# action-docker-image-publish 🎍

This repository contains a GitHub action, to
**build**, **tag** and **push** docker images, 
under certain conditions.

## Usage

```yaml
uses: tada5hi/action-docker-image-publish@v3
with:
    # Name of Dockerfile
    # Default: Dockerfile
    dockerFileName: 'Dockerfile'

    # Relative path to DockerFile
    # Default: ''
    dockerFilePath: ''
    
    # Whether to create an image tag for a git tag
    # Default: true
    gitTag: 'true'

    # Prefix for matching git tags
    # Default: ''
    gitTagPrefix: ''

    # Default: ghcr.io
    registryHost: 'ghcr.io'
    
    # Default: github.actor
    registryUser: ${{ github.actor }}
    
    # Default: ${{ github.token }}
    registryPassword: ${{ github.token }}

    # Registry repository full name (e.g. project/repository)
    # Default: github.repository
    registryRepository: ${{ github.repository }}

    # Registry image tag (e.g. latest)
    # Default: 'latest'
    registryTag: 'latest'

    # Delete the built image at the end
    # Default: 'true'
    cleanup: 'true'
```
