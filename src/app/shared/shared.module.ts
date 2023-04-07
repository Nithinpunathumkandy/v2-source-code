import { NgModule } from "@angular/core";
import { MobxAngularModule } from 'mobx-angular';
import { ScrollPointDirective } from './directives/scroll-point.directive';
import { DateFormatPipe } from "./directives/custom-date-pipe";
import { PermissionPipe } from "./directives/permission-pipe";
import { SafeHtmlPipe } from "./directives/safe-html-pipe";
import { FilterPipe } from "./directives/filter-pipe";
import { SortPipe } from "./directives/sort-pipe";
import { AutoFocus } from "./directives/auto-focus.directive";
import { UserWithDetailPopupComponent } from './components/user-with-detail-popup/user-with-detail-popup.component';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SubMenuComponent } from './components/sub-menu/sub-menu.component';
import { NgbPaginationModule, NgbAlertModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MsTypeModalComponent } from 'src/app/shared/components/organization/ms-type-modal/ms-type-modal.component';
import { MsTypeVersionModalComponent } from 'src/app/shared/components/organization/ms-type-version-modal/ms-type-version-modal.component';
import { DownloadProgressComponent } from './components/download-progress/download-progress.component';
import { ControlCategoryModalComponent } from './components/bpm/control-category/control-category-modal.component';
import { ControlSubcategoryModalComponent } from './components/bpm/control-subcategory/control-subcategory-modal.component';
import { DeletePopupComponent } from './components/delete-popup/delete-popup.component';
import { BreadcrumbMenuComponent } from './components/breadcrumb-menu/breadcrumb-menu.component';
import { ControlTypesModalComponent } from './components/bpm/control-types/control-types-modal.component';
import { ArciAddModalComponent } from './components/bpm/arci-matrix/arci-add-modal.component';
import { ProcessGroupModalComponent } from './components/bpm/process-group/process-group-modal.component';
import { ProcessCategoryModalComponent } from './components/bpm/process-category/process-category-modal.component';
import { AuditItemCategoryModalComponent } from './components/masters/internal-audit/audit-item-category-modal/audit-item-category-modal.component';
import { NoConnectivityComponent } from './components/no-connectivity/no-connectivity.component';
import { AuditCategoriesModalComponent } from './components/masters/internal-audit/audit-categories-modal/audit-categories-modal.component';
import { AuditCriterionModalComponent } from './components/masters/internal-audit/audit-criterion-modal/audit-criterion-modal.component';
import { AddNeedsExpectationComponent } from './components/shared/add-needs-expectation/add-needs-expectation.component'
import { AddStakeholderComponent } from './components/shared/add-stakeholder/add-stakeholder.component';
import { AuditObjectiveModalComponent } from './components/masters/internal-audit/audit-objective-modal/audit-objective-modal.component';
import { IdleTimeoutComponent } from './components/idle-timeout/idle-timeout.component'
import { AuditCheckListModalComponent } from './components/masters/internal-audit/audit-check-list-modal/audit-check-list-modal.component';
import { AuditFindingCategoriesModalComponent } from './components/masters/internal-audit/audit-finding-categories-modal/audit-finding-categories-modal.component';
import { FindingImpactAnalysisCategoryModalComponent } from './components/masters/internal-audit/finding-impact-analysis-category-modal/finding-impact-analysis-category-modal.component';
import { UserInfoComponent } from './components/shared/user-info/user-info.component';
import { RootCauseCategoriesModalComponent } from './components/masters/internal-audit/root-cause-categories-modal/root-cause-categories-modal.component';
import { RootCauseSubCategoriesModalComponent } from './components/masters/internal-audit/root-cause-sub-categories-modal/root-cause-sub-categories-modal.component';
import { OrganizationComplainceCategoryModalComponent } from './components/masters/knowledge-hub/organization-complaince-category-modal/organization-complaince-category-modal.component';
import { ComplianceTypeModalComponent } from './components/masters/compliance-management/compliance-type-modal/compliance-type-modal.component';
import { IssueComponent } from './components/masters/organization/issue/issue.component';
import { DivisionModalComponent } from './components/masters/organization/division-modal/division-modal.component';
import { DepartmentModalComponent } from './components/masters/organization/department-modal/department-modal.component';
import { SectionModalComponent } from './components/masters/organization/section-modal/section-modal.component';
import { SubSectionModalComponent } from './components/masters/organization/sub-section-modal/sub-section-modal.component';
import { AddIssueCategoryComponent } from './components/masters/organization/add-issue-category/add-issue-category.component';
import { AddIssueDomainComponent } from './components/masters/organization/add-issue-domain/add-issue-domain.component';
import { AddIssueTypeComponent } from './components/masters/organization/add-issue-type/add-issue-type.component';
import { IssueStatusModalComponent } from './components/masters/organization/issue-status-modal/issue-status-modal.component';
import { StakeholderModalComponent } from './components/masters/organization/stakeholder-modal/stakeholder-modal.component';
import { CompetencyModalComponent } from './components/masters/human-capital/competency-modal/competency-modal.component';
import { CompetencyGroupModalComponent } from './components/masters/human-capital/competency-group-modal/competency-group-modal.component';
import { CompetencyTypesModalComponent } from "./components/masters/human-capital/competency-types-modal/competency-types-modal.component";
import { DesignationModalComponent } from './components/masters/human-capital/designation-modal/designation-modal.component';
import { DesignationGradeModalComponent } from './components/masters/human-capital/designation-grade-modal/designation-grade-modal.component';
import { DesignationLevelModalComponent } from './components/masters/human-capital/designation-level-modal/designation-level-modal.component';
import { DesignationZoneModalComponent } from './components/masters/human-capital/designation-zone-modal/designation-zone-modal.component';
import { KpiCategoryModalComponent } from './components/masters/human-capital/kpi-category-modal/kpi-category-modal.component';
import { UserDocumentModalComponent } from './components/masters/human-capital/user-document-modal/user-document-modal.component';
import { UserKpiModalComponent } from './components/masters/human-capital/user-kpi-modal/user-kpi-modal.component';
import { UserReportModalComponent } from './components/masters/human-capital/user-report-modal/user-report-modal.component';
import { UserJdModalComponent } from './components/masters/human-capital/user-jd-modal/user-jd-modal.component';
import { DocumentCategoryModalComponent } from './components/masters/knowledge-hub/document-category-modal/document-category-modal.component';
import { DocumentTypesModalComponent } from './components/masters/knowledge-hub/document-types-modal/document-types-modal.component';
import { DocumentFamilyModalComponent } from './components/masters/knowledge-hub/document-family-modal/document-family-modal.component';
import { DocumentSubCategoriesModalComponent } from './components/masters/knowledge-hub/document-sub-categories-modal/document-sub-categories-modal.component';
import { DocumentSubSubCategoriesModalComponent } from './components/masters/knowledge-hub/document-sub-sub-categories-modal/document-sub-sub-categories-modal.component';
import { TagModalComponent } from './components/masters/knowledge-hub/tag-modal/tag-modal.component';
import { LabelModalComponent } from './components/masters/general/label-modal/label-modal.component';
import { AuditableItemModalComponent } from './components/masters/internal-audit/auditable-item-modal/auditable-item-modal.component';
import { ExternalAuditTypesModalComponent } from './components/masters/external-audit/external-audit-types-modal/external-audit-types-modal.component';
import { TableLoaderComponent } from 'src/app/modules/masters/components/loader/table-loader/table-loader.component';
import { UnitModalComponent } from './components/masters/human-capital/unit-modal/unit-modal.component';
import { ReportFrequencyModalComponent } from './components/masters/human-capital/report-frequency-modal/report-frequency-modal.component';
import { RegionModalComponent } from './components/masters/general/region-modal/region-modal.component';
import { CountryModalComponent } from './components/masters/general/country-modal/country-modal.component';
import { IndustryCategoryModalComponent } from './components/masters/general/industry-category-modal/industry-category-modal.component';
import { IndustryModalComponent } from './components/masters/general/industry-modal/industry-modal.component';
import { TimezoneModalComponent } from './components/masters/general/timezone-modal/timezone-modal.component';
import { LocationModalComponent } from './components/masters/general/location-modal/location-modal.component';
import { FilterMenuComponent } from './components/filter-menu/filter-menu.component';
import { ProductCategoryModalComponent } from './components/masters/organization/product-category-modal/product-category-modal.component';
import { ServiceCategoryModalComponent } from './components/masters/organization/service-category-modal/service-category-modal.component';
import { RiskAreaModalComponent } from './components/masters/risk-management/risk-area-modal/risk-area-modal.component';
import { RiskCategoryModalComponent } from './components/masters/risk-management/risk-category-modal/risk-category-modal.component';
import { RiskControlPlanModalComponent } from './components/masters/risk-management/risk-control-plan-modal/risk-control-plan-modal.component';
import { AddprocessComponent } from '../modules/organization/components/context/addprocess/addprocess.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { IssuesModalComponent } from './components/human-capital/issues-modal/issues-modal.component';
// import { AddprocessComponent } from './components/organization/components/context/addprocess/addprocess.component';
import { NoDataComponent } from './components/no-data/no-data.component';
import { FaqModalComponent } from './components/masters/general/faq-modal/faq-modal.component';
import { MeetingCategoryModalComponent } from './components/masters/mrm/meeting-category-modal/meeting-category-modal.component';
import { MeetingCriteriaModalComponent } from './components/masters/mrm/meeting-criteria-modal/meeting-criteria-modal.component';
import { MeetingObjectiveModalComponent } from './components/masters/mrm/meeting-objective-modal/meeting-objective-modal.component';
import { MeetingAgendaModalComponent } from './components/masters/mrm/meeting-agenda-modal/meeting-agenda-modal.component';
import { ControlEfficiencyMeasuresModalComponent } from './components/masters/risk-management/control-efficiency-measures-modal/control-efficiency-measures-modal.component';
import { VenueModalComponent } from './components/masters/general/venue-modal/venue-modal.component';
import { ProjectTimeCategoryModalComponent } from './components/masters/project-management/project-time-category-modal/project-time-category-modal.component';
import { ProjectCostCategoryModalComponent } from './components/masters/project-management/project-cost-category-modal/project-cost-category-modal.component';
import { ProjectCategoryModalComponent } from './components/masters/project-management/project-category-modal/project-category-modal.component';
import { KhDocumentsComponent } from './components/business-assessments/kh-documents/kh-documents.component';
import { RecursiveMeetingAgendaComponent } from './components/masters/mrm/recursive-meeting-agenda/recursive-meeting-agenda.component';
import { MeetingAgendaLoopComponent } from './components/masters/mrm/meeting-agenda-loop/meeting-agenda-loop.component';
import { ProjectTaskCategoryModalComponent } from './components/masters/project-management/project-task-category-modal/project-task-category-modal.component';
import { PreviewModalComponent } from './preview-modal/preview-modal.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { UserInfoPopupComponent } from './components/shared/user-info-popup/user-info-popup.component';
import { ProjectRolesModalComponent } from './components/masters/project-management/project-roles-modal/project-roles-modal.component';
import { ProfileQualificationModalComponent } from './components/my-profile/Profile/profile-qualification-modal/profile-qualification-modal.component';
import { ProfileExperienceModalComponent } from './components/my-profile/Profile/profile-experience-modal/profile-experience-modal.component';
import { ProfileCertificateModalComponent } from './components/my-profile/Profile/profile-certificate-modal/profile-certificate-modal.component';
import { UserPopupBoxComponent } from './components/user-popup-box/user-popup-box.component';
import { FrameworkModalComponent } from './components/business-assessments/framework-modal/framework-modal.component';
import { AssessmentModalComponent } from './components/business-assessments/assessment-modal/assessment-modal.component';

import { NoDataListComponent } from './components/no-data-list/no-data-list.component';
// import { IssueListLoaderComponent } from 'src/app/modules/organization/components/loaders/issue-list-loader/issue-list-loader.component';
import { AddControlsModalComponent } from './components/shared/add-controls-modal/add-controls-modal.component';
import { ProfileEditModalComponent } from './components/my-profile/Profile/profile-edit-modal/profile-edit-modal.component';
import { MailSendPopupComponent } from './components/mail-send-popup/mail-send-popup.component';
import { DesignationCompetencyModalComponent } from './components/masters/human-capital/designation-competency-modal/designation-competency-modal.component';
import { DesignationCompetencyAddModalComponent } from './components/masters/human-capital/designation-competency-add-modal/designation-competency-add-modal.component';
import { NoChartDataComponent } from './components/no-chart-data/no-chart-data.component';
import { LoaderComponent } from './components/loader/loader.component';
import { DocumentsLoaderComponent } from './components/business-assessments/kh-documents/documents-loader/documents-loader.component';
import { QuickCorrectionModalComponent } from "./components/shared/quick-correction-modal/quick-correction-modal.component";
import { ShareComponent } from './components/share/share.component';
import { MeetingsAddParticipantsModelComponent } from './components/masters/mrm/meetings-add-participants-model/meetings-add-participants-model.component';
import { AddControlComponent } from "./components/bpm/add-control/add-control.component";
import { ControlPopupComponent } from "./components/bpm/control-select-popup/control-popup.component";
import { ImportComponent } from './components/import/import.component';
import { ComplianceAreaModalComponent } from './components/masters/compliance-management/compliance-area-modal/compliance-area-modal.component';
import { CurrencyModalComponent } from './components/masters/general/currency-modal/currency-modal.component';
import { SuccessPopupComponent } from './components/success-popup/success-popup.component';
import { IncidentDamageTypeModalComponent } from './components/masters/incident-management/incident-damage-type-modal/incident-damage-type-modal.component';
import { IncidentCategoriesModelComponent } from './components/masters/incident-management/incident-categories/incident-categories-model.component';
import { RiskTreatmentUpdateModalComponent } from './components/risk-management/risk-treatment-update-modal/risk-treatment-update-modal.component';
import { IncidentSubCategoryModelComponent } from './components/masters/incident-management/incident-sub-category/incident-sub-category-model/incident-sub-category-model.component';
import { IncidentTypeModalComponent } from './components/masters/incident-management/incident-type-modal/incident-type-modal.component';
import { JsoCategoryModalComponent } from './components/masters/jso/jso-category-modal/jso-category-modal.component';
import { WorkflowUserAddModalComponent } from './components/workflow-popups/workflow-user-add-modal/workflow-user-add-modal.component';
import { WorkflowTeamAddModalComponent } from './components/workflow-popups/workflow-team-add-modal/workflow-team-add-modal.component';
import { WorkflowRoleAddModalComponent } from './components/workflow-popups/workflow-role-add-modal/workflow-role-add-modal.component';
import { WorkflowHeadUnitAddModalComponent } from './components/workflow-popups/workflow-head-unit-add-modal/workflow-head-unit-add-modal.component';
import { WorkflowPopupModalComponent } from './components/workflow-popups/workflow-popup-modal/workflow-popup-modal.component';
import { WorkflowDesignationModalComponent } from './components/workflow-popups/workflow-designation-modal/workflow-designation-modal.component';
import { JsoSubCategoryModalComponent } from './components/masters/jso/jso-sub-category-modal/jso-sub-category-modal.component';
import { RiskSourceModalComponent } from './components/masters/risk-management/risk-source-modal/risk-source-modal.component';
import { RiskLibraryModalComponent } from './components/masters/risk-management/risk-library-modal/risk-library-modal.component';
import { UnsafeActionObservedGroupModalComponent } from './components/masters/jso/unsafe-action-observed-group-modal/unsafe-action-observed-group-modal.component';
import { UnsafeActionSubCategoryModalComponent } from './components/masters/jso/unsafe-action-sub-category-modal/unsafe-action-sub-category-modal.component';
import { IncidentRootCauseModalComponent } from './components/masters/incident-management/incident-root-cause-modal/incident-root-cause-modal.component';
import { UnsafeActionCategoryModalComponent } from './components/masters/jso/unsafe-action-category-modal/unsafe-action-category-modal.component';
import { JsoObservationsModelComponent } from './components/jso/jso-observations/jso-observations-model/jso-observations-model.component';
import { LocationListModalComponent } from './components/risk-management/location-list-modal/location-list-modal.component';
import { ProjectsModalComponent } from './components/risk-management/projects-modal/projects-modal.component';
import { CustomerModalComponent } from './components/risk-management/customer-modal/customer-modal.component';
import { ProductModalComponent } from './components/risk-management/product-modal/product-modal.component';
import { KeyRiskIndicatorsComponent } from './components/masters/risk-management/key-risk-indicators/key-risk-indicators.component';
import { AddRcaModalComponent } from './components/risk-management/add-rca-modal/add-rca-modal.component';
import { JsoObservationTypeModalComponent } from './components/masters/jso/jso-observation-type-modal/jso-observation-type-modal.component';
import { RiskLibraryPopupComponent } from './components/masters/risk-management/risk-library-popup/risk-library-popup.component';
import { CustomDatePopupComponent } from './components/custom-date-popup/custom-date-popup.component';
import { AddKriModalComponent } from './components/risk-management/add-kri-modal/add-kri-modal.component';
import { StrategicObjectivesModalComponent } from './components/masters/risk-management/strategic-objectives-modal/strategic-objectives-modal.component';
import { StrategicObjectiveMappingComponent } from './components/risk-management/strategic-objective-mapping/strategic-objective-mapping.component';
import { UnsafeActionModelComponent } from './components/jso/jso-unsafe-actions/unsafe-action-model/unsafe-action-model.component';
import { ComplianceSectionModalComponent } from './components/masters/compliance-management/compliance-section-modal/compliance-section-modal.component';
import { ImpactCategoryAddModalComponent } from './components/masters/risk-management/impact-category-add-modal/impact-category-add-modal.component';
import { RiskImpactAnalysisModalComponent } from './components/risk-management/risk-impact-analysis-modal/risk-impact-analysis-modal.component';
import { IncidentDamageSeverityModalComponent } from './components/masters/incident-management/incident-damage-severity-modal/incident-damage-severity-modal.component';
import { ComplianceFrequencyModalComponent } from './components/masters/compliance-management/compliance-frequency-modal/compliance-frequency-modal.component';
import { ComplianceStatusModalComponent } from './components/masters/compliance-management/compliance-status-modal/compliance-status-modal.component';
import { SlaContractModelComponent } from './components/compliance-management/sla-contract-model/sla-contract-model.component';
import { SlaCategoryModalComponent } from './components/masters/compliance-management/sla-category-modal/sla-category-modal.component';
import { RiskSubCategoryModalComponent } from './components/masters/risk-management/risk-sub-category-modal/risk-sub-category-modal.component';
import { WorkflowSystemRoleComponent } from './components/workflow-popups/workflow-system-role/workflow-system-role.component';
import { RiskWorkflowHistoryComponent } from './components/risk-management/risk-workflow-history/risk-workflow-history.component';
import { RiskInfoWorkflowComponent } from './components/risk-management/risk-info-workflow/risk-info-workflow.component';
import { WorkflowCommentPopupComponent } from './components/risk-management/workflow-comment-popup/workflow-comment-popup.component';
import { RiskJourneyWorkflowComponent } from './components/risk-management/risk-journey-workflow/risk-journey-workflow.component';
import { RiskJourneyWorkflowHistoryComponent } from './components/risk-management/risk-journey-workflow-history/risk-journey-workflow-history.component';
import { WorkflowJourneyCommentPopupComponent } from './components/risk-management/workflow-journey-comment-popup/workflow-journey-comment-popup.component';
import { CloseUnsafeActionModalComponent } from './components/jso/jso-unsafe-actions/close-unsafe-action-modal/close-unsafe-action-modal.component';
import { BusinessApplicationTypeModalComponent } from './components/masters/bcm/business-application-type-modal/business-application-type-modal.component';
import { BiaRatingNewComponent } from './components/bcm/bia-rating-new/bia-rating-new.component';
import { ImpactCategoryNewComponent } from './components/bcm/impact-category-new/impact-category-new.component';
import { ImpactScenarioNewComponent } from './components/bcm/impact-scenario-new/impact-scenario-new.component';
import { ImpactAreaNewComponent } from './components/bcm/impact-area-new/impact-area-new.component';
import { BiaScaleNewComponent } from './components/bcm/bia-scale-new/bia-scale-new.component';
import { TierConfigNewComponent } from './components/bcm/tier-config-new/tier-config-new.component';
import { ShowArciCountMatrixComponent } from './components/bpm/show-arci-count-matrix/show-arci-count-matrix.component';
import { ChooseRelatedProcessComponent } from './components/bpm/choose-related-process/choose-related-process.component';
import { SuppliersModalComponent } from './components/masters/suppliers-management/suppliers-modal/suppliers-modal.component';
import { BusinessApplicationsModalComponent } from './components/masters/bcm/business-applications-modal/business-applications-modal.component';
import { AppTypeAddModalComponent } from './components/bpm/app-type-add-modal/app-type-add-modal.component';
import { FocusAreaModalComponent } from './components/masters/strategy/focus-area-modal/focus-area-modal.component';
import { ObjectiveModalComponent } from './components/masters/strategy/objective-modal/objective-modal.component';
import { ProcessOperationFrequencyModalComponent } from "./components/masters/bcm/process-operation-frequency-modal/process-operation-frequency-modal.component";
import { ProcessOperationModeModalComponent } from "./components/masters/bcm/process-operation-mode-modal/process-operation-mode-modal.component";
import { ProcessAccessibilityModalComponent } from './components/masters/bpm/process-accessibility-modal/process-accessibility-modal.component';
import { StorageTypesModalComponent } from './components/masters/bpm/storage-types-modal/storage-types-modal.component';
import { RecordRetentionPoliciesModalComponent } from "./components/masters/bpm/record-retention-policies-modal/record-retention-policies-modal.component";
import { StorageLocationsModalComponent } from './components/masters/bpm/storage-locations-modal/storage-locations-modal.component';
import { BackupFrequenciesModalComponent } from './components/masters/bpm/backup-frequencies-modal/backup-frequencies-modal.component';
import { AddVitalRecordsComponent } from './components/bpm/add-vital-records/add-vital-records.component';
import { PeriodicBackupModalComponent } from './components/masters/bpm/periodic-backup-modal/periodic-backup-modal.component';
import { BiaTireModalComponent } from './components/masters/bcm/bia-tire-modal/bia-tire-modal.component';
import { FileUploadPopupComponent } from './components/file-upload-popup/file-upload-popup.component';
import { BiaImpactCategoryInformationModalComponent } from './components/masters/bcm/bia-impact-category-information-modal/bia-impact-category-information-modal.component';
import { ControlModeModalComponent } from './components/bpm/control-mode-modal/control-mode-modal.component';
import { TrainingCategoryModalComponent } from './components/masters/training/training-category-modal/training-category-modal.component';
import { TrainingStatusModalComponent } from './components/masters/training/training-status-modal/training-status-modal.component';
import { AssetTypesModalComponent } from './components/masters/asset-management/asset-types-modal/asset-types-modal.component';
import { AssetCategoryModalComponent } from './components/masters/asset-management/asset-category-modal/asset-category-modal.component';
import { TrainingModalComponent } from "./components/training/training-modal/training-modal.component";
import { OrganisationChangeModalComponent } from "./components/training/organisation-change-modal/organisation-change-modal.component";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { AssetSubCategoryModalComponent } from './components/masters/asset-management/asset-sub-category-modal/asset-sub-category-modal.component';
import { AssetLocationModalComponent } from './components/masters/asset-management/asset-location-modal/asset-location-modal.component';
import { TrainingCompleteModalComponent } from './components/training/training-complete-modal/training-complete-modal.component';
import { StrategyInitiativeActionsModalComponent } from './components/masters/strategy/strategy-initiative-actions-modal/strategy-initiative-actions-modal.component';
import { IncidentWorkflowCommentPopupComponent } from "./components/incident/incident-workflow-comment-popup/incident-workflow-comment-popup.component";
import { IncidentInvestigationWorkflowHistoryComponent } from "./components/incident/incident-investigation-workflow-history/incident-investigation-workflow-history.component";
import { IncidentInvestigationWorkflowComponent } from "./components/incident/incident-investigation-workflow/incident-investigation-workflow.component";
import { IncidentInfoWorkflowCommentComponent } from './components/incident/incident-info-workflow-comment/incident-info-workflow-comment.component';
import { IncidentInfoWorkflowPopupComponent } from './components/incident/incident-info-workflow-popup/incident-info-workflow-popup.component';
import { IncidentInfoWorkflowHistoryComponent } from './components/incident/incident-info-workflow-history/incident-info-workflow-history.component';
import { IncidentCaWorkflowPopupComponent } from './components/incident/incident-ca-workflow-popup/incident-ca-workflow-popup.component';
import { IncidentCaWorkflowCommentComponent } from './components/incident/incident-ca-workflow-comment/incident-ca-workflow-comment.component';
import { IncidentCaWorkflowHistoryComponent } from './components/incident/incident-ca-workflow-history/incident-ca-workflow-history.component';
import { ComplianceRegisterWorkflowCommentComponent } from "./components/compliance-management/compliance-register-workflow-comment/compliance-register-workflow-comment.component";
import { ComplianceRegisterWorkflowPopupComponent } from "./components/compliance-management/compliance-register-workflow-popup/compliance-register-workflow-popup.component";
import { ComplianceRegisterWorkflowHistoryComponent } from "./components/compliance-management/compliance-register-workflow-history/compliance-register-workflow-history.component";
import { SlaContractWorkflowCommentComponent } from "./components/compliance-management/sla-contract-workflow-comment copy/sla-contract-workflow-comment.component";
import { SlaContractWorkflowPopupComponent } from "./components/compliance-management/sla-contract-workflow-popup copy/sla-contract-workflow-popup.component";
import { SlaContractWorkflowHistoryComponent } from "./components/compliance-management/sla-contract-workflow-history copy/sla-contract-workflow-history.component";
import { BusinessApplicationModalComponent } from './components/asset-management/asset-register/business-application-modal/business-application-modal.component';
import { ServiceModalComponent } from './components/asset-management/asset-register/service-modal/service-modal.component';
import { PhysicalConditionRankingsModalComponent } from './components/masters/asset-management/physical-condition-rankings-modal/physical-condition-rankings-modal.component';
import { AssetMatrixCategoriesModalComponent } from './components/masters/asset-management/asset-matrix-categories-modal/asset-matrix-categories-modal.component';
import { AssetMaintenanceCategoriesModalComponent } from './components/masters/asset-management/asset-maintenance-categories-modal/asset-maintenance-categories-modal.component';
import { AddAssetMatrixComponent } from './components/asset-management/asset-matrix/add-asset-matrix/add-asset-matrix.component';
import { AddAssetCategoryComponent } from './components/asset-management/asset-matrix/add-asset-category/add-asset-category.component';
import { AddBcpComponent } from "src/app/modules/bcm/pages/bcp/components/add-bcp/add-bcp.component";
import { MaintenanceShutdownComponent } from './components/asset-management/asset-register/maintenance-shutdown/maintenance-shutdown.component';
import { AssetMaintenanceReviewComponent } from './components/asset-management/asset-register/asset-maintenance-review/asset-maintenance-review.component';
import { MaintenanceShutdownReviewComponent } from './components/asset-management/asset-register/maintenance-shutdown-review/maintenance-shutdown-review.component';
import { StrategicFocusAreaMappingComponent } from './components/risk-management/strategic-focus-area-mapping/strategic-focus-area-mapping.component';
import { CommonDetailsReportLoaderComponent } from "./components/shared/common-details-report-loader/common-details-report-loader.component";
import { IsmsVulnerabilityModalComponent } from './components/masters/isms/isms-vulnerability-modal/isms-vulnerability-modal.component';
import { BcsTypeModalComponent } from './components/masters/bcm/bcs-type-modal/bcs-type-modal.component';
import { ContextNoDataComponent } from "../modules/organization/components/context/context-no-data/context-no-data.component";
import { NoImageDataComponent } from './components/no-image-data/no-image-data.component';
import { TestAndExerciseRecoveryLevelModalComponent } from "./components/masters/bcm/test-and-exercise-recovery-level-modal/test-and-exercise-recovery-level-modal.component";
import { TestAndExerciseTypesModalComponent } from "./components/masters/bcm/test-and-exercise-types-modal/test-and-exercise-types-modal.component";
import { TestAndExerciseCommunicationsModalComponent } from "./components/masters/bcm/test-and-exercise-communications-modal/test-and-exercise-communications-modal.component";
import { TableNoDataImageComponent } from './components/table-no-data-image/table-no-data-image.component';
import { TestAndExerciseChecklistModalComponent } from './components/masters/bcm/test-and-exercise-checklist-modal/test-and-exercise-checklist-modal.component';
import { AssetMappingComponent } from './components/asset-management/asset-mapping/asset-mapping.component';
import { ModuleSubmenuModalComponent } from "./components/masters/general/module-submenu-modal/module-submenu-modal.component";
import { ModuleMenuModalComponent } from "./components/masters/general/modulemenu-modal/modulemenu-modal.component";
import { IsmsRiskTreatmentUpdateModalComponent } from './components/isms/isms-risk-treatment-update-modal/isms-risk-treatment-update-modal.component';
import { CorrectiveActionResolveModalComponent } from 'src/app/modules/internal-audit/pages/audit-findings/components/corrective-action-resolve-modal/corrective-action-resolve-modal.component';
import { CustomerComplaintSourceModalComponent } from './components/masters/customer-engagement/customer-complaint-source-modal/customer-complaint-source-modal.component';
import { RiskListComponent } from "./components/risk-management/loaders/risk-list/risk-list.component";
import { RiskContextDetailComponent } from "./components/risk-management/loaders/risk-context-detail/risk-context-detail.component";
import { RiskImpactAnalysisLoaderComponent } from "./components/risk-management/loaders/risk-impact-analysis-loader/risk-impact-analysis-loader.component";
import { RiskKriLoaderComponent } from "./components/risk-management/loaders/risk-kri-loader/risk-kri-loader.component";
import { ResidualRiskLoaderComponent } from "./components/risk-management/loaders/residual-risk-loader/residual-risk-loader.component";
import { RiskAssessmentLoaderComponent } from "./components/risk-management/loaders/risk-assessment-loader/risk-assessment-loader.component";
import { RiskJourneyLoaderComponent } from "./components/risk-management/loaders/risk-journey-loader/risk-journey-loader.component";
import { RiskMappingLoaderComponent } from "./components/risk-management/loaders/risk-mapping-loader/risk-mapping-loader.component";
import { RiskTreatmentDetailLoaderComponent } from "./components/risk-management/loaders/risk-treatment-detail-loader/risk-treatment-detail-loader.component";
import { RiskWorkflowLoaderComponent } from "./components/risk-management/loaders/risk-workflow-loader/risk-workflow-loader.component";
import { RiskIndividualWorkflowLoaderComponent } from "./components/risk-management/loaders/risk-individual-workflow-loader/risk-individual-workflow-loader.component";
import { ISMSMatrixDetailLoaderComponent } from "./components/risk-management/loaders/isms-matrix-detail-loader/isms-matrix-detail-loader.component";
import { ImpactListComponent } from "./components/risk-management/loaders/impact-list/impact-list.component";
import { LikelihoodListComponent } from "./components/risk-management/loaders/likelihood-list/likelihood-list.component";
import { RiskMatrixLoaderComponent } from "./components/risk-management/loaders/risk-matrix-loader/risk-matrix-loader.component";
import { RiskHeatmapLoaderComponent } from "./components/risk-management/loaders/risk-heatmap-loader/risk-heatmap-loader.component";
import { HeatmapByDepartmentLoaderComponent } from "./components/risk-management/loaders/heatmap-by-department-loader/heatmap-by-department-loader.component";
import { BiaDetailsPageComponent } from "src/app/modules/bcm/pages/bia/pages/bia-detail/bia-details-page/bia-details-page.component";
import { BiaDetailsLoaderComponent } from "src/app/modules/bcm/components/bia-details-loader/bia-details-loader.component";
import { AddSoaComponent } from './components/isms/add-soa/add-soa.component';
import { SoaImplementationStatusesModalComponent } from './components/masters/isms/soa-implementation-statuses-modal/soa-implementation-statuses-modal.component';
import { ProjectContractTypeModalComponent } from './components/masters/project-monitoring/project-contract-type-modal/project-contract-type-modal.component';
import { IsmsWorkflowCommentPopupComponent } from './components/isms/isms-workflow-comment-popup/isms-workflow-comment-popup.component';
import { IsmsWorkflowJourneyCommentPopupComponent } from './components/isms/isms-workflow-journey-comment-popup/isms-workflow-journey-comment-popup.component';
import { IsmsRiskInfoWorkflowComponent } from './components/isms/isms-risk-info-workflow/isms-risk-info-workflow.component';
import { IsmsRiskJourneyWorkflowComponent } from './components/isms/isms-risk-journey-workflow/isms-risk-journey-workflow.component';
import { IsmsRiskWorkflowHistoryComponent } from './components/isms/isms-risk-workflow-history/isms-risk-workflow-history.component';
import { IsmsRiskJourneyWorkflowHistoryComponent } from './components/isms/isms-risk-journey-workflow-history/isms-risk-journey-workflow-history.component';
import { ProjectPriorityModalComponent } from "./components/masters/project-monitoring/project-priority-modal/project-priority-modal/project-priority-modal.component";
import { ProjectThemeModalComponent } from './components/masters/project-monitoring/project-theme-modal/project-theme-modal.component';
import { ProjectObjectiveModalComponent } from './components/masters/project-monitoring/project-objective-modal/project-objective-modal.component';
import { AssetMaintenanceScheduleHistoryComponent } from './components/asset-management/asset-register/asset-maintenance-schedule-history/asset-maintenance-schedule-history.component';
import { AssetMaintenanceScheduleHistoryPreviewComponent } from './components/asset-management/asset-register/asset-maintenance-schedule-history-preview/asset-maintenance-schedule-history-preview.component';

import { AssetMaintenanceShutdownHistoryComponent } from './components/asset-management/asset-register/asset-maintenance-shutdown-history/asset-maintenance-shutdown-history.component';

import { WorkflowLoaderComponent } from "./components/common-loader/workflow-loader/workflow-loader.component";
import { ProjectKpiModalComponent } from './components/masters/project-monitoring/project-kpi-modal/project-kpi-modal.component';
import { HistoryLoaderComponent } from './components/asset-management/asset-register/loader/history-loader/history-loader.component';
import { DivisionLoaderComponent } from './components/common-loader/division-loader/division-loader.component';
import { CorrectiveActionLoaderComponent } from './components/common-loader/corrective-action-loader/corrective-action-loader.component';
import { FindingDetailsCorrectiveActionLoaderComponent } from './components/common-loader/finding-details-corrective-action-loader/finding-details-corrective-action-loader.component';
import { RiskImpactGuidelineModalComponent } from './components/masters/risk-management/risk-impact-guideline-modal/risk-impact-guideline-modal.component';
import { ReportLoaderComponent } from './components/common-loader/report-loader/report-loader.component';
import { IncidentReportDetailComponent } from './components/incident/incident-report-detail/incident-report-detail.component';
import { ProjectTaskPrioritiesModalComponent } from "./components/masters/project-management/task-priorities/task-priorities-modal.component";
import { ReportBookLoaderComponent } from './components/incident/incident-report-detail/component/report-book-loader/report-book-loader.component';
import { SubMenuDropDownComponent } from './components/sub-menu-drop-down/sub-menu-drop-down.component';
import { StrategyThemeModalComponent } from './components/masters/strategy/strategy-theme-modal/strategy-theme-modal.component';
import { ReportNoDataComponent } from './components/report-no-data/report-no-data.component';
import { AmAuditPlanModalComponent } from './components/audit-management/am-audit-plan-modal/am-audit-plan-modal.component';
import { AmAuditPlanLoaderComponent } from './components/audit-management/loaders/am-audit-plan-loader/am-audit-plan-loader.component';
import { AmAuditCategoryModalComponent } from './components/masters/audit-management/am-audit-category-modal/am-audit-category-modal.component';
import { EventTypeModalComponent } from './components/masters/event-monitoring/event-type-modal/event-type-modal.component';
import { EntranceModalComponent } from './components/masters/event-monitoring/entrance-modal/entrance-modal.component';
import { PeriodicityModalComponent } from './components/masters/event-monitoring/periodicity-modal/periodicity-modal.component';

import { RangeModalComponent } from './components/masters/event-monitoring/range-modal/range-modal.component';
import { DimensionModalComponent } from './components/masters/event-monitoring/dimension-modal/dimension-modal.component';
import { SpaceTypeModalComponent } from './components/masters/event-monitoring/space-type-modal/space-type-modal.component';
import { AclListComponent } from './components/audit-management/loaders/acl-list/acl-list.component';



import { TargetAudienceModalComponent } from './components/masters/event-monitoring/target-audience-modal/target-audience-modal.component';
import { FourColumnLoaderComponent } from './components/common-loader/four-column-loader/four-column-loader.component';
import { FiveColumnLoaderComponent } from './components/common-loader/five-column-loader/five-column-loader.component';
import { SixColumnLoaderComponent } from './components/common-loader/six-column-loader/six-column-loader.component';
import { SevenColumnLoaderComponent } from './components/common-loader/seven-column-loader/seven-column-loader.component';
import { EightColumnLoaderComponent } from './components/common-loader/eight-column-loader/eight-column-loader.component';
import { NineColumnLoaderComponent } from './components/common-loader/nine-column-loader/nine-column-loader.component';
import { TenColumnLoaderComponent } from './components/common-loader/ten-column-loader/ten-column-loader.component';
import { EventClosureChecklistModalComponent } from './components/masters/event-monitoring/event-closure-checklist-modal/event-closure-checklist-modal.component';
import { EventEquipmentModalComponent } from './components/masters/event-monitoring/event-equipment-modal/event-equipment-modal.component';
import { AmAnnualAuditPlanModalComponent } from './components/audit-management/am-annual-audit-plan-modal/am-annual-audit-plan-modal.component';
import { AuditPlanWorkflowHistoryComponent } from './components/audit-management/audit-plan-workflow-history/audit-plan-workflow-history.component';
import { AuditPlanWorkflowComponent } from './components/audit-management/audit-plan-workflow/audit-plan-workflow.component';
import { AuditPlanWorkflowCommentComponent } from './components/audit-management/audit-plan-workflow-comment/audit-plan-workflow-comment.component';
import { CommunicationModalComponent } from "./components/masters/event-monitoring/communication-modal/communication-modal.component";
import { EventEngagementStrategyModalComponent } from './components/masters/event-monitoring/event-engagement-strategy-modal/event-engagement-strategy-modal.component';
import { EventInfluenceModalComponent } from './components/masters/event-monitoring/event-influence-modal/event-influence-modal.component';
import { LocationsModalComponent } from './components/masters/event-monitoring/locations-modal/locations-modal.component';
import { SupportivesModalComponent } from './components/masters/event-monitoring/supportives-modal/supportives-modal.component';
import { StatusModalComponent } from "./components/masters/event-monitoring/status-modal/status-modal.component";
import { AnnualAuditPlanWorkflowHistoryComponent } from './components/audit-management/annual-audit-plan-workflow-history/annual-audit-plan-workflow-history.component';
import { AnnualAuditPlanWorkflowCommentComponent } from './components/audit-management/annual-audit-plan-workflow-comment/annual-audit-plan-workflow-comment.component';
import { AnnualAuditPlanWorkflowComponent } from './components/audit-management/annual-audit-plan-workflow/annual-audit-plan-workflow.component';
import { KpiTypesStategyModalComponent } from './components/masters/strategy/kpi-types-stategy-modal/kpi-types-stategy-modal.component';
import { StrategyObjectiveTypesModalComponent } from './components/masters/strategy/strategy-objective-types-modal/strategy-objective-types-modal.component';
import { EventMaturityMatrixParameterModalComponent } from './components/masters/event-monitoring/event-maturity-matrix-parameter-modal/event-maturity-matrix-parameter-modal.component';
import { AmAuditModalComponent } from './components/audit-management/am-audit-modal/am-audit-modal.component';
import { EventMaturityMatrixTypeModalComponent } from "./components/masters/event-monitoring/event-maturity-matrix-type-modal/event-maturity-matrix-type-modal.component";
import { InformationRequestAddModalComponent } from './components/audit-management/information-request-add-modal/information-request-add-modal.component';
import { BpmSuppliersModalComponent } from "./components/masters/bpm/bpm-suppliers-modal/bpm-suppliers-modal.component";
import { KhCheckListModalComponent } from "./components/masters/knowledge-hub/check-list-modal/kh-check-list-modal.component";
import { ChecklistModalComponent } from './components/masters/event-monitoring/checklist-modal/checklist-modal.component';
import { MsAuditCategoryModalComponent } from './components/masters/ms-audit-management/ms-audit-category-modal/ms-audit-category-modal.component';
import { AddRiskMappingComplianceComponent } from "../modules/compliance-management/component/add-risk-mapping-compliance/add-risk-mapping-compliance.component";
import { MsAuditModeModalComponent } from "./components/masters/ms-audit-management/ms-audit-mode-modal/ms-audit-mode-modal.component";
import { AmAuditDocumentModalComponent } from './components/audit-management/am-audit-document-modal/am-audit-document-modal.component';
import { CorrectiveActionStatusModel } from "./components/masters/audit-management/corrective-action-status/corrective-action-status-model.component";
import { AmCommencementLetterModalComponent } from './components/audit-management/am-commencement-letter-modal/am-commencement-letter-modal.component';
import { AmAuditMeetingModalComponent } from './components/audit-management/am-audit-meeting-modal/am-audit-meeting-modal.component';
import { MsAuditChecklistGroupModel } from './components/masters/ms-audit-management/ms-audit-checklist-group-model/ms-audit-checklist-group-model.component';
import { TemplateLoaderComponent } from "./components/common-loader/template-loader/template-loader.component";
import { AmAuditTestPlanModalComponent } from './components/audit-management/am-audit-test-plan-modal/am-audit-test-plan-modal.component';
import { ExternalFindingCategoriesModalComponent } from "./components/masters/external-audit/external-finding-categories-modal/external-finding-categories-modal.component";
import { AmAuditFieldWorkModalComponent } from './components/audit-management/am-audit-field-work-modal/am-audit-field-work-modal.component';
import { ComplianceMappingComponent } from './components/mapping/compliance-mapping/compliance-mapping.component';
import { AmAuditFindingModalComponent } from './components/audit-management/am-audit-finding-modal/am-audit-finding-modal.component';
import { IncidentMappingComponent } from './components/mapping/incident-mapping/incident-mapping.component';
import { MeetingMappingComponent } from './components/mapping/meeting-mapping/meeting-mapping.component';
import { TrainingMappingComponent } from './components/mapping/training-mapping/training-mapping.component';
import { AuditTestPlanStatusModalComponent } from './components/masters/audit-management/audit-test-plan-status-modal/audit-test-plan-status-modal.component';
import { ObjectiveTypeModalComponent } from './components/masters/event-monitoring/objective-type-modal/objective-type-modal.component';
import { AmAuditDocumentTypeModelComponent } from './components/masters/audit-management/am-audit-document-type-model/am-audit-document-type-model.component';
import { AmFindingCaAddComponent } from './components/audit-management/am-finding-ca-add/am-finding-ca-add.component';
import { FindingCaUpdateModalComponent } from './components/audit-management/finding-ca-update-modal/finding-ca-update-modal.component';
import { NgbDateCustomParserFormatterService } from "../core/services/general/NgbDateCustomParserFormatter/ngb-date-custom-parser-formatter.service";
import { AuditFindingMappingComplianceComponent } from 'src/app/modules/compliance-management/component/audit-finding-mapping-compliance/audit-finding-mapping-compliance.component';
import { AmReportUpdateModalComponent } from './components/audit-management/am-report-update-modal/am-report-update-modal.component';
import { AmReportWorkflowComponent } from './components/audit-management/am-report-workflow/am-report-workflow.component';
import { AmReportWorkflowHistoryComponent } from './components/audit-management/am-report-workflow-history/am-report-workflow-history.component';
import { AmReportWorkflowCommentComponent } from './components/audit-management/am-report-workflow-comment/am-report-workflow-comment.component';
import { AmDraftReportWorkflowComponent } from './components/audit-management/am-draft-report-workflow/am-draft-report-workflow.component';
import { AmDraftReportWorkflowHistoryComponent } from './components/audit-management/am-draft-report-workflow-history/am-draft-report-workflow-history.component';
import { AmDraftReportWorkflowCommentComponent } from './components/audit-management/am-draft-report-workflow-comment/am-draft-report-workflow-comment.component';
import { AmFinalReportWorkflowCommentComponent } from './components/audit-management/am-final-report-workflow-comment/am-final-report-workflow-comment.component';
import { AmFinalReportWorkflowComponent } from './components/audit-management/am-final-report-workflow/am-final-report-workflow.component';
import { AmFinalReportWorkflowHistoryComponent } from './components/audit-management/am-final-report-workflow-history/am-final-report-workflow-history.component';
import { AmInnerDocumentVersionsComponent } from './components/audit-management/am-inner-document-versions/am-inner-document-versions.component'
import { ModalUserPopupBoxComponent } from './components/modal-user-popup-box/modal-user-popup-box.component';
import { AmCsaModalComponent } from './components/audit-management/am-csa-modal/am-csa-modal.component';
import { CsaQuestionModalComponent } from './components/audit-management/csa-question-modal/csa-question-modal.component';
import { EventRiskImpactAreaModelComponent } from './components/masters/event-monitoring/event-risk-impact-area-model/event-risk-impact-area-model.component';
import { AuditControlStatusComponent } from './components/masters/audit-management/audit-control-status/audit-control-status.component'
import { ReportAccordionLoaderComponent } from "./components/common-loader/report-accordion-loader/report-accordion-loader.component";
import { IsmsRiskImpactGuidelineModalComponent } from './components/masters/isms/isms-risk-impact-guideline-modal/isms-risk-impact-guideline-modal.component';
import { StrategyMappingOcDivComponent } from './components/strategy-management/strategy-mapping-oc-div/strategy-mapping-oc-div.component';
import { StrategyMappingOcViewComponent } from './components/strategy-management/strategy-mapping-oc-view/strategy-mapping-oc-view.component';

import { CustomersDetailsLoaderComponent } from 'src/app/modules/customer-engagement/component/loader/customers-details-loader/customers-details-loader.component';
import { RiskOverviewLoaderComponent } from "./components/risk-management/loaders/risk-overview-loader/risk-overview-loader.component";
import { StrategyPerformancesModalComponent } from './components/masters/strategy/strategy-performances-modal/strategy-performances-modal.component';
import { KpiMappingComponent } from './components/mapping/kpi-mapping/kpi-mapping.component';
import { StrategyMappingObjectiveTypeChildViewComponent } from './components/strategy-management/strategy-mapping-objective-type-child-view/strategy-mapping-objective-type-child-view.component';
import { MockDrillTypeModelComponent } from './components/masters/mock-drill/mock-drill-type-model/mock-drill-type-model.component';
import { MockDrillResponseServiceModelComponent } from "./components/masters/mock-drill/mock-drill-response-service-model/mock-drill-response-service-model.component";
import { MockDrillEvacuationRoleModelComponent } from './components/masters/mock-drill/mock-drill-evacuation-role-model/mock-drill-evacuation-role-model.component';
import { MockDrillChecksModelComponent } from './components/masters/mock-drill/mock-drill-checks-model/mock-drill-checks-model.component';
import { MockDrillScenarioModelComponent } from './components/masters/mock-drill/mock-drill-scenario-model/mock-drill-scenario-model.component';
import { EventMappingComponent } from "./components/mapping/event-mapping/event-mapping.component";
import { SitesMappingComponent } from "./components/mapping/sites-mapping/sites-mapping.component";
import { MsAuditFindingCategoriesModalComponent } from "./components/masters/ms-audit-management/ms-audit-finding-categories-modal/ms-audit-finding-categories-modal.component";
import { MsAuditPlanCriteriaModalComponent } from "./components/masters/ms-audit-management/ms-audit-plan-criteria-modal/ms-audit-plan-criteria-modal.component";
import { MsAuditPlanObjectiveModalComponent } from "./components/masters/ms-audit-management/ms-audit-plan-objective-modal/ms-audit-plan-objective-modal.component";
import { SmallNoDataComponent } from './components/small-no-data/small-no-data.component';
import { ProjectMonitoringMappingComponent } from './components/mapping/project-monitoring-mapping/project-monitoring-mapping.component';
import { ProjectManagementMappingComponent } from './components/mapping/project-management-mapping/project-management-mapping.component';
import { AddCyberIncidentClassificationModalComponent } from './components/cyber-incident/add-cyber-incident-classification-modal/add-cyber-incident-classification-modal.component';
import { AddCyberIncidentImpactAnalysisCategoryComponent } from './components/cyber-incident/add-cyber-incident-impact-analysis-category/add-cyber-incident-impact-analysis-category.component';
import { AddCustomersComponentComponent } from "./components/customer-engagement/add-customers-component/add-customers-component.component";

// import { FileIconTypeComponent } from './components/shared/file-icon-type/file-icon-type.component';
@NgModule({
    providers: [DatePipe, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatterService }],
    declarations: [
        ContextNoDataComponent,
        AssetTypesModalComponent,
        ScrollPointDirective,
        DateFormatPipe,
        PermissionPipe,
        SafeHtmlPipe,
        FilterPipe,
        AutoFocus,
        SortPipe,
        UserWithDetailPopupComponent,
        SubMenuComponent,
        MsTypeModalComponent,
        MsTypeVersionModalComponent,
        DownloadProgressComponent,
        ControlCategoryModalComponent,
        ControlSubcategoryModalComponent,
        DeletePopupComponent,
        BreadcrumbMenuComponent,
        ControlTypesModalComponent,
        ArciAddModalComponent,
        ProcessGroupModalComponent,
        ProcessCategoryModalComponent,
        AuditItemCategoryModalComponent,
        AuditCategoriesModalComponent,
        AuditCriterionModalComponent,
        NoConnectivityComponent,
        AuditCategoriesModalComponent,
        AddNeedsExpectationComponent,
        AddStakeholderComponent,
        AuditObjectiveModalComponent,
        IdleTimeoutComponent,
        AuditCheckListModalComponent,
        AuditFindingCategoriesModalComponent,
        FindingImpactAnalysisCategoryModalComponent,
        UserInfoComponent,
        RootCauseCategoriesModalComponent,
        RootCauseSubCategoriesModalComponent,
        OrganizationComplainceCategoryModalComponent,
        ComplianceTypeModalComponent,
        IssueComponent,
        DivisionModalComponent,
        DepartmentModalComponent,
        SectionModalComponent,
        SubSectionModalComponent,
        AddIssueCategoryComponent,
        AddIssueDomainComponent,
        AddIssueTypeComponent,
        IssueStatusModalComponent,
        StakeholderModalComponent,
        CompetencyModalComponent,
        CompetencyGroupModalComponent,
        CompetencyTypesModalComponent,
        DesignationModalComponent,
        DesignationGradeModalComponent,
        DesignationLevelModalComponent,
        DesignationZoneModalComponent,
        KpiCategoryModalComponent,
        UserDocumentModalComponent,
        UserKpiModalComponent,
        UserReportModalComponent,
        UserJdModalComponent,
        DocumentCategoryModalComponent,
        DocumentTypesModalComponent,
        DocumentFamilyModalComponent,
        DocumentSubCategoriesModalComponent,
        DocumentSubSubCategoriesModalComponent,
        TagModalComponent,
        LabelModalComponent,
        AuditableItemModalComponent,
        ExternalAuditTypesModalComponent,
        TableLoaderComponent,
        UnitModalComponent,
        ReportFrequencyModalComponent,
        RegionModalComponent,
        CountryModalComponent,
        IndustryCategoryModalComponent,
        IndustryModalComponent,
        TimezoneModalComponent,
        LocationModalComponent,
        FilterMenuComponent,
        ProductCategoryModalComponent,
        ServiceCategoryModalComponent,
        RiskAreaModalComponent,
        RiskCategoryModalComponent,
        RiskControlPlanModalComponent,
        AddprocessComponent,
        IssuesModalComponent,

        NoDataComponent,

        FaqModalComponent,

        MeetingCategoryModalComponent,

        MeetingCriteriaModalComponent,

        MeetingObjectiveModalComponent,

        MeetingAgendaModalComponent,

        ControlEfficiencyMeasuresModalComponent,

        VenueModalComponent,

        ProjectTimeCategoryModalComponent,

        ProjectCostCategoryModalComponent,

        ProjectCategoryModalComponent,

        RecursiveMeetingAgendaComponent,

        MeetingAgendaLoopComponent,
        KhDocumentsComponent,
        RecursiveMeetingAgendaComponent,
        ProjectTaskCategoryModalComponent,
        PreviewModalComponent,
        UserInfoPopupComponent,
        ProjectRolesModalComponent,
        ProfileQualificationModalComponent,
        ProfileExperienceModalComponent,
        ProfileCertificateModalComponent,
        UserPopupBoxComponent,
        FrameworkModalComponent,
        AssessmentModalComponent,

        NoDataListComponent,
        // IssueListLoaderComponent,
        AddControlsModalComponent,
        ProfileEditModalComponent,
        MailSendPopupComponent,
        DesignationCompetencyModalComponent,
        DesignationCompetencyAddModalComponent,
        NoChartDataComponent,
        LoaderComponent,
        DocumentsLoaderComponent,
        QuickCorrectionModalComponent,
        ShareComponent,
        MeetingsAddParticipantsModelComponent,
        ControlPopupComponent,
        AddControlComponent,
        ImportComponent,
        ComplianceAreaModalComponent,
        CurrencyModalComponent,
        SuccessPopupComponent,
        IncidentDamageTypeModalComponent,
        IncidentCategoriesModelComponent,
        RiskTreatmentUpdateModalComponent,
        IncidentSubCategoryModelComponent,
        IncidentTypeModalComponent,
        JsoCategoryModalComponent,
        WorkflowUserAddModalComponent,
        WorkflowTeamAddModalComponent,
        WorkflowRoleAddModalComponent,
        WorkflowHeadUnitAddModalComponent,
        WorkflowPopupModalComponent,
        WorkflowDesignationModalComponent,
        JsoSubCategoryModalComponent,
        RiskSourceModalComponent,
        RiskLibraryModalComponent,
        UnsafeActionObservedGroupModalComponent,
        UnsafeActionSubCategoryModalComponent,
        IncidentRootCauseModalComponent,
        UnsafeActionCategoryModalComponent,
        JsoObservationsModelComponent,
        LocationListModalComponent,
        ProjectsModalComponent,
        CustomerModalComponent,
        ProductModalComponent,
        KeyRiskIndicatorsComponent,
        AddRcaModalComponent,
        JsoObservationTypeModalComponent,
        RiskLibraryPopupComponent,
        CustomDatePopupComponent,
        AddKriModalComponent,
        StrategicObjectivesModalComponent,
        StrategicObjectiveMappingComponent,
        UnsafeActionModelComponent,
        ComplianceSectionModalComponent,
        ImpactCategoryAddModalComponent,
        RiskImpactAnalysisModalComponent,
        IncidentDamageSeverityModalComponent,
        ComplianceFrequencyModalComponent,
        ComplianceStatusModalComponent,
        SlaContractModelComponent,
        SlaCategoryModalComponent,
        RiskSubCategoryModalComponent,
        WorkflowSystemRoleComponent,
        RiskWorkflowHistoryComponent,
        RiskInfoWorkflowComponent,
        WorkflowCommentPopupComponent,
        RiskJourneyWorkflowComponent,
        RiskJourneyWorkflowHistoryComponent,
        WorkflowJourneyCommentPopupComponent,
        CloseUnsafeActionModalComponent,
        BusinessApplicationTypeModalComponent,
        BiaRatingNewComponent,
        ImpactCategoryNewComponent,
        ImpactScenarioNewComponent,
        ImpactAreaNewComponent,
        BiaScaleNewComponent,
        TierConfigNewComponent,
        ShowArciCountMatrixComponent,
        ChooseRelatedProcessComponent,
        SuppliersModalComponent,
        BusinessApplicationsModalComponent,
        AppTypeAddModalComponent,
        FocusAreaModalComponent,
        ObjectiveModalComponent,
        ProcessOperationFrequencyModalComponent,
        ProcessOperationModeModalComponent,
        ProcessAccessibilityModalComponent,
        StorageTypesModalComponent,
        RecordRetentionPoliciesModalComponent,
        StorageLocationsModalComponent,
        BackupFrequenciesModalComponent,
        AddVitalRecordsComponent,
        PeriodicBackupModalComponent,
        BiaTireModalComponent,
        FileUploadPopupComponent,
        BiaImpactCategoryInformationModalComponent,
        ControlModeModalComponent,
        TrainingCategoryModalComponent,
        TrainingStatusModalComponent,
        AssetTypesModalComponent,
        AssetCategoryModalComponent,
        TrainingModalComponent,
        OrganisationChangeModalComponent,
        AssetSubCategoryModalComponent,
        AssetLocationModalComponent,
        TrainingCompleteModalComponent,
        StrategyInitiativeActionsModalComponent,
        IncidentWorkflowCommentPopupComponent,
        IncidentInvestigationWorkflowHistoryComponent,
        IncidentInvestigationWorkflowComponent,
        IncidentInfoWorkflowCommentComponent,
        IncidentInfoWorkflowPopupComponent,
        IncidentInfoWorkflowHistoryComponent,
        IncidentCaWorkflowPopupComponent,
        IncidentCaWorkflowCommentComponent,
        IncidentCaWorkflowHistoryComponent,
        ComplianceRegisterWorkflowCommentComponent,
        ComplianceRegisterWorkflowPopupComponent,
        ComplianceRegisterWorkflowHistoryComponent,
        SlaContractWorkflowCommentComponent,
        SlaContractWorkflowPopupComponent,
        SlaContractWorkflowHistoryComponent,
        BusinessApplicationModalComponent,
        ServiceModalComponent,
        PhysicalConditionRankingsModalComponent,
        AssetMatrixCategoriesModalComponent,
        AssetMaintenanceCategoriesModalComponent,
        AddAssetMatrixComponent,
        AddAssetCategoryComponent,
        AddBcpComponent,
        MaintenanceShutdownComponent,
        AssetMaintenanceReviewComponent,
        MaintenanceShutdownReviewComponent,
        StrategicFocusAreaMappingComponent,
        CommonDetailsReportLoaderComponent,
        IsmsVulnerabilityModalComponent,
        BcsTypeModalComponent,
        NoImageDataComponent,
        TestAndExerciseRecoveryLevelModalComponent,
        TestAndExerciseTypesModalComponent,
        TestAndExerciseCommunicationsModalComponent,
        TableNoDataImageComponent,
        TestAndExerciseChecklistModalComponent,
        AssetMappingComponent,
        CompetencyTypesModalComponent,
        ModuleSubmenuModalComponent,
        ModuleMenuModalComponent,
        IsmsRiskTreatmentUpdateModalComponent,
        CorrectiveActionResolveModalComponent,
        CustomerComplaintSourceModalComponent,
        RiskListComponent,
        RiskContextDetailComponent,
        RiskImpactAnalysisLoaderComponent,
        RiskKriLoaderComponent,
        ResidualRiskLoaderComponent,
        RiskAssessmentLoaderComponent,
        RiskJourneyLoaderComponent,
        RiskMappingLoaderComponent,
        RiskTreatmentDetailLoaderComponent,
        RiskWorkflowLoaderComponent,
        RiskIndividualWorkflowLoaderComponent,
        ISMSMatrixDetailLoaderComponent,
        ImpactListComponent,
        LikelihoodListComponent,
        RiskMatrixLoaderComponent,
        RiskHeatmapLoaderComponent,
        HeatmapByDepartmentLoaderComponent,
        BiaDetailsPageComponent,
        BiaDetailsLoaderComponent,
        AddSoaComponent,
        SoaImplementationStatusesModalComponent,
        ProjectContractTypeModalComponent,
        IsmsWorkflowCommentPopupComponent,
        IsmsWorkflowJourneyCommentPopupComponent,
        IsmsRiskInfoWorkflowComponent,
        IsmsRiskJourneyWorkflowComponent,
        IsmsRiskWorkflowHistoryComponent,
        IsmsRiskJourneyWorkflowHistoryComponent,
        ProjectPriorityModalComponent,
        ProjectThemeModalComponent,
        ProjectObjectiveModalComponent,
        AssetMaintenanceScheduleHistoryComponent,
        AssetMaintenanceScheduleHistoryPreviewComponent,
        WorkflowLoaderComponent,
        ProjectKpiModalComponent,
        AssetMaintenanceShutdownHistoryComponent,
        WorkflowLoaderComponent,
        HistoryLoaderComponent,
        DivisionLoaderComponent,
        CorrectiveActionLoaderComponent,
        FindingDetailsCorrectiveActionLoaderComponent,
        RiskImpactGuidelineModalComponent,
        ProjectTaskPrioritiesModalComponent,
        ReportLoaderComponent,
        IncidentReportDetailComponent,
        ReportBookLoaderComponent,
        SubMenuDropDownComponent,
        StrategyThemeModalComponent,
        ReportNoDataComponent,
        AmAuditPlanModalComponent,
        AmAuditPlanLoaderComponent,
        AmAuditCategoryModalComponent,
        EventTypeModalComponent,
        EntranceModalComponent,
        PeriodicityModalComponent,
        CommunicationModalComponent,
        LocationsModalComponent,
        RangeModalComponent,
        DimensionModalComponent,
        ChecklistModalComponent,
        StatusModalComponent,
        SupportivesModalComponent,
        SpaceTypeModalComponent,

        TargetAudienceModalComponent,
        FourColumnLoaderComponent,
        FiveColumnLoaderComponent,
        SixColumnLoaderComponent,
        SevenColumnLoaderComponent,
        EightColumnLoaderComponent,
        NineColumnLoaderComponent,
        TenColumnLoaderComponent,
        EventClosureChecklistModalComponent,
        EventEquipmentModalComponent,
        AmAnnualAuditPlanModalComponent,
        LocationsModalComponent,
        AuditPlanWorkflowHistoryComponent,
        AuditPlanWorkflowComponent,
        AuditPlanWorkflowCommentComponent,
        EventEngagementStrategyModalComponent,
        EventInfluenceModalComponent,
        AnnualAuditPlanWorkflowHistoryComponent,
        AnnualAuditPlanWorkflowCommentComponent,
        AnnualAuditPlanWorkflowComponent,
        KpiTypesStategyModalComponent,
        StrategyObjectiveTypesModalComponent,
        EventMaturityMatrixParameterModalComponent,
        AmAuditModalComponent,
        EventMaturityMatrixTypeModalComponent,
        InformationRequestAddModalComponent,

        BpmSuppliersModalComponent,
        KhCheckListModalComponent,
        // FileIconTypeComponent
        MsAuditCategoryModalComponent,
        AmAuditDocumentModalComponent,
        AmCommencementLetterModalComponent,
        AddRiskMappingComplianceComponent,
        MsAuditModeModalComponent,
        AmAuditMeetingModalComponent,
        AmAuditDocumentModalComponent,
        CorrectiveActionStatusModel,
        MsAuditChecklistGroupModel,
        TemplateLoaderComponent,
        AmAuditTestPlanModalComponent,

        ExternalFindingCategoriesModalComponent,
        AmAuditFieldWorkModalComponent,
        ComplianceMappingComponent,
        AmAuditFindingModalComponent,
        IncidentMappingComponent,
        MeetingMappingComponent,
        TrainingMappingComponent,
        AuditTestPlanStatusModalComponent,
        ObjectiveTypeModalComponent,
        AmAuditDocumentTypeModelComponent,
        AmFindingCaAddComponent,
        FindingCaUpdateModalComponent,
        AuditFindingMappingComplianceComponent,
        AmReportUpdateModalComponent,
        AmReportWorkflowComponent,
        AmReportWorkflowHistoryComponent,
        AmReportWorkflowCommentComponent,
        AmDraftReportWorkflowComponent,
        AmDraftReportWorkflowHistoryComponent,
        AmDraftReportWorkflowCommentComponent,
        AmFinalReportWorkflowCommentComponent,
        AmFinalReportWorkflowComponent,
        AmFinalReportWorkflowHistoryComponent,
        AmInnerDocumentVersionsComponent,
        ModalUserPopupBoxComponent,
        AmCsaModalComponent,
        CsaQuestionModalComponent,
        EventRiskImpactAreaModelComponent,
        AclListComponent,
        AuditControlStatusComponent,
        ReportAccordionLoaderComponent,
        IsmsRiskImpactGuidelineModalComponent,
        StrategyMappingOcDivComponent,
        StrategyMappingOcViewComponent,
        CustomersDetailsLoaderComponent,
        RiskOverviewLoaderComponent,
        StrategyPerformancesModalComponent,
        KpiMappingComponent,
        StrategyMappingObjectiveTypeChildViewComponent,
        MockDrillTypeModelComponent,
        MockDrillResponseServiceModelComponent,
        MockDrillEvacuationRoleModelComponent,
        MockDrillChecksModelComponent,
        MockDrillScenarioModelComponent,
        EventMappingComponent,
        SitesMappingComponent,
        MsAuditFindingCategoriesModalComponent,
        MsAuditPlanObjectiveModalComponent,
        MsAuditPlanCriteriaModalComponent,
        SmallNoDataComponent,
        ProjectMonitoringMappingComponent,
        ProjectManagementMappingComponent,
        AddCyberIncidentClassificationModalComponent,
        AddCyberIncidentImpactAnalysisCategoryComponent,
        AddCustomersComponentComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ColorPickerModule,
        FormsModule,
        ReactiveFormsModule,
        MobxAngularModule,
        NgbPaginationModule,
        NgbAlertModule,
        CKEditorModule,
        NgbModule,
        DragDropModule,
        NgxPaginationModule,
        ToastrModule.forRoot({
            timeOut: 2000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
            countDuplicates: false,
            closeButton: true
        }),
        NgCircleProgressModule.forRoot({
            "radius": 70,
            "space": -10,
            "outerStrokeGradient": true,
            "outerStrokeWidth": 10,
            "outerStrokeColor": "#4882c2",
            "outerStrokeGradientStopColor": "#53a9ff",
            "innerStrokeColor": "#e7e8ea",
            "innerStrokeWidth": 10,
            "animateTitle": false,
            "animationDuration": 1000,
            "showUnits": true,
            "showTitle": true,
            "showBackground": false,
            "clockwise": true,
            "startFromZero": false,
            "maxPercent": 100,
            "showSubtitle": false
        }),
        // SweetAlert2Module.forRoot(),
        TranslateModule.forChild(),
        NgSelectModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
    ],
    exports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ColorPickerModule,
        ReactiveFormsModule,
        MobxAngularModule,
        ScrollPointDirective,
        DateFormatPipe,
        PermissionPipe,
        SafeHtmlPipe,
        FilterPipe,
        SortPipe,
        AutoFocus,
        UserWithDetailPopupComponent,
        SubMenuComponent,
        NgbPaginationModule,
        NgbAlertModule,
        ToastrModule,
        CKEditorModule,
        NgbModule,
        DragDropModule,
        // SweetAlert2Module,
        TranslateModule,
        NgSelectModule,
        NgCircleProgressModule,
        MsTypeModalComponent,
        MsTypeVersionModalComponent,
        DownloadProgressComponent,
        ControlCategoryModalComponent,
        ControlModeModalComponent,
        ControlSubcategoryModalComponent,
        DeletePopupComponent,
        BreadcrumbMenuComponent,
        ControlTypesModalComponent,
        AssetTypesModalComponent,
        ArciAddModalComponent,
        ProcessCategoryModalComponent,
        ProcessGroupModalComponent,
        AuditItemCategoryModalComponent,
        AuditCategoriesModalComponent,
        AuditCriterionModalComponent,
        NoConnectivityComponent,
        AuditCategoriesModalComponent,
        AddNeedsExpectationComponent,
        AddStakeholderComponent,
        AuditObjectiveModalComponent,
        IdleTimeoutComponent,
        AuditCheckListModalComponent,
        AuditFindingCategoriesModalComponent,
        FindingImpactAnalysisCategoryModalComponent,
        UserInfoComponent,
        RootCauseCategoriesModalComponent,
        RootCauseSubCategoriesModalComponent,
        OrganizationComplainceCategoryModalComponent,
        ComplianceTypeModalComponent,
        IssueComponent,
        DivisionModalComponent,
        DepartmentModalComponent,
        SectionModalComponent,
        SubSectionModalComponent,
        AddIssueCategoryComponent,
        AddIssueDomainComponent,
        AddIssueTypeComponent,
        IssueStatusModalComponent,
        StakeholderModalComponent,
        CompetencyModalComponent,
        CompetencyGroupModalComponent,
        CompetencyTypesModalComponent,
        DesignationModalComponent,
        DesignationGradeModalComponent,
        DesignationLevelModalComponent,
        DesignationZoneModalComponent,
        KpiCategoryModalComponent,
        UserDocumentModalComponent,
        UserKpiModalComponent,
        UserReportModalComponent,
        UserJdModalComponent,
        DocumentCategoryModalComponent,
        DocumentTypesModalComponent,
        ComplianceAreaModalComponent,
        DocumentFamilyModalComponent,
        DocumentSubCategoriesModalComponent,
        DocumentSubSubCategoriesModalComponent,
        TagModalComponent,
        LabelModalComponent,
        AuditableItemModalComponent,
        ExternalAuditTypesModalComponent,
        TableLoaderComponent,
        ExternalAuditTypesModalComponent,
        UnitModalComponent,
        ReportFrequencyModalComponent,
        RegionModalComponent,
        CountryModalComponent,
        IndustryCategoryModalComponent,
        IndustryModalComponent,
        TimezoneModalComponent,
        LocationModalComponent,
        FilterMenuComponent,
        ProductCategoryModalComponent,
        ServiceCategoryModalComponent,
        ScrollPointDirective,
        DateFormatPipe,
        PermissionPipe,
        SafeHtmlPipe,
        FilterPipe,
        SortPipe,
        AutoFocus,
        RiskAreaModalComponent,
        RiskCategoryModalComponent,
        IncidentCategoriesModelComponent,
        JsoCategoryModalComponent,
        JsoSubCategoryModalComponent,
        JsoObservationTypeModalComponent,
        UnsafeActionObservedGroupModalComponent,
        UnsafeActionCategoryModalComponent,
        UnsafeActionSubCategoryModalComponent,
        IncidentSubCategoryModelComponent,
        RiskControlPlanModalComponent,
        AddprocessComponent,
        IssuesModalComponent,
        FaqModalComponent,
        NoDataComponent,
        MeetingCategoryModalComponent,
        MeetingCriteriaModalComponent,
        MeetingObjectiveModalComponent,
        MeetingAgendaModalComponent,
        ControlEfficiencyMeasuresModalComponent,
        VenueModalComponent,
        ProjectTimeCategoryModalComponent,
        ProjectCostCategoryModalComponent,
        ProjectCategoryModalComponent,
        ProjectTaskCategoryModalComponent,
        KhDocumentsComponent,
        RecursiveMeetingAgendaComponent,
        MeetingAgendaLoopComponent,
        UserInfoPopupComponent,
        ProjectRolesModalComponent,
        ProfileQualificationModalComponent,
        ProfileExperienceModalComponent,
        ProfileCertificateModalComponent,
        ProfileEditModalComponent,
        UserPopupBoxComponent,
        FrameworkModalComponent,
        AssessmentModalComponent,
        NoDataListComponent,
        // IssueListLoaderComponent,
        AddControlsModalComponent,
        MailSendPopupComponent,
        DesignationCompetencyModalComponent,
        DesignationCompetencyAddModalComponent,
        NoChartDataComponent,
        LoaderComponent,
        QuickCorrectionModalComponent,
        ShareComponent,
        MeetingsAddParticipantsModelComponent,
        ControlPopupComponent,
        AddControlComponent,
        ImportComponent,
        CurrencyModalComponent,
        SuccessPopupComponent,
        IncidentDamageTypeModalComponent,
        IncidentTypeModalComponent,
        RiskTreatmentUpdateModalComponent,
        WorkflowUserAddModalComponent,
        WorkflowTeamAddModalComponent,
        WorkflowRoleAddModalComponent,
        WorkflowHeadUnitAddModalComponent,
        WorkflowPopupModalComponent,
        WorkflowDesignationModalComponent,
        RiskSourceModalComponent,
        RiskLibraryModalComponent,
        IncidentRootCauseModalComponent,
        JsoObservationsModelComponent,
        LocationListModalComponent,
        ProjectsModalComponent,
        CustomerModalComponent,
        ProductModalComponent,
        KeyRiskIndicatorsComponent,
        AddRcaModalComponent,
        RiskLibraryPopupComponent,
        CustomDatePopupComponent,
        AddKriModalComponent,
        StrategicObjectivesModalComponent,
        StrategicObjectiveMappingComponent,
        UnsafeActionModelComponent,
        ComplianceSectionModalComponent,
        ImpactCategoryAddModalComponent,
        RiskImpactAnalysisModalComponent,
        IncidentDamageSeverityModalComponent,
        ComplianceStatusModalComponent,
        SlaContractModelComponent,
        SlaCategoryModalComponent,
        RiskSubCategoryModalComponent,
        WorkflowSystemRoleComponent,
        RiskInfoWorkflowComponent,
        RiskWorkflowHistoryComponent,
        WorkflowCommentPopupComponent,
        RiskJourneyWorkflowComponent,
        RiskJourneyWorkflowHistoryComponent,
        WorkflowJourneyCommentPopupComponent,
        CloseUnsafeActionModalComponent,
        BusinessApplicationTypeModalComponent,
        BiaRatingNewComponent,
        ImpactCategoryNewComponent,
        ImpactScenarioNewComponent,
        ImpactAreaNewComponent,
        BiaScaleNewComponent,
        TierConfigNewComponent,
        ShowArciCountMatrixComponent,
        ChooseRelatedProcessComponent,
        SuppliersModalComponent,
        BusinessApplicationsModalComponent,
        AppTypeAddModalComponent,
        FocusAreaModalComponent,
        ObjectiveModalComponent,
        BpmSuppliersModalComponent,
        KhCheckListModalComponent,
        // FileIconTypeComponent
        ProcessOperationFrequencyModalComponent,
        ProcessOperationModeModalComponent,
        ProcessAccessibilityModalComponent,
        StorageTypesModalComponent,
        RecordRetentionPoliciesModalComponent,
        StorageLocationsModalComponent,
        BackupFrequenciesModalComponent,
        AddVitalRecordsComponent,
        PeriodicBackupModalComponent,
        BiaTireModalComponent,
        BiaImpactCategoryInformationModalComponent,
        TrainingCategoryModalComponent,
        FileUploadPopupComponent,
        AssetCategoryModalComponent,
        AssetSubCategoryModalComponent,
        TrainingModalComponent,
        OrganisationChangeModalComponent,
        AssetLocationModalComponent,
        TrainingCompleteModalComponent,
        TrainingCategoryModalComponent,
        StrategyInitiativeActionsModalComponent,
        IncidentWorkflowCommentPopupComponent,
        IncidentInvestigationWorkflowHistoryComponent,
        IncidentInvestigationWorkflowComponent,
        IncidentInfoWorkflowCommentComponent,
        IncidentInfoWorkflowPopupComponent,
        IncidentInfoWorkflowHistoryComponent,
        IncidentCaWorkflowPopupComponent,
        IncidentCaWorkflowCommentComponent,
        IncidentCaWorkflowHistoryComponent,
        ComplianceRegisterWorkflowCommentComponent,
        ComplianceRegisterWorkflowPopupComponent,
        ComplianceRegisterWorkflowHistoryComponent,
        SlaContractWorkflowCommentComponent,
        SlaContractWorkflowPopupComponent,
        SlaContractWorkflowHistoryComponent,
        BusinessApplicationModalComponent,
        ServiceModalComponent,
        PhysicalConditionRankingsModalComponent,
        AssetMatrixCategoriesModalComponent,
        AssetMaintenanceCategoriesModalComponent,
        AddAssetMatrixComponent,
        AddAssetCategoryComponent,
        AddBcpComponent,
        MaintenanceShutdownComponent,
        AssetMaintenanceReviewComponent,
        MaintenanceShutdownReviewComponent,
        StrategicFocusAreaMappingComponent,
        IsmsVulnerabilityModalComponent,
        CustomerComplaintSourceModalComponent,
        CommonDetailsReportLoaderComponent,
        BcsTypeModalComponent,
        ContextNoDataComponent,
        ReportNoDataComponent,
        NoImageDataComponent,
        TestAndExerciseRecoveryLevelModalComponent,
        TestAndExerciseTypesModalComponent,
        TestAndExerciseCommunicationsModalComponent,
        TableNoDataImageComponent,
        TestAndExerciseChecklistModalComponent,
        AssetMappingComponent,
        ModuleSubmenuModalComponent,
        ModuleMenuModalComponent,
        IsmsRiskTreatmentUpdateModalComponent,
        CorrectiveActionResolveModalComponent,
        RiskListComponent,
        RiskContextDetailComponent,
        RiskImpactAnalysisLoaderComponent,
        RiskKriLoaderComponent,
        ResidualRiskLoaderComponent,
        RiskAssessmentLoaderComponent,
        RiskJourneyLoaderComponent,
        RiskMappingLoaderComponent,
        RiskTreatmentDetailLoaderComponent,
        RiskWorkflowLoaderComponent,
        RiskIndividualWorkflowLoaderComponent,
        ISMSMatrixDetailLoaderComponent,
        ImpactListComponent,
        LikelihoodListComponent,
        RiskMatrixLoaderComponent,
        RiskHeatmapLoaderComponent,
        HeatmapByDepartmentLoaderComponent,
        BiaDetailsPageComponent,
        BiaDetailsLoaderComponent,
        AddSoaComponent,
        SoaImplementationStatusesModalComponent,
        ProjectContractTypeModalComponent,
        IsmsWorkflowCommentPopupComponent,
        IsmsWorkflowJourneyCommentPopupComponent,
        IsmsRiskInfoWorkflowComponent,
        IsmsRiskJourneyWorkflowComponent,
        IsmsRiskWorkflowHistoryComponent,
        IsmsRiskJourneyWorkflowHistoryComponent,
        ProjectPriorityModalComponent,
        ProjectThemeModalComponent,
        ProjectObjectiveModalComponent,
        AssetMaintenanceScheduleHistoryComponent,
        WorkflowLoaderComponent,
        ProjectKpiModalComponent,
        AssetMaintenanceShutdownHistoryComponent,
        WorkflowLoaderComponent,
        DivisionLoaderComponent,
        CorrectiveActionLoaderComponent,
        FindingDetailsCorrectiveActionLoaderComponent,
        RiskImpactGuidelineModalComponent,
        ReportLoaderComponent,
        IncidentReportDetailComponent,
        ProjectTaskPrioritiesModalComponent,
        StrategyThemeModalComponent,
        SubMenuDropDownComponent,
        SubMenuDropDownComponent,
        AmAuditCategoryModalComponent,
        EventTypeModalComponent,
        ObjectiveTypeModalComponent,
        RangeModalComponent,
        SpaceTypeModalComponent,
        DimensionModalComponent,
        ChecklistModalComponent,
        StatusModalComponent,
        SupportivesModalComponent,
        LocationsModalComponent,
        EntranceModalComponent,
        PeriodicityModalComponent,
        CommunicationModalComponent,
        TargetAudienceModalComponent,
        AmAuditPlanModalComponent,
        AmAuditPlanLoaderComponent,
        AmAuditCategoryModalComponent,
        FourColumnLoaderComponent,
        FiveColumnLoaderComponent,
        SixColumnLoaderComponent,
        SevenColumnLoaderComponent,
        EightColumnLoaderComponent,
        NineColumnLoaderComponent,
        TenColumnLoaderComponent,
        EventClosureChecklistModalComponent,
        EventEquipmentModalComponent,
        AmAnnualAuditPlanModalComponent,
        AuditPlanWorkflowHistoryComponent,
        AuditPlanWorkflowComponent,
        AuditPlanWorkflowCommentComponent,
        EventEngagementStrategyModalComponent,
        EventInfluenceModalComponent,
        AnnualAuditPlanWorkflowHistoryComponent,
        AnnualAuditPlanWorkflowCommentComponent,
        AnnualAuditPlanWorkflowComponent,
        KpiTypesStategyModalComponent,
        StrategyObjectiveTypesModalComponent,
        EventMaturityMatrixParameterModalComponent,
        AmAuditModalComponent,
        EventMaturityMatrixTypeModalComponent,
        InformationRequestAddModalComponent,
        MsAuditCategoryModalComponent,
        AddRiskMappingComplianceComponent,
        MsAuditModeModalComponent,
        AmAuditDocumentModalComponent,
        AmCommencementLetterModalComponent,
        AmAuditMeetingModalComponent,
        CorrectiveActionStatusModel,
        AmCommencementLetterModalComponent,
        MsAuditChecklistGroupModel,
        TemplateLoaderComponent,
        AmAuditTestPlanModalComponent,
        ExternalFindingCategoriesModalComponent,
        AmAuditFieldWorkModalComponent,
        ComplianceMappingComponent,
        AmAuditFindingModalComponent,
        IncidentMappingComponent,
        MeetingMappingComponent,
        TrainingMappingComponent,
        AuditTestPlanStatusModalComponent,
        AmAuditDocumentTypeModelComponent,
        AmFindingCaAddComponent,
        FindingCaUpdateModalComponent,
        AuditFindingMappingComplianceComponent,
        AmReportUpdateModalComponent,
        AmReportWorkflowComponent,
        AmReportWorkflowHistoryComponent,
        AmReportWorkflowCommentComponent,
        AmDraftReportWorkflowComponent,
        AmDraftReportWorkflowHistoryComponent,
        AmDraftReportWorkflowCommentComponent,
        AmFinalReportWorkflowCommentComponent,
        AmFinalReportWorkflowComponent,
        AmFinalReportWorkflowHistoryComponent,
        AmInnerDocumentVersionsComponent,
        AmCsaModalComponent,
        CsaQuestionModalComponent,
        EventRiskImpactAreaModelComponent,
        AclListComponent,
        AuditControlStatusComponent,
        ReportAccordionLoaderComponent,
        IsmsRiskImpactGuidelineModalComponent,
        StrategyMappingOcDivComponent,
        StrategyMappingOcViewComponent,
        CustomersDetailsLoaderComponent,
        RiskOverviewLoaderComponent,
        KpiMappingComponent,
        StrategyMappingObjectiveTypeChildViewComponent,
        MockDrillTypeModelComponent,
        MockDrillResponseServiceModelComponent,
        MockDrillEvacuationRoleModelComponent,
        MockDrillChecksModelComponent,
        MockDrillScenarioModelComponent,
        MsAuditFindingCategoriesModalComponent,
        MsAuditPlanObjectiveModalComponent,
        MsAuditPlanCriteriaModalComponent,
        SmallNoDataComponent,
        SitesMappingComponent,
        EventMappingComponent,
        ProjectMonitoringMappingComponent,
        ProjectManagementMappingComponent,
        AddCyberIncidentClassificationModalComponent,
        AddCyberIncidentImpactAnalysisCategoryComponent,
        AddCustomersComponentComponent
    ],
})
export class SharedModule { }