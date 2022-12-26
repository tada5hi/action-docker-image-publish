import { GithubOwnerType } from '../constants';
export type GithubRepository = {
    owner: string;
    ownerType: `${GithubOwnerType}`;
    repo: string;
    description: string;
    branch: string;
};
export type GithubRepositoryMinimal = Pick<GithubRepository, 'owner' | 'repo'> & Partial<GithubRepository>;
