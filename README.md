<p align="center">
    <img src=".github/assets/logo.svg" alt="action-docker-image-publish" width="120" height="120">
</p>

<h1 align="center">action-docker-image-publish</h1>

<p align="center">
    <b>Build, tag and push docker images, with the tags derived from the git ref.</b><br>
    A GitHub Action and CLI which clones the repository at a ref, builds the image once,<br>
    and pushes it under every tag that ref implies.
</p>

<p align="center">
    <a href="https://github.com/tada5hi/action-docker-image-publish/actions/workflows/main.yml"><img src="https://github.com/tada5hi/action-docker-image-publish/workflows/CI/badge.svg" alt="CI"></a>
    <a href="https://conventionalcommits.org"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white" alt="Conventional Commits"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
</p>

<p align="center">
    <a href="#usage"><b>Usage</b></a>
    ·
    <a href="#inputs">Inputs</a>
    ·
    <a href="#tagging">Tagging</a>
    ·
    <a href="#cli">CLI</a>
    ·
    <a href="#programmatic-api">API</a>
</p>

---

## How it works

The action derives the image tags from the git ref it is run for, so a workflow does not have to
compute them:

- **`refs/tags/v1.2.3`** → pushes `1.2.3` (the `v` is stripped), plus any explicit `registryTag`.
- **`refs/tags/some-package@v1.2.3`** with `gitTagPrefix: some-package` → pushes `1.2.3`, so monorepo tags work.
- **`refs/heads/master`** → pushes only the explicit `registryTag` values (default `latest`).

The image is built **once** under a local id derived from the ref, then tagged and pushed for each
resulting reference. A ref which has already been built during the same job is not rebuilt.

## Usage

```yaml
-   uses: tada5hi/action-docker-image-publish@v4
    with:
        registryTag: 'latest'
```

That is the whole configuration for the common case: every other input defaults to the right thing
from the workflow context.

> **`actions/checkout` is not required.** The action clones the repository at the ref it is running
> for into `.output` and builds from there, so it works on its own. Checking out first is harmless
> but does nothing for it.

Since **v4** this is a **composite** action rather than a Docker action, so it no longer builds a
container image of itself before doing any work. It runs directly on the runner, using the `docker`
and `git` CLIs that are already installed there.

## Recipes

### Publish `latest` on every push to master

```yaml
name: Publish

on:
    push:
        branches: [master]

permissions:
    contents: read
    packages: write

jobs:
    publish:
        runs-on: ubuntu-latest
        steps:
            -   uses: tada5hi/action-docker-image-publish@v4
```

Nothing else is needed: `registryHost` defaults to `ghcr.io`, the credentials default to
`github.actor` / `github.token`, and `registryTag` defaults to `latest`.

### Publish a version tag *and* move `latest`

```yaml
on:
    push:
        tags: ['v*']

jobs:
    publish:
        runs-on: ubuntu-latest
        steps:
            -   uses: tada5hi/action-docker-image-publish@v4
                with:
                    registryTag: 'latest'
```

For `refs/tags/v1.2.3` this pushes **both** `:1.2.3` (derived from the tag) and `:latest`. Leave
`registryTag` empty to push only `:1.2.3`.

### Publish several tags at once

```yaml
-   uses: tada5hi/action-docker-image-publish@v4
    with:
        registryTag: |
            latest
            stable
            1
```

`registryTag` and `buildArgs` are newline separated; blank lines and surrounding whitespace are
ignored.

### Monorepo: one image per package

Tags like `some-package@v1.2.3` are matched with `gitTagPrefix`, and the prefix is stripped from the
resulting image tag:

```yaml
-   uses: tada5hi/action-docker-image-publish@v4
    with:
        gitTagPrefix: 'some-package'
        dockerFilePath: 'packages/some-package'
        registryRepository: '${{ github.repository_owner }}/some-package'
```

`refs/tags/some-package@v1.2.3` → `ghcr.io/<owner>/some-package:1.2.3`. A tag which does not start
with `gitTagPrefix` is skipped, so each package's workflow only reacts to its own releases.

### A Dockerfile somewhere other than the root

```yaml
-   uses: tada5hi/action-docker-image-publish@v4
    with:
        dockerFilePath: 'services/api'
        dockerFileName: 'Dockerfile.production'
```

`dockerFilePath` is relative to the repository root and becomes the build context;
`dockerFileName` is resolved inside it.

### Build args

```yaml
-   uses: tada5hi/action-docker-image-publish@v4
    with:
        buildArgs: |
            NODE_VERSION=24
            BUILD_ENV=production
```

Each line becomes a `--build-arg`. Values are passed to `docker` as separate arguments without a
shell, so spaces and metacharacters need no quoting.

### Publish to Docker Hub instead of GHCR

```yaml
-   uses: tada5hi/action-docker-image-publish@v4
    with:
        registryHost: 'docker.io'
        registryUser: ${{ secrets.DOCKERHUB_USERNAME }}
        registryPassword: ${{ secrets.DOCKERHUB_TOKEN }}
        registryRepository: 'some-org/some-image'
```

### Publish by digest

A `registryTag` starting with `sha` is attached as a digest rather than a tag:

```yaml
-   uses: tada5hi/action-docker-image-publish@v4
    with:
        registryTag: 'sha256:${{ github.sha }}'
```

→ `ghcr.io/<owner>/<repo>@sha256:<sha>`

### Ignore git tags entirely

```yaml
-   uses: tada5hi/action-docker-image-publish@v4
    with:
        gitTag: 'false'
        registryTag: 'edge'
```

With `gitTag: 'false'` a tag ref no longer contributes an image tag, so only `registryTag` is used.

### Keep the built image for later steps

```yaml
-   uses: tada5hi/action-docker-image-publish@v4
    with:
        cleanup: 'false'

-   run: docker images
```

By default the locally built image is removed once every tag has been pushed.

### Clone a private repository

```yaml
-   uses: tada5hi/action-docker-image-publish@v4
    with:
        gitUser: ${{ github.actor }}
        gitPassword: ${{ secrets.SOME_PAT }}
```

Both default to `github.actor` / `github.token`, which is enough for the repository the workflow runs
in. Override them to clone with a PAT. The credentials are percent-encoded into the clone url, so
tokens containing `@`, `:` or `/` work.

### Reuse the runner's Node.js

```yaml
-   uses: actions/setup-node@v4
    with:
        node-version: 22

-   uses: tada5hi/action-docker-image-publish@v4
    with:
        node-version: ''
```

An empty `node-version` skips the action's own `setup-node` step.

## Inputs

| Input                | Description                                                       | Default                    |
|----------------------|-------------------------------------------------------------------|----------------------------|
| `dockerFileName`     | Name of the Dockerfile                                            | `Dockerfile`               |
| `dockerFilePath`     | Relative path to the Dockerfile                                   | `''`                       |
| `buildArgs`          | Additional build args (`KEY=VALUE`), one per line                 | `''`                       |
| `cleanup`            | Delete the built image at the end                                 | `true`                     |
| `gitTag`             | Create an image tag for a git tag                                 | `true`                     |
| `gitTagPrefix`       | Only match git tags with this prefix                              | `''`                       |
| `gitUser`            | User for cloning the repository                                   | `${{ github.actor }}`      |
| `gitPassword`        | Password/token for cloning the repository                         | `${{ github.token }}`      |
| `registryHost`       | Registry host                                                     | `ghcr.io`                  |
| `registryUser`       | Registry user                                                     | `${{ github.actor }}`      |
| `registryPassword`   | Registry password                                                 | `${{ github.token }}`      |
| `registryRepository` | Registry repository full name (e.g. `project/repository`)         | `${{ github.repository }}` |
| `registryTag`        | Registry image tags (e.g. `latest`), one per line                 | `latest`                   |
| `node-version`       | Node.js version to set up; empty string uses the existing install | `24`                       |
| `token`              | Deprecated and unused                                             | `''`                       |

## Tagging

A tag is normalised before it becomes an image tag:

| Git ref                              | `gitTagPrefix` | Image tag |
|--------------------------------------|----------------|-----------|
| `refs/tags/v1.2.3`                   | `''`           | `1.2.3`   |
| `refs/tags/1.2.3`                    | `''`           | `1.2.3`   |
| `refs/tags/some-package@1.2.3`       | `some-package` | `1.2.3`   |
| `refs/tags/some-package@v1.2.3`      | `some-package` | `1.2.3`   |
| `refs/tags/vNext`                    | `''`           | `vNext`   |

The `v` prefix is only stripped when what follows is a valid semver version, so a non-version tag
like `vNext` is left alone. A tag which does not start with `gitTagPrefix` is skipped entirely.

A `registryTag` starting with `sha` is attached as a digest (`image@sha256:...`) instead of a tag.

## CLI

The same logic is available as a CLI, so it can run outside GitHub Actions:

```bash
npx action-docker-image-publish \
    --ref refs/tags/v1.2.3 \
    --repository tada5hi/some-repo \
    --registryHost ghcr.io \
    --registryUser tada5hi \
    --registryPassword "$TOKEN" \
    --registryRepository tada5hi/some-repo \
    --registryTag latest
```

Every flag defaults to the corresponding `GITHUB_*` environment variable (`GITHUB_REF`,
`GITHUB_REPOSITORY`, `GITHUB_ACTOR`, `GITHUB_TOKEN`, …), so inside a workflow no flags are required.
Boolean flags are negated with `--no-` (e.g. `--no-cleanup`, `--no-gitTag`).

Run `action-docker-image-publish --help` for the full list.

## Programmatic API

The package is also a library. Every side effect sits behind an interface with an in-memory
implementation, so `publish()` runs without a docker daemon:

```typescript
import {
    DockerCLIClient,
    GitCLIClient,
    ConsolaLogger,
    NodeCommandRunner,
    publish,
} from 'action-docker-image-publish';

const runner = new NodeCommandRunner();

const result = await publish(options, {
    docker: new DockerCLIClient(runner),
    git: new GitCLIClient(runner),
    logger: new ConsolaLogger(),
});

console.log(result.images); // ['ghcr.io/tada5hi/some-repo:1.2.3']
```

Swap in `MemoryDockerClient` / `MemoryGitClient` / `NoopLogger` to exercise it in tests.

## Requirements

- **Node.js** >= 22.0.0
- The `docker` and `git` CLIs on `PATH` (both are preinstalled on GitHub runners)

## License

Made with 💚

Published under [MIT License](./LICENSE).
