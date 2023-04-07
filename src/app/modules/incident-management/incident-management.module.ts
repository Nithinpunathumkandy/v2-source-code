import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidentManagementRoutingModule } from './incident-management-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { IncidentListComponent } from './pages/incident/pages/incident-list/incident-list.component';
import { AddIncidentComponent } from './pages/incident/pages/add-incident/add-incident.component';
import { AddPersonInvolvedModalComponent } from './pages/incident/components/add-person-involved-modal/add-person-involved-modal.component';
import { AddWitnessModalComponent } from './pages/incident/components/add-witness-modal/add-witness-modal.component';
import { IncidentDetailsComponent } from './pages/incident/pages/incident-details/incident-details.component';
import { IncidentMappingComponent } from './pages/incident/pages/incident-details/incident-mapping/incident-mapping.component';
import { InvestigatorComponent } from './pages/incident/pages/incident-details/investigator/investigator.component';
import { EditIncidentComponent } from './pages/incident/pages/edit-incident/edit-incident.component';
import { IncidentListLoaderComponent } from './pages/incident/components/loader/incident-list-loader/incident-list-loader.component';
import { AddInvestigatorsComponent } from './pages/incident/components/add-investigators/add-investigators.component';
import { InfoComponent } from './pages/incident/pages/incident-details/info/info.component';
import { InvestigationListComponent } from './pages/investigation/pages/investigation/investigation-list/investigation-list.component';
import { InvestigationComponent } from './pages/investigation/pages/investigation/investigation.component';
import { InvestigationDetailsComponent } from './pages/incident/pages/incident-details/investigation-details/investigation-details.component';
import { InvestigationAddComponent } from './pages/incident/components/investigation-add/investigation-add.component';
import { AddIncidentInvestigationsModalComponent } from './pages/incident/components/add-incident-investigations-modal/add-incident-investigations-modal.component';
import { AddRecommendationsModalComponent } from './pages/incident/components/add-recommendations-modal/add-recommendations-modal.component';
import { AddSignificantObservationsComponent } from './pages/incident/components/add-significant-observations/add-significant-observations.component';
import { AddReferencesModalComponent } from './pages/incident/components/add-references-modal/add-references-modal.component';
import { OthersDetailsModalComponent } from './pages/incident/components/others-details-modal/others-details-modal.component';
import { AddCorrectiveActionComponent } from './pages/corrective-action/pages/add-corrective-action/add-corrective-action.component';
import { CorrectiveActionListComponent } from './pages/corrective-action/pages/corrective-action-list/corrective-action-list.component';
import { CorrectiveActionDetailsComponent } from './pages/corrective-action/pages/corrective-action-details/corrective-action-details.component';
import { InvolvedPersonModalComponent } from './pages/incident/components/involved-person-modal/involved-person-modal.component';
import { WitnessPersonModalComponent } from './pages/incident/components/witness-person-modal/witness-person-modal.component';
import { CorrectiveActionComponent } from "./pages/corrective-action/corrective-action.component";
import { IncidentPreviewModalComponent } from './pages/incident/components/incident-preview-modal/incident-preview-modal.component';
import { RootCauseAnalysisComponent } from './pages/incident/pages/incident-details/root-cause-analysis/root-cause-analysis.component';
import { AddRoutCauseAnalysisComponent } from './pages/incident/components/add-rout-cause-analysis/add-rout-cause-analysis.component';
import { IncidentCorrectiveActionsComponent } from './pages/incident/pages/incident-details/incident-corrective-actions/incident-corrective-actions.component';
import { TemplateListComponent } from './pages/template/pages/template-list/template-list.component';
import { AddTemplateModalComponent } from './pages/template/components/add-template-modal/add-template-modal.component';
import { IncidentTemplateDetailsComponent } from './pages/template/pages/incident-template-details/incident-template-details.component';
import { AddIncidentTitleComponent } from './pages/incident/components/add-incident-title/add-incident-title.component';
import { AddTypeOfDamageComponent } from './pages/incident/components/add-type-of-damage/add-type-of-damage.component';
import { AddDateAndTimeComponent } from './pages/incident/components/add-date-and-time/add-date-and-time.component';
import { AddIncidentCategoryComponent } from './pages/incident/components/add-incident-category/add-incident-category.component';
import { AddSubIncidentCategoryComponent } from './pages/incident/components/add-sub-incident-category/add-sub-incident-category.component';
import { AddIncidentReportedByComponent } from './pages/incident/components/add-incident-reported-by/add-incident-reported-by.component';
import { AddIncidentInvolvedPartyComponent } from './pages/incident/components/add-incident-involved-party/add-incident-involved-party.component';
import { AddIncidentSubsidiaryComponent } from './pages/incident/components/add-incident-subsidiary/add-incident-subsidiary.component';
import { AddIncidentDivisionsComponent } from './pages/incident/components/add-incident-divisions/add-incident-divisions.component';
import { AddIncidentDepartmentComponent } from './pages/incident/components/add-incident-department/add-incident-department.component';
import { AddIncidentSectionComponent } from './pages/incident/components/add-incident-section/add-incident-section.component';
import { AddIncidentSubSectionComponent } from './pages/incident/components/add-incident-sub-section/add-incident-sub-section.component';
import { AddIncidentActionTakenComponent } from './pages/incident/components/add-incident-action-taken/add-incident-action-taken.component';
import { AddIncidentDescriptionComponent } from './pages/incident/components/add-incident-description/add-incident-description.component';
import { AddIncidentAtComponent } from './pages/incident/components/add-incident-at/add-incident-at.component';
import { AddReportedDateComponent } from './pages/incident/components/add-reported-date/add-reported-date.component';
import { AddIncidentReportedAtComponent } from './pages/incident/components/add-incident-reported-at/add-incident-reported-at.component';
import { AddIncidentEvidenceComponent } from './pages/incident/components/add-incident-evidence/add-incident-evidence.component';
import { IncidentWorkflowListComponent } from './pages/incident-workflow/pages/incident-workflow-list/incident-workflow-list.component';
import { IncidentWorkflowDetailsComponent } from './pages/incident-workflow/pages/incident-workflow-details/incident-workflow-details.component';
import { IncidentWorkflowAddModdelComponent } from './pages/incident-workflow/components/incident-workflow-add-moddel/incident-workflow-add-moddel.component';
import { IncidentWorkflowUserAddComponent } from './pages/incident-workflow/components/incident-workflow-user-add/incident-workflow-user-add.component';
import { IncidentWorkflowDesiginationAddComponent } from './pages/incident-workflow/components/incident-workflow-desigination-add/incident-workflow-desigination-add.component';
import { IncidentWorkflowTeamAddComponent } from './pages/incident-workflow/components/incident-workflow-team-add/incident-workflow-team-add.component';
import { IncidentWorkflowRoleAddComponent } from './pages/incident-workflow/components/incident-workflow-role-add/incident-workflow-role-add.component';
import { IncidentWorkflowHeadUnitAddComponent } from './pages/incident-workflow/components/incident-workflow-head-unit-add/incident-workflow-head-unit-add.component';
import { IncidentWorkflowCommonPopupAddComponent } from './pages/incident-workflow/components/incident-workflow-common-popup-add/incident-workflow-common-popup-add.component';
import { IncidentReportListComponent } from './pages/report/pages/incident-report-list/incident-report-list.component';
import { InvestigationDetailComponent } from './pages/investigation/pages/investigation/investigation-detail/investigation-detail.component';
import { AddIncidentLocationComponent } from './pages/incident/components/add-incident-location/add-incident-location.component';
import { AddInvestigationDetailsComponent } from './pages/incident/components/investigation-edit/add-investigation-details/add-investigation-details.component';
import { AddRecommentionsComponent } from './pages/incident/components/investigation-edit/add-recommentions/add-recommentions.component';
import { AddObservationsComponent } from './pages/incident/components/investigation-edit/add-observations/add-observations.component';
import { AddReferenceComponent } from './pages/incident/components/investigation-edit/add-reference/add-reference.component';
import { InvolvedPersonDetailsComponent } from './pages/incident/components/investigation-edit/involved-person-details/involved-person-details.component';
import { InvolvedPersonOtherDetailsComponent } from './pages/incident/components/investigation-edit/involved-person-other-details/involved-person-other-details.component';
import { InvolvedWitnessPersonOtherDetailsComponent } from './pages/incident/components/investigation-edit/involved-witness-person-other-details/involved-witness-person-other-details.component';
import { InvolvedWitnessPersonDetailsComponent } from './pages/incident/components/investigation-edit/involved-witness-person-details/involved-witness-person-details.component';
import { InvestigationDetailsLoaderComponent } from './pages/incident/loaders/investigation-details-loader/investigation-details-loader.component';
import { IncidentInfoLoaderComponent } from './pages/incident/loaders/incident-info-loader/incident-info-loader.component';
import { IncidentMappingLoaderComponent } from './pages/incident/loaders/incident-mapping-loader/incident-mapping-loader.component';
import { IncidentInvestigatorLoaderComponent } from './pages/incident/loaders/incident-investigator-loader/incident-investigator-loader.component';
import { IncidentRootCauseLoaderComponent } from './pages/incident/loaders/incident-root-cause-loader/incident-root-cause-loader.component';
import { AddReportModalComponent } from './pages/report/components/add-report-modal/add-report-modal.component';
import { MainReportComponent } from './pages/report/pages/main-report/main-report.component';
import { IncidentDashboardComponent } from './pages/incident-dashboard/pages/incident-dashboard/incident-dashboard.component';
import { UpdateCorrectiveactionProgressComponent } from './pages/corrective-action/component/update-correctiveaction-progress/update-correctiveaction-progress.component';
import { UpdateHistoryModalComponent } from './pages/corrective-action/component/update-history-modal/update-history-modal.component';
import { InvestigationHistoryModalComponent } from './pages/investigation/components/investigation-history-modal/investigation-history-modal.component';
import { InvestigationProgressUpdateComponent } from './pages/investigation/components/investigation-progress-update/investigation-progress-update.component';
import { IncidentReportComponent } from './pages/incident-report/incident-report.component';
import { IncidentCountTypeComponent } from './pages/incident-report/incident-count-type/incident-count-type.component';
import { IncidentCountListComponent } from './pages/incident-report/incident-count-list/incident-count-list.component';
import { IncidentReportLoaderComponent } from './component/loader/incident-report-loader/incident-report-loader.component';
import { IncidentDashboardLoaderComponent } from './pages/incident/components/loader/incident-dashboard-loader/incident-dashboard-loader.component';
// import { TemplateLoaderComponent } from './pages/incident/loaders/template-loader/template-loader.component';
import { IncidentReportsComponent } from './pages/incident/pages/incident-details/incident-report/incident-report.component';
// import { CorrectiveActionLoaderComponent } from './pages/incident/loaders/corrective-action-loader/corrective-action-loader.component';
import { IncidentWorkflowLoaderComponent } from './pages/incident/loaders/incident-workflow-loader/incident-workflow-loader.component';
import { IncidentTemplateDetailsLoaderComponent } from './pages/incident/loaders/incident-template-details-loader/incident-template-details-loader.component';
import { IncidentHistoryLoaderComponent } from './pages/incident/loaders/incident-history-loader/incident-history-loader.component';
import { ReportBookLoaderComponent } from './pages/incident/loaders/report-book-loader/report-book-loader.component';
import { InvestigatorChartLoaderComponent } from './pages/incident/loaders/investigator-chart-loader/investigator-chart-loader.component';
import { IncidentManagementOverviewComponent } from './pages/incident-management-overview/incident-management-overview.component';
import { AddRiskMappingComponent } from './component/add-risk-mapping/add-risk-mapping.component';
import { InvestigationAddModalComponent } from './pages/incident/components/investigation-add-modal/investigation-add-modal.component';
import { InvestigationEditModalComponent } from './pages/incident/components/investigation-edit-modal/investigation-edit-modal.component';




@NgModule({
  declarations: [IncidentListComponent, 
    AddIncidentComponent, 
    AddPersonInvolvedModalComponent,
     AddWitnessModalComponent, 
     IncidentDetailsComponent, 
     InfoComponent, 
     IncidentMappingComponent, 
     InvestigatorComponent, 
     EditIncidentComponent, 
     IncidentListLoaderComponent, 
     AddInvestigatorsComponent, 
     InvestigationComponent, 
     InvestigationListComponent,
       InvestigationDetailsComponent,
        InvestigationAddComponent, 
        AddIncidentInvestigationsModalComponent,
         AddRecommendationsModalComponent,
          AddSignificantObservationsComponent, 
          AddReferencesModalComponent, 
            OthersDetailsModalComponent, 
            AddCorrectiveActionComponent,
            CorrectiveActionListComponent,
            CorrectiveActionDetailsComponent,
            CorrectiveActionComponent,
            InvolvedPersonModalComponent,
            WitnessPersonModalComponent,
            CorrectiveActionComponent,
            IncidentPreviewModalComponent,
            RootCauseAnalysisComponent,
            AddRoutCauseAnalysisComponent,
            IncidentCorrectiveActionsComponent,
            TemplateListComponent,
            AddTemplateModalComponent,
            IncidentTemplateDetailsComponent,
            AddIncidentTitleComponent,
            AddTypeOfDamageComponent,
            AddDateAndTimeComponent,
            AddIncidentCategoryComponent,
            AddSubIncidentCategoryComponent,
            AddIncidentReportedByComponent,
            AddIncidentInvolvedPartyComponent,
            AddIncidentSubsidiaryComponent,
            AddIncidentDivisionsComponent,
            AddIncidentDepartmentComponent,
            AddIncidentSectionComponent,
            AddIncidentSubSectionComponent,
            AddIncidentActionTakenComponent,
            AddIncidentDescriptionComponent,
            AddIncidentAtComponent,
            AddReportedDateComponent,
            AddIncidentReportedAtComponent,
            AddIncidentEvidenceComponent,
            IncidentWorkflowListComponent,
            IncidentWorkflowDetailsComponent,
            IncidentWorkflowAddModdelComponent,
            IncidentWorkflowUserAddComponent,
            IncidentWorkflowDesiginationAddComponent,
            IncidentWorkflowTeamAddComponent,
            IncidentWorkflowRoleAddComponent,
            IncidentWorkflowHeadUnitAddComponent,
            IncidentWorkflowCommonPopupAddComponent,
            IncidentReportListComponent,
            InvestigationDetailComponent,
            AddIncidentLocationComponent,
            AddInvestigationDetailsComponent,
            AddRecommentionsComponent,
            AddObservationsComponent,
            AddReferenceComponent,
            InvolvedPersonDetailsComponent,
            InvolvedPersonOtherDetailsComponent,
            InvolvedWitnessPersonOtherDetailsComponent,
            InvolvedWitnessPersonDetailsComponent,
            InvestigationDetailsLoaderComponent,
            IncidentInfoLoaderComponent,
            IncidentMappingLoaderComponent,
            IncidentInvestigatorLoaderComponent,
            IncidentRootCauseLoaderComponent,
            AddReportModalComponent,
            MainReportComponent,
            IncidentDashboardComponent,
            UpdateCorrectiveactionProgressComponent,
            UpdateHistoryModalComponent,
            InvestigationHistoryModalComponent,
            InvestigationProgressUpdateComponent,
            IncidentReportComponent,
            IncidentCountTypeComponent,
            IncidentCountListComponent,
            IncidentReportLoaderComponent,
            IncidentDashboardLoaderComponent,
            // TemplateLoaderComponent,
            IncidentReportsComponent,
            // CorrectiveActionLoaderComponent,
            IncidentWorkflowLoaderComponent,
            IncidentTemplateDetailsLoaderComponent,
            IncidentHistoryLoaderComponent,
            ReportBookLoaderComponent,
            InvestigatorChartLoaderComponent,
            IncidentManagementOverviewComponent,
            AddRiskMappingComponent,
            InvestigationAddModalComponent,
            InvestigationEditModalComponent
         
     ],
  imports: [
    CommonModule,
    IncidentManagementRoutingModule,
    SharedModule,
    NgxPaginationModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ]
})
export class IncidentManagementModule { }
