import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MockDrillPlanNewComponent } from './pages/mock-drill-plan/mock-drill-plan-new/mock-drill-plan-new.component';
import { MockDrillPlanDetailsComponent } from './pages/mock-drill-plan/mock-drill-plan-details/mock-drill-plan-details.component';
import { MockDrillPlanListComponent } from './pages/mock-drill-plan/mock-drill-plan-list/mock-drill-plan-list.component';
import { MockDrillPlanComponent } from './pages/mock-drill-plan/mock-drill-plan.component';
import { MockDrillAddComponent } from './pages/mock-drill/mock-drill-add/mock-drill-add.component';
import { MockDrillDetailsComponent } from './pages/mock-drill/mock-drill-details/mock-drill-details.component';
import { MockDrillListComponent } from './pages/mock-drill/mock-drill-list/mock-drill-list.component';
import { MockDrillComponent } from './pages/mock-drill/mock-drill.component';
import { MockDrillReportsComponent } from './pages/mock-drill-report/mock-drill-reports/mock-drill-reports.component';
import { MockDrillEditComponent } from './pages/mock-drill/mock-drill-edit/mock-drill-edit.component';
import { MockDrillPlanEditComponent } from './pages/mock-drill-plan/mock-drill-plan-edit/mock-drill-plan-edit.component';
import { MockDrillProgramComponent } from './pages/mock-drill-program/mock-drill-program.component';
import { MockDrillProgramListComponent } from './pages/mock-drill-program/mock-drill-program-list/mock-drill-program-list.component';
import { MockDrillProgramDetailsComponent } from './pages/mock-drill-program/mock-drill-program-details/mock-drill-program-details.component';
import { MockDrillProgramAddComponent } from './pages/mock-drill-program/mock-drill-program-add/mock-drill-program-add.component';
import { MockDrillProgramEditComponent } from './pages/mock-drill-program/mock-drill-program-edit/mock-drill-program-edit.component';
import { MockDrillInfoComponent } from './pages/mock-drill/mock-drill-details/mock-drill-info/mock-drill-info.component';
import { MockDrillActionPlansComponent } from './pages/mock-drill/mock-drill-details/mock-drill-action-plans/mock-drill-action-plans.component';
import { MockDrillWorkflowComponent } from './pages/Workflow/Pages/mock-drill-workflow.component';
import { MockDrillWorkflowListComponent } from './pages/Workflow/Pages/mock-drill-workflow-list/mock-drill-workflow-list.component';
import { MockDrillWorkflowDetailsComponent } from './pages/Workflow/Pages/mock-drill-workflow-details/mock-drill-workflow-details.component';
import { MockDrillProgramInfoComponent } from './pages/mock-drill-program/mock-drill-program-details/mock-drill-program-info/mock-drill-program-info.component';
import { MockDrillProgramMappingComponent } from './pages/mock-drill-program/mock-drill-program-details/mock-drill-program-mapping/mock-drill-program-mapping.component';


const routes: Routes = [
    {
        path: 'mock-drills',
        component: MockDrillComponent,
        children: [
            {
                path: '',
                component: MockDrillListComponent,
                data: {
                    core: { title: 'Mock Drill' },
                    breadcrumb: 'mock_drill'
                }
            },
            {
                path: 'new',
                component: MockDrillAddComponent,
                data: {
                    core: { title: 'new' },
                    breadcrumb: null
                }
            },
            {
                path: 'edit',
                component: MockDrillEditComponent,
                data: {
                    core: { title: 'edit' },
                    breadcrumb: null
                }
            },
            {
                path: ':id',
                component: MockDrillDetailsComponent,
                children: [
                    {
                        path: '',
                        component: MockDrillInfoComponent,
                        data: {
                            core: { title: 'Info' },
                            breadcrumb: null
                        }
                    },
                    {
                        path: 'mock-drill-action-plan',
                        component: MockDrillActionPlansComponent,
                        data: {
                            breadcrumb: null
                        }
                    }
                ]
            },
        ]
    },

    {
        path: 'mock-drill-plans',
        component: MockDrillPlanComponent,
        children: [
            {
                path: '',
                component: MockDrillPlanListComponent,
                data: {
                    core: { title: 'Mock Drill Plans' },
                    breadcrumb: 'mock_drill_plans'
                }
            },

            {
                path: 'new',
                component: MockDrillPlanNewComponent,
                data: {
                    core: { title: 'new' },
                    breadcrumb: null
                }
            },

            {
                path: 'edit',
                component: MockDrillPlanEditComponent,
                data: {
                    core: { title: 'edit' },
                    breadcrumb: null
                }
            }
            ,
            {
                path: ':id',
                component: MockDrillPlanDetailsComponent,
                data: {
                    breadcrumb: null
                }
            }
        ]
    },
    {
        path: 'reports',
        component: MockDrillReportsComponent,
    },

    {
        path: 'mock-drill-programs',
        component: MockDrillProgramComponent,
        children: [
            {
                path: '',
                component: MockDrillProgramListComponent,
                data: {
                    core: { title: 'Mock Drill Program' },
                    breadcrumb: 'mock_drill_programs'
                }
            }
            ,
            {
                path: 'add',
                component: MockDrillProgramAddComponent,
                data: {
                    breadcrumb: null
                }
            }
            ,
            {
                path: 'edit',
                component: MockDrillProgramEditComponent,
                data: {
                    breadcrumb: null
                }
            },
            {
                path: ':id',
                component: MockDrillProgramDetailsComponent,
                children: [
                    {
                        path: '',
                        component: MockDrillProgramInfoComponent,
                        data: {
                            core: { title: 'Info' },
                            breadcrumb: null
                        }
                    },
                    {
                        path: 'mapping',
                        component: MockDrillProgramMappingComponent,
                        data: {
                            core: { title: 'Mapping' },
                            breadcrumb: null
                        }
                    }
                ]
            },
        ]
    },
    {
        path: 'mock-drill-workflows',
        component: MockDrillWorkflowComponent,
        children: [
            {
                path: "",
                component: MockDrillWorkflowListComponent,
                data: {
                    core: { title: 'Workflow Engine' },
                    breadcrumb: 'workflow_engine'
                }
            },
            {
                path: ':id',
                component: MockDrillWorkflowDetailsComponent,
                data: {
                    core: { title: 'Workflow Engine Details' },
                    breadcrumb: null,
                }
            },
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MockDrillRoutingModule { }
