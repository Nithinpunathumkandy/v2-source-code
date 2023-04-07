import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventWorkflowEngineComponent } from './pages/event-workflow-engine/event-workflow-engine.component';
import { EventWorkflowDetailsComponent } from './pages/event-workflow-engine/pages/event-workflow-details/event-workflow-details.component';
import { EventWorkflowListComponent } from './pages/event-workflow-engine/pages/event-workflow-list/event-workflow-list.component';
import { AddEventComponent } from './pages/event/add-event/add-event.component';
import { EditEventComponent } from './pages/event/edit-event/edit-event.component';
import { EventBudgetComponent } from './pages/event/event-details/event-budget/event-budget.component';
import { EventClosureChecklistComponent } from './pages/event/event-details/event-closure-checklist/event-closure-checklist.component';
import { EventDeliverablesComponent } from './pages/event/event-details/event-deliverables/event-deliverables.component';
import { EventDetailsComponent } from './pages/event/event-details/event-details.component';
import { EventDocumentsComponent } from './pages/event/event-details/event-documents/event-documents.component';
import { EventLessonLearntDetailsComponent } from './pages/event/event-details/event-lesson-learnt/event-lesson-learnt-details/event-lesson-learnt-details.component';
import { EventLessonLearntComponent } from './pages/event/event-details/event-lesson-learnt/event-lesson-learnt.component';
import { EventMilestoneComponent } from './pages/event/event-details/event-milestone/event-milestone/event-milestone.component';
import { EventScopeComponent } from './pages/event/event-details/event-scope/event-scope.component';
import { EventSpecificationComponent } from './pages/event/event-details/event-specification/event-specification.component';
import { EventStakeholderDetailsComponent } from './pages/event/event-details/event-stakeholder/event-stakeholder-details/event-stakeholder-details.component';
import { EventStakeholderComponent } from './pages/event/event-details/event-stakeholder/event-stakeholder.component';
import { EventTaskDetailsComponent } from './pages/event/event-details/event-task/event-task-details/event-task-details.component';
import { EventTaskComponent } from './pages/event/event-details/event-task/event-task.component';
import { EventTeamComponent } from './pages/event/event-details/event-team/event-team.component';
import { ProfileDetailsComponent } from './pages/event/event-details/profile-details/profile-details.component';
import { EventListComponent } from './pages/event/event-list/event-list.component';
import { EventComponent } from './pages/event/event.component';
import { EventStrategicThemesComponent } from './pages/event/event-details/event-strategic-themes/event-strategic-themes.component';
import { EventChangeRequestComponent } from './pages/event/event-details/event-change-request/event-change-request.component';
import { NewEventChangeRequestComponent } from './pages/event/event-details/event-change-request/new-event-change-request/new-event-change-request.component';
import { EditEventChangeRequestComponent } from './pages/event/event-details/event-change-request/edit-event-change-request/edit-event-change-request.component';
import { EventClosureReportComponent } from './pages/event/event-details/event-closure-report/event-closure-report.component';
// import { MaturityMatrixListComponent } from './pages/maturity-matrix/pages/maturity-matrix-list/maturity-matrix-list.component';
// import { MaturityMatrixPlanListComponent } from './pages/maturity-matrix/pages/maturity-matrix-plan-list/maturity-matrix-plan-list.component';
import { MaturityMatrixCommonListComponent } from './pages/maturity-matrix/pages/maturity-matrix-common-list/maturity-matrix-common-list.component';
import { MaturityMatrixComponent } from './pages/maturity-matrix/maturity-matrix.component';
import { MaturityMatrixListComponent } from './pages/maturity-matrix/pages/maturity-matrix-common-list/maturity-matrix-list/maturity-matrix-list.component';
import { MaturityMatrixPlanListComponent } from './pages/maturity-matrix/pages/maturity-matrix-common-list/maturity-matrix-plan-list/maturity-matrix-plan-list.component';
import { EventMatrixPlanDetailsComponent } from './pages/maturity-matrix/pages/maturity-matrix-plan-details/event-matrix-plan-details/event-matrix-plan-details.component';
// import { EventMatrixPlanDetailsComponent } from './pages/maturity-matrix/pages/maturity-matrix-plan-list/pages/event-matrix-plan-details/event-matrix-plan-details.component';

import { EventCalendarComponent } from './pages/event-calendar/event-calendar.component';
import { EventClosureDetailsComponent } from './pages/event/event-details/event-closure-checklist/event-closure-details/event-closure-details.component';
import { EventChangeRequestListComponent } from './pages/event-change-request/event-change-request-list/event-change-request-list.component';
import { EventChangeRequestDetailsComponent } from './pages/event-change-request/event-change-request-details/event-change-request-details.component';
import { EventsChangeRequestComponent } from './pages/event-change-request/event-change-request.component';
import { RiskRegisterComponent } from './pages/risk-register/risk-register.component';
import { RiskRegisterListComponent } from './pages/risk-register/risk-register-list/risk-register-list.component';
import { RiskRegisterAddComponent } from './pages/risk-register/risk-register-add/risk-register-add.component';
import { EventMatrixPlanAsessmentComponent } from './pages/maturity-matrix/pages/maturity-matrix-plan-details/event-matrix-plan-asessment/event-matrix-plan-asessment.component';
import { MaturityMatrixPlanDetailsComponent } from './pages/maturity-matrix/pages/maturity-matrix-plan-details/maturity-matrix-plan-details.component';
import { EventClosureComponent } from './pages/event-closure/event-closure.component';
import { EventClosureListComponent } from './pages/event-closure/event-closure-list/event-closure-list.component';
import { EventTaskListComponent } from './pages/event-task/event-task-list/event-task-list.component';
import { EventTaskSubmenuComponent } from './pages/event-task/event-task-submenu.component';
import { EventChecklistComponent } from './pages/event/event-details/event-checklist/event-checklist.component';
import { EventChecklistDetailsComponent } from './pages/event/event-details/event-checklist/event-checklist-details/event-checklist-details.component';
import { MappingEventComponent } from './pages/event/event-details/mapping-event/mapping-event.component';
import { EventDashboardComponent } from './pages/event-dashboard/event-dashboard.component';
import { EventClosureInsideEventComponent } from './pages/event/event-details/event-closure-inside-event/event-closure-inside-event.component';
import { EventReportComponent } from './pages/event-report/event-report.component';
import { ReportComponent } from './pages/event-report/report/report.component';
import { EventReportDetailsComponent } from './pages/event-report/event-report-details/event-report-details.component';
import { EventClosureDetailsInsideEventComponent } from './pages/event/event-details/event-closure-inside-event/event-closure-details-inside-event/event-closure-details-inside-event.component';
import { StakeholderDashboardComponent } from './pages/event-dashboard/stakeholder-dashboard/stakeholder-dashboard.component';
import { EventClosureDashboardComponent } from './pages/event-closure-dashboard/event-closure-dashboard.component';
import { EventChangeRequestDashboardComponent } from './pages/event-change-request-dashboard/event-change-request-dashboard.component';
import { StakeholderMatrixComponent } from './pages/stakeholder-matrix/stakeholder-matrix.component';
import { EventClosureDetailsListPageComponent } from './pages/event-closure/event-closure-details-list-page/event-closure-details-list-page.component';
import { LessonLearntInfoComponent } from './pages/event/event-details/event-lesson-learnt/event-lesson-learnt-details/lesson-learnt-info/lesson-learnt-info.component';
import { LessonLearntCaComponent } from './pages/event/event-details/event-lesson-learnt/event-lesson-learnt-details/lesson-learnt-ca/lesson-learnt-ca.component';
import { EventMonitoringOverviewComponent } from './pages/event-monitoring-overview/event-monitoring-overview.component';
import { RiskDetailsComponent } from './pages/risk-register/risk-details/risk-details.component';
import { RiskMappingComponent } from './pages/risk-register/risk-details/risk-mapping/risk-mapping.component';
import { RiskRegisterDetailsComponent } from './pages/risk-register/risk-context/risk-register-details.component';
import { EventRiskAssessmentComponent } from './pages/risk-register/risk-details/event-risk-assessment/event-risk-assessment.component';
import { RiskTreatmentComponent } from './pages/risk-register/risk-details/risk-treatment/risk-treatment.component';
import { ResidualRiskComponent } from './pages/risk-register/risk-details/residual-risk/residual-risk.component';
import { EventRiskJourneyComponent } from './pages/risk-register/risk-details/event-risk-journey/event-risk-journey.component';



const routes: Routes = [
  {
    path: 'events',
    component: EventComponent,
    data: {
      core: { title: 'Events' },
    },
    children:[
      {
        path:'',
        component:EventListComponent,
        data: {
          breadcrumb: 'events'
        },
      },
      {
        path:'new',
        component:AddEventComponent,
        data: {
          breadcrumb: 'New Event'
        },
      },
      {
        path: 'edit',
        component: EditEventComponent,
        data: {
          core: { title: 'Edit Event' },
        },
      },
      {
        path:':id',
        component:EventDetailsComponent,
        // data: {
        //   breadcrumb: 'Business Continuity Plan Details'
        // },
        children:[
          {
            path: '',
            component: ProfileDetailsComponent,
            data: {
              core: { title: 'Event Profile Details' },


            },
            
          },
          {
            path: 'team',
            component: EventTeamComponent,
            data: {
              core: { title: 'Event Team' },
            },
          },
          {
            path: 'strategic-themes',
            component: EventStrategicThemesComponent,
            data: {
              core: { title: 'Event Strategic Themes' },
            },
          },
          {
            path: 'specifications',
            component: EventSpecificationComponent,
            data: {
              core: { title: 'Event Specification' },

            },
            
          },
          {
            path: 'documents',
            component: EventDocumentsComponent,
            data: {
              core: { title: 'Event Documents' },

            },
            
          },
          {
            path: 'milestones',
            component: EventMilestoneComponent,
            data: {
              core: { title: 'Event Milestone' },
            },
          }, 
          {
            path: 'budgets',
            component: EventBudgetComponent,
            data: {
              core: { title: 'Event Budgets' },
            },
          },

          {
            path: 'deliverables',
            component: EventDeliverablesComponent,
            data: {
              core: { title: 'Event Deliverables' },
            },
          },

          {
            path: 'scope',
            component: EventScopeComponent,
            data: {
              core: { title: 'Event Scope' },
            },
          },
          {
            path: 'task',
            component: EventTaskComponent,
            data: {
              core: { title: 'Event Task' },
            },            
          },  
          {
            path: 'closure',
            component: EventClosureDetailsInsideEventComponent,
            data: {
              core: { title: 'Event Closure' },
            },            
          },   
          {
            path: 'closure-checklist',
            component: EventClosureChecklistComponent,
            data: {
              core: { title: 'Event Closure Checklist' },
            },            
          },         
          {
            path: 'lesson-learned',
            component: EventLessonLearntComponent,
            data: {
              core: { title: 'Lesson Learned' },
            },            
          },
          {
            path: 'stakeholder',
            component: EventStakeholderComponent,
            data: {
              core: { title: 'Stakeholder Analysis' },
            },            
          },
          {
            path: 'change-request',
            component: EventChangeRequestComponent,
            data: {
              core: { title: 'Event Change Request' },
            },            
          },
          {
            path: 'closure-report',
            component: EventClosureReportComponent,
            data: {
              core: { title: 'Event Closure Report' },
            },            
          },
          {
            path: 'checklist',
            component: EventChecklistComponent,
            data: {
              core: { title: 'Event Checklist' },
            },            
          },

          {
            path: 'mapping',
            component: MappingEventComponent,
            data: {
              core: { title: 'Event Mapping' },
            },            
          },
          

        ]
      }

    ]
  },
  {
    path: 'events/:id/change-request/add',
    component: NewEventChangeRequestComponent,
    data: {
      core: { title: 'New Change Request' },
    },            
  },
  {
    path: 'user-guides',
    component: EventMonitoringOverviewComponent,
    data: {
      core: { title: 'Overview' },
    },            
  },
  {
    path: 'events/:id/change-request/edit',
    component: EditEventChangeRequestComponent,
    data: {
      core: { title: 'New Change Request' },
    },            
  },
  {
    path: 'events/:id/change-request/:crid',
    component: EventChangeRequestDetailsComponent,
    data: {
      core: { title: 'Change Request Details' },
    },            
  },
  {
    path: 'events/:id/task/:taskid',
    component: EventTaskDetailsComponent,
    data: {
      core: { title: 'Event Task Details' },       
      //breadcrumb: 'Task Info'           
    },                
  },
  {
    path: 'events/:id/lesson-learned/:id',
    component: EventLessonLearntDetailsComponent,
    data: {
      core: { title: 'Event Lesson Learnt Details' },                  
    },   
    children:[
      {
        path: "",
        component: LessonLearntInfoComponent,
        data:{
          core:{title: 'Event Lesson Learnt Details'}
        }
      },
      {
        path: "corrective-action",
        component: LessonLearntCaComponent,
        data:{
          core:{title: 'Event Lesson Learnt Corrective Action'}
        }
      },
    ]             
  },
  {
    path: 'events/:id/stakeholder/:id',
    component: EventStakeholderDetailsComponent,
    data: {
      core: { title: 'Stakeholder Analysis Details' },       
      //breadcrumb: 'Stakeholder Analysis'           
    },                
  },
  {
    path: 'events/:id/checklist/:id',
    component: EventChecklistDetailsComponent,
    data: {
      core: { title: 'Checklist Details' },             
    },                
  },
  {
    path: 'events/:id/closure-checklist/:id',
    component: EventClosureDetailsComponent,
    data: {
      core: { title: 'Closure Checklist Details' },       
      //breadcrumb: 'Closure checklist'           
    },                
  },

  {
    path: 'events/:id/closure/:clid',
    component: EventClosureDetailsInsideEventComponent,
    data: {
      core: { title: 'Closure  Details' },       
      //breadcrumb: 'Closure checklist'           
    },                
  },

  {
    path:'event-workflows',
    component:EventWorkflowEngineComponent,
    children:[
      {
        path:'',
        component:EventWorkflowListComponent,
        data: {
          core: { title: 'Workflow Engine' },
          breadcrumb: 'workflow_engine'
        }
      },
      {
        path: ':id',
        component: EventWorkflowDetailsComponent,
        data: {
          core: { title: 'Workflow Engine Details' },
        }
      }
    ]
  },

  {
    path:'event-change-requests',
    component:EventsChangeRequestComponent,
    children:[
      {
        path:'',
        component:EventChangeRequestListComponent,
        data: {
          core: { title: 'Event Change Request' },
          breadcrumb: 'change_request'
        }
      },
      {
        path: ':id',
        component: EventChangeRequestDetailsComponent,
        data: {
          core: { title: 'Event Change Request Details' },
        }
      }
    ]
  },
  {
    path:"event-risks",
    component:RiskRegisterComponent,
    data: {
      core: { title: "Risk Register" },
      breadcrumb: 'risk_registers',
    },
    children:[
      {
        path:"",
        component:RiskRegisterListComponent,
        data: {
          core: { title: "Risk Register" },
          breadcrumb: 'risk_registers',
        }
      },
      {
        path: ':id',
        component: RiskDetailsComponent,
        data: {
          core: { title: 'Risk Assessment Details' },
        },
        children: [
          {
            path: '',
            component: RiskRegisterDetailsComponent,
            data: {
              core: { title: 'Risk Context' }
            }
          },
          {
            path: 'risk-mapping',
            component: RiskMappingComponent,
            data: {
              core: { title: 'Risk Mapping' }
            }
          },
          {
            path: 'risk-assessment',
            component: EventRiskAssessmentComponent,
            data: {
              core: { title: 'Risk Assessment' }
            }
          },
          {
            path: 'risk-treatment',
            component: RiskTreatmentComponent,
            data: {
              core: { title: 'Risk Treatment' }
            }
          },
          {
            path: 'residual-risk',
            component: ResidualRiskComponent,
            data: {
              core: { title: 'Residual Risk' }
            },
          },
          {
            path: 'risk-journey',
            component: EventRiskJourneyComponent,
            data: {
              core: { title: 'Risk Journey' }
            }
          },
        ]},
      {
        path:"add-risk-register",
        component:RiskRegisterAddComponent,
        data: {
          core: { title: "Add Risk Register" },
          breadcrumb: null,
        }
      }
    ]
  },
  {
    path:"event-closures",
    component:EventClosureComponent,
    data: {
      core: { title: "Event Closures" },
      breadcrumb: 'event_closures',
    },
    children:[
      {
        path:"",
        component:EventClosureListComponent,
        data: {
          core: { title: "Event Closures" },
          breadcrumb: 'event_closures',
        }
      },
      {
        path: ':id',
        component: EventClosureDetailsListPageComponent,
        data: {
          core: { title: 'Event Closure Details' },
        }
      },
     
    ]
  },
  {
    path:"event-tasks",
    component:EventTaskSubmenuComponent,
    data: {
      core: { title: "Event Tasks" },
      breadcrumb: 'event_task',
    },
    children:[
      {
        path:"",
        component:EventTaskListComponent,
        data: {
          core: { title: "Event Task" },
          breadcrumb: 'event_task',
        }
      },
     
    ]
  },
  {
    path:"dashboard",
    component:EventDashboardComponent,
    data: {
      core: { title: "Event Dashboard" },
      breadcrumb: 'event_dashboard',
    },
  },
  {
    path:"stakeholder-dashboard",
    component:StakeholderMatrixComponent,
    data: {
      core: { title: "Event Stakeholder Dashboard" },
      breadcrumb: 'event_dashboard',
    },
  },
  {
    path:"closure-dashboard",
    component:EventClosureDashboardComponent,
    data: {
      core: { title: "Event Closure Dashboard" },
      breadcrumb: 'event_dashboard',
    },
  },
  {
    path:"cr-dashboard",
    component:EventChangeRequestDashboardComponent,
    data: {
      core: { title: "Event Change Request Dashboard" },
      breadcrumb: 'event_dashboard',
    },
  },
  {
    path:'maturity-matrix',
    component:MaturityMatrixComponent,
    children:[
      {
        path:'',
        component:MaturityMatrixCommonListComponent,
        // data: {
        //   core: { title: 'Matrurity Matrix' },
        //   breadcrumb: 'maturity_matrix'
        // }
        children:[
          {
            path:'',
            component:MaturityMatrixListComponent,
            data: {
              core: { title: 'Matrurity Matrix' },
              breadcrumb: 'maturity_matrix'
            }
          },
          {
            path: 'maturity-matrix-plan',
            component: MaturityMatrixPlanListComponent,
            data: {
              core: { title: 'Maturity Matrix Plan' },
            }
          },

        ]
      },
      
      {
        path: 'maturity-matrix-plan/:id',
        component: MaturityMatrixPlanDetailsComponent,
        data: {
          core: { title: 'Maturity Matrix Plan' },
          breadcrumb: 'matrix_plan_details_menu'
        },
        children:[
          {
            path: '',
            component: EventMatrixPlanDetailsComponent,
          },
          {
            path: 'assesment',
            component: EventMatrixPlanAsessmentComponent,
            data: {
              core: { title: 'Maturity Matrix Plan Asessment' },
              //breadcrumb: 'matrix_plan_details_menu'
            }
          },
        ]
      },
    
     
    ],
  },
  {
    path: 'event-calendars',
    component: EventCalendarComponent,
    data: {
      core: { title: 'Event Calendar' },
      breadcrumb: 'event_calendar',
    }
  },
  {
    path: 'reports',
    component: EventReportComponent,
    children: [
      {
        path: '',
        component: ReportComponent,
        data: {
          core: { title: 'Event Reports' },
          breadcrumb: 'event_reports'
        },
      },

      // {
      //   path: 'pdf-report',
      //   component: PdfReportComponent,
      //   children: [
      //     {
      //       path: '',
      //       component: ExecutiveSummeryComponent,
      //       data: {
      //         core: { title: 'Executive Summary' },
      //         breadcrumb: 'executive_summary'
      //       },
      //     },
      //     {
      //       path: 'detailed-erm-report',
      //       component: DetailedErmReportComponent,
      //       data: {
      //         core: { title: 'Detaild Ern Report' },
      //         breadcrumb: 'detailed_ern_report'
      //       },
      //     },
      //     {
      //       path: 'quick-risk-assesment',
      //       component: QuickRiskAssesmentReportComponent,
      //       data: {
      //         core: { title: 'Quick Risk Assesment Report' },
      //         breadcrumb: 'quick_risk_assessment_reports'
      //       },
      //     },
      //   ],
      //   data: {
      //     core: { title: 'Pdf Reports' },
      //     breadcrumb: 'pdf_reports'
      //   },
      // },
    ],
    
    data: {
      core: { title: 'Reports' },
      breadcrumb: 'reports'
    },
    
  },

  {
    path: 'reports/:eventcountType',
    component: ReportComponent,
    data: {
      core: { title: 'Event Report' },
    },
  },
  {
    path: 'reports/:eventcountType/:id',
    component: EventReportDetailsComponent,
    data: {
      core: { title: 'Event report details' },
    },
  }

  

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventMonitoringRoutingModule { }
