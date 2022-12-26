import { GithubOwnerType } from './constants';
import { useGitHubClient } from './singleton';
import { GithubRepositoryEntity, GithubRepositoryEntityMinimal } from './type';

export async function extendGitHubRepositoryEntity(
    entity: GithubRepositoryEntityMinimal,
) : Promise<GithubRepositoryEntity> {
    const { data } = await useGitHubClient()
        .rest.repos.get({
            repo: this.repo,
            owner: this.owner,
        });

    return {
        ...entity,
        ownerType: data.owner.type === 'User' ?
            GithubOwnerType.USER :
            GithubOwnerType.ORGANISATION,
        description: data.description,
        branch: data.default_branch,
    };
}
