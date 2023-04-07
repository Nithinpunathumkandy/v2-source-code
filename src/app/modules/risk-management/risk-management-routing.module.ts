import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddRiskComponent } from './pages/risk-management/risks/add-risk/add-risk.component';
import { RiskDetailsComponent } from './pages/risk-management/risk-details/risk-details.component';
import { RisksComponent } from './pages/risk-management/risks/risks.component';
import { RisksDashboardComponent } from './pages/risks-dashboard/risks-dashboard.component';
import { RiskContextComponent } from './pages/risk-management/risk-details/risk-context/risk-context.component';
import { RiskMappingComponent } from './pages/risk-management/risk-details/risk-mapping/risk-mapping.component';
import { RiskTreatmentComponent } from './pages/risk-management/risk-details/risk-treatment/risk-treatment.component';
import { ResidualRiskComponent } from './pages/risk-management/risk-details/residual-risk/residual-risk.component';
import { RiskManagementComponent } from './pages/risk-management/risk-management.component';
import { RiskAssessmentComponent } from './pages/risk-management/risk-details/risk-assessment/risk-assessment.component';
import { EditRiskComponent } from './pages/risk-management/risks/edit-risk/edit-risk.component';
import { RiskMatrixComponent } from './pages/risk-matrix/risk-matrix.component';
import { RiskConfigurationComponent } from './pages/risk-configuration/risk-configuration.component';
import { LikelihoodComponent } from './pages/risk-configuration/likelihood/likelihood.component';
import { ImpactComponent } from './pages/risk-configuration/impact/impact.component';
import { RiskScoreComponent } from './pages/risk-configuration/risk-score/risk-score.component';
import { AddRiskTreatmentComponent } from './pages/risk-management/risk-details/risk-treatment/add-risk-treatment/add-risk-treatment.component';
import { EditRiskTreatmentComponent } from './pages/risk-management/risk-details/risk-treatment/edit-risk-treatment/edit-risk-treatment.component';
import { HeatMapComponent } from './pages/risk-heat-map/heat-map/heat-map.component';
import { HmByCategoryComponent } from './pages/risk-heat-map/hm-by-category/hm-by-category.component';
import { HmByDepartmentComponent } from './pages/risk-heat-map/hm-by-department/hm-by-department.component';
import { RiskHeatMapComponent } from './pages/risk-heat-map/risk-heat-map.component';
import { RiskTreatmentPlanComponent } from './pages/risk-treatment/risk-treatment-plan/risk-treatment-plan.component';
import { RiskTreatmentPlansComponent } from './pages/risk-treatment/risk-treatment-plan/risk-treatment-plans/risk-treatment-plans.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { RiskCountTypeComponent } from './pages/reports/risk-count-type/risk-count-type/risk-count-type.component';
import { RiskCountListComponent } from './pages/reports/risk-count-list/risk-count-list.component';
import { RiskTreatmentDetailsComponent } from './pages/risk-treatment/treatment-details/risk-treatment-details/risk-treatment-details.component';
import { RiskWorkflowComponent } from './pages/risk-workflow/pages/risk-workflow.component';
import { RiskWorkflowListComponent } from './pages/risk-workflow/pages/risk-workflow-list/risk-workflow-list.component';
import { RiskWorkflowDetailsComponent } from './pages/risk-workflow/pages/risk-workflow-details/risk-workflow-details.component';
import { RootCauseAnalysisComponent } from './pages/risk-management/risk-details/root-cause-analysis/root-cause-analysis.component'
import { KeyRiskIndicatorComponent } from './pages/risk-management/risk-details/key-risk-indicator/key-risk-indicator.component';
import { RiskJourneyComponent } from './pages/risk-management/risk-details/risk-journey/risk-journey.component';
import { CorporateRisksComponent } from './pages/risk-management/risks/corporate-risks/corporate-risks.component';
import { ImpactAnalysisComponent } from './pages/risk-management/risk-details/impact-analysis/impact-analysis.component';
import { HmByDivisionComponent } from './pages/risk-heat-map/hm-by-division/hm-by-division.component';
import { HmBySectionComponent } from './pages/risk-heat-map/hm-by-section/hm-by-section.component';
import { HmBySourceComponent } from './pages/risk-heat-map/hm-by-source/hm-by-source.component';
import { RiskReportComponent } from './pages/reports/risk-report/risk-report.component';
import { PdfReportComponent } from './pages/reports/pdf-report/pdf-report.component';
import { DetailedErmReportComponent } from './pages/reports/pdf-report/detailed-erm-report/detailed-erm-report.component';
import { ExecutiveSummeryComponent } from './pages/reports/pdf-report/executive-summary/executive-summary.component';
import { QuickRiskAssesmentReportComponent } from './pages/reports/pdf-report/quick-risk-assesment-report/quick-risk-assesment-report.component';
import { DetailedErmReportDetailComponent } from './pages/reports/pdf-report/detailed-erm-report/detailed-erm-report-detail/detailed-erm-report-detail.component';
import { ExecutiveSummeryDetailComponent } from './pages/reports/pdf-report/executive-summary/executive-summary-detail/executive-summary-detail.component';
import { QuickRiskAssesmentReportDetailComponent } from './pages/reports/pdf-report/quick-risk-assesment-report/quick-risk-assesment-report-detail/quick-risk-assesment-report-detail.component';
import { RiskCeoDashboardComponent } from './pages/risk-ceo-dashboard/risk-ceo-dashboard.component';
import { TopRisksComponent } from './pages/risk-ceo-dashboard/top-risks/top-risks.component';
import { CeoDashboardMainComponent } from './pages/risk-ceo-dashboard/ceo-dashboard-main/ceo-dashboard-main.component';
import { RiskCeoDetailsComponent } from './pages/risk-ceo-dashboard/risk-ceo-details/risk-ceo-details.component';
import { AutomativeDivisionComponent } from './pages/risk-ceo-dashboard/automative-division/automative-division.component';
import { CorporateAndSharedServiceDivisionComponent } from './pages/risk-ceo-dashboard/corporate-shared-service-divsion/corporate-shared-service-divsion.component';
import { CommercailAndIndustrialDivisionComponent } from './pages/risk-ceo-dashboard/commercial-industrial-division/commercial-industrial-division.component';
import { RiskManagementOverviewComponent } from './pages/risk-management-overview/risk-management-overview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: RisksDashboardComponent,
    data: {
      core: { title: 'Dashboard' },
      breadcrumb: 'dashboard'
    }
  },
  {
    path: 'corporate-risks',
    component: RiskManagementComponent,
    data: {
      core: { title: 'Corporate Risk Register' },
      breadcrumb: 'corporate_risk_register'
    },
    children: [
      {
        path: '',
        component: CorporateRisksComponent,
        data: {
          core: { title: 'Corporate Risk Register' },
          breadcrumb: 'corporate_risk_register'
        },
      },
     
      {
        path: 'add-risk',
        component: AddRiskComponent,
        data: {
          core: { title: 'Add Risk' },
          breadcrumb: null
        }
      },
      {
        path: 'edit-risk',
        component: EditRiskComponent,
        data: {
          core: { title: 'Edit Risk' },
          breadcrumb: null
        }
      },
      {
        path: ':id',
        component: RiskDetailsComponent,
        children: [

          {
            path: '',
            component: RiskContextComponent,
            data: {
              core: { title: 'Risk Context' },
              breadcrumb: null
            }
          },
          {
            path: 'risk-mapping',
            component: RiskMappingComponent,
            data: {
              core: { title: 'Risk Mapping' },
              breadcrumb: null
            }
          },
          {
            path: 'risk-assessment',
            component: RiskAssessmentComponent,
            data: {
              core: { title: 'Risk Assessment' },
              breadcrumb: null
            }
          },
          {
            path: 'risk-treatment',
            component: RiskTreatmentComponent,
            data: {
              core: { title: 'Risk Treatment' },
              breadcrumb: null
            }
          },
          {
            path: 'residual-risk',
            component: ResidualRiskComponent,
            data: {
              core: { title: 'Residual Risk' },
              breadcrumb: null
            }
          },
          {
            path: 'add-risk-treatment',
            component: AddRiskTreatmentComponent,
            data: {
              core: { title: 'Add Risk Treatment' },
              breadcrumb: null
            }
          },
          {
            path: 'edit-risk-treatment',
            component: EditRiskTreatmentComponent,
            data: {
              core: { title: 'Edit Risk Treatment' },
              breadcrumb: null
            }
          },
          {
            path: 'root-cause-analyses',
            component: RootCauseAnalysisComponent,
            data: {
              core: { title: 'Root Cause Analyses' },
              breadcrumb: null
            }
          },
          {
            path: 'key-risk-indicators',
            component: KeyRiskIndicatorComponent,
            data: {
              core: { title: 'Key Risk Indicators' },
              breadcrumb: null
            }
          },
          {
            path: 'impact-analysis',
            component: ImpactAnalysisComponent,
            data: {
              core: { title: 'Impact Analysis' },
              breadcrumb: null
            }
          },
          {
            path: 'risk-journey',
            component: RiskJourneyComponent,
            data: {
              core: { title: 'Risk Journey' },
              breadcrumb: null
            }
          },
        ]
      },
    ]
  },
  {
    path: 'risks',
    component: RiskManagementComponent,
    data: {
      core: { title: 'Risk & Opportunity Register' },
      breadcrumb: 'risk_register'
    },
    children: [
      {
        path: '',
        component: RisksComponent,
        data: {
          core: { title: 'Risk & Opportunity Register' },
          breadcrumb: 'risk_register'
        },
      },

     
      {
        path: 'add-risk',
        component: AddRiskComponent,
        data: {
          core: { title: 'Add Risk' },
          breadcrumb: null
        }
      },
      {
        path: 'edit-risk',
        component: EditRiskComponent,
        data: {
          core: { title: 'Edit Risk' },
          breadcrumb: null
        }
      },
      {
        path: ':id',
        component: RiskDetailsComponent,
        children: [

          {
            path: '',
            component: RiskContextComponent,
            data: {
              core: { title: 'Risk Context' },
              breadcrumb: null
            }
          },
          {
            path: 'risk-mapping',
            component: RiskMappingComponent,
            data: {
              core: { title: 'Risk Mapping' },
              breadcrumb: null
            }
          },
          {
            path: 'risk-assessment',
            component: RiskAssessmentComponent,
            data: {
              core: { title: 'Risk Assessment' },
              breadcrumb: null
            }
          },
          {
            path: 'risk-treatment',
            component: RiskTreatmentComponent,
            data: {
              core: { title: 'Risk Treatment' },
              breadcrumb: null
            }
          },
          {
            path: 'residual-risk',
            component: ResidualRiskComponent,
            data: {
              core: { title: 'Residual Risk' },
              breadcrumb: null
            }
          },
          {
            path: 'add-risk-treatment',
            component: AddRiskTreatmentComponent,
            data: {
              core: { title: 'Add Risk Treatment' },
              breadcrumb: null
            }
          },
          {
            path: 'edit-risk-treatment',
            component: EditRiskTreatmentComponent,
            data: {
              core: { title: 'Edit Risk Treatment' },
              breadcrumb: null
            }
          },
          {
            path: 'root-cause-analyses',
            component: RootCauseAnalysisComponent,
            data: {
              core: { title: 'Root Cause Analyses' },
              breadcrumb: null
            }
          },
          {
            path: 'key-risk-indicators',
            component: KeyRiskIndicatorComponent,
            data: {
              core: { title: 'Key Risk Indicators' },
              breadcrumb: null
            }
          },
          {
            path: 'impact-analysis',
            component: ImpactAnalysisComponent,
            data: {
              core: { title: 'Impact Analysis' },
              breadcrumb: null
            }
          },
          {
            path: 'risk-journey',
            component: RiskJourneyComponent,
            data: {
              core: { title: 'Risk Journey' },
              breadcrumb: null
            }
          },
        ]
      },
    

    ],
  },

  {
    path: 'reports',
    component: ReportsComponent,
    children: [
      {
        path: '',
        component: RiskReportComponent,
        data: {
          core: { title: 'Risk Reports' },
          breadcrumb: 'risk_reports'
        },
      },
      {
        path: 'pdf-report',
        component: PdfReportComponent,
        children: [
          {
            path: '',
            component: ExecutiveSummeryComponent,
            data: {
              core: { title: 'Executive Summary' },
              breadcrumb: 'executive_summary'
            },
          },
          {
            path: 'detailed-erm-report',
            component: DetailedErmReportComponent,
            data: {
              core: { title: 'Detaild Ern Report' },
              breadcrumb: 'detailed_ern_report'
            },
          },
          {
            path: 'quick-risk-assesment',
            component: QuickRiskAssesmentReportComponent,
            data: {
              core: { title: 'Quick Risk Assesment Report' },
              breadcrumb: 'quick_risk_assessment_reports'
            },
          },
        ],
        data: {
          core: { title: 'Pdf Reports' },
          breadcrumb: 'pdf_reports'
        },
      },
    ],
    
    data: {
      core: { title: 'Reports' },
      breadcrumb: 'reports'
    },
    
  },
  {
    path: 'reports/pdf-report/detailed-erm-report/:id',
    component: DetailedErmReportDetailComponent,
    data: {
      core: { title: 'Detaild Ern Report Detail' },
      breadcrumb: 'Detaild Ern Report Detail'
    },
  },

  {
    path: 'reports/pdf-report/:id',
    component: ExecutiveSummeryDetailComponent,
    data: {
      core: { title: 'Executive Report Detail' },
      breadcrumb: 'Executive Report Detail'
    },
  },
  {
    path: 'reports/pdf-report/quick-risk-assesment/:id',
    component: QuickRiskAssesmentReportDetailComponent,
    data: {
      core: { title: 'Quick Risk Assesment Detail' },
      breadcrumb: 'quick_risk_assessment_detail'
    },
  },

  {
    path: 'reports/:riskcountType',
    component: RiskCountTypeComponent,
    data: {
      core: { title: 'Risk Count Type' },
    },
  },
  {
    path: 'reports/:riskcountType/:id',
    component: RiskCountListComponent,
    data: {
      core: { title: 'Risk Count List' },
    },
  },

  {
    path: 'risk-matrix',
    component: RiskMatrixComponent,
    data: {
      core: { title: 'Risk Matrix' },
      breadcrumb: 'risk_matrix'
    }
  },
  {
    path: 'risk-heat-map',
    component: RiskHeatMapComponent,

    children: [
      {
        path: '',
        component: HeatMapComponent,
        data: {
          core: { title: 'Risk Heat-Map' },
          breadcrumb: 'risk_heat_map'
        },
      },
      {
        path: 'by-category',
        component: HmByCategoryComponent,
        data: {
          core: { title: 'Heat-Map by Category' },
          breadcrumb: null
        },
      },
      {
        path: 'by-department',
        component: HmByDepartmentComponent,
        data: {
          core: { title: 'Heat-Map by Department' },
          breadcrumb: null
        },
      },
      {
        path: 'by-division',
        component: HmByDivisionComponent,
        data: {
          core: { title: 'Heat-Map by Division' },
          breadcrumb: null
        },
      },
      {
        path: 'by-section',
        component: HmBySectionComponent,
        data: {
          core: { title: 'Heat-Map by Section' },
          breadcrumb: null
        },
      },
      {
        path: 'by-source',
        component: HmBySourceComponent,
        data: {
          core: { title: 'Heat-Map by Source' },
          breadcrumb: null
        },
      },

    ]
  },
  {
    path: 'risk-configuration',
    component: RiskConfigurationComponent,
    children: [

      {
        path: '',
        component: LikelihoodComponent,
        data: {
          core: { title: 'Likelihood' },
          breadcrumb: null
        }
      },
      {
        path: 'impact',
        component: ImpactComponent,
        data: {
          core: { title: 'Impact' },
          breadcrumb: null
        }
      },
      {
        path: 'risk-score',
        component: RiskScoreComponent,
        data: {
          core: { title: 'Risk Score' },
          breadcrumb: null
        }
      },
    ]
  },
  {
    path: 'risk-treatments',
    component: RiskTreatmentPlanComponent,
    children: [
      {
        path: '',
        component: RiskTreatmentPlansComponent,
        data: {
          core: { title: 'Risk Treatment plans' },
          breadcrumb: 'risk_treatments'
        }
      },
      {
        path: 'add-risk-treatment-plan',
        component: AddRiskTreatmentComponent,
        data: {
          core: { title: 'Add Risk Treatment plans' },
          breadcrumb: null
        }
      },
      {
        path: 'edit-risk-treatment-plan',
        component: EditRiskTreatmentComponent,
        data: {
          core: { title: 'Edit Risk Treatment plans' },
          breadcrumb: null
        }
      },
    ]
  },
  {
    path: 'risk-treatment',
    component: RiskTreatmentPlanComponent,
    children: [
      {
        path: ':id',
        component: RiskTreatmentDetailsComponent,
        data: {
          core: { title: 'Risk Treatment Details' },
          breadcrumb: null
        }
      },
    ]
  },
  {
    path: 'workflow',
    component: RiskWorkflowComponent,
    children: [
      {
        path: "",
        component: RiskWorkflowListComponent,
        data: {
          core: { title: 'Workflow Engine' },
          breadcrumb: 'workflow_engine'
        }
      },
      {
        path: ':id',
        component: RiskWorkflowDetailsComponent,
        data: {
          core: { title: 'Workflow Engine Details' },

        }
      },
    ]
  },

  // start risk ceo dashboard 
  {
    path: 'ceo-dashboard',
    component: RiskCeoDashboardComponent,
    children: [
      {
        path: '',
        component: CeoDashboardMainComponent,
        data: {
          core: { title: 'CEO Dashboard' },
          breadcrumb: 'CEO_dashboard'
        }
      },
      {
        path: "top-risks",
        component: TopRisksComponent,
        data: {
          core: { title: 'Top 20 Risks' },
          breadcrumb: 'top_20_risks'
        }
      },
      {
        path: "risk-details",
        component: RiskCeoDetailsComponent,
        data: {
          core: { title: 'Risk Details' },
          breadcrumb: 'risk_details'
        }
      },{
        path: "division-wise-details/:id",
        component: AutomativeDivisionComponent,
        data: {
          core: { title: 'Division Wise Dashboard' },
          breadcrumb: 'division_wise_dashboard'
        }
      },
      {
        path: "automative-division",
        component: AutomativeDivisionComponent,
        data: {
          core: { title: 'Automative Division' },
          breadcrumb: 'automative_division'
        }
      },
      {
        path: "commercial-industrial",
        component: CommercailAndIndustrialDivisionComponent,
        data: {
          core: { title: 'Commercial Industrial Division' },
          breadcrumb: 'commercial_industrial_division'
        }
      },
      {
        path: "corporate-shared-service",
        component: CorporateAndSharedServiceDivisionComponent,
        data: {
          core: { title: 'Corporate Shared Service Division' },
          breadcrumb: 'corporate_shared_service_division'
        }
      },
    ]
  },
  {
    path: 'user-guides',
    component: RiskManagementOverviewComponent,
    data: {
        core: { title: 'Overview' },
        // breadcrumb:'risk_management_overview'
    }
},
   // End risk ceo dashboard 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskManagementRoutingModule { }
