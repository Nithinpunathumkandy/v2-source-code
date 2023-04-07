import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BpmDashboardComponent } from "./pages/dashboard/bpm-dashboard.component";
import { BpmControlsComponent } from "./pages/controls/bpm-controls.component";
import { ControlsListComponent } from "./pages/controls/pages/controls/controls-list.component";
import { AddControlComponent } from "../../shared/components/bpm/add-control/add-control.component";
import { ControlDetailsComponent } from "./pages/controls/pages/control-details/control-details.component";
import { BpmProcessesComponent } from "./pages/processes/bpm-processes.component";
import { ProcessListComponent } from "./pages/processes/pages/process/process-list.component";
import { AddProcessComponent } from "./pages/processes/pages/process/add-process/add-process.component";
import { ProcessDetailsComponent } from "./pages/processes/pages/process-details/process-details.component";
import { NeedExpectaionComponent } from "./pages/processes/pages/process-details/need-expectaion/need-expectaion.component";
import { RiskAssessmentComponent } from "./pages/processes/pages/process-details/risk-assessment/risk-assessment.component";
import { InfoComponent } from './pages/processes/pages/process-details/info/info.component';
import { ArciComponent } from './pages/arci/pages/arci/arci.component';
import { BpmArciComponent } from './pages/arci/bpm-arci.component';
import { ProcessReportComponent } from './pages/process-report/process-report.component';
import { ProcessCountTypeComponent } from './pages/process-report/process-count-type/process-count-type.component';
import { ProcessCountListComponent } from './pages/process-report/process-count-list/process-count-list.component';
import { EditProcessComponent } from './pages/processes/pages/process/edit-process/edit-process.component';
import { AprComponent } from "./pages/processes/pages/process-details/apr/apr.component";
import { AddAprComponent } from "./pages/processes/pages/add-apr/add-apr.component";
import { EditAprComponent } from "./pages/processes/pages/edit-apr/edit-apr.component";
import { BiaProcessesComponent } from "./pages/processes/pages/process-details/bia-processes/bia-processes.component";
import { BpmProcessMappingComponent } from "./pages/processes/pages/process-details/bpm-process-mapping/bpm-process-mapping.component";
import { BpmOverviewComponent } from "./pages/bpm-overview/bpm-overview.component";
import { BpmQlikDashboardComponent } from "./pages/bpm-qlik-dashboard/bpm-qlik-dashboard.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
  },
  {
    path: "dashboard",
    component: BpmDashboardComponent,
    data: {
      core: { title: "Dashboard" },
      breadcrumb: 'dashboard',
      
    },
  },
  {
    path: "qlik-dashboard",
    component: BpmQlikDashboardComponent,
    data: {
      core: { title: "Dashboard" },
    },
  },
  {
    path: "controls",
    component: BpmControlsComponent,
    data: {
      core: { title: "Controls" },
      breadcrumb: 'controls'
    },
    children: [
      {
        path: "",
        component: ControlsListComponent,
        data: {
          core: { title: "Controls" },
          breadcrumb: 'controls'
        },
      },

      {
        path: "add-controls",
        component: AddControlComponent,
        data: {
          core: { title: "Add" },
        },
      },
      {
        path: ":id",
        component: ControlDetailsComponent,
        data: {
          core: { title: "Details" },
        },
      },
    ],
  },
  {
    path: 'arci',
    component: BpmArciComponent,
    data:{
      core: { title: "ARCI" },
      breadcrumb: 'ARCI'
    },
    children: [
      {
        path: "",
        component: ArciComponent,
        data: {
          core: { title: "ARCI" },
        },
      },
    ],
  },

  {
    path: 'reports',
    component: ProcessReportComponent,
    data: {
      core: { title: 'Process Reports' },
      breadcrumb: 'reports'
    },
  },
  {
    path: 'reports/:riskcountType',
    component: ProcessCountTypeComponent,
    data: {
      core: { title: 'Process Count Type' },
    },
  },
  {
    path: 'reports/:riskcountType/:id',
    component: ProcessCountListComponent,
    data: {
      core: { title: 'Process Count List' },
    },
  },



  {
    path: "process",
    component: BpmProcessesComponent,
    data: {
      core: { title: "Process" },
      breadcrumb: 'process'
    },
    children: [
      {
        path: "",
        component: ProcessListComponent,
        data: {
          core: { title: "Process" },
          breadcrumb: 'process'
        },
      },

      {
        path: "add-process",
        component: AddProcessComponent,
        data: {
          core: { title: "Add" },
        },
      },
      {
        path: 'edit-process',
        component: EditProcessComponent,
        data: {
            core: { title: 'Edit' },
            breadcrumb: ''
        }
      },
      {
        path: 'add-advanced-process-discovery',
        component: AddAprComponent,
        data: {
          core: { title: 'Add Advanced Process Discovery' },
        }
      },
      {
        path: 'edit-advanced-process-discovery',
        component: EditAprComponent,
        data: {
          core: { title: 'Edit Advanced Process Discovery' },
        }
      },
      {
        path: ":id",
        component: ProcessDetailsComponent,
        children: [
          {
            path: "",
            component: InfoComponent,
            data: {
              core: { title: "Info" },
            },
          },
          {
            path: "need-expectaion",
            component: NeedExpectaionComponent,
            data: {
              core: { title: "Need & Expecation" },
            },
          },
          {
            path: "risk-assessment",
            component: RiskAssessmentComponent,
            data: {
              core: { title: "Risks" },
            },
          },
          {
            path: "advanced-process-discovery",
            component: AprComponent,
            data: {
              core: { title: "Advanced Process Discovery" },
            },
          },
          {
            path: "business-impact-analysis",
            component: BiaProcessesComponent,
            data: {
              core: { title: "Business Impact Analysis" },
            },
          },
          {
            path: "mapping",
            component: BpmProcessMappingComponent,
            data: {
              core: { title: "Process Mapping" },
            },
          },
        ],
      },
    ],
  },
  {
    path: 'user-guides',
    component: BpmOverviewComponent,
    data: {
        core: { title: 'Overview' },
        // breadcrumb:'bpm_overview'
    }
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BpmRoutingModule {}
