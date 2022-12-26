import { GithubOwnerType } from './constants';

export type GithubRepositoryEntity = {
    owner: string,
    ownerType: `${GithubOwnerType}`,
    repo: string,
    description: string,
    branch: string,
};

export type GithubRepositoryEntityMinimal = Pick<
GithubRepositoryEntity,
'owner' |
'repo'
> & Partial<GithubRepositoryEntity>;
