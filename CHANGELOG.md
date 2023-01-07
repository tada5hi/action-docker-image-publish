## [1.7.1](https://github.com/Tada5hi/action-docker-release/compare/v1.7.0...v1.7.1) (2023-01-07)


### Bug Fixes

* docker image-id building ([3138b41](https://github.com/Tada5hi/action-docker-release/commit/3138b41411bb0c40609fc1cef13d2fba450272f4))

# [1.7.0](https://github.com/Tada5hi/action-docker-release/compare/v1.6.5...v1.7.0) (2023-01-07)


### Features

* add cache support ([6fd29a9](https://github.com/Tada5hi/action-docker-release/commit/6fd29a982bfb531f71878e2e0b6603e8de7621e0))

## [1.6.5](https://github.com/Tada5hi/action-docker-release/compare/v1.6.4...v1.6.5) (2023-01-04)


### Bug Fixes

* **deps:** bump json5 from 1.0.1 to 1.0.2 ([b4194e3](https://github.com/Tada5hi/action-docker-release/commit/b4194e3edc4fad0c2b41cba6ea2730e2a31206ec))

## [1.6.4](https://github.com/Tada5hi/action-docker-release/compare/v1.6.3...v1.6.4) (2022-12-26)


### Bug Fixes

* move type to other directory ([c6d5875](https://github.com/Tada5hi/action-docker-release/commit/c6d5875613132515a70638f6b254b824a8e5f50c))

## [1.6.3](https://github.com/Tada5hi/action-docker-release/compare/v1.6.2...v1.6.3) (2022-12-26)


### Bug Fixes

* enhance ref-name trimming for monorepo tags ([bf783e4](https://github.com/Tada5hi/action-docker-release/commit/bf783e4f0ea6eaa986b45007940a1d8bf59c54ec))

## [1.6.2](https://github.com/Tada5hi/action-docker-release/compare/v1.6.1...v1.6.2) (2022-12-26)


### Bug Fixes

* trim ref name for docker image ([f2c7861](https://github.com/Tada5hi/action-docker-release/commit/f2c7861d6453119a96115bdfd3f6fe5efd2a06d8))

## [1.6.1](https://github.com/Tada5hi/action-docker-release/compare/v1.6.0...v1.6.1) (2022-12-26)


### Bug Fixes

* ignores option building ([9b9fd67](https://github.com/Tada5hi/action-docker-release/commit/9b9fd673aa5222d0ca19d16515e813ac449b8e24))

# [1.6.0](https://github.com/Tada5hi/action-docker-release/compare/v1.5.1...v1.6.0) (2022-12-26)


### Features

* better control for git tag trigger ([2d80473](https://github.com/Tada5hi/action-docker-release/commit/2d8047392b5a113607678212a8777c592975352a))

## [1.5.1](https://github.com/Tada5hi/action-docker-release/compare/v1.5.0...v1.5.1) (2022-12-26)


### Bug Fixes

* github input parsing ([5713c12](https://github.com/Tada5hi/action-docker-release/commit/5713c12b8f573ed422781796fc1d1d6b52045e01))

# [1.5.0](https://github.com/Tada5hi/action-docker-release/compare/v1.4.1...v1.5.0) (2022-12-26)


### Features

* parse git ref for better decision making ([b446fa6](https://github.com/Tada5hi/action-docker-release/commit/b446fa6bd167e56343a5784c5976effe41341ab6))

## [1.4.1](https://github.com/Tada5hi/action-docker-release/compare/v1.4.0...v1.4.1) (2022-12-26)


### Bug Fixes

* add precondition for commit range check ([7a839ff](https://github.com/Tada5hi/action-docker-release/commit/7a839ffe3efde3479fd9196703e94e65552c32bb))
* transform repository name to lower case ([c380d0d](https://github.com/Tada5hi/action-docker-release/commit/c380d0d2e445abea615fbed9d79ea560d0cf4da3))

# [1.4.0](https://github.com/Tada5hi/action-docker-release/compare/v1.3.0...v1.4.0) (2022-12-26)


### Features

* allow disabling version file ([3f137e8](https://github.com/Tada5hi/action-docker-release/commit/3f137e8279dba7ec899eb0b185e46956ac659477))

# [1.3.0](https://github.com/Tada5hi/action-docker-release/compare/v1.2.0...v1.3.0) (2022-12-26)


### Bug Fixes

* better commit detection for related package release ([ac6d43c](https://github.com/Tada5hi/action-docker-release/commit/ac6d43c6c4a68ffb63dabbaeb57010270c435687))
* ctx options ref ([896c145](https://github.com/Tada5hi/action-docker-release/commit/896c14555d341596e35c735ec1366faac14145d1))
* extending github repository ([7e0c8fd](https://github.com/Tada5hi/action-docker-release/commit/7e0c8fda8dbd3f20241ad85d7b82d05157eb8395))
* git tree path normalization ([3479c51](https://github.com/Tada5hi/action-docker-release/commit/3479c516dcf3b9d6f58e856d909b6b1c77ac7b71))
* prevent to set a slash for empty string ([5d49278](https://github.com/Tada5hi/action-docker-release/commit/5d492780ac894206c07c96ba9bc6dac547871fe3))


### Features

* only check for changes if path or ignores option is set ([802d06d](https://github.com/Tada5hi/action-docker-release/commit/802d06dc0576b810689239495a4bbf73b82cb217))

# [1.2.0](https://github.com/Tada5hi/action-docker-release/compare/v1.1.2...v1.2.0) (2022-12-25)


### Features

* add ignore otpion for change detection ([f4c36eb](https://github.com/Tada5hi/action-docker-release/commit/f4c36eba052bbca6e0010f1c0533eec20a115ca2))

## [1.1.2](https://github.com/Tada5hi/action-docker-release/compare/v1.1.1...v1.1.2) (2022-12-25)


### Bug Fixes

* removing same image tag ([7806213](https://github.com/Tada5hi/action-docker-release/commit/78062132b55e5d1319b0f9fb7bc22d3c4604f01e))

## [1.1.1](https://github.com/Tada5hi/action-docker-release/compare/v1.1.0...v1.1.1) (2022-12-25)


### Bug Fixes

* enhance logging ([cc06215](https://github.com/Tada5hi/action-docker-release/commit/cc06215158388c19cc6dc097266210678ab29a37))

# [1.1.0](https://github.com/Tada5hi/action-docker-js/compare/v1.0.2...v1.1.0) (2022-12-25)


### Features

* use lerna.json as fallback + docker logout on finish ([2d080ba](https://github.com/Tada5hi/action-docker-js/commit/2d080baae952529ad7b328991a05a9e21fe5394f))

## [1.0.2](https://github.com/Tada5hi/action-docker-js/compare/v1.0.1...v1.0.2) (2022-12-25)


### Bug Fixes

* github url building ([dedfae1](https://github.com/Tada5hi/action-docker-js/commit/dedfae16d6ec4f730690a36f885118600b6a13e3))
* package check ([a5239cd](https://github.com/Tada5hi/action-docker-js/commit/a5239cdc016a9eeb3fa8ca208ad0bebc55016cdc))

## [1.0.1](https://github.com/Tada5hi/action-docker-js/compare/v1.0.0...v1.0.1) (2022-12-25)


### Bug Fixes

* removed dockerode library ([1e71cca](https://github.com/Tada5hi/action-docker-js/commit/1e71cca2b7eeb9cfddcc70fab1b0f6da1dc898d8))

# 1.0.0 (2022-12-23)


### Bug Fixes

* better check if package changed ([c565650](https://github.com/Tada5hi/action-docker-js/commit/c565650dd032f8efca7de72065797022b398a586))
