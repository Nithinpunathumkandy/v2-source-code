import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HumanCapitalDashboardPage } from './pages/dashboard/human-capital-dashboard.page';
import { HumanCapitalUsersPage } from './pages/users/human-capital-users.page';
import { HumanCapitalAssessmentsPage } from './pages/assessments/human-capital-assessments.page';
import { HumanCapitalAssessmentCompetencyAssessment } from './pages/assessments/pages/assessment/competency-assessment/competency-assessment.page';
import { HumanCapitalAssessmentUser } from './pages/assessments/pages/assessment/user/user.page';
import { HumanCapitalAssessmentTeam } from './pages/assessments/pages/assessment/team/team.page';
import { HumanCapitalAssessmentDepartment } from './pages/assessments/pages/assessment/department/department.page';
import { HumanCapitalAssessmentSubsidiary } from './pages/assessments/pages/assessment/subsidiary/subsidiary.page';
import { UserDetailsPageComponent } from './pages/users/pages/user-details/user-details-page.component';
import { UsersPageComponent } from './pages/users/pages/users/users.page.component';
import { UserDocumentsPageComponent } from './pages/users/pages/user-details/user-documents/user-documents.page/user-documents.page.component';
import { UserProfilePageComponent } from './pages/users/pages/user-details/user-profile/user-profile.page.component';
import { UserJdPageComponent } from './pages/users/pages/user-details/user-jd/user-jd-page/user-jd-page.component';
import { UserRrPageComponent } from './pages/users/pages/user-details/user-rr/user-rr-page/user-rr-page.component';
import { UserKpiPageComponent } from './pages/users/pages/user-details/user-kpi-page/user-kpi-page.component';
import { UserCompetenciesPageComponent } from './pages/users/pages/user-details/user-competencies-page/user-competencies-page.component';
import { UserReportsPageComponent } from './pages/users/pages/user-details/user-reports-page/user-reports-page.component';
import { UserSettingsPageComponent } from './pages/users/pages/user-details/user-settings-page/user-settings-page.component';
import { SecurityComponent } from './pages/users/pages/user-details/user-settings-page/security/security.component';
import { AclComponent } from './pages/users/pages/user-details/user-settings-page/acl/acl.component';
import { AccessComponent } from './pages/users/pages/user-details/user-settings-page/access/access.component';
import { EmailNotificationComponent } from './pages/users/pages/user-details/user-settings-page/email-notification/email-notification.component';
import { IntegrationComponent } from './pages/users/pages/user-details/user-settings-page/integration/integration.component';
import { AddUserComponent } from './pages/users/pages/users/add-user/add-user.component';
import { NewAssessmentComponent } from './pages/assessments/pages/new-assessment/new-assessment.component';
import { PerformanceEvaluationComponent } from './pages/users/pages/user-details/performance-evaluation/performance-evaluation.component';
// import { EditUserComponent } from './pages/users/pages/users/edit-user-main/edit-user/edit-user.component';
import { UserReportComponent } from './pages/user-report/user-report.component';
import { CompetencyMatrixComponent } from './pages/competency-matrix/competency-matrix.component';
import {AssessmentComponent} from './pages/assessments/pages/assessment/assessment.component'
import { UserSettingComponent } from './pages/users/pages/user-details/user-settings-page/user-setting/user-setting.component';
import { DepartmentComponent } from './pages/department/department.component';
import { EditAssessmentComponent } from './pages/assessments/pages/edit-assessment/edit-assessment.component';
import { EditUserMainComponent } from './pages/users/pages/edit-user-main/edit-user-main.component';
import { EditUserComponent } from './pages/users/pages/edit-user-main/edit-user/edit-user.component';
import { UserTrainingsComponent } from './pages/users/pages/user-details/user-trainings/user-trainings.component';
import { DepartmentDetailsComponent } from './pages/department/department-details/department-details.component';
import { HumanCapitalOverviewComponent } from './pages/human-capital-overview/human-capital-overview.component';
import { HcQlikDashboardComponent } from './pages/hc-qlik-dashboard/hc-qlik-dashboard.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
    },
    {
        path: 'dashboard',
        component: HumanCapitalDashboardPage,
        data: {
            core: { title: 'Dashboard' },
            breadcrumb: 'dashboard'
        }
    },
    {
        path: 'qlik-dashboard',
        component: HcQlikDashboardComponent,
        data: {
            core: { title: 'Qlik Dashboard' },
        }
    },
    {
        path: 'users',
        component: HumanCapitalUsersPage,
        data: {
            core: { title: 'Users' },
            breadcrumb: 'users'
        },
        children: [
            {
                path: '',
                component: UsersPageComponent,
                data: {
                    core: { title: 'Users' },
                    breadcrumb: 'users'
                }
            },

            {
                path: 'add-user',
                component: AddUserComponent,
                data: {
                    core: { title: 'Add User' },
                    breadcrumb: null
                }
            },
            {
                path: 'edit',
                component: EditUserMainComponent,
                children: [
                    {
                        path:':id',
                        component:EditUserComponent,
                        data: {
                            core: { title: 'Edit User' },
                            breadcrumb: null
                        }
                    }
                    

                ]
                
            },
            {
                path: ':id',
                component: UserDetailsPageComponent,
                children: [
                    {
                        path: '',
                        component: UserProfilePageComponent,
                        data: {
                             core: { title: 'Profile' }, 
                             breadcrumb: null
                            }
                    },
                    {
                        path: 'documents',
                        component: UserDocumentsPageComponent,
                        data: {
                             core: { title: 'Documents' },
                             breadcrumb: null 
                            }
                    },
                    {
                        path: 'job-descriptions',
                        component: UserJdPageComponent,
                        data: {
                             core: { title: 'Job Descriptions' },
                             breadcrumb: null 
                            }
                    },
                    {
                        path: 'roles-and-responsibilities',
                        component: UserRrPageComponent,
                        data: {
                             core: { title: 'RACI' },
                             breadcrumb: null 
                            }
                    },
                    {
                        path: 'key-performances',
                        component: UserKpiPageComponent,
                        data: {
                             core: { title: 'Key Performance Indicator' },
                             breadcrumb: null  
                            }
                    },
                    {
                        path: 'performance-evaluation',
                        component: PerformanceEvaluationComponent,
                        data: {
                             core: { title: 'Performance Evaluation' },
                             breadcrumb:null 
                            }
                    },
                    {
                        path: 'competencies',
                        component: UserCompetenciesPageComponent,
                        data: {
                             core: { title: 'Competencies' },
                             breadcrumb:null 
                            }
                    },
                    {
                        path: 'trainings',
                        component: UserTrainingsComponent,
                        data: {
                             core: { title: 'Trainings' },
                             breadcrumb:null 
                            }
                    },
                    {
                        path: 'reports',
                        component: UserReportsPageComponent,
                        data: {
                             core: { title: 'Reports' },
                             breadcrumb:null 
                            }
                    },
                    {
                        path: 'settings',
                        component: UserSettingsPageComponent,
                        data: {
                             core: { title: 'Settings' },
                             breadcrumb:null 
                            },
                        children: [
                            {
                                path: '',
                                component: SecurityComponent,
                                data: {
                                    core: { title: 'Security' },
                                    breadcrumb:null
                                }
                            },
                            {
                                path: 'security',
                                component: SecurityComponent,
                                data: {
                                    core: { title: 'Security' },
                                    breadcrumb:null
                                }
                            },
                            {
                                path: 'acl',
                                component: AclComponent,
                                data: {
                                    core: { title: 'Acl' },
                                    breadcrumb:null
                                }
                            },
                            {
                                path: 'access',
                                component: AccessComponent,
                                data: {
                                    core: { title: 'Access' },
                                    breadcrumb:null
                                }
                            },
                            {
                                path: 'email-notifications',
                                component: EmailNotificationComponent,
                                data: {
                                    core: { title: 'Email Notifications' },
                                    breadcrumb:null
                                }
                            },
                            {
                                path: 'integrations',
                                component: IntegrationComponent,
                                data: {
                                    core: { title: 'Integrations' },
                                    breadcrumb:null
                                }
                            },
                            {
                                path: 'general-settings',
                                component: UserSettingComponent,
                                data: {
                                    core: { title: 'General Settings' },
                                    breadcrumb:null
                                }
                            },
                        ]
                    }
                ],
                data: { core: { title: 'User Details' } }
            }
        ]
    },
    {
        path: 'assessments',
        component: HumanCapitalAssessmentsPage,
        data: {
            core: { title: 'Assessments' },
            breadcrumb:'Assessments'
        },
        
        children: [
            {
                path: '',
                component: AssessmentComponent,
                data: {
                    core: { title: 'Assessments' },
                    breadcrumb:null
                },
                children:[
                    {
                        path: '',
                        component: HumanCapitalAssessmentCompetencyAssessment,
                        data: {
                            core: { title: 'Competency Assessments' },
                            breadcrumb:null
                        }
                    },
                    {
                        path: 'users',
                        component: HumanCapitalAssessmentUser,
                        data: {
                            core: { title: 'Users' },
                            breadcrumb:null
                        }
                    },
        
                    {
                        path: 'teams',
                        component: HumanCapitalAssessmentTeam,
                        data: {
                            core: { title: 'Teams' },
                            breadcrumb:null
                        }
                    },
                    {
                        path: 'subsidiaries',
                        component: HumanCapitalAssessmentSubsidiary,
                        data: {
                            core: { title: 'Subsidiaries' },
                            breadcrumb:null
                        }
                    },
                    {
                        path: 'departments',
                        component: HumanCapitalAssessmentDepartment,
                        data: {
                            core: { title: 'Departments' },
                            breadcrumb:null
                        }
                    },
                ],
            },
            
            
            {
                path: 'details',
                component: UserDetailsPageComponent,
                data: {
                    core: { title: 'Details' },
                    breadcrumb:'details'
                }
            },

            {
                path: 'new-assessment',
                component: NewAssessmentComponent,
                data: {
                    core: { title: 'New Assessment' }
                }
            },
            {
                path: 'edit-assessment',
                component: EditAssessmentComponent,
                data: {
                    core: { title: 'Edit Assessment' }
                }
            },
        ]
    },
    {
        path: 'user-reports',
        component: UserReportComponent,
        data: {
            core: { title: 'User Reports' },
            breadcrumb:'user_reports'
        }
    },

    {
        path: 'departments',
        component: DepartmentComponent,
        data: {
            core: { title: 'Departments' },
            breadcrumb:'departments'
        }
    },
    {
        path: 'departments/:id',
        component: DepartmentDetailsComponent,
        data: {
            core: { title: 'Department Details' },
            breadcrumb:'departments'
        }
    },
   


    {
        path: 'competency-matrix',
        component: CompetencyMatrixComponent,
        data: {
            core: { title: 'Competency Matrix' },
            breadcrumb:null
        }
    },
    {
        path: 'user-guides',
        component: HumanCapitalOverviewComponent,
        data: {
            core: { title: 'Overview' },
            // breadcrumb:'human_capital_overview'
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HumanCapitalRoutingModule { }