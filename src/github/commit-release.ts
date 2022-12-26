import semver from 'semver';
import { isObject } from 'smob';
import { REGISTRY_GITHUB } from '../contants';
import { Options } from '../type';
import { withoutLeadingSlash } from '../utils';
import { VersionFile } from '../version-file';
import { GithubOwnerType } from './constants';
import { useGitHubClient } from './singleton';
import { GithubRepositoryEntity } from './type';

type Context = {
    options: Options,

    repository: GithubRepositoryEntity,

    versionFile?: VersionFile
};

export async function findGitHubCommitOfLatestReleaseByPackage(
    ctx: Context,
) : Promise<string | undefined> {
    const client = useGitHubClient();

    let createdAt : string | undefined;

    try {
        switch (ctx.repository.ownerType) {
            case GithubOwnerType.ORGANISATION: {
                const { data } = await client.rest.packages.getPackageForOrganization({
                    package_type: 'container',
                    package_name: ctx.options.registryRepository,
                    org: ctx.repository.owner,
                });

                createdAt = data.created_at;

                break;
            }
            default: {
                const { data } = await client.rest.packages.getPackageForUser({
                    package_type: 'container',
                    package_name: ctx.options.registryRepository,
                    username: ctx.repository.owner,
                });

                createdAt = data.created_at;
            }
        }
    } catch (e: any) {
        if (isObject(e) && e.status === 404) {
            return undefined;
        }

        throw e;
    }

    if (createdAt) {
        const path = withoutLeadingSlash(ctx.options.path);
        const { data: commits } = await useGitHubClient()
            .rest.repos.listCommits({
                repo: ctx.repository.repo,
                owner: ctx.repository.owner,
                since: createdAt,
                until: createdAt,
                per_page: 1,
                ...(path.length !== 0 ? { path } : {}),
            });

        if (commits.length > 0) {
            return commits[0].sha;
        }
    }

    return undefined;
}

export async function findGitHubCommitOfLatestReleaseByTag(
    ctx: Context & { page: number },
) : Promise<string | undefined> {
    const client = useGitHubClient();
    const { data: tags } = await client.rest.repos.listTags({
        owner: ctx.repository.owner,
        repo: ctx.repository.repo,
        per_page: 30,
        page: ctx.page,
    });

    if (tags.length > 0) {
        let commitSha : string | undefined;
        for (let i = 0; i < tags.length; i++) {
            let { name } = tags[i];
            if (name.startsWith('v')) {
                name = name.substring(1);
            }

            if (semver.valid(name)) {
                commitSha = tags[i].commit.sha;
                break;
            }

            if (
                ctx.versionFile &&
                ctx.versionFile.name &&
                tags[i].name.startsWith(ctx.versionFile.name)
            ) {
                commitSha = tags[i].commit.sha;
            }
        }

        if (commitSha) {
            return commitSha;
        }
    }

    if (
        tags.length === 30 &&
        ctx.page < 3
    ) {
        ctx.page++;

        return findGitHubCommitOfLatestReleaseByTag(ctx);
    }

    return undefined;
}

export async function findGitHubCommitOfLatestRelease(
    ctx: Context,
) : Promise<string | undefined> {
    if (ctx.options.registryHost === REGISTRY_GITHUB) {
        return findGitHubCommitOfLatestReleaseByPackage(ctx);
    }

    return findGitHubCommitOfLatestReleaseByTag({
        ...ctx,
        page: 1,
    });
}
