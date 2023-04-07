import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssessmentDepartmentComponent } from './pages/assessments/assessment-department/assessment-department.component';
import { AssessmentDocumentTypeComponent } from './pages/assessments/assessment-document-type/assessment-document-type.component';
import { AssessmentDocumentComponent } from './pages/assessments/assessment-document/assessment-document.component';
import { AssessmentMsTypeComponent } from './pages/assessments/assessment-ms-type/assessment-ms-type.component';
import { AssessmentPdcaComponent } from './pages/assessments/assessment-pdca/assessment-pdca.component';
import { AssessmentDetailsComponent } from './pages/assessment-detail-main/assessment-details/assessment-details.component';
import { AssessmentsComponent } from './pages/assessments/assessments/assessments.component';
import { BusinessAssessmentAssessmentsComponent } from './pages/assessments/business-assessment-assessments.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BusinessAssessmentFrameworkComponent } from './pages/frameworks/business-assessment-framework.component';
import { FrameworkDetailsComponent } from './pages/frameworks/framework-details/framework-details.component';
import { FrameworksComponent } from './pages/frameworks/frameworks/frameworks.component';
import { AssessmentDetailMainComponent } from './pages/assessment-detail-main/assessment-detail-main.component';
import { AssessmentActionPlanDetailsComponent } from './pages/assessment-action-plan/assessment-action-plan-details/assessment-action-plan-details.component';
import { AssessmentActionPlanListComponent } from './pages/assessment-action-plan/assessment-action-plan-list/assessment-action-plan-list.component';
import { AssessmentActionPlanComponent } from './pages/assessment-action-plan/assessment-action-plan.component';
import { ActionPlansComponent } from './pages/assessment-detail-main/assessment-details/action-plans/action-plans.component';
import { AssessmentInfoComponent } from './pages/assessment-detail-main/assessment-details/assessment-info/assessment-info.component';
import { BusinessAssessmentOverviewComponent } from './pages/business-assessment-overview/business-assessment-overview.component';
import { ControlAssessmentComponent } from './pages/control-assessment/control-assessment.component';
import { ControlAssessmentListComponent } from './pages/control-assessment/control-assessment-list/control-assessment-list.component';
import { ControlAssessmentDetailsComponent } from './pages/control-assessment/control-assessment-details/control-assessment-details.component';
import { AssessmentInControlComponent } from './pages/control-assessment/control-assessment-details/assessment-in-control/assessment-in-control.component';
import { MaturityModalComponent } from './pages/maturity-modal/maturity-modal.component';
import { MaturityModalListComponent } from './pages/maturity-modal/maturity-modal-list/maturity-modal-list.component';
import { MaturityModalDetailsComponent } from './pages/maturity-modal/maturity-modal-details/maturity-modal-details.component';
import { EditControlAssessmentComponent } from './pages/control-assessment/control-assessment-details/assessment-in-control/edit-control-assessment/edit-control-assessment.component';
import { ControlAssessmentActionPlanComponent } from './pages/control-assessment/control-assessment-details/control-assessment-action-plan/control-assessment-action-plan.component';
import { ActionPlanControlAssessmentComponent } from './pages/action-plan-control-assessment/action-plan-control-assessment.component';
import { ActionPlanControlAssessmentListComponent } from './pages/action-plan-control-assessment/action-plan-control-assessment-list/action-plan-control-assessment-list.component';
import { ActionPlanControlAssessmentDetailsComponent } from './pages/action-plan-control-assessment/action-plan-control-assessment-details/action-plan-control-assessment-details.component';
import { ControlAssessmentDashboardComponent } from './pages/control-assessment/control-assessment-details/control-assessment-dashboard/control-assessment-dashboard.component';
import { ControlAssessmentCountComponent } from './pages/control-assessment/control-assessment-details/control-assessment-count/control-assessment-count.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      core: { title: 'Dashboard' },
      breadcrumb: 'dashboard'
    }
  },
  {
    path: 'user-guides',
    component: BusinessAssessmentOverviewComponent,
    data: {
      core: { title: 'Overview' },
      // breadcrumb: 'business_assessment_overview'
    }
  },
  {
    path: 'assessments',
    component: BusinessAssessmentAssessmentsComponent,

    children: [
      {
        path: '',
        component: AssessmentsComponent,
        data: {
          core: { title: 'Assessments' },
          breadcrumb: 'Assessments',

        },
      },

      {
        path: 'assessment-documents',
        component: AssessmentDocumentComponent,
        data: {
          core: { title: 'Assessment Documents' },
          breadcrumb: null
        },
      },
      {
        path: 'assessment-ms-types',
        component: AssessmentMsTypeComponent,
        data: {
          core: { title: 'Assessment MS Type' },
          breadcrumb: null
        },
      },
      {
        path: 'assessment-document-types',
        component: AssessmentDocumentTypeComponent,
        data: {
          core: { title: 'Assessment Document Type' },
          breadcrumb: null
        },
      },
      {
        path: 'assessment-departments',
        component: AssessmentDepartmentComponent,
        data: {
          core: { title: 'Assessment Departments' },
          breadcrumb: null
        },
      },
      {
        path: 'pdca',
        component: AssessmentPdcaComponent,
        data: {
          core: { title: 'PDCA' },
          breadcrumb: null
        },
      },


    ],

  },

  {
    path: 'control-assessment-action-plans',
    component: ActionPlanControlAssessmentComponent,
    children: [
      {
        path: '',
        component: ActionPlanControlAssessmentListComponent,
        data: {
          core: { title: 'Control Assessments Action Plan' },
          breadcrumb: 'action_plan',

        },
      },
      {
        path: ':id',
        component: ActionPlanControlAssessmentDetailsComponent,
        data: {
          core: { title: 'Details' },
          breadcrumb: 'action_plan'
        },
      },

    ],

  },

  {
    path: 'assessment',
    component: AssessmentDetailMainComponent,
    children: [
      {
        path: ':id',
        component: AssessmentDetailsComponent,
        data: {
          core: { title: 'Assessment Details' },
          breadcrumb: null
        },
        children:[
          {
            path: '',
              component: AssessmentInfoComponent,
              data: {
                core: { title: 'Assessment Details' },
                breadcrumb: null
              }
          },
          {
            path: 'action-plans',
              component: ActionPlansComponent,
              data: {
                core: { title: 'Action Plan' },
                breadcrumb: null
              }
          },
        ]
      }
    ]

  },

  {
    path: 'control-assessments',
    component: ControlAssessmentComponent,
    children: [
      {
        path: '',
        component: ControlAssessmentListComponent,
        data: {
          core: { title: 'control-assessment' },
          //breadcrumb: 'Control Assessment'
        },
      },
      {
        path: ':id',
        component: ControlAssessmentDetailsComponent,
        data: {
          core: { title: 'Control Assessment  Details' },
          breadcrumb: 'control_assessment'
        },
        children:[
          {
            path: '',
           component: ControlAssessmentCountComponent, 
            data: {
              core: { title: 'assessment' },
              //breadcrumb: 'Control Assessment'
            },
          },
        //   {
        //     path: 'control-dashboard',
        //    component: ControlAssessmentCountComponent,
        //     data: {
        //       core: { title: 'assessment' },
        //       //breadcrumb: 'Control Assessment'
        //     },
        //  },
          {
            path: 'assessments',
            component: AssessmentInControlComponent,
            data: {
              core: { title: 'assessment' },
              //breadcrumb: 'Control Assessment'
            },
          },
           {
            path: 'action-plan',
            component: ControlAssessmentActionPlanComponent,
            data: {
              core: { title: 'action_plan' },
              //breadcrumb: 'Control Assessment'
            },
           },
           
            {
              path: 'assessments/:assessmentId',
              component: EditControlAssessmentComponent,
              data: {
                core: { title: 'update_assessment' },
                //breadcrumb: 'Control Assessment'
              },
            },
            // children:[
              
            // ]
          
        ]
      },
      
  
    ],
    
  },


  {
    path: 'frameworks',
    component: BusinessAssessmentFrameworkComponent,
    children: [
      {
        path: '',
        component: FrameworksComponent,
        data: {
          core: { title: 'Frameworks' },
          breadcrumb: 'Frameworks'
        },
      },
      {
        path: ':id',
        component: FrameworkDetailsComponent,
        data: {
          core: { title: 'Framework Details' },
          breadcrumb: null
        },
      },
    ]
  },

  {
    path: 'maturity-models',
    component: MaturityModalComponent,
    children: [
      {
        path: '',
        component: MaturityModalListComponent,
        data: {
          core: { title: 'Maturity Model' },
          //breadcrumb: 'maturity_modal'
        },
      },
      {
        path: ':id',
        component: MaturityModalDetailsComponent,
        data: {
          core: { title: 'Maturity Model Details' },
          breadcrumb: 'maturity_model'
        },
      },
    ]
  },
  
  {
    path:'action-plans',
    component:AssessmentActionPlanComponent,
    children:[
      {
        path: '',
        component: AssessmentActionPlanListComponent,
        data: {
          core: { title: 'Actionplans' },
          breadcrumb: 'Actionplans'
        },
      },
      {
        path: ':id',
        component: AssessmentActionPlanDetailsComponent,
        data: {
          core: { title: 'Actionplan Details' },
          breadcrumb: null
        },
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessAssessmentsRoutingModule { }
