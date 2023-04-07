import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MastersRoutingModule } from './masters-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserDocumentModalComponent } from './components/modals/human-capital/user-document-modal/user-document-modal.component';
import { MasterLoaderComponent } from './components/loader/master-loader/master-loader.component';
import { CompetencyTypesMasterComponent } from 'src/app/modules/masters/pages/human-capital/competency-types/competency-types-master/competency-types-master.component';

//masters
import { MastersComponent } from './pages/masters/masters.component';

//supplier-management
import { SupplierManagementMasterComponent } from './pages/supplier-management/master/supplier-management-master/supplier-management-master.component';
import { SuppliersComponent } from './pages/supplier-management/suppliers/suppliers.component';

//jso
import { JsoMasterComponent } from './pages/jso/masters/jso-master/jso-master.component';
import { JsoCategoryComponent } from './pages/jso/jso-category/jso-category.component';
import { JsoSubCategoryComponent } from './pages/jso/jso-sub-category/jso-sub-category.component';
import { UnsafeActionObservedGroupComponent } from './pages/jso/unsafe-action-observed-group/unsafe-action-observed-group.component';
import { UnsafeActionSubCategoriesComponent } from './pages/jso/unsafe-action-sub-categories/unsafe-action-sub-categories.component';
import { UnsafeActionCategoriesComponent } from './pages/jso/unsafe-action-categories/unsafe-action-categories.component';
import { JsoObservationTypeComponent } from './pages/jso/jso-observation-type/jso-observation-type.component';
import { UnsafeActionStatusComponent } from './pages/jso/unsafe-action-status/unsafe-action-status.component';

//external-audit
import { RiskRatingComponent } from './pages/external-audit/risk-rating/risk-rating.component';
import { ExternalAuditTypesComponent } from './pages/external-audit/external-audit-types/external-audit-types.component';
import { ExternalAuditMasterComponent } from './pages/external-audit/master/external-audit-master/external-audit-master.component';


//training
import { TrainingMasterComponent } from './pages/training/master/training-master/training-master.component';
import { TrainingCategoryComponent } from './pages/training/training-category/training-category.component';
import { TrainingStatusComponent } from './pages/training/training-status/training-status.component';

//compliance-management
import { ComplianceTypeMasterComponent } from './pages/compliance-management/compliance-type/compliance-type-master.component';
import { ComplianceAreaComponent } from './pages/compliance-management/compliance-area/compliance-area.component';
import { CmMastersComponent } from './pages/compliance-management/cm-masters/cm-masters.component';
import { ComplianceSectionComponent } from './pages/compliance-management/compliance-section/compliance-section.component';
import { ComplianceFrequencyComponent } from './pages/compliance-management/compliance-frequency/compliance-frequency.component';
import { ComplianceStatusComponent } from './pages/compliance-management/compliance-status/compliance-status.component';
import { SlaCategoryComponent } from './pages/compliance-management/sla-category/sla-category.component';
import { SlaStatusesComponent } from './pages/compliance-management/sla-statuses/sla-statuses.component';

//general
import { GeneralMasterComponent } from './pages/general/general-master/general-master.component';
import { CurrencyComponent } from "./pages/general/currency/currency.component";
import { LabelsComponent } from './pages/general/labels/labels.component';
import { MastersMasterComponent } from "./pages/general/masters/masters.component";
import { RegionComponent } from './pages/general/region/region.component';
import { CountryComponent } from './pages/general/country/country.component';
import { IndustryCategoryComponent } from './pages/general/industry-category/industry-category.component';
import { IndustryComponent } from './pages/general/industry/industry.component';
import { TimezoneComponent } from './pages/general/timezone/timezone.component';
import { LocationComponent } from './pages/general/location/location.component';
import { AppFeedbackSmileyComponent } from './pages/general/app-feedback-smiley/app-feedback-smiley.component';
import { AppFeedbackKeyComponent } from './pages/general/app-feedback-key/app-feedback-key.component';
import { AppUserFeedbackComponent } from './pages/general/app-user-feedback/app-user-feedback.component';
import { FaqComponent } from './pages/general/faq/faq.component';
import { VenueComponent } from './pages/general/venue/venue.component';
import { LanguagesComponent } from './pages/general/languages/languages.component';
import { MasterMenuComponent } from './pages/general/master-menu/master-menu.component';
import { ModuleGroupsComponent } from './pages/general/module-groups/module-groups.component';
import { ModuleComponent } from './pages/general/module/module.component';

//mrm
import { MrmComponent } from './pages/mrm/master/mrm.component';
import { MeetingCategoryComponent } from './pages/mrm/meeting-category/meeting-category.component';
import { MeetingCriteriaComponent } from './pages/mrm/meeting-criteria/meeting-criteria.component';
import { MeetingObjectiveComponent } from './pages/mrm/meeting-objective/meeting-objective.component';
import { MeetingTypeComponent } from './pages/mrm/meeting-type/meeting-type.component';
import { MeetingPlanStatusComponent } from './pages/mrm/meeting-plan-status/meeting-plan-status.component';
import { MeetingAgendaComponent } from './pages/mrm/meeting-agenda/meeting-agenda.component';
import { MeetingReportStatusComponent } from './pages/mrm/meeting-report-status/meeting-report-status.component';
import { MeetingActionPlanStatusComponent } from './pages/mrm/meeting-action-plan-status/meeting-action-plan-status.component';

//asset-management
import { AssetTypesComponent } from './pages/asset-management/asset-types/asset-types.component';
import { AssetManagementMasterComponent } from './pages/asset-management/masters/asset-management-master.component';
import { AssetsCategoryComponent } from './pages/asset-management/assets-category/assets-category.component';
import { AssetSubCategoryComponent } from './pages/asset-management/asset-sub-category/asset-sub-category.component';
import { AssetStatusComponent } from './pages/asset-management/asset-status/asset-status.component';
import { AssetLocationComponent } from './pages/asset-management/asset-location/asset-location.component';
import { AssetInvestmentTypesComponent } from './pages/asset-management/asset-investment-types/asset-investment-types.component';
import { PhysicalConditionRankingsComponent } from './pages/asset-management/physical-condition-rankings/physical-condition-rankings.component';
import { AssetOptionValuesComponent } from './pages/asset-management/asset-option-values/asset-option-values.component';
import { AssetRatingsComponent } from './pages/asset-management/asset-ratings/asset-ratings.component';
import { AssetMatrixCategoriesComponent } from './pages/asset-management/asset-matrix-categories/asset-matrix-categories.component';
import { AssetMaintenanceCategoriesComponent } from './pages/asset-management/asset-maintenance-categories/asset-maintenance-categories.component';
import { AssetMaintenanceTypesComponent } from './pages/asset-management/asset-maintenance-types/asset-maintenance-types.component';
import { AssetMaintenanceScheduleFrequenciesComponent } from './pages/asset-management/asset-maintenance-schedule-frequencies/asset-maintenance-schedule-frequencies.component';
import { AssetCalculationMethodComponent } from './pages/asset-management/asset-calculation-method/asset-calculation-method.component';
import { AssetMaintenanceStatusesComponent } from './pages/asset-management/asset-maintenance-statuses/asset-maintenance-statuses.component';

//risk-management
import { RiskTreatmentStatusesComponent } from './pages/risk-management/risk-treatment-statuses/risk-treatment-statuses.component';
import { RiskSourcesComponent } from './pages/risk-management/risk-sources/risk-sources.component';
import { RiskLibraryComponent } from './pages/risk-management/risk-library/risk-library.component';
import { ControlEfficiencyMeasuresComponent } from './pages/risk-management/control-efficiency-measures/control-efficiency-measures.component';
import { RiskManagementComponent } from './pages/risk-management/master/risk-management.component';
import { RiskRatingComponentRiskmanagement } from './pages/risk-management/risk-rating/risk-rating.component';
import { RiskCategoryComponent } from './pages/risk-management/risk-category/risk-category.component';
import { RiskAreaComponent } from './pages/risk-management/risk-area/risk-area.component';
import { RiskTypeComponent } from './pages/risk-management/risk-type/risk-type.component';
import { RiskClassificationComponent } from './pages/risk-management/risk-classification/risk-classification.component';
import { RiskReviewFrequencyComponent } from './pages/risk-management/risk-review-frequency/risk-review-frequency.component';
import { RiskControlPlanComponent } from './pages/risk-management/risk-control-plan/risk-control-plan.component';
import { RiskMatrixCalculationMethodComponent } from './pages/risk-management/risk-matrix-calculation-method/risk-matrix-calculation-method.component';
import { RiskStatusComponent } from './pages/risk-management/risk-status/risk-status.component';
import { RiskMatrixRatingLevelsComponent } from './pages/risk-management/risk-matrix-rating-levels/risk-matrix-rating-levels.component';
import { KriMasterComponent } from './pages/risk-management/kri-master/kri-master.component';
import { StrategicObjectivesComponent } from './pages/risk-management/strategic-objectives/strategic-objectives.component';
import { ImpactAnalysisCategoriesComponent } from './pages/risk-management/impact-analysis-categories/impact-analysis-categories.component';
import { RiskSubCategoryComponent } from './pages/risk-management/risk-sub-category/risk-sub-category.component';
import { RiskRegisterTypeComponent } from './pages/risk-management/risk-register-type/risk-register-type.component';
import { RiskImpactGuidelineComponent } from './pages/risk-management/risk-impact-guideline/risk-impact-guideline.component';

//knowledge-hub
import { ComplianceCategoryMasterComponent } from './pages/knowledge-hub/compliance-category/compliance-category-master.component';
import { KnowledgeHubMasterComponent } from './pages/knowledge-hub/masters/knowledge-hub-master/knowledge-hub-master.component';
import { DocumentCategoryComponent } from './pages/knowledge-hub/document-category/document-category.component';
import { DocumentTypesComponent } from './pages/knowledge-hub/document-types/document-types.component';
import { DocumentFamilyComponent } from './pages/knowledge-hub/document-family/document-family.component';
import { DocumentSubCategoriesComponent } from './pages/knowledge-hub/document-sub-categories/document-sub-categories.component';
import { DocumentSubSubCategoriesComponent } from './pages/knowledge-hub/document-sub-sub-categories/document-sub-sub-categories.component';
import { TagComponent } from './pages/knowledge-hub/tag/tag.component';
import { DocumentAccessTypeComponent } from './pages/knowledge-hub/document-access-type/document-access-type.component';
import { DocumentChangeRequestTypeComponent } from './pages/knowledge-hub/document-change-request-type/document-change-request-type.component';
import { DocumentStatusComponent } from './pages/knowledge-hub/document-status/document-status.component';
import { DocumentReviewFrequenciesComponent } from './pages/knowledge-hub/document-review-frequencies/document-review-frequencies.component';

//Isms
import { IsmsMastersComponent } from './pages/Isms/masters/isms-masters.component';
import { IsmsVulnerabilityComponent } from './pages/Isms/isms-vulnerability/isms-vulnerability.component';
import { IsmsRiskMatrixCalculationMethodComponent } from './pages/Isms/isms-risk-matrix-calculation-method/isms-risk-matrix-calculation-method.component';
import { IsmsRiskRatingComponent } from './pages/Isms/isms-risk-rating/isms-risk-rating.component';
import { IsmsRiskMatrixRatingLevelComponent } from './pages/Isms/isms-risk-matrix-rating-level/isms-risk-matrix-rating-level.component';
import { SoaStatusComponent } from './pages/Isms/soa-statuses/soa-statuses.component';
import { SoaImplementationStatusesComponent } from './pages/Isms/soa-implementation-statuses/soa-implementation-statuses.component';

//organization
import { DivisionComponent } from './pages/organization/division/division.component';
import { OrganizationMastersComponent } from './pages/organization/masters/organization-masters.component';
import { IssueCategoryMasterComponent } from './pages/organization/issue-category/issue-category-master.component';
import { IssueDomainMasterComponent } from './pages/organization/issue-domain/issue-domain-master.component';
import { MsTypeMasterComponent } from './pages/organization/ms-type/ms-type-master.component';
import { IssueStatusMasterComponent } from './pages/organization/issue-status/issue-status-master.component';
import { IssueMasterComponent } from './pages/organization/issue/issue-master.component';
import { IssueTypeMasterComponent } from './pages/organization/issue-type/issue-type-master.component';
import { MsTypeVersionMasterComponent } from './pages/organization/ms-type-version/ms-type-version-master.component';
import { StakeholderMasterComponent } from './pages/organization/stakeholder/stakeholder-master.component';
import { StakeholderTypeMasterComponent } from './pages/organization/stakeholder-type/stakeholder-type-master.component';
import { DepartmentComponent } from './pages/organization/department/department.component';
import { SectionComponent } from './pages/organization/section/section.component';
import { SubSectionComponent } from './pages/organization/sub-section/sub-section.component';
import { NeedExpectationComponent } from './pages/organization/need-expectation/need-expectation.component';
import { DivisionDetailsComponent } from './pages/organization/division/division-details/division-details.component';
import { ProductCategoryComponent } from './pages/organization/product-category/product-category.component';
import { ServiceCategoryComponent } from './pages/organization/service-category/service-category.component';

//human-capital
import { CompetencyMasterComponent } from './pages/human-capital/competency/competency-master.component';
import { CompetencyGroupMasterComponent } from './pages/human-capital/competency-group/competency-group-master.component';
import { HumanCapitalMastersComponent } from './pages/human-capital/masters/human-capital-masters.component';
import { DesignationMasterComponent } from './pages/human-capital/designation/designation-master.component';
import { DesignationGradeMasterComponent } from './pages/human-capital/designation-grade/designation-grade-master.component';
import { DesignationLevelMasterComponent } from './pages/human-capital/designation-level/designation-level-master.component';
import { DesignationZoneMasterComponent } from './pages/human-capital/designation-zone/designation-zone-master.component';
import { UserDocumentTypeMasterComponent } from './pages/human-capital/user-document-type/user-document-type-master.component';
import { UserReportMasterComponent } from './pages/human-capital/user-report/user-report-master.component';
import { UserJdMasterComponent } from './pages/human-capital/user-jd/user-jd-master.component';
import { KpiCategoryMasterComponent } from './pages/human-capital/kpi-category/kpi-category-master.component';
import { UserKpiMasterComponent } from './pages/human-capital/user-kpi/user-kpi-master.component';
import { UnitComponent } from './pages/human-capital/unit/unit.component';
import { ReportFrequencyComponent } from './pages/human-capital/report-frequency/report-frequency.component';

//incident-management
import { IncidentManagementMasterComponent } from './pages/incident-management/masters/incident-management-master.component';
import { IncidentDamageTypeComponent } from './pages/incident-management/incident-damage-type/incident-damage-type.component';
import { IncidentCategoriesComponent } from './pages/incident-management/incident-categories/incident-categories.component';
import { IncidentSubCategoryComponent } from './pages/incident-management/incident-sub-category/incident-sub-category.component';
import { IncidentTypeComponent } from './pages/incident-management/incident-type/incident-type.component';
import { IncidentStatusComponent } from './pages/incident-management/incident-status/incident-status.component';
import { IncidentRootCauseComponent } from './pages/incident-management/incident-root-cause/incident-root-cause.component';
import { IncidentDamageSeverityComponent } from './pages/incident-management/incident-damage-severity/incident-damage-severity.component';
import { IncidentCorrectiveActionStatusComponent } from './pages/incident-management/incident-corrective-action-status/incident-corrective-action-status.component';
import { IncidentInvestigationStatusComponent } from './pages/incident-management/incident-investigation-status/incident-investigation-status.component';

//bcm
import { BcmMastersComponent } from './pages/bcm/masters/bcm-masters.component';
import { ImpactRatingComponent } from './pages/bcm/impact-rating/impact-rating.component';
import { ImpactCategoryComponent } from './pages/bcm/impact-category/impact-category.component';
import { ImpactScinarioComponent } from './pages/bcm/impact-scenario/impact-scenario.component';
import { BiaScaleCategoryComponent } from './pages/bcm/bia-scale-category/bia-scale-category.component';
import { ImpactAreaComponent } from './pages/bcm/impact-area/impact-area.component';
import { BiaScaleComponent } from './pages/bcm/bia-scale/bia-scale.component';
import { BiaTireComponent } from './pages/bcm/bia-tire/bia-tire.component';
import { BiaImpactCategoryInformationComponent } from './pages/bcm/bia-impact-category-information/bia-impact-category-information.component';
import { BusinessContinuityPlanStatusComponent } from './pages/bcm/business-continuity-plan-status/business-continuity-plan-status.component';
import { BcpChangeRequestTypesComponent } from './pages/bcm/bcp-change-request-types/bcp-change-request-types.component';
import { BcsStatusComponent } from './pages/bcm/bcs-status/bcs-status.component';
import { BcsTypeComponent } from './pages/bcm/bcs-type/bcs-type.component';
import { BcsFinancesComponent } from './pages/bcm/bcs-finances/bcs-finances.component';
import { BusinessContinuityStrategySolutionStatusComponent } from './pages/bcm/business-continuity-strategy-solution-status/business-continuity-strategy-solution-status.component';
import { TestAndExerciseRecoveryLevelComponent } from './pages/bcm/test-and-exercise-recovery-level/test-and-exercise-recovery-level.component';
import { TestAndExerciseTypesComponent } from './pages/bcm/test-and-exercise-types/test-and-exercise-types.component';
import { TestAndExerciseCommunicationsComponent } from './pages/bcm/test-and-exercise-communications/test-and-exercise-communications.component';
import { TestAndExerciseStatusesComponent } from './pages/bcm/test-and-exercise-statuses/test-and-exercise-statuses.component';
import { TestAndExerciseChecklistComponent } from './pages/bcm/test-and-exercise-checklist/test-and-exercise-checklist.component';
import { BusinessImpactAnalysisStatusesComponent } from './pages/bcm/business-impact-analysis-statuses/business-impact-analysis-statuses.component';

//internal-audit
import { AuditableItemComponent } from './pages/internal-audit/auditable-item/auditable-item.component';
import { AuditableItemCategoryComponent } from './pages/internal-audit/auditable-item-category/auditable-item-category.component';
import { InternalAditMastersComponent } from './pages/internal-audit/masters/internal-adit-masters/internal-adit-masters.component';
import { AuditableItemTypeComponent } from './pages/internal-audit/auditable-item-type/auditable-item-type.component';
import { AuditCategoriesComponent } from './pages/internal-audit/audit-categories/audit-categories.component';
import { AuditCriterionComponent } from './pages/internal-audit/audit-criterion/audit-criterion.component';
import { AuditObjectiveComponent } from './pages/internal-audit/audit-objective/audit-objective.component';
import { AuditCheckListComponent } from './pages/internal-audit/audit-check-list/audit-check-list.component';
import { AuditFindingCategoriesComponent } from './pages/internal-audit/audit-finding-categories/audit-finding-categories.component';
import { FindingImpactAnalysisCategoryComponent } from './pages/internal-audit/finding-impact-analysis-category/finding-impact-analysis-category.component';
import { RootCauseCategoriesComponent } from './pages/internal-audit/root-cause-categories/root-cause-categories.component';
import { RootCauseSubCategoriesComponent } from './pages/internal-audit/root-cause-sub-categories/root-cause-sub-categories.component';
import { AuditReportStatusesComponent } from './pages/internal-audit/audit-report-statuses/audit-report-statuses.component';
import { AuditChecklistAnswerKeyComponent } from './pages/internal-audit/audit-checklist-answer-key/audit-checklist-answer-key.component';
import { FindingCorrectiveActionStatusesComponent } from './pages/internal-audit/finding-corrective-action-statuses/finding-corrective-action-statuses.component';
import { FindingStatusesComponent } from './pages/internal-audit/finding-statuses/finding-statuses.component';
import { AuditPlanStatusesComponent } from './pages/internal-audit/audit-plan-statuses/audit-plan-statuses.component';

//strategy
import { StrategyMasterComponent } from './pages/strategy/masters/strategy-master/strategy-master.component';
import { FocusAreaComponent } from './pages/strategy/focus-area/focus-area.component';
import { ObjectivesComponent } from './pages/strategy/objectives/objectives.component';
import { KpiTypeComponent } from './pages/strategy/kpi-type/kpi-type.component';
import { StrategyKpiDataTypeComponent } from './pages/strategy/strategy-kpi-data-types/strategy-kpi-data-types.component';
import { KpiCalculationTypesComponent } from './pages/strategy/kpi-calculation-types/kpi-calculation-types.component';
import { StrategyInitiativeActionsComponent } from './pages/strategy/strategy-initiative-actions/strategy-initiative-actions.component';
import { StrategyInitiativeReviewFrequencyComponent } from './pages/strategy/strategy-initiative-review-frequencies/strategy-initiative-review-frequencies.component';
import { AggregationTypesComponent } from './pages/strategy/aggregation-types/aggregation-types.component';
import { StrategyInitiativeStatusComponent } from './pages/strategy/strategy-initiative-status/strategy-initiative-status/strategy-initiative-status.component';
import { StrategyInitiativeActionPlanStatusComponent } from './pages/strategy/strategy-initiative-action-plan-status/strategy-initiative-action-plan-status/strategy-initiative-action-plan-status.component';
import { StrategyProfileStatusComponent } from './pages/strategy/strategy-profile-status/strategy-profile-status/strategy-profile-status.component';
import { StrategyThemesComponent } from './pages/strategy/strategy-themes/strategy-themes.component';
import { StrategyObjectiveTypeComponent } from './pages/strategy/strategy-objective-type/strategy-objective-type.component';
import { StrategyInitiativeMilestoneStatusComponent } from './pages/strategy/strategy-initiative-milestone-status/strategy-initiative-milestone-status.component';

//customer-engagement
import { CustomerMastersComponent } from './pages/customer-engagement/customer-masters/customer-masters.component';
import { CustomerCompliantTypesComponent } from './pages/customer-engagement/customer-compliant-types/customer-compliant-types.component';
import { CustomerComplaintStatusComponent } from './pages/customer-engagement/customer-complaint-status/customer-complaint-status.component';
import { CustomerComplaintInvestigationStatusComponent } from './pages/customer-engagement/customer-complaint-investigation-status/customer-complaint-investigation-status.component';
import { CustomerComplaintActionPlanStatusesComponent } from './pages/customer-engagement/customer-complaint-action-plan-statuses/customer-complaint-action-plan-statuses';
import { CustomerComplaintActionTypesComponent } from './pages/customer-engagement/customer-complaint-action-types/customer-complaint-action-types.component';
import { CustomerComplaintSourceComponent } from './pages/customer-engagement/customer-complaint-source/customer-complaint-source.component';

//bpm
import { BpmMastersComponent } from './pages/bpm/masters/bpm-masters.component';
import { ProcessCategoriesMasterComponent } from './pages/bpm/process-categories/process-categories-master.component';
import { ProcessGroupsMasterComponent } from './pages/bpm/process-groups/process-groups-master.component';
import { ControlTypesComponent } from './pages/bpm/control-types/control-types.component';
import { ControlCategoriesComponent } from './pages/bpm/control-categories/control-categories.component';
import { ControlSubcategoriesMasterComponent } from './pages/bpm/control-subcategories/control-subcategories-master.component';
import { StorageTypesComponent } from './pages/bpm/storage-types/storage-types.component';
import { ProcessAccessibilityComponent } from './pages/bpm/process-accessibility/process-accessibility.component';
import { ProcessOperationModeComponent } from './pages/bpm/process-operation-mode/process-operation-mode.component';
import { BackupAtOffsiteStatusesComponent } from './pages/bpm/backup-at-offsite-statuses/backup-at-offsite-statuses.component';
import { RecordRetentionPoliciesComponent } from './pages/bpm/record-retention-policies/record-retention-policies.component';
import { HighAvailabilityStatusComponent } from './pages/bpm/high-availability-status/high-availability-status.component';
import { BackupFrequenciesComponent } from './pages/bpm/backup-frequencies/backup-frequencies.component';
import { StorageLocationsComponent } from './pages/bpm/storage-locations/storage-locations.component';
import { ProcessOperationFrequencyComponent } from './pages/bpm/process-operation-frequency/process-operation-frequency.component';
import { BusinessApplicationTypesComponent } from './pages/bpm/business-application-types/business-application-types.component';
import { BusinessApplicationsComponent } from './pages/bpm/business-applications/business-applications.component';
import { PeriodicBackupsComponent } from './pages/bpm/periodic-backups/periodic-backups.component';
import { ControlModeComponent } from './pages/bpm/control-mode/control-mode.component';
import { BpmSuppliersComponent } from './pages/bpm/bpm-suppliers/bpm-suppliers.component';
import { CheckListComponent } from './pages/knowledge-hub/check-list/check-list.component';





//project-management
import { ProjectManagementComponent } from './pages/project-management/master/project-management.component';
import { ProjectTypeComponent } from './pages/project-management/project-type/project-type.component';
import { ProjectTimeCategoryComponent } from './pages/project-management/project-time-category/project-time-category.component';
import { ProjectCostCategoryComponent } from './pages/project-management/project-cost-category/project-cost-category.component';
import { ProjectStatusComponent } from './pages/project-management/project-status/project-status.component';
import { ProjectModuleComponent } from './pages/project-management/project-module/project-module.component';
import { ProjectCategoryComponent } from './pages/project-management/project-category/project-category.component';
import { ProjectTaskCategoryComponent } from './pages/project-management/project-task-category/project-task-category.component';
import { ProjectRolesComponent } from './pages/project-management/project-roles/project-roles.component';
import { ProjectTaskWeightageComponent } from './pages/project-management/project-task-weightage/project-task-weightage.component';
import { TaskStatusesComponent } from './pages/project-management/task-statuses/task-statuses.component';
import { ProjectTaskPrioritiesComponent } from './pages/project-management/task-priorities/task-priorities.component';

//project-monitoring
import { ProjectMonitoringComponent } from './pages/project-monitoring/masters/project-monitoring/project-monitoring.component';
import { ProjectContractTypeComponent } from './pages/project-monitoring/project-contract-type/project-contract-type.component';
import { ProjectPriorityComponent } from './pages/project-monitoring/project-priority/project-priority.component';
import { ProjectThemeComponent } from './pages/project-monitoring/project-theme/project-theme.component';
import { ProjectObjectiveComponent } from './pages/project-monitoring/project-objective/project-objective.component';
import { ProjectKpiComponent } from './pages/project-monitoring/project-kpi/project-kpi.component';
import { ProjectIssueStatusComponent } from './pages/project-monitoring/project-issue-status/project-issue-status.component';
import { ProjectMonitoringStatusComponent } from './pages/project-monitoring/project-monitoring-status/project-monitoring-status.component';
import { ProjectCorrectiveActionStatusComponent } from './pages/project-monitoring/project-corrective-action-status/project-corrective-action-status.component';
import { ProjectChangeRequestStatusComponent } from './pages/project-monitoring/project-change-request-status/project-change-request-status.component';
import { ProjectClosureStatusComponent } from './pages/project-monitoring/project-closure-status/project-closure-status.component';

//business-assessment
import { BusinessAssessmentFrequenciesComponent } from './pages/business-assessment/business-assessment-frequencies/business-assessment-frequencies.component';
import { BaMastersComponent } from './pages/business-assessment/ba-masters/ba-masters.component';
import { BusinessAssessmentStatusComponent } from './pages/business-assessment/business-assessment-status/business-assessment-status.component';

//audit-management
import { AuditStatusesComponent } from './pages/audit-management/audit-statuses/audit-statuses.component';
import { AuditManagementImpactComponent } from './pages/audit-management/audit-management-impact/audit-management-impact.component';
import { AnnualAuditPalnFrequencyItemComponent } from './pages/audit-management/annual-audit-paln-frequency-item/annual-audit-paln-frequency-item.component';
import { AuditManagementLikelihoodComponent } from './pages/audit-management/audit-management-likelihood/audit-management-likelihood.component';
import { AuditManagementRiskRatingComponent } from './pages/audit-management/audit-management-risk-rating/audit-management-risk-rating.component';
import { AuditManagementComponent } from './pages/audit-management/masters/audit-management/audit-management.component';
import { AnnualPlanFrequenciesComponent } from './pages/audit-management/annual-plan-frequencies/annual-plan-frequencies.component';
import { AmAuditCategoriesComponent } from './pages/audit-management/am-audit-categories/am-audit-categories.component';
import { AmAuditDocumentTypesComponent } from './pages/audit-management/am-audit-document-types/am-audit-document-types.component';
import { CorrectiveActionStatusComponent } from './pages/audit-management/corrective-action-status/corrective-action-status.component';
import { AuditTestPlanStatusComponent } from './pages/audit-management/audit-test-plan-status/audit-test-plan-status.component';
import { InformationRequestStatusesComponent } from './pages/audit-management/information-request-statuses/information-request-statuses.component';


// //kpi-management
import { KpiManagementComponent } from './pages/kpi-management/masters/kpi-management/kpi-management.component';
import { KpiManagementStatusComponent } from './pages/kpi-management/kpi-management-status/kpi-management-status.component';
import { KpiReviewFrequenciesComponent } from './pages/kpi-management/kpi-review-frequencies/kpi-review-frequencies.component';
import { KpiScoreStatusesComponent } from './pages/kpi-management/kpi-score-statuses/kpi-score-statuses.component';
import { KpiImprovementPlanStatusesComponent } from './pages/kpi-management/kpi-improvement-plan-statuses/kpi-improvement-plan-statuses.component';

//event-monitoring
import { EventMonitoringComponent } from './pages/event-monitoring/masters/event-monitoring/event-monitoring.component';
import { EventTypeComponent } from './pages/event-monitoring/event-type/event-type.component';
import { PeriodicityComponent } from './pages/event-monitoring/periodicity/periodicity.component';
import { EntranceComponent } from './pages/event-monitoring/entrance/entrance.component';
import { RangeComponent } from './pages/event-monitoring/range/range.component';
import { DimensionComponent } from './pages/event-monitoring/dimension/dimension.component';
import { SpaceTypeComponent } from './pages/event-monitoring/space-type/space-type.component';
import { TargetAudienceComponent } from './pages/event-monitoring/target-audience/target-audience.component';
import { EventClosureChecklistComponent } from './pages/event-monitoring/event-closure-checklist/event-closure-checklist.component';
import { EventEquipmentComponent } from './pages/event-monitoring/event-equipment/event-equipment.component';
import { TaskPhaseComponent } from './pages/event-monitoring/task-phase/task-phase.component';
import { EventClosureStatusComponent } from './pages/event-monitoring/event-closure-status/event-closure-status.component';
import { CommunicationComponent } from './pages/event-monitoring/communication/communication.component';
import { EventEngagementStrategyComponent } from './pages/event-monitoring/event-engagement-strategy/event-engagement-strategy.component';
import { EventInfluenceComponent } from './pages/event-monitoring/event-influence/event-influence.component';
import { LocationsComponent } from './pages/event-monitoring/locations/locations.component';
import { SupportivesComponent } from './pages/event-monitoring/supportives/supportives.component';
import { EventStatusComponent } from './pages/event-monitoring/event-status/event-status.component';
import { EventChangeRequestItemsComponent } from './pages/event-monitoring/event-change-request-items/event-change-request-items.component';
import { EventMaturityMatrixRangesComponent } from './pages/event-monitoring/event-maturity-matrix-ranges/event-maturity-matrix-ranges.component';
import { EventMaturityMatrixParameterComponent } from './pages/event-monitoring/event-maturity-matrix-parameter/event-maturity-matrix-parameter.component';
import { EventMaturityMatrixTypesComponent } from './pages/event-monitoring/event-maturity-matrix-types/event-maturity-matrix-types.component';
import { StrategyStatusComponent } from './pages/strategy/strategy-status/strategy-status.component';
import { MsAuditManagementComponent } from './pages/ms-audit-management/master/ms-audit-management.component';
import { EventTaskStatusComponent } from './pages/event-monitoring/event-task-status/event-task-status.component';
import { AuditRiskRatingComponentRiskmanagement } from './pages/internal-audit/audit-risk-rating/audit-risk-rating.component';
import { MaturityMatrixPlanStatusesComponent } from './pages/event-monitoring/maturity-matrix-plan-statuses/maturity-matrix-plan-statuses.component';



//ms-audit-management
import { MsAuditCategoryComponent } from './pages/ms-audit-management/ms-audit-category/ms-audit-category.component';
import { MsAuditModesComponent } from './pages/ms-audit-management/ms-audit-mode/ms-audit-modes.component';
import { MsAuditScheduleStatusesComponent } from './pages/ms-audit-management/ms-audit-schedule-statuses/ms-audit-schedule-statuses.component';
import { MsAuditFindingCategoriesComponent } from './pages/ms-audit-management/ms-audit-finding-categories/ms-audit-finding-categories.component';


import { ChecklistComponent } from './pages/event-monitoring/checklist/checklist.component';
import { EventChangeRequestStatusComponent } from './pages/event-monitoring/event-change-request-status/event-change-request-status.component';
import { MsAuditChecklistGroupComponent } from './pages/ms-audit-management/ms-audit-checklist-group/ms-audit-checklist-group.component';
import { ExternalAuditFindingCategoriesComponent } from './pages/external-audit/external-audit-finding-categories/external-audit-finding-categories.component';
import { BaActionPlanStatusComponent } from './pages/business-assessment/ba-action-plan-status/ba-action-plan-status.component';
import { ObjectiveTypeComponent } from './pages/event-monitoring/objective-type/objective-type.component';
import { TestAndExerciseActionPlanStatusComponent } from './pages/bcm/test-and-exercise-action-plan-status/test-and-exercise-action-plan-status.component';
import { AmAnnualPlanStatusComponent } from './pages/audit-management/am-annual-plan-status/am-annual-plan-status.component';
import { ComplianceActionPlanStatusComponent } from './pages/compliance-management/compliance-action-plan-status/compliance-action-plan-status.component';
import { AmAuditReportTypeComponent } from './pages/audit-management/am-audit-report-type/am-audit-report-type.component';
import { EventRiskImpactAreasComponent } from './pages/event-monitoring/event-risk-impact-areas/event-risk-impact-areas.component';
import { AmAuditControlSelfAssessmentUpdateStatusComponent } from './pages/audit-management/am-audit-control-self-assessment-update-status/am-audit-control-self-assessment-update-status.component';
import { AmAuditControlSelfAssessmentStatusComponent } from './pages/audit-management/am-audit-control-self-assessment-status/am-audit-control-self-assessment-status.component';
import { MeetingAgendaTypeComponent } from './pages/mrm/meeting-agenda-type/meeting-agenda-type.component';
import { RiskFindingTypeComponent } from './pages/risk-management/risk-finding-type/risk-finding-type.component';
import { IsmsRiskImpactGuidelineComponent } from './pages/Isms/isms-risk-impact-guideline/isms-risk-impact-guideline.component';
import { StrategyPerformancesComponent } from './pages/strategy/strategy-performances/strategy-performances.component';
import { MsAuditStatusesComponent } from './pages/ms-audit-management/ms-audit-statuses/ms-audit-statuses.component';
import { MsAuditPlanStatusesComponent } from './pages/ms-audit-management/ms-audit-plan-statuses/ms-audit-plan-statuses.component';
import { MsAuditFindingCaStatusesComponent } from './pages/ms-audit-management/ms-audit-finding-ca-statuses/ms-audit-finding-ca-statuses.component';
import { MsAuditFindingStatusesComponent } from './pages/ms-audit-management/ms-audit-finding-statuses/ms-audit-finding-statuses.component';
import { MsAuditPlanCriteriaComponent } from './pages/ms-audit-management/ms-audit-plan-criteria/ms-audit-plan-criteria.component';
import { MsAuditPlanObjectivesComponent } from './pages/ms-audit-management/ms-audit-plan-objectives/ms-audit-plan-objectives.component';

// Mock Drill
import { MockDrillComponent } from './pages/mock-drill/master/mock-drill.component';
import { MockDrillStatusComponent } from './pages/mock-drill/mock-drill-status/mock-drill-status.component';
import { MockDrillTypesComponent } from './pages/mock-drill/mock-drill-types/mock-drill-types.component';
import { MockDrillResponseServiceComponent } from './pages/mock-drill/mock-drill-response-service/mock-drill-response-service.component';
import { MockDrillEvacuationRoleComponent } from './pages/mock-drill/mock-drill-evacuation-role/mock-drill-evacuation-role.component';
import { MockDrillChecksComponent } from './pages/mock-drill/mock-drill-checks/mock-drill-checks.component';
import { MockDrillScenarioComponent } from './pages/mock-drill/mock-drill-scenario/mock-drill-scenario.component';
import { MockDrillProgramStatusComponent } from './pages/mock-drill/mock-drill-program-status/mock-drill-program-status.component';
import { MockDrillScopesComponent } from './pages/mock-drill/mock-drill-scopes/mock-drill-scopes.component';
import { ComplianceReportingStatusComponent } from './pages/compliance-management/compliance-reporting-status/compliance-reporting-status.component';
import { MockDrillActionPlanStatusComponent } from './pages/mock-drill/mock-drill-action-plan-status/mock-drill-action-plan-status.component';
import { ControlAssessmentStatusComponent } from './pages/business-assessment/control-assessment-status/control-assessment-status.component';
import { ControlAssessmentActionPlanStatusComponent } from './pages/business-assessment/control-assessment-action-plan-status/control-assessment-action-plan-status.component';

//cyber incidents
import { CyberIncidentStatusesComponent } from './pages/cyber-incident/cyber-incident-statuses/cyber-incident-statuses.component';
import { CyberIncidentMasterComponent } from './pages/cyber-incident/cyber-incident-master/cyber-incident-master.component';
import { CyberIncidentClassificationComponent } from './pages/cyber-incident/cyber-incident-classification/cyber-incident-classification.component';
import { CyberIncidentCorrectiveActionStatusesComponent } from './pages/cyber-incident/cyber-incident-corrective-action-statuses/cyber-incident-corrective-action-statuses.component';
import { CyberIncidentImpactAnalysisCategoryComponent } from './pages/cyber-incident/cyber-incident-impact-analysis-category/cyber-incident-impact-analysis-category.component';
import { SlaAndContractAssessmentStatusComponent } from './pages/compliance-management/sla-and-contract-assessment-status/sla-and-contract-assessment-status.component';



@NgModule({
  declarations: [
    UserDocumentModalComponent,
    MasterLoaderComponent,
    UserDocumentModalComponent,
    CompetencyTypesMasterComponent,

    //supplier-management
    SupplierManagementMasterComponent,
    SuppliersComponent,

    //jso
    JsoMasterComponent,
    JsoCategoryComponent,
    JsoSubCategoryComponent,
    UnsafeActionObservedGroupComponent,
    UnsafeActionSubCategoriesComponent,
    UnsafeActionCategoriesComponent,
    JsoObservationTypeComponent,
    UnsafeActionStatusComponent,

    //external-audit
    RiskRatingComponent,
    ExternalAuditTypesComponent,
    ExternalAuditMasterComponent,
    ExternalAuditFindingCategoriesComponent,

    //training
    TrainingMasterComponent,
    TrainingCategoryComponent,
    TrainingStatusComponent,

    //compliance-management
    ComplianceTypeMasterComponent,
    ComplianceAreaComponent,
    CmMastersComponent,
    ComplianceSectionComponent,
    ComplianceFrequencyComponent,
    ComplianceStatusComponent,
    SlaCategoryComponent,
    SlaStatusesComponent,

    //masters
    MastersComponent,

    //general
    ModuleComponent,
    LabelsComponent,
    GeneralMasterComponent,
    MastersMasterComponent,
    RegionComponent,
    CountryComponent,
    IndustryCategoryComponent,
    IndustryComponent,
    TimezoneComponent,
    LocationComponent,
    AppFeedbackSmileyComponent,
    AppFeedbackKeyComponent,
    AppUserFeedbackComponent,
    FaqComponent,
    VenueComponent,
    LanguagesComponent,
    MasterMenuComponent,
    ModuleGroupsComponent,
    CurrencyComponent,

    //mrm
    MrmComponent,
    MeetingCategoryComponent,
    MeetingCriteriaComponent,
    MeetingObjectiveComponent,
    MeetingTypeComponent,
    MeetingPlanStatusComponent,
    MeetingAgendaComponent,
    MeetingReportStatusComponent,
    MeetingActionPlanStatusComponent,

    //asset-management
    AssetTypesComponent,
    AssetManagementMasterComponent,
    AssetsCategoryComponent,
    AssetSubCategoryComponent,
    AssetStatusComponent,
    AssetLocationComponent,
    AssetInvestmentTypesComponent,
    PhysicalConditionRankingsComponent,
    AssetOptionValuesComponent,
    AssetRatingsComponent,
    AssetMatrixCategoriesComponent,
    AssetMaintenanceCategoriesComponent,
    AssetMaintenanceTypesComponent,
    AssetMaintenanceScheduleFrequenciesComponent,
    AssetCalculationMethodComponent,
    AssetMaintenanceStatusesComponent,

    //risk-management
    RiskManagementComponent,
    RiskRatingComponentRiskmanagement,
    RiskCategoryComponent,
    RiskAreaComponent,
    RiskTypeComponent,
    RiskClassificationComponent,
    RiskReviewFrequencyComponent,
    RiskControlPlanComponent,
    RiskMatrixCalculationMethodComponent,
    RiskStatusComponent,
    RiskMatrixRatingLevelsComponent,
    ControlEfficiencyMeasuresComponent,
    RiskTreatmentStatusesComponent,
    RiskSourcesComponent,
    RiskLibraryComponent,
    KriMasterComponent,
    StrategicObjectivesComponent,
    ImpactAnalysisCategoriesComponent,
    RiskSubCategoryComponent,
    RiskRegisterTypeComponent,
    RiskImpactGuidelineComponent,

    //knowledge-hub
    ComplianceCategoryMasterComponent,
    KnowledgeHubMasterComponent,
    DocumentCategoryComponent,
    DocumentTypesComponent,
    DocumentFamilyComponent,
    DocumentSubCategoriesComponent,
    DocumentSubSubCategoriesComponent,
    TagComponent,
    DocumentAccessTypeComponent,
    DocumentChangeRequestTypeComponent,
    DocumentStatusComponent,
    DocumentReviewFrequenciesComponent,

    //Isms
    IsmsMastersComponent,
    IsmsVulnerabilityComponent,
    IsmsRiskMatrixRatingLevelComponent,
    IsmsRiskMatrixCalculationMethodComponent,
    IsmsRiskRatingComponent,
    IsmsRiskMatrixRatingLevelComponent,
    SoaStatusComponent,
    SoaImplementationStatusesComponent,

    //organization
    OrganizationMastersComponent,
    IssueCategoryMasterComponent,
    IssueDomainMasterComponent,
    MsTypeMasterComponent,
    IssueStatusMasterComponent,
    IssueMasterComponent,
    IssueTypeMasterComponent,
    MsTypeVersionMasterComponent,
    StakeholderMasterComponent,
    StakeholderTypeMasterComponent,
    DivisionComponent,
    DepartmentComponent,
    SectionComponent,
    SubSectionComponent,
    NeedExpectationComponent,
    ProductCategoryComponent,
    ServiceCategoryComponent,
    DivisionDetailsComponent,

    //human-capital
    CompetencyMasterComponent,
    CompetencyGroupMasterComponent,
    HumanCapitalMastersComponent,
    DesignationMasterComponent,
    DesignationGradeMasterComponent,
    DesignationLevelMasterComponent,
    DesignationZoneMasterComponent,
    UserDocumentTypeMasterComponent,
    UserReportMasterComponent,
    UserJdMasterComponent,
    KpiCategoryMasterComponent,
    UserKpiMasterComponent,
    UnitComponent,
    ReportFrequencyComponent,

    //incident-management
    IncidentManagementMasterComponent,
    IncidentDamageTypeComponent,
    IncidentCategoriesComponent,
    IncidentSubCategoryComponent,
    IncidentTypeComponent,
    IncidentStatusComponent,
    IncidentRootCauseComponent,
    IncidentDamageSeverityComponent,
    IncidentCorrectiveActionStatusComponent,
    IncidentInvestigationStatusComponent,

    //bcm
    BcmMastersComponent,
    BcmMastersComponent,
    ImpactRatingComponent,
    ImpactCategoryComponent,
    ImpactScinarioComponent,
    BiaScaleCategoryComponent,
    ImpactAreaComponent,
    BiaScaleComponent,
    BiaTireComponent,
    BiaImpactCategoryInformationComponent,
    BusinessContinuityPlanStatusComponent,
    BcpChangeRequestTypesComponent,
    BcsStatusComponent,
    BcsTypeComponent,
    BcsFinancesComponent,
    BusinessContinuityStrategySolutionStatusComponent,
    TestAndExerciseRecoveryLevelComponent,
    TestAndExerciseTypesComponent,
    TestAndExerciseCommunicationsComponent,
    TestAndExerciseStatusesComponent,
    TestAndExerciseChecklistComponent,
    BusinessImpactAnalysisStatusesComponent,

    //internal-audit
    AuditableItemCategoryComponent,
    InternalAditMastersComponent,
    AuditableItemTypeComponent,
    AuditCategoriesComponent,
    AuditCriterionComponent,
    AuditObjectiveComponent,
    AuditCheckListComponent,
    AuditFindingCategoriesComponent,
    FindingImpactAnalysisCategoryComponent,
    RootCauseCategoriesComponent,
    RootCauseSubCategoriesComponent,
    AuditableItemComponent,
    AuditReportStatusesComponent,
    AuditChecklistAnswerKeyComponent,
    FindingCorrectiveActionStatusesComponent,
    FindingStatusesComponent,
    AuditPlanStatusesComponent,

    //strategy
    StrategyMasterComponent,
    FocusAreaComponent,
    ObjectivesComponent,
    KpiTypeComponent,
    StrategyKpiDataTypeComponent,
    KpiCalculationTypesComponent,
    StrategyInitiativeActionsComponent,
    StrategyInitiativeReviewFrequencyComponent,
    AggregationTypesComponent,
    StrategyInitiativeStatusComponent,
    StrategyInitiativeActionPlanStatusComponent,
    StrategyProfileStatusComponent,
    StrategyProfileStatusComponent,
    StrategyThemesComponent,
    StrategyObjectiveTypeComponent,
    StrategyInitiativeMilestoneStatusComponent,

    //customer-engagement
    CustomerMastersComponent,
    CustomerCompliantTypesComponent,
    CustomerComplaintStatusComponent,
    CustomerComplaintInvestigationStatusComponent,
    CustomerComplaintActionPlanStatusesComponent,
    CustomerComplaintActionTypesComponent,
    CustomerComplaintSourceComponent,

    //bpm
    StorageTypesComponent,
    BpmMastersComponent,
    BackupAtOffsiteStatusesComponent,
    ProcessCategoriesMasterComponent,
    ProcessGroupsMasterComponent,
    ControlTypesComponent,
    ControlCategoriesComponent,
    ControlSubcategoriesMasterComponent,
    BusinessApplicationTypesComponent,
    BusinessApplicationsComponent,
    ProcessOperationFrequencyComponent,
    ProcessOperationModeComponent,
    ProcessAccessibilityComponent,
    RecordRetentionPoliciesComponent,
    HighAvailabilityStatusComponent,
    BackupFrequenciesComponent,
    StorageLocationsComponent,
    PeriodicBackupsComponent,
    ControlModeComponent,
    BpmSuppliersComponent,
    CheckListComponent,
    AuditRiskRatingComponentRiskmanagement,

    //project-management
    ProjectManagementComponent,
    ProjectTypeComponent,
    ProjectTimeCategoryComponent,
    ProjectCostCategoryComponent,
    ProjectStatusComponent,
    ProjectModuleComponent,
    ProjectCategoryComponent,
    ProjectTaskCategoryComponent,
    ProjectRolesComponent,
    ProjectTaskWeightageComponent,
    TaskStatusesComponent,
    ProjectTaskPrioritiesComponent,

    //project-monitoring
    ProjectContractTypeComponent,
    ProjectMonitoringComponent,
    ProjectPriorityComponent,
    ProjectThemeComponent,
    ProjectObjectiveComponent,
    ProjectKpiComponent,
    ProjectIssueStatusComponent,
    ProjectMonitoringStatusComponent,
    ProjectMonitoringStatusComponent,
    ProjectChangeRequestStatusComponent,
    ProjectClosureStatusComponent,
    ProjectCorrectiveActionStatusComponent,

    //business-assessment
    BusinessAssessmentFrequenciesComponent,
    BaMastersComponent,
    BusinessAssessmentStatusComponent,

    //audit-management
    AuditManagementComponent,
    AnnualPlanFrequenciesComponent,
    AmAuditCategoriesComponent,
    AnnualAuditPalnFrequencyItemComponent,
    AuditStatusesComponent,
    AuditManagementImpactComponent,
    AuditManagementLikelihoodComponent,
    AuditManagementRiskRatingComponent,
    AmAuditDocumentTypesComponent,
    CorrectiveActionStatusComponent,
    AuditTestPlanStatusComponent,
    InformationRequestStatusesComponent,

    // //kpi-management
    KpiManagementComponent,
    KpiManagementStatusComponent,
    KpiReviewFrequenciesComponent,
    KpiScoreStatusesComponent,
    KpiImprovementPlanStatusesComponent,

    //event-monitoring
    EventMonitoringComponent,
    EventTypeComponent,
    PeriodicityComponent,
    EntranceComponent,
    EventMonitoringComponent,
    TargetAudienceComponent,
    EventClosureChecklistComponent,
    RangeComponent,
    DimensionComponent,
    SpaceTypeComponent,
    EventEquipmentComponent,
    TaskPhaseComponent,
    CommunicationComponent,
    EventEngagementStrategyComponent,
    EventInfluenceComponent,
    LocationsComponent,
    SupportivesComponent,
    EventClosureStatusComponent,
    CommunicationComponent,
    EventStatusComponent,
    EventChangeRequestItemsComponent,
    EventMaturityMatrixParameterComponent,
    EventMaturityMatrixRangesComponent,
    EventMaturityMatrixTypesComponent,
    StrategyStatusComponent,
    MsAuditManagementComponent,
    EventTaskStatusComponent,
    ChecklistComponent,
    EventChangeRequestStatusComponent,
    MaturityMatrixPlanStatusesComponent,

    //ms-audit-category
    MsAuditCategoryComponent,
    MsAuditModesComponent,
    MsAuditChecklistGroupComponent,
    MsAuditScheduleStatusesComponent,
    BaActionPlanStatusComponent,
    ObjectiveTypeComponent,
    TestAndExerciseActionPlanStatusComponent,
    AmAnnualPlanStatusComponent,
    ComplianceActionPlanStatusComponent,
    AmAuditReportTypeComponent,
    EventRiskImpactAreasComponent,
    AmAuditControlSelfAssessmentUpdateStatusComponent,
    AmAuditControlSelfAssessmentStatusComponent,
    MeetingAgendaTypeComponent,
    RiskFindingTypeComponent,
    IsmsRiskImpactGuidelineComponent,
    StrategyPerformancesComponent,
    MsAuditStatusesComponent,
    MsAuditPlanStatusesComponent,
    MsAuditFindingCaStatusesComponent,
    MsAuditFindingStatusesComponent,
    MsAuditFindingCategoriesComponent,
    MsAuditPlanCriteriaComponent,
    MsAuditPlanObjectivesComponent,

    // Mock Drill
    MockDrillComponent,
    MockDrillStatusComponent,
    MockDrillTypesComponent,
    MockDrillResponseServiceComponent,
    MockDrillEvacuationRoleComponent,
    MockDrillChecksComponent,
    MockDrillScenarioComponent,
    MockDrillProgramStatusComponent,
    MockDrillScopesComponent,
    MockDrillActionPlanStatusComponent,
    ComplianceReportingStatusComponent,
    ControlAssessmentStatusComponent,
    ControlAssessmentActionPlanStatusComponent,
    CyberIncidentStatusesComponent,
    CyberIncidentMasterComponent,
    CyberIncidentClassificationComponent,
    CyberIncidentCorrectiveActionStatusesComponent,
    CyberIncidentImpactAnalysisCategoryComponent,
    SlaAndContractAssessmentStatusComponent
  ],
  imports: [
    SharedModule,
    MastersRoutingModule,
    NgxPaginationModule,
    CommonModule,
  ]
})
export class MastersModule { }
