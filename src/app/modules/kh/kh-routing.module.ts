import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './pages/documents/documents.component';
import { DocumentsListComponent } from './pages/documents/pages/list/documents-list.component';

//change request
import { ChangeRequestComponent } from './pages/change-request/change-request.component';
import { ChangeRequestListComponent } from './pages/change-request/pages/change-request-list/change-request-list.component';
import { AddChangeRequestComponent } from './pages/change-request/pages/add-change-request/add-change-request.component';
import { EditChangeRequestComponent } from './pages/change-request/pages/edit-change-request/edit-change-request.component';
import { InfoComponent } from './pages/change-request/pages/change-request-details/info/info.component';
import { ChangeRequestDetailsComponent } from './pages/change-request/pages/change-request-details/change-request-details.component';

import { AddFileComponent } from './pages/documents/pages/add/add-file/add-file.component';
import { DocumentDetailsComponent } from './pages/documents/pages/document-details/document-details.component';
import { DocumentInfoComponent } from './pages/documents/pages/document-details/pages/document-info/document-info.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardDetailsComponent } from './pages/dashboard/dashboard-details/dashboard-details.component';
import { KhTemplateListComponent } from './pages/templates/pages/kh-template-list/kh-template-list.component';
import { KhTemplateDetailsComponent } from './pages/templates/pages/kh-template-details/kh-template-details.component';
import { KhTemplateInfoComponent } from './pages/templates/pages/kh-template-details/kh-template-info/kh-template-info.component';
import { MasterDocumentListComponent } from './pages/master-document-list/master-document-list.component';
import { MasterListComponent } from './pages/master-document-list/pages/master-list/master-list.component';
import { MasterAddComponent } from './pages/master-document-list/pages/master-add/master-add.component';
import { KhReportsComponent } from './pages/kh-reports/kh-reports.component';
import { KhCountTypeComponent } from './pages/kh-reports/kh-count-type/kh-count-type.component';
import { KhCountListComponent } from './pages/kh-reports/kh-count-list/kh-count-list.component';
import { MasterDetailsComponent } from './pages/master-document-list/pages/master-details/master-details.component';
import { MasterDetailsInfoComponent } from './pages/master-document-list/pages/master-details/master-details-info/master-details-info.component';
import { KhWorkflowComponent } from './pages/workflow/kh-workflow.component';
import { KhWorkflowListComponent } from './pages/workflow/pages/kh-workflow-list/kh-workflow-list.component';
import { KhWorkflowDetailsComponent } from './pages/workflow/pages/kh-workflow-details/kh-workflow-details.component';
import { KhOverviewComponent } from './pages/kh-overview/kh-overview.component';
import { EditFileComponent } from './pages/documents/pages/add/edit-file/edit-file.component';
import { DocumentMappingComponent } from './pages/documents/pages/document-details/pages/document-info/document-mapping/document-mapping.component';
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
      }
  },
  {
    path: 'dashboard-details',
    component: DashboardDetailsComponent,
    data: {
        core: { title: 'Dashboard' },
    }
  },
  {
    path: 'documents',
    component: DocumentsComponent,
    data: {
        core: { title: 'Documents' },
    },
    children: [
      {
        path: "",
        component: DocumentsListComponent,
        data: {
          core: { title: 'List' },
          breadcrumb:'documents'
        }
      },
      {
        path: "add-document",
        component: AddFileComponent,
        data: {
          core: { title: "Add" },
        }
      },

      {
        path: "edit-document",
        component: EditFileComponent,
        data: {
          core: { title: "Edit" },
        }
      },

      {
        path:":id",
        component:DocumentDetailsComponent,
        data: {
              core: { title: "Details" },
            },

            children:[
              {
                path: "",
                component: DocumentInfoComponent,
                data: {
                  core: { title: "Info" },
                },
               
              },
              {
                path: "mapping",
                component: DocumentMappingComponent,
                data: {
                  core: { title: "Mapping" },
                }
                
              }
              
            ]
      }
     
    ]
  },
  {
    path: 'template',
    component: KhTemplateListComponent,
    data: {
        core: { title: 'Template' },
    },    
    // children: [
    //   // {
    //   //   path: "",
    //   //   component: KbTemplatesListComponent,
    //   //   data: {
    //   //     core: { title: "List" },
    //   //     breadcrumb: 'template'
    //   //   },
    //   // },

    //   {
    //     path: ":id",
    //     component: KhTemplateDetailsComponent,
    //     data: {
    //       core: { title: " Details" },
    //       breadcrumb: 'template'
    //     },
    //   },

    // ]
  },
  {
    path: "template/:id",
    component: KhTemplateDetailsComponent,
    data: {
      core: { title: " Details" },
      // breadcrumb: 'template'
    },
    children: [
      {
        path: "",
        component: KhTemplateInfoComponent,
        data: {
          core: { title: "Info" },
        }
      },
      // {
      //   path: "work-flow",
      //   component: CWorkFlowComponent,
      //   data: {
      //     core: { title: "Workflow" },
      //   }
      // }
    ]
  },
  {
    path: 'work-flow',
    component: KhWorkflowComponent,
    data: {
        core: { title: 'WorkFlow' },
    },
    children: [
      {
        path: "",
        component: KhWorkflowListComponent,
        data: {
          core: { title: 'List' },
          breadcrumb:'workflow'
        }
      },
      {
        path: ":id",
        component: KhWorkflowDetailsComponent,
        data: {
          core: { title: " Details" },
          breadcrumb: 'workflow'
        },
      }
    ]
  },
   {
    path: 'change-requests',
    component: ChangeRequestComponent,
    data: {
        core: { title: 'Change Request' },
    },
    children: [
      {
        path: "",
        component: ChangeRequestListComponent,
        data: {
          core: { title: 'List' },
          breadcrumb:'change_request'
        }
     },
      {
        path: "add-request",
        component: AddChangeRequestComponent,
        data: {
          core: { title: "Add" },
        }
      },
      {
        path: "edit-request",
        component: EditChangeRequestComponent,
        data: {
          core: { title: "Edit" },
        }
      },
      {
        path: ":id",
        component: ChangeRequestDetailsComponent,
        data: {
          core: { title: " Details" },
        },
        
        children: [
          {
            path: "",
            component: InfoComponent,
            data: {
              core: { title: "Info" },
            }
          },
          // {
          //   path: "work-flow",
          //   component: CWorkFlowComponent,
          //   data: {
          //     core: { title: "Workflow" },
          //   }
          // }
        ]
      },
    ]
  },
  {
    path: 'reports',
    component: KhReportsComponent,
    data: {
      core: { title: 'KH Reports' },
      breadcrumb: 'reports'
    },
  },
  {
    path: 'reports/:riskcountType',
    component: KhCountTypeComponent,
    data: {
      core: { title: 'KH Count Type' },
    },
  },
  {
    path: 'reports/:riskcountType/:id',
    component: KhCountListComponent,
    data: {
      core: { title: 'KH Count List' },
    },
  },
  {
    path: 'corporate-documents',
    component: MasterDocumentListComponent,
    data: {
        core: { title: 'Documents' },
    },
    children: [
      {
        path: "",
        component: MasterListComponent,
        data: {
          core: { title: 'List' },
          breadcrumb:'documents'
        }
      },
      {
        path: "add-document",
        component: MasterAddComponent,
        data: {
          core: { title: "Add" },
        }
      },

      // {
      //   path: "edit-document",
      //   component: EditFileComponent,
      //   data: {
      //     core: { title: "Edit" },
      //   }
      // },

      {
        path:":id",
        component:MasterDetailsComponent,
        data: {
              core: { title: "Details" },
            },

            children:[
              {
                path: "",
                component: MasterDetailsInfoComponent,
                data: {
                  core: { title: "Info" },
                }
                
              }
            ]
      }
     
    ]
  },
  {
    path: 'user-guides',
    component: KhOverviewComponent,
    data: {
        core: { title: 'Knowledge Hub Overview' },
    }
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KhRoutingModule { }
