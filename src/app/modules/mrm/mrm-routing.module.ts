import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetingPlanComponent } from './pages/meeting-plan/meeting-plan.component';
import { MeetingPlanListComponent } from './pages/meeting-plan/meeting-plan-list/meeting-plan-list.component';
import { AddMeetingPlanComponent } from './pages/meeting-plan/add-meeting-plan/add-meeting-plan.component';
import { MeetingPlanDetailsComponent } from './pages/meeting-plan/meeting-plan-details/meeting-plan-details.component';
import { MappingComponent } from './pages/meeting-plan/meeting-plan-details/mapping/mapping.component';
import { MeetingComponent } from './pages/meeting-plan/meeting-plan-details/meeting/meeting.component';
import { ReportComponent } from './pages/meeting-plan/meeting-plan-details/report/report.component';
import { ActionPlanComponent } from './pages/meeting-plan/meeting-plan-details/action-plan/action-plan.component';
import { InfoComponent } from './pages/meeting-plan/meeting-plan-details/info/info.component';
import { EditMeetingPlanComponent } from './pages/meeting-plan/edit-meeting-plan/edit-meeting-plan.component';
import { MeetingsComponent } from './pages/meetings/meetings.component';
import { MeetingListComponent } from './pages/meetings/meeting-list/meeting-list.component';
import { AddMeetingComponent } from './pages/meetings/add-meeting/add-meeting.component';
import { MeetingsDetailsComponent } from './pages/meetings/meetings-details/meetings-details.component';
import { MeetingsInfoComponent } from './pages/meetings/meetings-details/meetings-info/meetings-info.component';
import { MeetingsReportComponent } from './pages/meetings/meetings-details/meetings-report/meetings-report.component';
import { MeetingsActionPlanComponent } from './pages/meetings/meetings-details/meetings-action-plan/meetings-action-plan.component';
import { EditMeetingComponent } from './pages/meetings/edit-meeting/edit-meeting.component';
import { MeetingReportTemplatesComponent } from './pages/meeting-report-templates/meeting-report-templates.component';
import { MeetingReportTemplatesListComponent } from './pages/meeting-report-templates/meeting-report-templates-list/meeting-report-templates-list.component';
import { MeetingReportTemplatesAddComponent } from './pages/meeting-report-templates/meeting-report-templates-add/meeting-report-templates-add.component';
import { ActionPlansComponent } from './pages/action-plans/action-plans.component';
import { ActionPlansListComponent } from './pages/action-plans/action-plans-list/action-plans-list.component';
import { ActionPlansAddComponent } from './pages/action-plans/action-plans-add/action-plans-add.component';
//import { ActionPlansEditComponent } from './pages/action-plans/action-plans-edit/action-plans-edit.component';
import { ActionPlansDetailsComponent } from './pages/action-plans/action-plans-details/action-plans-details.component';
import { MrmWorkflowComponent } from './pages/workflow/pages/mrm-workflow.component';
import { MrmWorkflowListComponent } from './pages/workflow/pages/mrm-workflow-list/mrm-workflow-list.component';
import { MrmWorkflowDetailsComponent } from './pages/workflow/pages/mrm-workflow-details/mrm-workflow-details.component';
import { MeetingReportTemplatesDetailsComponent } from './pages/meeting-report-templates/meeting-report-templates-details/meeting-report-templates-details.component';
import { MeetingReportsComponent } from './pages/meeting-reports/meeting-reports.component';
import { MeetingReportsListComponent } from './pages/meeting-reports/meeting-reports-list/meeting-reports-list.component';
import { AddUnplannedMeetingComponent } from './pages/meetings/add-unplanned-meeting/add-unplanned-meeting.component';
import { MeetingReportsDetailsComponent } from './pages/meeting-reports/meeting-reports-details/meeting-reports-details.component';
import { EditUnplannedMeetingComponent } from './pages/meetings/edit-unplanned-meeting/edit-unplanned-meeting.component';
import { MeetingsMomComponent } from './pages/meetings/meetings-details/meetings-mom/meetings-mom.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MrmOverviewComponent } from './pages/mrm-overview/mrm-overview.component';
import { MeetingDocumentsComponent } from './pages/meetings/meetings-details/meeting-documents/meeting-documents.component';
import { MeetingPlanDocumentsComponent } from './pages/meeting-plan/meeting-plan-details/meeting-plan-documents/meeting-plan-documents.component';
import { MeetingMappingComponent } from './pages/meetings/meetings-details/meeting-mapping/meeting-mapping.component';
const routes: Routes = [

  {
    path: "meeting-plans",
    component: MeetingPlanComponent,
    data: {
      core: { title: "Meeting Plans" },
      breadcrumb: 'meeting_plans',
  },
  children: [
    {
      path: "",
      component: MeetingPlanListComponent,
      data: {
        core: { title: "Meetings Plans" },
        breadcrumb: 'meeting_plans'
      },
    },
    {
      path: "add-meeting-plan",
      component: AddMeetingPlanComponent,
      data: {
        core: { title: "Add Meeting Plan" },
        breadcrumb: null
      },
    },
    {
      path: 'edit-meeting-plan',
      component: EditMeetingPlanComponent,
      data: {
        core: { title: 'Edit Meeting Plan' },
        breadcrumb: null
      }
    },
    {
      path: ':id',
      component: MeetingPlanDetailsComponent,
      children: [
        {
          path: '',
            component: InfoComponent,
            data: {
              core: { title: 'Info' },
              breadcrumb: null
            }
        },
        {
          path: 'meeting-plan-mapping',
          component: MappingComponent,
          data: {
            core: { title: 'Meeting Plan Mapping' },
            breadcrumb: null
          }
        },
        {
          path: 'meeting-plan-meeting',
          component: MeetingComponent,
          data: {
            core: { title: 'Meeting' },
            breadcrumb: null
          }
        },
        {
          path: 'meeting-plan-report',
          component: ReportComponent,
          data: {
            core: { title: 'report' },
            breadcrumb: null
          }
        },
        {
          path: 'meeting-plan-action-plan',
          component: ActionPlanComponent,
          data: {
            core: { title: 'Action Plan' },
            breadcrumb: null
          }
        }, 
        {
          path: 'meeting-plan-documents',
          component: MeetingPlanDocumentsComponent,
          data: {
            core: { title: 'Meeting Plan Documents' },
            breadcrumb: null
          }
        },
      ]
    }
  ]
},
{
  path:"meetings",
  component:MeetingsComponent,
  data: {
    core: { title: "Meetings" },
    breadcrumb: 'meetings',
  },
  children:[
    {
      path:"",
      component:MeetingListComponent,
      data: {
        core: { title: "Meetings" },
        breadcrumb: 'meetings',
      }
    },
    {
      path:"add-meeting",
      component:AddMeetingComponent,
      data: {
        core: { title: "Add Meeting" },
        breadcrumb: null,
      }
    },
    {
      path:"add-unplanned-meeting",
      component:AddUnplannedMeetingComponent,
      data: {
        core: { title: "Add Unplanned Meeting" },
        breadcrumb: null,
      }
    },
    {
      path:"edit-meeting",
      component:EditMeetingComponent,
      data:{
        core: { title: "Edit Meeting" },
        breadcrumb: null 
      }
    },
    {
      path:"edit-unplanned-meeting",
      component:EditUnplannedMeetingComponent,
      data:{
        core: { title: "Edit Unplanned Meeting" },
        breadcrumb: null 
      }
    },
    {
      path:":id",
      component:MeetingsDetailsComponent,
      children:[
        {
          path: '',
            component: MeetingsInfoComponent,
            data: {
              core: { title: 'Info' },
              breadcrumb: null
            }
        },
        {
          path: 'mom',
            component: MeetingsMomComponent,
            data: {
              core: { title: 'MOM' },
              breadcrumb: null
            }
        },
        {
          path: 'meetings-documents',
            component: MeetingDocumentsComponent,
            data: {
              core: { title: 'Documents' },
              breadcrumb: null
            }
        },
        {
          path: 'meetings-mapping',
            component: MeetingMappingComponent,
            data: {
              core: { title: 'Mapping' },
              breadcrumb: null
            }
        },
        {
          path: 'meetings-report',
            component: MeetingsReportComponent,
            data: {
              core: { title: 'Report' },
              breadcrumb: null
            }
        },
        {
          path: 'meetings-action-plan',
            component: MeetingsActionPlanComponent,
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
  path:'meeting-report-templates',
  component:MeetingReportTemplatesComponent,
  data: {
    core: { title: 'Report Templates' },
  },
  children: [
    {
      path: '',
      component: MeetingReportTemplatesListComponent,
      data: {
        core: { title: 'List' },
        breadcrumb:'template'
      }
    },
    {
      path:'meeting-report-templates-add',
      component:MeetingReportTemplatesAddComponent,
      data: {
        core: { title: "Add" },
      }
    },
    {
      path:":id",
      component:MeetingReportTemplatesDetailsComponent,
      data:{
        core: { title: "Report Templates Details" },
        breadcrumb: null,
      }
    }
  ]
},
{
  path:'meeting-action-plans',
  component:ActionPlansComponent,
  data: {
    core: { title: 'Action Plans' },
  },
  children: [
    {
      path: '',
      component: ActionPlansListComponent,
      data: {
        core: { title: 'List' },
        breadcrumb:'action_plans'
      }
    },
    {
      path:'add-action-plans',
      component:ActionPlansAddComponent,
      data: {
        core: { title: "Add Action Plans" },
        breadcrumb: null,
      }
    },
    // {
    //   path:'edit-action-plans',
    //   component:ActionPlansEditComponent,
    //   data: {
    //     core: { title: "Add Action Plans" },
    //     breadcrumb: null,
    //   }
    // },
    {
      path:":id",
      component:ActionPlansDetailsComponent,
      data:{
        core: { title: "Details Action Plans" },
        breadcrumb: null,
      }
    }
  ]
},
{
  path:'meeting-reports',
  component:MeetingReportsComponent,
  data:{
    core: { title: "Meeting Reports" },
    },
  children:[
    {
      path:'',
      component:MeetingReportsListComponent,
      data:{
        core:{ title: "Meeting Reports List"},
        breadcrumb:'meeting_reports'
      }
    },
    {
      path:":id",
      component:MeetingReportsDetailsComponent,
      data:{
        core:{ title: "Meeting Reports Details"},
        breadcrumb:'meeting_reports'
      }
    }
  ]
},
{
  path: 'meeting-workflows',
  component: MrmWorkflowComponent,
  children: [  
    {
      path: "",
      component: MrmWorkflowListComponent,
      data: {
        core: { title: 'Workflow Engine' },
        breadcrumb: 'workflow_engine'
      }
    },    
    {
      path: ':id',
      component: MrmWorkflowDetailsComponent,
      data: {
        core: { title: 'Workflow Engine Details' },
        breadcrumb: null,
      }
    },
  ]
},

{
  path:'dashboard',
  component:DashboardComponent,
  data: {
    core: { title: 'MRM Dashboard' },
    breadcrumb: 'MRM Dashboard',
  }
},
{
  path:'user-guides',
  component:MrmOverviewComponent,
  data: {
    core: { title: 'Overview' },
    // breadcrumb: null
  }
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MrmRoutingModule { }
