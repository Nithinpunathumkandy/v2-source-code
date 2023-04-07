import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MastersComponent } from './pages/masters/masters.component';
import { HumanCapitalMastersComponent } from './pages/human-capital/masters/human-capital-masters.component';
import { CompetencyGroupMasterComponent } from './pages/human-capital/competency-group/competency-group-master.component';
import { OrganizationMastersComponent } from './pages/organization/masters/organization-masters.component';
import { IssueCategoryMasterComponent } from './pages/organization/issue-category/issue-category-master.component';
import { IssueDomainMasterComponent } from './pages/organization/issue-domain/issue-domain-master.component';
import { MsTypeMasterComponent } from './pages/organization/ms-type/ms-type-master.component';
import { ComplianceCategoryMasterComponent } from './pages/knowledge-hub/compliance-category/compliance-category-master.component';
import { ComplianceTypeMasterComponent } from './pages/compliance-management/compliance-type/compliance-type-master.component';
import { IssueStatusMasterComponent } from './pages/organization/issue-status/issue-status-master.component';
import { IssueMasterComponent } from './pages/organization/issue/issue-master.component';
import { IssueTypeMasterComponent } from './pages/organization/issue-type/issue-type-master.component';
import { MsTypeVersionMasterComponent } from './pages/organization/ms-type-version/ms-type-version-master.component';
import { StakeholderMasterComponent } from './pages/organization/stakeholder/stakeholder-master.component';
import { StakeholderTypeMasterComponent } from './pages/organization/stakeholder-type/stakeholder-type-master.component';
import { CompetencyMasterComponent } from './pages/human-capital/competency/competency-master.component';
import { DesignationMasterComponent } from './pages/human-capital/designation/designation-master.component';
import { DesignationGradeMasterComponent } from './pages/human-capital/designation-grade/designation-grade-master.component';
import { DesignationLevelMasterComponent } from './pages/human-capital/designation-level/designation-level-master.component';
import { DesignationZoneMasterComponent } from './pages/human-capital/designation-zone/designation-zone-master.component';
import { UserDocumentTypeMasterComponent } from './pages/human-capital/user-document-type/user-document-type-master.component';
import { BpmMastersComponent } from './pages/bpm/masters/bpm-masters.component';
import { ProcessGroupsMasterComponent } from './pages/bpm/process-groups/process-groups-master.component';
import { ProcessCategoriesMasterComponent } from './pages/bpm/process-categories/process-categories-master.component';
import { ControlTypesComponent } from './pages/bpm/control-types/control-types.component';
import { ControlCategoriesComponent } from './pages/bpm/control-categories/control-categories.component';
import { ControlSubcategoriesMasterComponent } from './pages/bpm/control-subcategories/control-subcategories-master.component';
import { UserReportMasterComponent } from './pages/human-capital/user-report/user-report-master.component';
import { UserJdMasterComponent } from './pages/human-capital/user-jd/user-jd-master.component';
import { KpiCategoryMasterComponent } from './pages/human-capital/kpi-category/kpi-category-master.component';
import { UserKpiMasterComponent } from './pages/human-capital/user-kpi/user-kpi-master.component';
import { InternalAditMastersComponent } from './pages/internal-audit/masters/internal-adit-masters/internal-adit-masters.component';
import { AuditableItemCategoryComponent } from './pages/internal-audit/auditable-item-category/auditable-item-category.component';
import { AuditableItemTypeComponent } from './pages/internal-audit/auditable-item-type/auditable-item-type.component';
import { AuditCategoriesComponent } from './pages/internal-audit/audit-categories/audit-categories.component';
import { AuditCriterionComponent } from './pages/internal-audit/audit-criterion/audit-criterion.component';
import { AuditObjectiveComponent } from './pages/internal-audit/audit-objective/audit-objective.component';
import { AuditCheckListComponent } from './pages/internal-audit/audit-check-list/audit-check-list.component';
import { AuditFindingCategoriesComponent } from './pages/internal-audit/audit-finding-categories/audit-finding-categories.component';
import { FindingImpactAnalysisCategoryComponent } from './pages/internal-audit/finding-impact-analysis-category/finding-impact-analysis-category.component';
import { RiskRatingComponent } from './pages/external-audit/risk-rating/risk-rating.component';
import { RootCauseCategoriesComponent } from './pages/internal-audit/root-cause-categories/root-cause-categories.component';
import { RootCauseSubCategoriesComponent } from './pages/internal-audit/root-cause-sub-categories/root-cause-sub-categories.component';
import { DivisionComponent } from './pages/organization/division/division.component';
import { DepartmentComponent } from './pages/organization/department/department.component';
import { SectionComponent } from './pages/organization/section/section.component';
import { SubSectionComponent } from './pages/organization/sub-section/sub-section.component';
import { KnowledgeHubMasterComponent } from './pages/knowledge-hub/masters/knowledge-hub-master/knowledge-hub-master.component';
import { JsoMasterComponent } from './pages/jso/masters/jso-master/jso-master.component';
import { JsoCategoryComponent } from './pages/jso/jso-category/jso-category.component';
import { DocumentCategoryComponent } from './pages/knowledge-hub/document-category/document-category.component';
import { DocumentTypesComponent } from './pages/knowledge-hub/document-types/document-types.component';
import { ComplianceAreaComponent } from './pages/compliance-management/compliance-area/compliance-area.component';
import { DocumentFamilyComponent } from './pages/knowledge-hub/document-family/document-family.component';
import { DocumentSubCategoriesComponent } from './pages/knowledge-hub/document-sub-categories/document-sub-categories.component';
import { DocumentSubSubCategoriesComponent } from './pages/knowledge-hub/document-sub-sub-categories/document-sub-sub-categories.component';
import { TagComponent } from './pages/knowledge-hub/tag/tag.component';
import { GeneralMasterComponent } from './pages/general/general-master/general-master.component';
import { AuditableItemComponent } from './pages/internal-audit/auditable-item/auditable-item.component';
import { NeedExpectationComponent } from './pages/organization/need-expectation/need-expectation.component';
import { ExternalAuditMasterComponent } from './pages/external-audit/master/external-audit-master/external-audit-master.component';
import { ExternalAuditTypesComponent } from './pages/external-audit/external-audit-types/external-audit-types.component';
import { MastersMasterComponent } from './pages/general/masters/masters.component';
import { LabelsComponent } from './pages/general/labels/labels.component';
import { DocumentAccessTypeComponent } from './pages/knowledge-hub/document-access-type/document-access-type.component';
import { DocumentChangeRequestTypeComponent } from './pages/knowledge-hub/document-change-request-type/document-change-request-type.component';
import { UnitComponent } from './pages/human-capital/unit/unit.component';
import { ReportFrequencyComponent } from './pages/human-capital/report-frequency/report-frequency.component';
import { RegionComponent } from './pages/general/region/region.component';
import { CountryComponent } from './pages/general/country/country.component';
import { IndustryCategoryComponent } from './pages/general/industry-category/industry-category.component';
import { IndustryComponent } from './pages/general/industry/industry.component';
import { TimezoneComponent } from './pages/general/timezone/timezone.component';
import { LocationComponent } from './pages/general/location/location.component';
import { AppFeedbackSmileyComponent } from './pages/general/app-feedback-smiley/app-feedback-smiley.component';
import { AppFeedbackKeyComponent } from './pages/general/app-feedback-key/app-feedback-key.component';
import { AppUserFeedbackComponent } from './pages/general/app-user-feedback/app-user-feedback.component';
import { ProductCategoryComponent } from './pages/organization/product-category/product-category.component';
import { ServiceCategoryComponent } from './pages/organization/service-category/service-category.component';
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
import { RiskTreatmentStatusesComponent } from './pages/risk-management/risk-treatment-statuses/risk-treatment-statuses.component';
import { RiskMatrixRatingLevelsComponent } from './pages/risk-management/risk-matrix-rating-levels/risk-matrix-rating-levels.component';
import { FaqComponent } from './pages/general/faq/faq.component';
import { MrmComponent } from './pages/mrm/master/mrm.component';
import { MeetingCategoryComponent } from './pages/mrm/meeting-category/meeting-category.component';
import { MeetingCriteriaComponent } from './pages/mrm/meeting-criteria/meeting-criteria.component';
import { MeetingObjectiveComponent } from './pages/mrm/meeting-objective/meeting-objective.component';
import { MeetingTypeComponent } from './pages/mrm/meeting-type/meeting-type.component';
import { MeetingPlanStatusComponent } from './pages/mrm/meeting-plan-status/meeting-plan-status.component';
import { MeetingAgendaComponent } from './pages/mrm/meeting-agenda/meeting-agenda.component';
import { ControlEfficiencyMeasuresComponent } from './pages/risk-management/control-efficiency-measures/control-efficiency-measures.component';
import { VenueComponent } from './pages/general/venue/venue.component';
import { ProjectManagementComponent } from './pages/project-management/master/project-management.component';
import { ProjectTypeComponent } from './pages/project-management/project-type/project-type.component';
import { ProjectTimeCategoryComponent } from './pages/project-management/project-time-category/project-time-category.component';
import { ProjectCostCategoryComponent } from './pages/project-management/project-cost-category/project-cost-category.component';
import { ProjectStatusComponent } from './pages/project-management/project-status/project-status.component';
import { ProjectModuleComponent } from './pages/project-management/project-module/project-module.component';
import { ProjectCategoryComponent } from './pages/project-management/project-category/project-category.component';
import { ProjectTaskCategoryComponent } from './pages/project-management/project-task-category/project-task-category.component';
import { ProjectRolesComponent } from './pages/project-management/project-roles/project-roles.component';
import { LanguagesComponent } from './pages/general/languages/languages.component';
import { MasterMenuComponent } from './pages/general/master-menu/master-menu.component';
import { ModuleGroupsComponent } from './pages/general/module-groups/module-groups.component';
import { DocumentStatusComponent } from './pages/knowledge-hub/document-status/document-status.component';
import { CurrencyComponent } from './pages/general/currency/currency.component';
import { MeetingReportStatusComponent } from './pages/mrm/meeting-report-status/meeting-report-status.component';
import { AuditReportStatusesComponent } from './pages/internal-audit/audit-report-statuses/audit-report-statuses.component';
import { AuditChecklistAnswerKeyComponent } from './pages/internal-audit/audit-checklist-answer-key/audit-checklist-answer-key.component';
import { MeetingActionPlanStatusComponent } from './pages/mrm/meeting-action-plan-status/meeting-action-plan-status.component';
import { IncidentManagementMasterComponent } from './pages/incident-management/masters/incident-management-master.component';
import { IncidentDamageTypeComponent } from './pages/incident-management/incident-damage-type/incident-damage-type.component';
import { IncidentCategoriesComponent } from './pages/incident-management/incident-categories/incident-categories.component';
import { IncidentSubCategoryComponent } from './pages/incident-management/incident-sub-category/incident-sub-category.component';
import { IncidentTypeComponent } from './pages/incident-management/incident-type/incident-type.component';
import { IncidentStatusComponent } from './pages/incident-management/incident-status/incident-status.component';
import { from } from 'rxjs';
import { JsoSubCategoryComponent } from './pages/jso/jso-sub-category/jso-sub-category.component';
import { RiskSourcesComponent } from './pages/risk-management/risk-sources/risk-sources.component';
import { RiskLibraryComponent } from './pages/risk-management/risk-library/risk-library.component';
import { UnsafeActionObservedGroupComponent } from './pages/jso/unsafe-action-observed-group/unsafe-action-observed-group.component';
import { UnsafeActionSubCategoriesComponent } from './pages/jso/unsafe-action-sub-categories/unsafe-action-sub-categories.component';
import { UnsafeActionCategoriesComponent } from './pages/jso/unsafe-action-categories/unsafe-action-categories.component';
import { IncidentRootCauseComponent } from './pages/incident-management/incident-root-cause/incident-root-cause.component';
import { KriMasterComponent } from './pages/risk-management/kri-master/kri-master.component';
import { JsoObservationTypeComponent } from './pages/jso/jso-observation-type/jso-observation-type.component';
import { StrategicObjectivesComponent } from './pages/risk-management/strategic-objectives/strategic-objectives.component';
import { CmMastersComponent } from './pages/compliance-management/cm-masters/cm-masters.component';
import { ComplianceSectionComponent } from './pages/compliance-management/compliance-section/compliance-section.component';
import { ImpactAnalysisCategoriesComponent } from './pages/risk-management/impact-analysis-categories/impact-analysis-categories.component';
import { IncidentDamageSeverityComponent } from './pages/incident-management/incident-damage-severity/incident-damage-severity.component';
import { ComplianceFrequencyComponent } from './pages/compliance-management/compliance-frequency/compliance-frequency.component';
import { ComplianceStatusComponent } from './pages/compliance-management/compliance-status/compliance-status.component';
import { UnsafeActionStatusComponent } from './pages/jso/unsafe-action-status/unsafe-action-status.component';
import { IncidentCorrectiveActionStatusComponent } from './pages/incident-management/incident-corrective-action-status/incident-corrective-action-status.component';
import { SlaCategoryComponent } from './pages/compliance-management/sla-category/sla-category.component';
import { SlaStatusesComponent } from './pages/compliance-management/sla-statuses/sla-statuses.component';
import { RiskSubCategoryComponent } from './pages/risk-management/risk-sub-category/risk-sub-category.component';
import { IncidentInvestigationStatusComponent } from './pages/incident-management/incident-investigation-status/incident-investigation-status.component';
import { SupplierManagementMasterComponent } from './pages/supplier-management/master/supplier-management-master/supplier-management-master.component';

import { BcmMastersComponent } from './pages/bcm/masters/bcm-masters.component';
import { SuppliersComponent } from './pages/supplier-management/suppliers/suppliers.component';
import { StrategyMasterComponent } from './pages/strategy/masters/strategy-master/strategy-master.component';
import { FocusAreaComponent } from './pages/strategy/focus-area/focus-area.component';
import { ObjectivesComponent } from './pages/strategy/objectives/objectives.component';
import { ProcessOperationModeComponent } from './pages/bpm/process-operation-mode/process-operation-mode.component';
import { ProcessAccessibilityComponent } from './pages/bpm/process-accessibility/process-accessibility.component';
import { data } from 'jquery';
import { ImpactRatingComponent } from './pages/bcm/impact-rating/impact-rating.component';
import { ImpactCategoryComponent } from './pages/bcm/impact-category/impact-category.component';
import { StorageTypesComponent } from './pages/bpm/storage-types/storage-types.component';
import { ImpactScinarioComponent } from './pages/bcm/impact-scenario/impact-scenario.component';
import { BiaScaleCategoryComponent } from './pages/bcm/bia-scale-category/bia-scale-category.component';
import { BackupAtOffsiteStatusesComponent } from './pages/bpm/backup-at-offsite-statuses/backup-at-offsite-statuses.component';
import { ImpactAreaComponent } from './pages/bcm/impact-area/impact-area.component';
import { RecordRetentionPoliciesComponent } from './pages/bpm/record-retention-policies/record-retention-policies.component';
import { HighAvailabilityStatusComponent } from './pages/bpm/high-availability-status/high-availability-status.component';
import { StorageLocationsComponent } from './pages/bpm/storage-locations/storage-locations.component';
import { BackupFrequenciesComponent } from './pages/bpm/backup-frequencies/backup-frequencies.component';
import { BusinessApplicationTypesComponent } from './pages/bpm/business-application-types/business-application-types.component';
import { ProcessOperationFrequencyComponent } from './pages/bpm/process-operation-frequency/process-operation-frequency.component';
import { BusinessApplicationsComponent } from './pages/bpm/business-applications/business-applications.component';
import { PeriodicBackupsComponent } from './pages/bpm/periodic-backups/periodic-backups.component';
import { ControlModeComponent } from './pages/bpm/control-mode/control-mode.component';
import { BiaScaleComponent } from './pages/bcm/bia-scale/bia-scale.component';
import { BiaTireComponent } from './pages/bcm/bia-tire/bia-tire.component';
import { BiaImpactCategoryInformationComponent } from './pages/bcm/bia-impact-category-information/bia-impact-category-information.component';
import { KpiTypeComponent } from './pages/strategy/kpi-type/kpi-type.component';
import { StrategyKpiDataTypeComponent } from './pages/strategy/strategy-kpi-data-types/strategy-kpi-data-types.component';
import { KpiCalculationTypesComponent } from './pages/strategy/kpi-calculation-types/kpi-calculation-types.component';
import { TrainingMasterComponent } from './pages/training/master/training-master/training-master.component';
import { TrainingCategoryComponent } from './pages/training/training-category/training-category.component';
import { TrainingStatusComponent } from './pages/training/training-status/training-status.component';
import { AssetTypesComponent } from './pages/asset-management/asset-types/asset-types.component';
import { AssetManagementMasterComponent } from './pages/asset-management/masters/asset-management-master.component';
import { AssetsCategoryComponent } from './pages/asset-management/assets-category/assets-category.component';
import { AssetSubCategoryComponent } from './pages/asset-management/asset-sub-category/asset-sub-category.component';
import { AssetStatusComponent } from './pages/asset-management/asset-status/asset-status.component';
import { AssetLocationComponent } from './pages/asset-management/asset-location/asset-location.component';
import { AssetInvestmentTypesComponent } from './pages/asset-management/asset-investment-types/asset-investment-types.component';
import { PhysicalConditionRankingsComponent } from './pages/asset-management/physical-condition-rankings/physical-condition-rankings.component';
import { StrategyInitiativeActionsComponent } from './pages/strategy/strategy-initiative-actions/strategy-initiative-actions.component';
import { StrategyInitiativeReviewFrequencyComponent } from './pages/strategy/strategy-initiative-review-frequencies/strategy-initiative-review-frequencies.component';
import { AssetMatrixCategoriesComponent } from './pages/asset-management/asset-matrix-categories/asset-matrix-categories.component';
import { AssetMaintenanceCategoriesComponent } from './pages/asset-management/asset-maintenance-categories/asset-maintenance-categories.component';
import { CustomerMastersComponent } from './pages/customer-engagement/customer-masters/customer-masters.component';
import { CustomerCompliantTypesComponent } from './pages/customer-engagement/customer-compliant-types/customer-compliant-types.component';
import { CustomerComplaintStatusComponent } from './pages/customer-engagement/customer-complaint-status/customer-complaint-status.component';
import { CustomerComplaintInvestigationStatusComponent } from './pages/customer-engagement/customer-complaint-investigation-status/customer-complaint-investigation-status.component';
import { CustomerComplaintActionPlanStatusesComponent } from './pages/customer-engagement/customer-complaint-action-plan-statuses/customer-complaint-action-plan-statuses';
import { AssetMaintenanceTypesComponent } from './pages/asset-management/asset-maintenance-types/asset-maintenance-types.component';
import { AssetMaintenanceScheduleFrequenciesComponent } from './pages/asset-management/asset-maintenance-schedule-frequencies/asset-maintenance-schedule-frequencies.component';
import { AssetCalculationMethodComponent } from './pages/asset-management/asset-calculation-method/asset-calculation-method.component';
import { AssetMaintenanceStatusesComponent } from './pages/asset-management/asset-maintenance-statuses/asset-maintenance-statuses.component';
import { AssetOptionValuesComponent } from './pages/asset-management/asset-option-values/asset-option-values.component';
import { AssetRatingsComponent } from './pages/asset-management/asset-ratings/asset-ratings.component';
import { BusinessContinuityPlanStatusComponent } from './pages/bcm/business-continuity-plan-status/business-continuity-plan-status.component';
import { CustomerComplaintActionTypesComponent } from './pages/customer-engagement/customer-complaint-action-types/customer-complaint-action-types.component';
import { RiskRegisterTypeComponent } from './pages/risk-management/risk-register-type/risk-register-type.component';
import { AggregationTypesComponent } from './pages/strategy/aggregation-types/aggregation-types.component';
import { BcpChangeRequestTypesComponent } from './pages/bcm/bcp-change-request-types/bcp-change-request-types.component';
import { IsmsMastersComponent } from './pages/Isms/masters/isms-masters.component';
import { IsmsVulnerabilityComponent } from './pages/Isms/isms-vulnerability/isms-vulnerability.component';
import { IsmsRiskMatrixCalculationMethodComponent } from './pages/Isms/isms-risk-matrix-calculation-method/isms-risk-matrix-calculation-method.component';
import { IsmsRiskRatingComponent } from './pages/Isms/isms-risk-rating/isms-risk-rating.component';
import { IsmsRiskMatrixRatingLevelComponent } from './pages/Isms/isms-risk-matrix-rating-level/isms-risk-matrix-rating-level.component';
import { BcsStatusComponent } from './pages/bcm/bcs-status/bcs-status.component';
import { BcsTypeComponent } from './pages/bcm/bcs-type/bcs-type.component';
import { BcsFinancesComponent } from './pages/bcm/bcs-finances/bcs-finances.component';
import { BusinessContinuityStrategySolutionStatusComponent } from './pages/bcm/business-continuity-strategy-solution-status/business-continuity-strategy-solution-status.component';
import { TestAndExerciseRecoveryLevelComponent } from './pages/bcm/test-and-exercise-recovery-level/test-and-exercise-recovery-level.component';
import { TestAndExerciseTypesComponent } from './pages/bcm/test-and-exercise-types/test-and-exercise-types.component';
import { TestAndExerciseCommunicationsComponent } from './pages/bcm/test-and-exercise-communications/test-and-exercise-communications.component';
import { TestAndExerciseStatusesComponent } from './pages/bcm/test-and-exercise-statuses/test-and-exercise-statuses.component';
import { TestAndExerciseChecklistComponent } from './pages/bcm/test-and-exercise-checklist/test-and-exercise-checklist.component';
import { CompetencyTypesMasterComponent } from 'src/app/modules/masters/pages/human-capital/competency-types/competency-types-master/competency-types-master.component';
import { StrategyInitiativeStatusComponent } from 'src/app/modules/masters/pages/strategy/strategy-initiative-status/strategy-initiative-status/strategy-initiative-status.component';
import { StrategyInitiativeActionPlanStatusComponent } from 'src/app/modules/masters/pages/strategy/strategy-initiative-action-plan-status/strategy-initiative-action-plan-status/strategy-initiative-action-plan-status.component';
import { StrategyProfileStatusComponent } from 'src/app/modules/masters/pages/strategy/strategy-profile-status/strategy-profile-status/strategy-profile-status.component'
import { FindingCorrectiveActionStatusesComponent } from './pages/internal-audit/finding-corrective-action-statuses/finding-corrective-action-statuses.component';
import { FindingStatusesComponent } from './pages/internal-audit/finding-statuses/finding-statuses.component';
import { CustomerComplaintSourceComponent } from './pages/customer-engagement/customer-complaint-source/customer-complaint-source.component';
import { BaMastersComponent } from './pages/business-assessment/ba-masters/ba-masters.component';
import { BusinessAssessmentStatusComponent } from './pages/business-assessment/business-assessment-status/business-assessment-status.component';
import { SoaStatusComponent } from './pages/Isms/soa-statuses/soa-statuses.component';
import { SoaImplementationStatusesComponent } from './pages/Isms/soa-implementation-statuses/soa-implementation-statuses.component';
import { path } from '@amcharts/amcharts4/core';
import { DivisionDetailsComponent } from './pages/organization/division/division-details/division-details.component';
import { ProjectContractTypeComponent } from './pages/project-monitoring/project-contract-type/project-contract-type.component';
import { ProjectMonitoringComponent } from './pages/project-monitoring/masters/project-monitoring/project-monitoring.component';
import { BusinessImpactAnalysisStatusesComponent } from './pages/bcm/business-impact-analysis-statuses/business-impact-analysis-statuses.component';
import { ProjectPriorityComponent } from './pages/project-monitoring/project-priority/project-priority.component';
import { AuditPlanStatusesComponent } from './pages/internal-audit/audit-plan-statuses/audit-plan-statuses.component';
import { ProjectThemeComponent } from './pages/project-monitoring/project-theme/project-theme.component';
import { ProjectObjectiveComponent } from './pages/project-monitoring/project-objective/project-objective.component';
import { ProjectKpiComponent } from './pages/project-monitoring/project-kpi/project-kpi.component';
import { KpiManagementComponent } from './pages/kpi-management/masters/kpi-management/kpi-management.component';
import { KpiManagementStatusComponent } from './pages/kpi-management/kpi-management-status/kpi-management-status.component';
import { KpiReviewFrequenciesComponent } from './pages/kpi-management/kpi-review-frequencies/kpi-review-frequencies.component';
import { ProjectIssueStatusComponent } from './pages/project-monitoring/project-issue-status/project-issue-status.component'
import { ProjectMonitoringStatusComponent } from './pages/project-monitoring/project-monitoring-status/project-monitoring-status.component';
import { DocumentReviewFrequenciesComponent } from './pages/knowledge-hub/document-review-frequencies/document-review-frequencies.component';
import { ProjectTaskWeightageComponent } from './pages/project-management/project-task-weightage/project-task-weightage.component';
import { RiskImpactGuidelineComponent } from './pages/risk-management/risk-impact-guideline/risk-impact-guideline.component';
import { KpiScoreStatusesComponent } from './pages/kpi-management/kpi-score-statuses/kpi-score-statuses.component';
import { ProjectChangeRequestStatusComponent } from './pages/project-monitoring/project-change-request-status/project-change-request-status.component';
import { ProjectClosureStatusComponent } from './pages/project-monitoring/project-closure-status/project-closure-status.component';
import { TaskStatusesComponent } from './pages/project-management/task-statuses/task-statuses.component';
import { ProjectTaskPrioritiesComponent } from './pages/project-management/task-priorities/task-priorities.component';
import { KpiImprovementPlanStatusesComponent } from './pages/kpi-management/kpi-improvement-plan-statuses/kpi-improvement-plan-statuses.component';
import { StrategyThemesComponent } from './pages/strategy/strategy-themes/strategy-themes.component';
import { AuditManagementComponent } from './pages/audit-management/masters/audit-management/audit-management.component';
import { AmAuditCategoriesComponent } from './pages/audit-management/am-audit-categories/am-audit-categories.component';
import { AnnualPlanFrequenciesComponent } from './pages/audit-management/annual-plan-frequencies/annual-plan-frequencies.component';
import { EventMonitoringComponent } from './pages/event-monitoring/masters/event-monitoring/event-monitoring.component';
import { EventTypeComponent } from './pages/event-monitoring/event-type/event-type.component';
import { RangeComponent } from './pages/event-monitoring/range/range.component';
import { DimensionComponent } from './pages/event-monitoring/dimension/dimension.component'
import { SpaceTypeComponent } from './pages/event-monitoring/space-type/space-type.component';
import { PeriodicityComponent } from './pages/event-monitoring/periodicity/periodicity.component';
import { EntranceComponent } from './pages/event-monitoring/entrance/entrance.component';
import { TargetAudienceComponent } from './pages/event-monitoring/target-audience/target-audience.component';
import { EventClosureChecklistComponent } from './pages/event-monitoring/event-closure-checklist/event-closure-checklist.component';
import { ProjectCorrectiveActionStatusComponent } from './pages/project-monitoring/project-corrective-action-status/project-corrective-action-status.component';
import { EventEquipmentComponent } from './pages/event-monitoring/event-equipment/event-equipment.component';
import { AnnualAuditPalnFrequencyItemComponent } from './pages/audit-management/annual-audit-paln-frequency-item/annual-audit-paln-frequency-item.component';
import { TaskPhaseComponent } from './pages/event-monitoring/task-phase/task-phase.component';
import { StrategyObjectiveTypeComponent } from './pages/strategy/strategy-objective-type/strategy-objective-type.component';
import { AuditStatusesComponent } from './pages/audit-management/audit-statuses/audit-statuses.component';
import { ModuleComponent } from './pages/general/module/module.component';
import { EventClosureStatusComponent } from './pages/event-monitoring/event-closure-status/event-closure-status.component';
import { CommunicationComponent } from './pages/event-monitoring/communication/communication.component';
import { EventEngagementStrategyComponent } from './pages/event-monitoring/event-engagement-strategy/event-engagement-strategy.component';
import { EventInfluenceComponent } from './pages/event-monitoring/event-influence/event-influence.component';
import { LocationsComponent } from './pages/event-monitoring/locations/locations.component';
import { SupportivesComponent } from './pages/event-monitoring/supportives/supportives.component';
import { EventStatusComponent } from './pages/event-monitoring/event-status/event-status.component';
import { BusinessAssessmentFrequenciesComponent } from './pages/business-assessment/business-assessment-frequencies/business-assessment-frequencies.component';
import { AuditManagementImpactComponent } from './pages/audit-management/audit-management-impact/audit-management-impact.component';
import { AuditManagementRiskRatingComponent } from './pages/audit-management/audit-management-risk-rating/audit-management-risk-rating.component';
import { AuditManagementLikelihoodComponent } from './pages/audit-management/audit-management-likelihood/audit-management-likelihood.component';
import { EventChangeRequestItemsComponent } from './pages/event-monitoring/event-change-request-items/event-change-request-items.component';
import { EventMaturityMatrixRangesComponent } from './pages/event-monitoring/event-maturity-matrix-ranges/event-maturity-matrix-ranges.component';
import { EventMaturityMatrixParameterComponent } from './pages/event-monitoring/event-maturity-matrix-parameter/event-maturity-matrix-parameter.component';
import { EventMaturityMatrixTypesComponent } from './pages/event-monitoring/event-maturity-matrix-types/event-maturity-matrix-types.component';
import { StrategyInitiativeMilestoneStatusComponent } from './pages/strategy/strategy-initiative-milestone-status/strategy-initiative-milestone-status.component';
import { MsAuditManagementComponent } from './pages/ms-audit-management/master/ms-audit-management.component';
import { MsAuditCategoryComponent } from './pages/ms-audit-management/ms-audit-category/ms-audit-category.component';
import { EventTaskStatusComponent } from './pages/event-monitoring/event-task-status/event-task-status.component';
import { BpmSuppliersComponent } from './pages/bpm/bpm-suppliers/bpm-suppliers.component';
import { CheckListComponent } from './pages/knowledge-hub/check-list/check-list.component';
import { AuditRiskRatingComponentRiskmanagement } from './pages/internal-audit/audit-risk-rating/audit-risk-rating.component';
import { ExternalAuditFindingCategoriesComponent } from './pages/external-audit/external-audit-finding-categories/external-audit-finding-categories.component';
import { ChecklistComponent } from './pages/event-monitoring/checklist/checklist.component';
import { AmAuditDocumentTypesComponent } from './pages/audit-management/am-audit-document-types/am-audit-document-types.component';
import { StrategyStatusComponent } from './pages/strategy/strategy-status/strategy-status.component';
import { EventChangeRequestStatusComponent } from './pages/event-monitoring/event-change-request-status/event-change-request-status.component';
import { MsAuditModesComponent } from './pages/ms-audit-management/ms-audit-mode/ms-audit-modes.component';
import { CorrectiveActionStatusComponent } from './pages/audit-management/corrective-action-status/corrective-action-status.component';
import { MsAuditChecklistGroupComponent } from './pages/ms-audit-management/ms-audit-checklist-group/ms-audit-checklist-group.component';
import { MaturityMatrixPlanStatusesComponent } from './pages/event-monitoring/maturity-matrix-plan-statuses/maturity-matrix-plan-statuses.component';
import { AuditTestPlanStatusComponent } from './pages/audit-management/audit-test-plan-status/audit-test-plan-status.component';
import { ObjectiveTypeComponent } from './pages/event-monitoring/objective-type/objective-type.component';
import { InformationRequestStatusesComponent } from './pages/audit-management/information-request-statuses/information-request-statuses.component';
import { MsAuditScheduleStatusesComponent } from './pages/ms-audit-management/ms-audit-schedule-statuses/ms-audit-schedule-statuses.component';
import { TestAndExerciseActionPlanStatusComponent } from './pages/bcm/test-and-exercise-action-plan-status/test-and-exercise-action-plan-status.component';
import { AmAnnualPlanStatusComponent } from './pages/audit-management/am-annual-plan-status/am-annual-plan-status.component';
import { AmAuditReportTypeComponent } from './pages/audit-management/am-audit-report-type/am-audit-report-type.component';
import { EventRiskImpactAreasComponent } from './pages/event-monitoring/event-risk-impact-areas/event-risk-impact-areas.component';
import { AmAuditControlSelfAssessmentUpdateStatusComponent } from './pages/audit-management/am-audit-control-self-assessment-update-status/am-audit-control-self-assessment-update-status.component';
import { AmAuditControlSelfAssessmentStatusComponent } from './pages/audit-management/am-audit-control-self-assessment-status/am-audit-control-self-assessment-status.component';
import { MeetingAgendaTypeComponent } from './pages/mrm/meeting-agenda-type/meeting-agenda-type.component';
import { RiskFindingTypeComponent } from './pages/risk-management/risk-finding-type/risk-finding-type.component';
import { IsmsRiskImpactGuidelineComponent } from './pages/Isms/isms-risk-impact-guideline/isms-risk-impact-guideline.component';
import { MsAuditStatusesComponent } from './pages/ms-audit-management/ms-audit-statuses/ms-audit-statuses.component';
import { MsAuditPlanStatusesComponent } from './pages/ms-audit-management/ms-audit-plan-statuses/ms-audit-plan-statuses.component';
import { MsAuditFindingStatusesComponent } from './pages/ms-audit-management/ms-audit-finding-statuses/ms-audit-finding-statuses.component';
import { MsAuditFindingCaStatusesComponent } from './pages/ms-audit-management/ms-audit-finding-ca-statuses/ms-audit-finding-ca-statuses.component';
import { MsAuditFindingCategoriesComponent } from './pages/ms-audit-management/ms-audit-finding-categories/ms-audit-finding-categories.component';
import { MsAuditPlanCriteriaComponent } from './pages/ms-audit-management/ms-audit-plan-criteria/ms-audit-plan-criteria.component';
import { MsAuditPlanObjectivesComponent } from './pages/ms-audit-management/ms-audit-plan-objectives/ms-audit-plan-objectives.component';
// Mock Drill
import { MockDrillStatusComponent } from './pages/mock-drill/mock-drill-status/mock-drill-status.component';
import { MockDrillComponent } from './pages/mock-drill/master/mock-drill.component';
import { MockDrillTypesComponent } from './pages/mock-drill/mock-drill-types/mock-drill-types.component';
import { MockDrillResponseServiceComponent } from './pages/mock-drill/mock-drill-response-service/mock-drill-response-service.component';
import { MockDrillEvacuationRoleComponent } from './pages/mock-drill/mock-drill-evacuation-role/mock-drill-evacuation-role.component';
import { MockDrillChecksComponent } from './pages/mock-drill/mock-drill-checks/mock-drill-checks.component';
import { MockDrillScenarioComponent } from './pages/mock-drill/mock-drill-scenario/mock-drill-scenario.component';
import { MockDrillProgramStatusComponent } from './pages/mock-drill/mock-drill-program-status/mock-drill-program-status.component';
import { MockDrillScopesComponent } from './pages/mock-drill/mock-drill-scopes/mock-drill-scopes.component';
import { ComplianceReportingStatusComponent } from './pages/compliance-management/compliance-reporting-status/compliance-reporting-status.component';
import { MockDrillActionPlanStatusComponent } from './pages/mock-drill/mock-drill-action-plan-status/mock-drill-action-plan-status.component';

//business assessment
import { ControlAssessmentStatusComponent } from './pages/business-assessment/control-assessment-status/control-assessment-status.component';
import { ControlAssessmentActionPlanStatusComponent } from './pages/business-assessment/control-assessment-action-plan-status/control-assessment-action-plan-status.component';

//cyber incidents
import { CyberIncidentStatusesComponent } from './pages/cyber-incident/cyber-incident-statuses/cyber-incident-statuses.component';
import { CyberIncidentMasterComponent } from './pages/cyber-incident/cyber-incident-master/cyber-incident-master.component';
import { CyberIncidentClassificationComponent } from './pages/cyber-incident/cyber-incident-classification/cyber-incident-classification.component';
import { CyberIncidentCorrectiveActionStatusesComponent } from './pages/cyber-incident/cyber-incident-corrective-action-statuses/cyber-incident-corrective-action-statuses.component';
import { CyberIncidentImpactAnalysisCategoryComponent } from './pages/cyber-incident/cyber-incident-impact-analysis-category/cyber-incident-impact-analysis-category.component';
import { SlaAndContractAssessmentStatusComponent } from './pages/compliance-management/sla-and-contract-assessment-status/sla-and-contract-assessment-status.component';


const routes: Routes = [
  {
    path: '',
    component: MastersComponent,
    data: {
      core: { title: 'Masters' },
    },
    children: [
      {
        path: '',
        redirectTo: 'organization'
      },
      //human-capital-modules
      {
        path: 'human-capital',
        component: HumanCapitalMastersComponent,
        data: {
          core: { title: "Human Capital" }
        }
      },
      {
        path: 'competency-groups',
        component: CompetencyGroupMasterComponent,
        data: {
          core: { title: 'Competency Group' }
        }
      },
      {
        path: 'competencies',
        component: CompetencyMasterComponent,
        data: {
          core: { title: 'Competency' }
        }
      },
      {
        path: 'designations',
        component: DesignationMasterComponent,
        data: {
          core: { title: 'Designations' }
        }
      },
      {
        path: 'designation-grades',
        component: DesignationGradeMasterComponent,
        data: {
          core: { title: 'Designation Grades' }
        }
      },
      {
        path: 'designation-levels',
        component: DesignationLevelMasterComponent,
        data: {
          core: { title: 'Designation Levels' }
        }
      }, {

        path: 'units',
        component: UnitComponent,
        data: {
          core: { title: 'Units' }
        }
      }, {

        path: 'report-frequencies',
        component: ReportFrequencyComponent,
        data: {
          core: { title: 'Report Frequency' }
        }
      },
      {
        path: 'designation-zones',
        component: DesignationZoneMasterComponent,
        data: {
          core: { title: 'Designation Zones' }
        }
      },
      {
        path: 'user-document-types',
        component: UserDocumentTypeMasterComponent,
        data: {
          core: { title: 'User Document Types' }
        }
      },

      {
        path: 'kpi-categories',
        component: KpiCategoryMasterComponent,
        data: {
          core: { title: 'KPI Category' }
        }
      },
      {
        path: 'kpis',
        component: UserKpiMasterComponent,
        data: {
          core: { title: 'KPI' }
        }
      },

      {
        path: 'user-reports',
        component: UserReportMasterComponent,
        data: {
          core: { title: 'User Report' }
        }
      },

      {
        path: 'jds',
        component: UserJdMasterComponent,
        data: {
          core: { title: 'User JD' }
        }
      },
      //bpm modules
      {
        path: 'bpm',
        component: BpmMastersComponent,
        data: {
          core: { title: "BPM" }
        }
      },
      {
        path: 'process-groups',
        component: ProcessGroupsMasterComponent,
        data: {
          core: {
            title: "Process Groups"
          }
        }
      },
      {
        path: 'process-categories',
        component: ProcessCategoriesMasterComponent,
        data: {
          core: {
            title: "Process Categories"
          }
        }
      },
      {
        path: 'control-types',
        component: ControlTypesComponent,
        data: {
          core: {
            title: "Control Types"
          }
        }
      },
      {
        path: 'control-categories',
        component: ControlCategoriesComponent,
        data: {
          core: {
            title: "Control Category"
          }
        }
      },
      {
        path: 'control-modes',
        component: ControlModeComponent,
        data: {
          core: {
            title: "Control Mode"
          }
        }
      },
      {
        path: 'control-sub-categories',
        component: ControlSubcategoriesMasterComponent,
        data: {
          core: {
            title: "Control SubCategory"
          }
        }
      },
      {
        path: 'backup-at-offsite-statuses',
        component: BackupAtOffsiteStatusesComponent,
        data: {
          core: {
            title: "Backup At Offsite Statuses"
          }
        }
      },
      {
        path: 'record-retention-policies',
        component: RecordRetentionPoliciesComponent,
        data: {
          core: {
            title: "Record Retention Policies"
          }
        }
      },
      {
        path: 'bpm-suppliers',
        component: BpmSuppliersComponent,
        data: {
          core: {
            title: "Process Groups"
          }
        }
      },

      // internal-audit-module

      {
        path: 'audit-plan-statuses',
        component: AuditPlanStatusesComponent,
        data: {
          core: { title: "Audit Plan Statuses" }
        }
      },
      {
        path: 'internal-audit',
        component: InternalAditMastersComponent,
        data: {
          core: { title: "Internal-Audit" }
        }
      },
      {
        path: 'auditable-item-categories',
        component: AuditableItemCategoryComponent,
        data: {
          core: {
            title: "Auditable Item Category"
          }
        }
      }, {

        path: 'auditable-items',
        component: AuditableItemComponent,
        data: {
          core: {
            title: "Auditable Items"
          }
        }

      }, {
        path: 'auditable-item-types',
        component: AuditableItemTypeComponent,
        data: {
          core: {
            title: "Auditable Item Type"
          }
        }
      }, {
        path: 'audit-categories',
        component: AuditCategoriesComponent,
        data: {
          core: {
            title: "Audit Categories"
          }
        }
      }, {
        path: 'audit-criteria',
        component: AuditCriterionComponent,
        data: {
          core: {
            title: "Audit Criteria"
          }
        }
      }, {
        path: 'finding-categories',
        component: AuditFindingCategoriesComponent,
        data: {
          core: {
            title: "Finding Category"
          }
        }
      },
      {

        path: 'audit-objectives',
        component: AuditObjectiveComponent,
        data: {
          core: {
            title: "Audit Objective"
          }
        }
      }, {
        path: 'checklists',
        component: AuditCheckListComponent,
        data: {
          core: {
            title: "CheckList"
          }
        }
      },
      {
        path: 'audit-checklist-answer-keys',
        component: AuditChecklistAnswerKeyComponent,
        data: {
          core: {
            title: "Audit Checklist Answer Key"
          }
        }
      },
      {
        path: 'finding-impact-analysis-categories',
        component: FindingImpactAnalysisCategoryComponent,
        data: {
          core: {
            title: "Finding Impact Analysis Category"
          }
        }
      }, {
        path: 'root-cause-categories',
        component: RootCauseCategoriesComponent,
        data: {
          core: {
            title: "Root Cause Category"
          }
        }
      }, {
        path: 'root-cause-sub-categories',
        component: RootCauseSubCategoriesComponent,
        data: {
          core: {
            title: "Root Cause Sub Category"
          }
        }
      }, {

        path: 'audit-report-statuses',
        component: AuditReportStatusesComponent,
        data: {
          core: {
            title: "Audit Report Status"
          }
        }
      },
      {
        path: 'finding-corrective-action-plan-statuses',
        component: FindingCorrectiveActionStatusesComponent,
        data: {
          core: { title: "Finding Corrective Action Statuses" }
        }
      },
      {
        path: 'finding-statuses',
        component: FindingStatusesComponent,
        data: {
          core: { title: "Finding Statuses" }
        }
      },
      {
        path: 'internal-risk-ratings',
        component: AuditRiskRatingComponentRiskmanagement,
        data: {
          core: { title: "Risk Ratings" }
        }
      },


      // knowledge hub master module

      {
        path: 'knowledge-hub',
        component: KnowledgeHubMasterComponent,
        data: {
          core: { title: "Knowledge Hub" }
        }
      },
      {

        path: 'document-categories',
        component: DocumentCategoryComponent,
        data: {
          core: { title: "Document Category" }
        }
      }, {

        path: 'document-types',
        component: DocumentTypesComponent,
        data: {
          core: { title: "Document Types" }
        }
      }, {

        path: 'compliance-areas',
        component: ComplianceAreaComponent,
        data: {
          core: { title: "Compliance Area" }
        }
      },
      {
        path: 'compliance-sections',
        component: ComplianceSectionComponent,
        data: {
          core: { title: "Compliance Section" }
        }
      }, {
        path: 'compliance-frequencies',
        component: ComplianceFrequencyComponent,
        data: {
          core: { title: "Compliance Frequency" }
        }
      },
      {
        path: 'compliance-statuses',
        component: ComplianceStatusComponent,
        data: {
          core: { title: "Compliance Status" }
        }
      },
      {
        path: 'compliance-reporting-statuses',
        component: ComplianceReportingStatusComponent,
        data: {
          core: { title: "Compliance Reporting Status" }
        }
      },
      {
        path: 'sla-and-contract-assessment-statuses',
        component: SlaAndContractAssessmentStatusComponent,
        data: {
          core: { title: "SLA And Contract Assessment Status" }
        }
      },
      {
        path: 'document-families',
        component: DocumentFamilyComponent,
        data: {
          core: { title: "Document Families" }
        }
      }, {

        path: 'document-sub-categories',
        component: DocumentSubCategoriesComponent,
        data: {
          core: { title: "Document Sub Categories" }
        }
      }, {

        path: 'document-sub-sub-categories',
        component: DocumentSubSubCategoriesComponent,
        data: {
          core: { title: "Document Sub Sub Categories" }
        }
      }, {

        path: 'tags',
        component: TagComponent,
        data: {
          core: { title: "Tag" }
        }
      }, {

        path: 'document-access-types',
        component: DocumentAccessTypeComponent,
        data: {
          core: { title: "Document Access Type" }
        }
      }, {

        path: 'document-change-request-types',
        component: DocumentChangeRequestTypeComponent,
        data: {
          core: { title: "Document Change Request Type" }
        }
      },
      {

        path: 'document-status',
        component: DocumentStatusComponent,
        data: {
          core: { title: "Document Status" }
        }
      },
      {

        path: 'document-review-frequencies',
        component: DocumentReviewFrequenciesComponent,
        data: {
          core: { title: "Document Review Freqencies" }
        }
      },
      {

        path: 'knowledge-hub-checklists',
        component: CheckListComponent,
        data: {
          core: { title: "Knowledge Hub Checklists" }
        }
      },

      // general master module

      {
        path: 'masters',
        component: MastersMasterComponent,
        data: {
          core: { title: "General" }
        }
      },
      {
        path: 'labels',
        component: LabelsComponent,
        data: {
          core: { title: "Labels" }
        }
      }, {
        path: 'regions',
        component: RegionComponent,
        data: {
          core: { title: "Regions" }
        }
      }, {
        path: 'countries',
        component: CountryComponent,
        data: {
          core: { title: "Country" }
        }
      }, {
        path: 'industry-categories',
        component: IndustryCategoryComponent,
        data: {
          core: { title: "Industry Category" }
        }
      }, {
        path: 'industries',
        component: IndustryComponent,
        data: {
          core: { title: "Industry" }
        }
      }, {
        path: 'timezones',
        component: TimezoneComponent,
        data: {
          core: { title: "TimeZone" }
        }
      }, {
        path: 'locations',
        component: LocationComponent,
        data: {
          core: { title: "Location" }
        }
      }, {
        path: 'app-feedback-smilies',
        component: AppFeedbackSmileyComponent,
        data: {
          core: { title: "App Feedback Smiley" }
        }
      }, {
        path: 'app-feedback-keys',
        component: AppFeedbackKeyComponent,
        data: {
          core: { title: "App Feedback Key" }
        }
      }, {
        path: 'app-user-feedbacks',
        component: AppUserFeedbackComponent,
        data: {
          core: { title: "App User Feedback" }
        }
      }, {
        path: 'faqs',
        component: FaqComponent,
        data: {
          core: { title: "Faq" }
        }
      }
      , {
        path: 'languages',
        component: LanguagesComponent,
        data: {
          core: { title: "Languages" }
        }
      },
      {
        path: 'master-menus',
        component: MasterMenuComponent,
        data: {
          core: { title: "Master Menu" }
        }
      }, {
        path: 'module-groups',
        component: ModuleGroupsComponent,
        data: {
          core: { title: "Module Groups" }
        }
      },
      {
        path: 'currencies',
        component: CurrencyComponent,
        data: {
          core: { title: "Currency" }
        }
      },
      {
        path: 'modules',
        component: ModuleComponent,
        data: {
          core: { title: 'Module' }
        }
      },
      // external audit module
      {
        path: 'external-audit',
        component: ExternalAuditMasterComponent,
        data: {
          core: { title: "External Audit" }
        }
      }, {
        path: 'external-audit-types',
        component: ExternalAuditTypesComponent,
        data: {
          core: { title: "External Audit Types" }
        }

      },
      {
        path: 'external-risk-ratings',
        component: RiskRatingComponent,
        data: {
          core: {
            title: "Risk Rating"
          }
        }
      },
      {
        path: 'external-finding-categories',
        component: ExternalAuditFindingCategoriesComponent,
        data: {
          core: {
            title: "External Finding Category"
          }
        }
      },

      //organization modules

      {
        path: 'organization',
        component: OrganizationMastersComponent,
        data: {
          core: { title: "The Organization" }
        },
        children: [
          {
            path: 'competency-group',
            component: CompetencyGroupMasterComponent,
            data: {
              core: { title: 'Competency Group' }
            }
          }
        ]
      },
      {
        path: 'issue-categories',
        component: IssueCategoryMasterComponent,
        data: {
          core: { title: 'Issue Category' }
        }
      },
      {
        path: 'departments',
        component: DepartmentComponent,
        data: {
          core: { title: 'Department' }
        }
      },
      {
        path: 'issue-domains',
        component: IssueDomainMasterComponent,
        data: {
          core: { title: 'Issue Domain' }
        }
      },
      {
        path: 'ms-types',
        component: MsTypeMasterComponent,
        data: {
          core: { title: 'Management System Type' }
        }
      },
      {
        path: 'compliance-categories',
        component: ComplianceCategoryMasterComponent,
        data: {
          core: { title: 'Compliance Category' }
        }
      },
      {
        path: 'compliance-document-types',
        component: ComplianceTypeMasterComponent,
        data: {
          core: { title: 'Compliance Type' }
        }
      },
      {
        path: 'sla-categories',
        component: SlaCategoryComponent,
        data: {
          core: { title: 'Sla Category' }
        }
      },
      {
        path: 'sla-statuses',
        component: SlaStatusesComponent,
        data: {
          core: { title: 'Sla Statuses' }
        }
      },
      {
        path: 'issue-statuses',
        component: IssueStatusMasterComponent,
        data: {
          core: { title: 'Issue Status' }
        }
      }, {

        path: 'need-and-expectations',
        component: NeedExpectationComponent,
        data: {
          core: { title: 'Need And Expectation' }
        }
      },
      {
        path: 'issues',
        component: IssueMasterComponent,
        data: {
          core: { title: 'Issue' }
        }
      },
      {
        path: 'issue-types',
        component: IssueTypeMasterComponent,
        data: {
          core: { title: 'Issue Type' }
        }
      },
      {
        path: 'ms-type-versions',
        component: MsTypeVersionMasterComponent,
        data: {
          core: { title: 'Management System Type Version' }
        }
      },
      {
        path: 'stakeholders',
        component: StakeholderMasterComponent,
        data: {
          core: { title: 'Stakeholder' }
        }
      },
      {
        path: 'stakeholder-types',
        component: StakeholderTypeMasterComponent,
        data: {
          core: { title: 'Stakeholder Type' }
        }
      }, {
        path: 'divisions',
        component: DivisionComponent,
        data: {
          core: { title: 'Divisions' }
        }
      }, {
        path: 'sections',
        component: SectionComponent,
        data: {
          core: { title: 'Sections' }
        }
      }, {
        path: 'sub-sections',
        component: SubSectionComponent,
        data: {
          core: { title: 'Sub Sections' }
        }
      }, {
        path: 'product-categories',
        component: ProductCategoryComponent,

        data: {
          core: { title: 'Product Categories' }
        }

      }, {
        path: 'service-categories',
        component: ServiceCategoryComponent,

        data: {
          core: { title: 'Service Categories' }
        }

      },
      // Risk Management Module
      {
        path: 'risk-management',
        component: RiskManagementComponent,
        data: {
          core: { title: "Risk Management" }
        }
      },
      {
        path: 'risk-ratings',
        component: RiskRatingComponentRiskmanagement,
        data: {
          core: { title: 'Risk Ratings' }
        }
      },
      {
        path: 'risk-categories',
        component: RiskCategoryComponent,
        data: {
          core: { title: 'Risk Categories' }
        }
      },
      {
        path: 'risk-sub-categories',
        component: RiskSubCategoryComponent,
        data: {
          core: { title: 'Risk Sub Categories' }
        }
      },
      {
        path: 'risk-impact-analysis-categories',
        component: ImpactAnalysisCategoriesComponent,
        data: {
          core: { title: 'Impact Analysis Categories' }
        }
      },
      {
        path: 'risk-areas',
        component: RiskAreaComponent,
        data: {
          core: { title: 'Risk Areas' }
        }
      },
      {
        path: 'risk-types',
        component: RiskTypeComponent,
        data: {
          core: { title: 'Risk Types' }
        }
      },
      {
        path: 'risk-classifications',
        component: RiskClassificationComponent,
        data: {
          core: { title: 'Risk Classifications' }
        }
      },
      {
        path: 'risk-review-frequencies',
        component: RiskReviewFrequencyComponent,
        data: {
          core: { title: 'Risk Review Frequencies' }
        }
      },

      {
        path: 'risk-control-plans',
        component: RiskControlPlanComponent,
        data: {
          core: { title: 'Risk Control Plans' }
        }
      },
      {
        path: 'risk-matrix-calculation-methods',
        component: RiskMatrixCalculationMethodComponent,
        data: {
          core: { title: 'Risk Matrix Calculation Method' }
        }
      },
      {
        path: 'risk-statuses',
        component: RiskStatusComponent,
        data: {
          core: { title: 'Risk Matrix Status' }
        }
      },
      {
        path: 'risk-sources',
        component: RiskSourcesComponent,
        data: {
          core: { title: 'Risk Sources' }
        }
      },
      {
        path: 'risk-library',
        component: RiskLibraryComponent,
        data: {
          core: { title: 'Risk Library' }
        }
      },
      {
        path: 'risk-treatment-statuses',
        component: RiskTreatmentStatusesComponent,
        data: {
          core: { title: 'Risk Treatment Statuses' }
        }
      },
      {
        path: 'risk-impact-guidelines',
        component: RiskImpactGuidelineComponent,
        data: {
          core: { title: 'Risk Impact Guideline' }
        }
      },
      {
        path: 'key-risk-indicators',
        component: KriMasterComponent,
        data: {
          core: { title: 'Key Risk Indicators' }
        }
      },
      {
        path: 'strategic-objectives',
        component: StrategicObjectivesComponent,
        data: {
          core: { title: 'Strategic Objectives' }
        }
      },
      {
        path: 'risk-matrix-rating-levels',
        component: RiskMatrixRatingLevelsComponent,
        data: {
          core: { title: 'Risk Matrix Rating levels' }
        }
      },
      {
        path: 'control-efficiency-measures',
        component: ControlEfficiencyMeasuresComponent,
        data: {
          core: { title: 'Control Efficiency Measures' }
        }
      },
      {
        path: 'venues',
        component: VenueComponent,
        data: {
          core: { title: 'Venue' }
        }
      },
      // Mrm Module
      {
        path: 'mrm',
        component: MrmComponent,
        data: {
          core: { title: "MRM" }
        }
      },
      {
        path: 'meeting-categories',
        component: MeetingCategoryComponent,
        data: {
          core: { title: 'Meeting Category' }
        }
      },
      {
        path: 'meeting-criteria',
        component: MeetingCriteriaComponent,
        data: {
          core: { title: 'Meeting Criteria' }
        }
      },
      {
        path: 'meeting-objectives',
        component: MeetingObjectiveComponent,
        data: {
          core: { title: 'Meeting Objective' }
        }
      },
      {
        path: 'meeting-types',
        component: MeetingTypeComponent,
        data: {
          core: { title: 'Meeting Type' }
        }
      },
      {
        path: 'meeting-plan-statuses',
        component: MeetingPlanStatusComponent,
        data: {
          core: { title: 'Meeting Plan Status' }
        }
      },
      {
        path: 'meeting-report-statuses',
        component: MeetingReportStatusComponent,
        data: {
          core: { title: 'Meeting Report Status' }
        }
      },
      {
        path: 'meeting-agenda-types',
        component: MeetingAgendaTypeComponent,
        data: {
          core: { title: 'Meeting Agenda Type' }
        }
      },
      {
        path: 'meeting-action-plan-statuses',
        component: MeetingActionPlanStatusComponent,
        data: {
          core: { title: 'Meeting Action Plan Status' }
        }
      },
      {
        path: 'meeting-agendas',
        component: MeetingAgendaComponent,
        data: {
          core: { title: 'Meeting Agenda' }
        },
      },
      // Incident Management
      {
        path: 'incident-management',
        component: IncidentManagementMasterComponent,
        data: {
          core: { title: 'Incident Management' }
        }
      },
      {
        path: 'incident-damage-types',
        component: IncidentDamageTypeComponent,
        data: {
          core: { title: 'Incident Damage Types' }
        }
      },
      {
        path: 'incident-categories',
        component: IncidentCategoriesComponent,
        data: {
          core: { title: 'Incident Category' }
        }
      },
      {
        path: 'incident-damage-severities',
        component: IncidentDamageSeverityComponent,
        data: {
          core: { title: 'Incident Damage Severity' }
        }
      },
      {
        path: 'incident-statuses',
        component: IncidentStatusComponent,
        data: {
          core: { title: 'Incident Status' }
        }
      },

      {
        path: 'incident-sub-categories',
        component: IncidentSubCategoryComponent,
        data: {
          core: { title: 'Incident Sub Category' }
        }
      },
      {
        path: 'incident-types',
        component: IncidentTypeComponent,
        data: {
          core: { title: 'Incident Types' }
        }
      },
      {
        path: 'incident-root-causes',
        component: IncidentRootCauseComponent,
        data: {
          core: { title: 'Incident Root Cause' }
        }
      },
      {
        path: 'incident-corrective-action-statuses',
        component: IncidentCorrectiveActionStatusComponent,
        data: {
          core: { title: 'Incident Corrective Action Status' }
        }
      },
      {
        path: 'incident-investigation-statuses',
        component: IncidentInvestigationStatusComponent,
        data: {
          core: { title: 'Incident Investigation Status' }
        }
      },

      //jso
      {
        path: 'jso',
        component: JsoMasterComponent,
        data: {
          core: { title: "JSO" }
        }
      },

      {
        path: 'jso-categories',
        component: JsoCategoryComponent,
        data: {
          core: { title: "Jso Category" }
        }
      },
      {
        path: 'jso-sub-categories',
        component: JsoSubCategoryComponent,
        data: {
          core: { title: "Jso Sub Category" }
        }
      },
      {
        path: 'unsafe-action-observed-groups',
        component: UnsafeActionObservedGroupComponent,
        data: {
          core: { title: "Jso Unsafe Action Observed Group" }
        }
      },
      {
        path: 'unsafe-action-sub-categories',
        component: UnsafeActionSubCategoriesComponent,
        data: {
          core: { title: "Jso Unsafe Action SubCategories" }
        }
      },
      {
        path: 'unsafe-action-categories',
        component: UnsafeActionCategoriesComponent,
        data: {
          core: { title: "Jso Unsafe Action Categories" }
        }
      },
      {
        path: 'jso-observation-types',
        component: JsoObservationTypeComponent,
        data: {
          core: { title: "Jso Observation Type" }
        }
      },
      {
        path: 'unsafe-action-statuses',
        component: UnsafeActionStatusComponent,
        data: {
          core: { title: "Unsafe Action Status" }
        }
      },

      // Project management

      {
        path: 'project-management',
        component: ProjectManagementComponent,
        data: {
          core: { title: "Project Management" }
        }
      },
      {
        path: 'task-categories',
        component: ProjectTaskCategoryComponent,
        data: {
          core: { title: 'Project Task Category' }
        }
      },
      {
        path: 'task-weightages',
        component: ProjectTaskWeightageComponent,
        data: {
          core: { title: 'Project Task Weightage' }
        }
      },
      {
        path: 'project-types',
        component: ProjectTypeComponent,
        data: {
          core: { title: 'Project Type' }
        }
      },
      {
        path: 'project-time-categories',
        component: ProjectTimeCategoryComponent,
        data: {
          core: { title: 'Project Time Category' }
        }
      },
      {
        path: 'project-cost-categories',
        component: ProjectCostCategoryComponent,
        data: {
          core: { title: 'Project Cost Category' }
        }
      },
      {
        path: 'project-statuses',
        component: ProjectStatusComponent,
        data: {
          core: { title: 'Project Status' }
        }
      },
      {
        path: 'project-modules',
        component: ProjectModuleComponent,
        data: {
          core: { title: 'Project Module' }
        }
      },
      {
        path: 'project-categories',
        component: ProjectCategoryComponent,
        data: {
          core: { title: 'Project Category' }
        }
      },
      {
        path: 'project-roles',
        component: ProjectRolesComponent,
        data: {
          core: { title: 'Project Category' }
        }
      },

      // start Supplier Management
      {
        path: 'supplier-management',
        component: SupplierManagementMasterComponent,
        data: {
          core: { title: "Supplier Management" }
        }
      },
      // end Supplier Management

      //START BCM
      {
        path: 'bcm',
        component: BcmMastersComponent,
        data: {
          core: { title: 'BCM' }
        }
      },
      {
        path: 'business-application-types',
        component: BusinessApplicationTypesComponent,
        data: {
          core: { title: 'Business Application Types' }
        }
      },
      {
        path: 'process-operation-frequencies',
        component: ProcessOperationFrequencyComponent,
        data: {
          core: { title: 'Process Operation Frequencies' }
        }
      },
      {
        path: 'process-operation-modes',
        component: ProcessOperationModeComponent,
        data: {
          core: { title: 'Process Operation Mode' }
        }
      },
      {
        path: 'impact-ratings',
        component: ImpactRatingComponent,
        data: {
          core: { title: 'Impact Rating' }
        }
      },
      {
        path: 'impact-categories',
        component: ImpactCategoryComponent,
        data: {
          core: { title: 'Impact Category' }
        }
      },
      {
        path: 'impact-scenarios',
        component: ImpactScinarioComponent,
        data: {
          core: { title: 'Impact Scenarios' }
        }
      },
      {
        path: 'bia-scale-categories',
        component: BiaScaleCategoryComponent,
        data: {
          core: { title: 'BIA Scale Category' }
        }
      },
      {
        path: 'impact-areas',
        component: ImpactAreaComponent,
        data: {
          core: { title: 'Impact Area' }
        }
      },
      {
        path: 'business-continuity-plan-statuses',
        component: BusinessContinuityPlanStatusComponent,
        data: {
          core: { title: 'Business Continuity Plan statuses' }
        }
      },
      {
        path: 'business-continuity-plan-change-request-types',
        component: BcpChangeRequestTypesComponent,
        data: {
          core: { title: 'BCP Change Request Types' }
        }
      },
      {
        path: 'business-continuity-strategy-statuses',
        component: BcsStatusComponent,
        data: {
          core: { title: 'BCS Status' }
        }
      },
      {
        path: 'business-continuity-strategy-types',
        component: BcsTypeComponent,
        data: {
          core: { title: 'BCS Type' }
        }
      },
      {
        path: 'business-continuity-strategy-finances',
        component: BcsFinancesComponent,
        data: {
          core: { title: 'BCS Finance' }
        }
      },
      {
        path: 'business-continuity-strategy-solution-statuses',
        component: BusinessContinuityStrategySolutionStatusComponent,
        data: {
          core: { title: 'BCS Solution Status' }
        }
      },
      {
        path: 'test-and-exercise-types',
        component: TestAndExerciseTypesComponent,
        data: {
          core: { title: 'Test And Exercise Types' }
        }
      },
      {
        path: 'test-and-exercise-plan-communications',
        component: TestAndExerciseCommunicationsComponent,
        data: {
          core: { title: 'Test And Exercise Types' }
        }
      },
      {
        path: 'test-and-exercise-statuses',
        component: TestAndExerciseStatusesComponent,
        data: {
          core: { title: 'Test And Exercise Statuses' }
        }
      },
      {
        path: 'business-impact-analysis-statuses',
        component: BusinessImpactAnalysisStatusesComponent,
        data: {
          core: { title: 'Business Impact Analysis Statuses' }
        }
      },
      {
        path: 'test-and-exercise-action-plan-statuses',
        component: TestAndExerciseActionPlanStatusComponent,
        data: {
          core: { title: 'Business Test & Exercise Action Plan Status' }
        }
      },
      //END BCM

      {
        path: 'compliance-management',
        component: CmMastersComponent,
        data: {
          core: { title: "Compliance Management" }
        }
      },

      // start Supplier Management
      {
        path: 'supplier-management',
        component: SupplierManagementMasterComponent,
        data: {
          core: { title: "Supplier Management" }
        }
      },
      // end Supplier Management

      // start business Assessment
      {
        path: 'business-assessment',
        component: BaMastersComponent,
        data: {
          core: { title: 'Business Assessment' }
        }
      },

      {
        path: 'business-assessment-frequencies',
        component: BusinessAssessmentFrequenciesComponent,
        data: {
          core: { title: 'Business Assessment Frequencies' }
        }
      },

      {
        path: 'business-assessment-statuses',
        component: BusinessAssessmentStatusComponent,
        data: {
          core: { title: 'Business Assessment Status' }
        }
      },
      {
        path: 'control-assessment-statuses',
        component: ControlAssessmentStatusComponent,
        data: {
          core: { title: 'Control Assessment Status' }
        }
      },
      {
        path: 'control-assessment-action-plan-statuses',
        component: ControlAssessmentActionPlanStatusComponent,
        data: {
          core: { title: 'Control Assessment Action Plan Status' }
        }
      },

      // end Business Assessment

      //START BCM
      {
        path: 'bcm',
        component: BcmMastersComponent,
        data: {
          core: { title: 'BCM' }
        }
      },
      {
        path: 'business-application-types',
        component: BusinessApplicationTypesComponent,
        data: {
          core: { title: 'Business Application Types' }
        }
      },
      {
        path: 'process-operation-frequencies',
        component: ProcessOperationFrequencyComponent,
        data: {
          core: { title: 'Process Operation Frequencies' }
        }
      },
      {
        path: 'process-operation-modes',
        component: ProcessOperationModeComponent,
        data: {
          core: { title: 'Process Operation Mode' }
        }
      },
      {
        path: 'impact-ratings',
        component: ImpactRatingComponent,
        data: {
          core: { title: 'Impact Rating' }
        }
      },
      {
        path: 'impact-categories',
        component: ImpactCategoryComponent,
        data: {
          core: { title: 'Impact Category' }
        }
      },
      //END BCM

      {
        path: 'business-applications',
        component: BusinessApplicationsComponent,
        data: {
          core: { title: 'Business Applications' }
        }
      },

      //suppliers 

      {
        path: 'suppliers',
        component: SuppliersComponent,
        data: {
          core: { title: 'suppliers' }
        }
      },

      // ,{
      //   path: 'department',
      //   component: DepartmentComponent,
      //   data: {
      //     core: { title: 'Department' }
      //   }
      // }
      //  },

      // start strategy management
      {
        path: 'strategy-management',
        component: StrategyMasterComponent,
        data: {
          core: { title: 'Strategy Management' }
        }
      },

      {
        path: 'focus-areas',
        component: FocusAreaComponent,
        data: {
          core: { title: 'Focus Area' }
        }
      },
      {
        path: 'strategy-themes',
        component: StrategyThemesComponent,
        data: {
          core: { title: 'Strategy Themes' }
        }
      },
      {
        path: 'strategy-objective-types',
        component: StrategyObjectiveTypeComponent,
        data: {
          core: { title: 'Strategy Objective Type' }
        }
      },
      {
        path: 'kpi-types',
        component: KpiTypeComponent,
        data: {
          core: { title: 'Kpi Type' }
        }
      },
      {
        path: 'kpi-calculation-types',
        component: KpiCalculationTypesComponent,
        data: {
          core: { title: 'Kpi Calculation Type' }
        }
      },
      {
        path: 'objectives',
        component: ObjectivesComponent,
        data: {
          core: { title: 'Objective' }
        }
      },

      {
        path: 'kpi-types',
        component: KpiTypeComponent,
        data: {
          core: { title: 'Kpi Type' }
        }
      },
      {
        path: 'strategy-kpi-data-types',
        component: StrategyKpiDataTypeComponent,
        data: {
          core: { title: 'Strategy Kpi Data Types' }
        }
      },
      {
        path: 'strategy-initiative-actions',
        component: StrategyInitiativeActionsComponent,
        data: {
          core: { title: 'Strategy Initiative Actions' }
        }
      },
      {
        path: 'strategy-initiative-review-frequencies',
        component: StrategyInitiativeReviewFrequencyComponent,
        data: {
          core: { title: 'Strategy Initiative Actions' }
        }
      },
      {
        path: 'aggregation-types',
        component: AggregationTypesComponent,
        data: {
          core: { title: 'Aggregation Types' }
        }
      },
      // end strategy management

      // start training 
      {
        path: 'training',
        component: TrainingMasterComponent,
        data: {
          core: { title: 'Training' }
        }
      },
      {
        path: 'training-categories',
        component: TrainingCategoryComponent,
        data: {
          core: { title: 'Training Category' }
        }
      },
      {
        path: 'training-statuses',
        component: TrainingStatusComponent,
        data: {
          core: { title: 'Training Status' }
        }
      },
      // end training
      {
        path: 'process-accessibilities',
        component: ProcessAccessibilityComponent,
        data: {
          core: { title: 'Process Accessibility' }
        }
      },

      {
        path: 'storage-types',
        component: StorageTypesComponent,
        data: {
          core: { title: 'Storage Types' }
        }
      },

      {
        path: 'high-availability-statuses',
        component: HighAvailabilityStatusComponent,
        data: {
          core: { title: 'High Availability Status' }
        }
      },
      {
        path: 'storage-locations',
        component: StorageLocationsComponent,
        data: {
          core: { title: 'Storage Locations' }
        }
      },

      {
        path: 'backup-frequencies',
        component: BackupFrequenciesComponent,
        data: {
          core: { title: 'Backup Frequencies' }
        }
      },
      {
        path: 'periodic-backups',
        component: PeriodicBackupsComponent,
        data: {
          core: { title: 'Periodic Backups' }
        }
      },

      {
        path: 'bia-scales',
        component: BiaScaleComponent,
        data: {
          core: { title: 'BIA Scale' }
        }
      },

      {
        path: 'bia-tiers',
        component: BiaTireComponent,
        data: {
          core: { title: 'BIA Tier' }
        }
      },

      {
        path: 'bia-impact-category-informations',
        component: BiaImpactCategoryInformationComponent,
        data: {
          core: { title: 'BIA Impact Category Information' }
        }
      },
      {

        path: 'asset-management',
        component: AssetManagementMasterComponent,
        data: {
          core: { title: 'Asset Management' }
        }
      },

      {
        path: 'asset-types',
        component: AssetTypesComponent,
        data: {
          core: { title: 'Asset Types' }
        }
      },
      {
        path: 'asset-categories',
        component: AssetsCategoryComponent,
        data: {
          core: { title: 'Asset Category' }
        }
      },
      {
        path: 'asset-sub-categories',
        component: AssetSubCategoryComponent,
        data: {
          core: { title: 'Asset Sub Category' }
        }
      },
      {
        path: 'asset-statuses',
        component: AssetStatusComponent,
        data: {
          core: { title: 'Asset Status' }
        }
      },
      {
        path: 'asset-locations',
        component: AssetLocationComponent,
        data: {
          core: { title: 'Asset Location' }
        }
      },
      {
        path: 'asset-investment-types',
        component: AssetInvestmentTypesComponent,
        data: {
          core: { title: 'Asset Investment Types' }
        }
      },
      {
        path: 'asset-maintenance-types',
        component: AssetMaintenanceTypesComponent,
        data: {
          core: { title: 'Asset Maintenance Types' }
        }
      },
      {
        path: 'asset-maintenance-schedule-frequencies',
        component: AssetMaintenanceScheduleFrequenciesComponent,
        data: {
          core: { title: 'Asset Maintenance Schedule Frequencies' }
        }
      },
      {
        path: 'asset-calculation-methods',
        component: AssetCalculationMethodComponent,
        data: {
          core: { title: 'Asset Calculation Method' }
        }
      },
      {
        path: 'asset-maintenance-statuses',
        component: AssetMaintenanceStatusesComponent,
        data: {
          core: { title: 'Asset Maintenance Statuses' }
        }
      },

      {
        path: 'asset-option-values',
        component: AssetOptionValuesComponent,
        data: {
          core: { title: 'Asset Option Values' }
        }
      },

      {
        path: 'asset-ratings',
        component: AssetRatingsComponent,
        data: {
          core: { title: 'Asset Ratings' }
        }
      },

      {
        path: 'physical-condition-rankings',
        component: PhysicalConditionRankingsComponent,
        data: {
          core: { title: 'Physical Condition Rankings' }
        }
      },
      {
        path: 'asset-matrix-categories',
        component: AssetMatrixCategoriesComponent,
        data: {
          core: { title: 'Asset Matrix Categories' }
        }
      },

      {
        path: 'asset-maintenance-categories',
        component: AssetMaintenanceCategoriesComponent,
        data: {
          core: { title: 'Asset Maintenance Categories' }
        }
      },


      //Starts Customer Engagement
      {
        path: 'customer-engagement',
        component: CustomerMastersComponent,
        data: {
          core: { title: 'Customer Engagement' }
        }
      },
      {
        path: 'customer-complaint-types',
        component: CustomerCompliantTypesComponent,
        data: {
          core: { title: 'Customer Compliant Types' }
        }
      },
      {
        path: 'customer-complaint-statuses',
        component: CustomerComplaintStatusComponent,
        data: {
          core: { title: 'Customer Compliant Status' }
        }
      },

      {
        path: 'customer-complaint-investigation-statuses',
        component: CustomerComplaintInvestigationStatusComponent,
        data: {
          core: { title: 'Customer Compliant Investigation Status' }
        }
      },
      {
        path: 'customer-complaint-action-plan-statuses',
        component: CustomerComplaintActionPlanStatusesComponent,
        data: {
          core: { title: 'Customer Complaint Action Plan Statuses' }
        }
      },

      {
        path: 'customer-complaint-action-types',
        component: CustomerComplaintActionTypesComponent,
        data: {
          core: { title: 'Customer Complaint Action Types' }
        }
      },
      {
        path: 'risk-register-types',
        component: RiskRegisterTypeComponent,
        data: {
          core: { title: 'Risk Register Types' }
        }
      },

      {
        path: 'risk-finding-types',
        component: RiskFindingTypeComponent,
        data: {
          core: { title: 'Risk Finding Types' }
        }
      },

      {
        path: 'isms',
        component: IsmsMastersComponent,
        data: {
          core: { title: 'Isms' }
        }
      },

      {
        path: 'isms-vulnerabilities',
        component: IsmsVulnerabilityComponent,
        data: {
          core: { title: 'Isms Vulnerability' }
        }
      },
      {
        path: 'isms-risk-matrix-rating-levels',
        component: IsmsRiskMatrixRatingLevelComponent,
        data: {
          core: { title: 'Isms Risk Matrix Rating Level' }
        }
      },

      {
        path: 'isms-risk-matrix-calculation-methods',
        component: IsmsRiskMatrixCalculationMethodComponent,
        data: {
          core: { title: 'Isms Risk Matrix Calculation Method' }
        }
      },

      {
        path: 'isms-risk-ratings',
        component: IsmsRiskRatingComponent,
        data: {
          core: { title: 'Isms Risk Rating' }
        }
      },
      {
        path: 'soa-implementation-statuses',
        component: SoaImplementationStatusesComponent,
        data: {
          core: { title: 'Soa Implementation Statuses' }
        }
      },
      {
        path: 'soa-statuses',
        component: SoaStatusComponent,
        data: {
          core: { title: 'Isms Soa Status' }
        }
      },
      {
        path: 'isms-risk-impact-guidelines',
        component: IsmsRiskImpactGuidelineComponent,
        data: {
          core: { title: 'Isms Risk Impact Guidelines' }
        }
      },
      {
        path: 'test-and-exercise-recovery-levels',
        component: TestAndExerciseRecoveryLevelComponent,
        data: {
          core: { title: 'Text And Exercise Recovery Level' }
        }
      },
      {
        path: 'test-and-exercise-checklists',
        component: TestAndExerciseChecklistComponent,
        data: {
          core: { title: 'Text And Exercise Checklist' }
        }
      },
      {
        path: 'competency-types',
        component: CompetencyTypesMasterComponent,
        data: {
          core: { title: 'Competency Types' }
        }
      },
      {
        path: 'strategy-initiative-statuses',
        component: StrategyInitiativeStatusComponent,
        data: {
          core: { title: 'Strategy Initiative Status' }
        }
      },
      {
        path: 'strategy-initiative-action-plan-statuses',
        component: StrategyInitiativeActionPlanStatusComponent,
        data: {
          core: { title: 'Strategy Initiative Action Plan Status' }
        }
      },
      {
        path: 'strategy-profile-statuses',
        component: StrategyProfileStatusComponent,
        data: {
          core: { title: 'Strategy profile Status' }
        }
      },
      {
        path: 'strategy-statuses',
        component: StrategyStatusComponent,
        data: {
          core: { title: 'Strategy Status' }
        }
      },
      {
        path: 'strategy-initiative-milstone-statuses',
        component: StrategyInitiativeMilestoneStatusComponent,
        data: {
          core: { title: 'Strategy Initiative Milstone Statuses' }
        }
      },
      {
        path: 'customer-complaint-sources',
        component: CustomerComplaintSourceComponent,
        data: {
          core: { title: 'Customer Complaint Source' }
        }
      },

      // start project monitoring
      {
        path: 'project-monitoring',
        component: ProjectMonitoringComponent,
        data: {
          core: { title: 'Project Monitoring' }
        }
      },
      {
        path: 'contract-types',
        component: ProjectContractTypeComponent,
        data: {
          core: { title: 'Project Contract Types' }
        }
      },
      {
        path: 'project-issue-statuses',
        component: ProjectIssueStatusComponent,
        data: {
          core: { title: 'Project Issue Status' }
        }
      },
      {
        path: 'project-priorities',
        component: ProjectPriorityComponent,
        data: {
          core: { title: 'Project Priority' }
        }
      },
      {
        path: 'project-themes',
        component: ProjectThemeComponent,
        data: {
          core: { title: 'Project Themes' }
        }
      },
      {
        path: 'project-objectives',
        component: ProjectObjectiveComponent,
        data: {
          core: { title: 'Project Objectives' }
        }
      },
      {
        path: 'project-kpis',
        component: ProjectKpiComponent,
        data: {
          core: { title: 'Project Kpi' }
        }
      },
      {
        path: 'project-monitoring-statuses',
        component: ProjectMonitoringStatusComponent,
        data: {
          core: { title: 'Project Monitoring Status' }
        }
      },
      {
        path: 'project-monitor-change-request-statuses',
        component: ProjectChangeRequestStatusComponent,
        data: {
          core: { title: 'Project Monitor Change Request Status' }
        }
      },
      {
        path: 'project-monitor-closure-statuses',
        component: ProjectClosureStatusComponent,
        data: {
          core: { title: 'Project Monitor Closure Status' }
        }
      },
      {
        path: 'project-issue-corrective-action-statuses',
        component: ProjectCorrectiveActionStatusComponent,
        data: {
          core: { title: 'Project Issue Corrective Action Status' }
        }
      },

      // start kpi management
      {
        path: 'kpi-management',
        component: KpiManagementComponent,
        data: {
          core: { title: 'Kpi Management' }
        }
      },
      {
        path: 'kpi-management-statuses',
        component: KpiManagementStatusComponent,
        data: {
          core: { title: 'Kpi Management Status' }
        }
      },
      {
        path: 'kpi-review-frequencies',
        component: KpiReviewFrequenciesComponent,
        data: {
          core: { title: 'Kpi Review Frequency' }
        }
      },
      {
        path: 'kpi-management-kpi-improvement-plan-statuses',
        component: KpiImprovementPlanStatusesComponent,
        data: {
          core: { title: 'Kpi improvement plan Status' }
        }
      },
      {
        path: 'kpi-management-kpi-score-statuses',
        component: KpiScoreStatusesComponent,
        data: {
          core: { title: 'Kpi Score statuses' }
        }
      },
      {
        path: 'task-statuses',
        component: TaskStatusesComponent,
        data: {
          core: { title: 'Task Statuses' }
        }
      },
      {
        path: 'task-priorities',
        component: ProjectTaskPrioritiesComponent,
        data: {
          core: { title: 'Task Statuses' }
        }
      },

      // start audit management
      {
        path: 'audit-management',
        component: AuditManagementComponent,
        data: {
          core: { title: 'Audit Management' }
        }
      },
      {
        path: 'am-audit-categories',
        component: AmAuditCategoriesComponent,
        data: {
          core: { title: 'Audit Categories' }
        }
      },
      {
        path: 'am-audit-statuses',
        component: AuditStatusesComponent,
        data: {
          core: { title: 'Audit Categories' }
        }
      },
      {
        path: 'am-annual-plan-frequencies',
        component: AnnualPlanFrequenciesComponent,
        data: {
          core: { title: 'Annual Plan Frequencies' }
        }
      },
      {
        path: 'am-annual-plan-frequency-items',
        component: AnnualAuditPalnFrequencyItemComponent,
        data: {
          core: { title: 'Annual Plan Frequencies Item' }
        }
      },

      {
        path: 'am-impacts',
        component: AuditManagementImpactComponent,
        data: {
          core: { title: 'Audit Management Impact' }
        }
      },

      {
        path: 'am-likelihoods',
        component: AuditManagementLikelihoodComponent,
        data: {
          core: { title: 'Audit Management Likelihood' }
        }
      },

      {
        path: 'am-risk-ratings',
        component: AuditManagementRiskRatingComponent,
        data: {
          core: { title: 'Audit Management Risk Rating' }
        }
      },
      {
        path: 'am-audit-document-types',
        component: AmAuditDocumentTypesComponent,
        data: {
          core: { title: 'Audit Management Risk Rating' }
        }
      },
      {
        path: 'am-audit-finding-corrective-action-statuses',
        component: CorrectiveActionStatusComponent,
        data: {
          core: { title: 'Audit Management Corrective Action Statuses' }
        }
      },
      {
        path: 'am-audit-test-plan-statuses',
        component: AuditTestPlanStatusComponent,
        data: {
          core: { title: 'Audit Test Plan Status' }
        }
      },

      {
        path: 'am-audit-information-request-statuses',
        component: InformationRequestStatusesComponent,
        data: {
          core: { title: 'Information Request Statuses' }
        }
      },
      {
        path: 'am-annual-plan-statuses',
        component: AmAnnualPlanStatusComponent,
        data: {
          core: { title: 'Am Annual Plan Status' }
        }
      },

      {
        path: 'am-audit-control-self-assessment-update-statuses',
        component: AmAuditControlSelfAssessmentUpdateStatusComponent,
        data: {
          core: { title: 'Am Audit Control Self Assessment Update Status' }
        }
      },
      {
        path: 'am-audit-control-self-assessment-statuses',
        component: AmAuditControlSelfAssessmentStatusComponent,
        data: {
          core: { title: 'Am Audit Control Self Assessment Status' }
        }
      },

      {
        path: 'am-audit-report-types',
        component: AmAuditReportTypeComponent,
        data: {
          core: { title: 'Am Audit Report Types' }
        }
      },

      // start cyber-incident

      {
        path: 'cyber-incident',
        component: CyberIncidentMasterComponent,
        data: {
          core: { title: 'Cyber Incident' }
        }
      },

      {
        path: 'cyber-incident-statuses',
        component: CyberIncidentStatusesComponent,
        data: {
          core: { title: 'Cyber Incident Status' }
        }
      },

      {
        path: 'cyber-incident-classification',
        component: CyberIncidentClassificationComponent,
        data: {
          core: { title: 'Cyber Incident Classification' }
        }
      },

      {
        path: 'cyber-incident-corrective-action-statuses',
        component: CyberIncidentCorrectiveActionStatusesComponent,
        data: {
          core: { title: 'Cyber Incident Corrective Action Status' }
        }
      },

      {
        path: 'cyber-incident-impact-analysis-categories',
        component: CyberIncidentImpactAnalysisCategoryComponent,
        data: {
          core: { title: 'Cyber Incident Impact Analysis Categories' }
        }
      },


      // start ms-audit--management

      {
        path: 'ms-audit-management',
        component: MsAuditManagementComponent,
        data: {
          core: { title: 'MS Audit Management' }
        }
      },

      {
        path: 'ms-audit-categories',
        component: MsAuditCategoryComponent,
        data: {
          core: { title: 'MS Audit Category' }
        }
      },
      {
        path: 'ms-audit-modes',
        component: MsAuditModesComponent,
        data: {
          core: { title: 'MS Audit Modes' }
        }
      },
      {
        path: 'ms-audit-management/checklist-groups',
        component: MsAuditChecklistGroupComponent,
        data: {
          core: { title: 'MS Checklist Groups' }
        }
      },
      {
        path: 'ms-audit-schedule-statuses',
        component: MsAuditScheduleStatusesComponent,
        data: {
          core: { title: 'Ms Audit Schedule Status' }
        }
      },
      {
        path: 'ms-audit-status',
        component: MsAuditStatusesComponent,
        data: {
          core: { title: 'Ms Audit Status' }
        }
      },
      {
        path: 'ms-audit-plan-statuses',
        component: MsAuditPlanStatusesComponent,
        data: {
          core: { title: 'Ms Audit Plan Statuses' }
        }
      },
      {
        path: 'ms-audit-finding-statuses',
        component: MsAuditFindingStatusesComponent,
        data: {
          core: { title: 'Ms Audit Finding Statuses' }
        }
      },
      {
        path: 'ms-audit-finding-corrective-action-statuses',
        component: MsAuditFindingCaStatusesComponent,
        data: {
          core: { title: 'Ms Audit Corrective Action Statuses' }
        }
      },
      {
        path: 'ms-audit-finding-categories',
        component: MsAuditFindingCategoriesComponent,
        data: {
          core: { title: 'Ms Audit Finding Categories' }
        }
      },
      {
        path: 'ms-audit-plan-criteria',
        component: MsAuditPlanCriteriaComponent,
        data: {
          core: { title: 'Ms Audit Plan Criteria' }
        }
      },
      {
        path: 'ms-audit-plan-objectives',
        component: MsAuditPlanObjectivesComponent,
        data: {
          core: { title: 'Ms Audit Plan Objective' }
        }
      },



      // start event monitoring
      {
        path: 'event-monitoring',
        component: EventMonitoringComponent,
        data: {
          core: { title: 'Event Monitoring' }
        }
      },
      {
        path: 'event-types',
        component: EventTypeComponent,
        data: {
          core: { title: 'Event Types' }
        }
      },
      {
        path: 'event-objective-types',
        component: ObjectiveTypeComponent,
        data: {
          core: { title: 'Event Types' }
        }
      },
      {

        path: 'event-ranges',
        component: RangeComponent,
        data: {
          core: { title: 'range' }
        }
      },
      {
        path: 'event-dimensions',
        component: DimensionComponent,
        data: {
          core: { title: 'dimension' }
        }
      },
      {
        path: 'event-checklists',
        component: ChecklistComponent,
        data: {
          core: { title: 'checklist' }
        }
      },
      {
        path: 'event-maturity-matrix-ranges',
        component: EventMaturityMatrixRangesComponent,
        data: {
          core: { title: 'Matrix range' }
        }
      },
      {
        path: 'event-task-statuses',
        component: EventTaskStatusComponent,
        data: {
          core: { title: 'Status' }
        }
      },
      {
        path: 'event-change-request-statuses',
        component: EventChangeRequestStatusComponent,
        data: {
          core: { title: 'Status' }
        }
      },
      {
        path: 'event-statuses',
        component: EventStatusComponent,
        data: {
          core: { title: 'Status' }
        }
      },
      {
        path: 'event-supportives',
        component: SupportivesComponent,
        data: {
          core: { title: 'Supportives' }
        }
      },
      {
        path: 'event-communication-channels',
        component: CommunicationComponent,
        data: {
          core: { title: 'communication' }
        }
      },
      {
        path: 'event-locations',
        component: LocationsComponent,
        data: {
          core: { title: 'locations' }
        }
      },
      {
        path: 'event-space-types',
        component: SpaceTypeComponent,
        data: {
          core: { title: 'Space Types' }
        }
      },
      {

        path: 'event-periodicities',
        component: PeriodicityComponent,
        data: {
          core: { title: 'Event Periodicity' }
        }
      },
      {
        path: 'event-entrances',
        component: EntranceComponent,
        data: {
          core: { title: 'Entrances' }
        }
      },
      {
        path: 'event-target-audiences',
        component: TargetAudienceComponent,
        data: {
          core: { title: 'Target Audience' }
        }
      },
      {
        path: 'event-closure-checklists',
        component: EventClosureChecklistComponent,
        data: {
          core: { title: 'Event Closure Checklist' }
        }
      },
      {
        path: 'event-equipments',
        component: EventEquipmentComponent,
        data: {
          core: { title: 'Event Equipment' }
        }
      },
      {
        path: 'event-engagement-strategies',
        component: EventEngagementStrategyComponent,
        data: {
          core: { title: 'Engagement Strategy' }
        }
      },
      {
        path: 'event-influences',
        component: EventInfluenceComponent,
        data: {
          core: { title: 'Event Influence' }
        }
      },
      {
        path: 'task-phases',
        component: TaskPhaseComponent,
        data: {
          core: { title: 'Task Phase' }
        }
      },
      {
        path: 'event-closure-statuses',
        component: EventClosureStatusComponent,
        data: {
          core: { title: 'Event Closure Statuses' }
        }
      },
      {
        path: 'event-change-request-items',
        component: EventChangeRequestItemsComponent,
        data: {
          core: { title: 'Event Change Request Item' }
        }
      },
      {
        path: 'event-maturity-matrix-parameters',
        component: EventMaturityMatrixParameterComponent,
        data: {
          core: { title: 'Event Maturity Matrix Parameter' }
        }
      },
      {
        path: 'event-maturity-matrix-types',
        component: EventMaturityMatrixTypesComponent,
        data: {
          core: { title: 'Event Maturity Matrix Type' }
        }
      }, {
        path: 'event-maturity-matrix-plan-statuses',
        component: MaturityMatrixPlanStatusesComponent,
        data: {
          core: { title: 'Event Maturity Matrix Plan Statuses' }
        }
      },
      {
        path: 'risk-impact-areas',
        component: EventRiskImpactAreasComponent,
        data: {
          core: { title: 'Event Risk Impact Areas' }
        }
      },

      {
        path: 'mock-drill',
        component: MockDrillComponent,
        data: {
          core: { title: 'Mock Drill' }
        }
      },
      {
        path: 'mock-drill-statuses',
        component: MockDrillStatusComponent,
        data: {
          core: { title: 'Mock Drill Status' }
        }
      },
      {
        path: 'mock-drill-types',
        component: MockDrillTypesComponent,
        data: {
          core: { title: 'Mock Drill Types' }
        }
      }
      ,
      {
        path: 'mock-drill-response-services',
        component: MockDrillResponseServiceComponent,
        data: {
          core: { title: 'Mock Drill Response Services' }
        }
      }
      ,
      {
        path: 'mock-drill-evacuation-roles',
        component: MockDrillEvacuationRoleComponent,
        data: {
          core: { title: 'Mock Drill Evacuation Roles' }
        }
      }
      ,
      {
        path: 'mock-drill-checks',
        component: MockDrillChecksComponent,
        data: {
          core: { title: 'Mock Drill Checks' }
        }
      }
      ,
      {
        path: 'mock-drill-scenarios',
        component: MockDrillScenarioComponent,
        data: {
          core: { title: 'Mock Drill Scenarios' }
        }
      }
      ,
      {
        path: 'mock-drill-program-statuses',
        component: MockDrillProgramStatusComponent,
        data: {
          core: { title: 'Mock Drill Program Status' }
        }
      },
      {
        path: 'mock-drill-scopes',
        component: MockDrillScopesComponent,
        data: {
          core: { title: 'Mock Drill Scopes' }
        }
      },
      {
        path: 'mock-drill-action-plan-statuses',
        component: MockDrillActionPlanStatusComponent,
        data: {
          core: { title: 'Mock Drill Action Plan Status' }
        }
      },
    ]
  },
  {
    path: 'divisions/:id',
    component: DivisionDetailsComponent,
    data: {
      core: { title: 'Info' },
      breadcrumb: null
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
