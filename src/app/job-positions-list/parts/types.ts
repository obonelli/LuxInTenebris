export type Job = {
    id: string;
    title: string;
    description: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    currency: string;
    seniority: string;
    workingScheme: string;
    englishLevel?: string | null;
    location?: string | null;
    provider?: string | null;
    technologies: { id: number; name: string; slug: string }[];
};

export const SENIORITIES = ['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'STAFF', 'LEAD', 'PRINCIPAL'] as const;
export const SCHEMES = ['ONSITE', 'HYBRID', 'REMOTE'] as const;
export const ENGLISH = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export const PAGE_SIZE = 3;

export const PROVIDER_COLORS: Record<string, string> = {
    NebulaWorks: '#7C4DFF',
    'Orion Talent': '#22D3EE',
    LunarSoft: '#FF9F43',
    'Atlas Systems': '#34D399',
    QuantumTech: '#F472B6',
    NovaData: '#60A5FA',
    default: '#A3A3A3',
};

export const TECH_SLUG_OPTIONS = [
    'typescript', 'react', 'nodejs', 'nestjs', 'rest', 'graphql',
    'mui', 'net', 'sql-server', 'nosql',
    'iam', 'auth0', 'keycloak', 'okta', 'azure-ad', 'oauth-2-0', 'openid-connect', 'mfa', 'rbac',
    'docker', 'aws', 'kubernetes', 'helm', 'terraform', 'github-actions', 'prometheus', 'grafana', 'linux', 'ci-cd',
    'react-native', 'expo', 'ios', 'android', 'jest',
    'python', 'apache-spark', 'airflow', 'gcp', 'bigquery', 'dataflow', 'dbt',
    'postgresql', 'redis',
];
