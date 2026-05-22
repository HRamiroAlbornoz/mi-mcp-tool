export type RepoDTO = {
    full_name: string;
    description: string | null;
    html_url: string;
    stars: number;
    open_issues_count: number;
    language: string | null;
    default_branch: string;
};

export function mapRepoToDTO(repo: any): RepoDTO {
    return {
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        stars: repo.stargazers_count,
        open_issues_count: repo.open_issues_count,
        language: repo.language,
        default_branch: repo.default_branch,
    };
}