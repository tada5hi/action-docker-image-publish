export type GithubRef = {
    type: 'branch' | 'tag' | 'pull';
    value: string;
};
