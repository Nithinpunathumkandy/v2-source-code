export interface ProjectSettingsModules {
    project_id: number;
    is_enabled: number;
    type: projectSettingsModulesTypes;
    title: string;
}

export type projectSettingsModulesTypes = 'high-level-plan' | 'task' | 'member'
    | 'document' | 'meeting' | 'deliverable' | 'scope' | 'risk'
    | 'setting' | 'lesson-learned' | 'project-closure' | 'team' |
    'payment-milestone' | 'cost' | 'discussion';

export type projectSettingsModulesStatus = 'activate' | 'deactivate';
