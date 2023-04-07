import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from "@angular/core";
import { AppStore } from '../../../stores/app.store';
import { RightSidebarFilterService } from "src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { IssueCategoryMasterStore } from 'src/app/stores/masters/organization/issue-category-master.store';
import { RightSidebarLayoutStore } from "src/app/stores/general/right-sidebar-layout.store";
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
// import { DivisionStore } from 'src/app/stores/general/division.store';
// import { SubSectionStore } from 'src/app/stores/general/sub-section.store';
import { IssueDomainMasterStore } from 'src/app/stores/masters/organization/issue-domain-master.store';
import { IssueTypeMasterStore } from 'src/app/stores/masters/organization/issue-type-master.store';
// import { DepartmentStore } from 'src/app/stores/general/department.store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { BranchesStore } from 'src/app/stores/organization/business_profile/branches/branches.store';
import { IReactionDisposer, autorun } from 'mobx';
import { IssueCategoryService } from '../../services/masters/organization/issue-category/issue-category.service';
import { DesignationService } from '../../services/masters/human-capital/designation/designation.service';
// import { DivisionService } from '../../services/general/division/division.service';
// import { SubSectionService } from '../../services/general/sub-section/sub-section.service';
import { IssueDomainService } from '../../services/masters/organization/issue-domain/issue-domain.service';
import { IssueTypeService } from '../../services/masters/organization/issue-type/issue-type.service';
// import { DepartmentService } from '../../services/general/department/department.service';
import { SubsidiaryService } from '../../services/organization/business_profile/subsidiary/subsidiary.service';
import { BranchService } from '../../services/organization/business_profile/branches/branch.service';

import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";
import { DepartmentMasterStore } from "src/app/stores/masters/organization/department-store";

import { DivisionService } from "src/app/core/services/masters/organization/division/division.service";
import { DivisionMasterStore } from "src/app/stores/masters/organization/division-store";

import { SubSectionService } from "src/app/core/services/masters/organization/sub-section/sub-section.service";
import { SubSectionMasterStore } from "src/app/stores/masters/organization/sub-section-store";

import { MsTypeService } from "src/app/core/services/masters/organization/ms-type/ms-type.service";
import { MsTypeVersionService } from "src/app/core/services/masters/organization/ms-type-version/ms-type-version.service";
import { MsTypeMasterStore } from 'src/app/stores/masters/organization/ms-type-master.store';
import { MsTypeVersionMasterStore } from 'src/app/stores/masters/organization/ms-type-version-master.store';

import { BusinessServicesService } from "src/app/core/services/organization/business_profile/business_services/business-services.service";
import { BusinessServiceStore } from "src/app/stores/organization/business_profile/business-services.store";

import { OrganizationproductsService } from "src/app/core/services/organization/business_profile/products/organizationproducts.service";
import { BusinessProductsStore } from "src/app/stores/organization/business_profile/business-products.store";
import { ProcessGroupsMasterStore } from "src/app/stores/masters/bpm/process-groups-master.store";
import { ProcessCategoryMasterStore } from "src/app/stores/masters/bpm/prcoess-category.master.store";
import { ProcessGroupsService } from "../../services/masters/bpm/process-groups/process-groups.service";
import { ProcessCategoriesService } from "../../services/masters/bpm/process-categories/process-categories.service";
import { RiskRatingMasterStore } from 'src/app/stores/masters/risk-management/risk-rating-store';
import { RiskRatingService } from "../../services/masters/risk-management/risk-rating/risk-rating.service";
import { UsersStore } from "src/app/stores/human-capital/users/users.store";
import { UsersService } from "../../services/human-capital/user/users.service";
import { HelperServiceService } from "../../services/general/helper-service/helper-service.service";
import { BpmFileService } from "../../services/bpm/bpm-file/bpm-file.service";
import { ImageServiceService } from "../../services/general/image-service/image-service.service";
import { ControlCategoryMasterStore } from "src/app/stores/masters/bpm/control-category.master.store";
import { ControlCategoryService } from "../../services/masters/bpm/control-category/control-category.service";
import { ControlTypesMasterStore } from "src/app/stores/masters/bpm/control-types.master.store";
import { ControlTypesService } from "../../services/masters/bpm/control-types/control-types.service";
import { ControlSubcategoryMasterStore } from "src/app/stores/masters/bpm/control-subcategory.master.store";
import { ControlSubcategoryService } from "../../services/masters/bpm/control-subcategory/control-subcategory.service";
import { LanguageService } from "../../services/settings/languages/language.service";
import { LanguageSettingsStore } from "src/app/stores/settings/language-settings.store";
import { RiskTypeMasterStore } from "src/app/stores/masters/risk-management/risk-type-store";
import { RiskTypeService } from "../../services/masters/risk-management/risk-type/risk-type.service";
import { StakeholderTypeMasterStore } from "src/app/stores/masters/organization/stakeholder-type-master.store";
import { StakeholderService } from "../../services/masters/organization/stakeholder/stakeholder.service";
import { RiskClassificationMasterStore } from "src/app/stores/masters/risk-management/risk-classification-store";
import { RiskClassificationService } from "../../services/masters/risk-management/risk-classification/risk-classification.service";
import { RiskCategoryMasterStore } from "src/app/stores/masters/risk-management/risk-category-store";
import { RiskCategoryService } from "../../services/masters/risk-management/risk-category/risk-category.service";
import { RiskStatusMasterStore } from "src/app/stores/masters/risk-management/risk-status-store";
import { RiskTreatmentStatusesService } from "../../services/masters/risk-management/risk-treatment-statuses/risk-treatment-statuses.service";
import { RiskTreatmentStatusesMasterStore } from "src/app/stores/masters/risk-management/risk-treatment-statuses-store";
import { RisksStore } from "src/app/stores/risk-management/risks/risks.store";
import { RisksService } from "../../services/risk-management/risks/risks.service";
import { AuditItemTypeMasterStore } from "src/app/stores/masters/internal-audit/auditable-item-type";
import { AuditableItemTypeService } from "../../services/masters/internal-audit/auditable-item-type/auditable-item-type.service";
import { AuditItemCategoryMasterStore } from "src/app/stores/masters/internal-audit/audit-item-category-store";
import { AuditableItemCategoryService } from "../../services/masters/internal-audit/auditable-item-category/auditable-item-category.service";
import { AuditReportStatusMasterStore } from "src/app/stores/masters/internal-audit/audit-report-statuses-store";
import { AuditReportStatusesService } from "../../services/masters/internal-audit/audit-report-statuses/audit-report-statuses.service";
import { AuditProgramMasterStore } from "src/app/stores/internal-audit/audit-program/audit-program-store";
import { AuditProgramService } from "../../services/internal-audit/audit-program/audit-program.service";
import { RiskStatusService } from "../../services/masters/risk-management/risk-status/risk-status.service";
import { AuditPlanStore } from "src/app/stores/internal-audit/audit-plan/audit-plan-store";
import { AuditPlanService } from "../../services/internal-audit/audit-plan/audit-plan.service";
import { AuditObjectiveMasterStore } from "src/app/stores/masters/internal-audit/audit-objective-store";
import { AuditObjectiveService } from "../../services/masters/internal-audit/audit-objective/audit-objective.service";
import { AuditCriterionService } from "../../services/masters/internal-audit/audit-criterion/audit-criterion.service";
import { AuditCriterionMasterStore } from "src/app/stores/masters/internal-audit/audit-criterion-store";
import { AuditFindingCategoryMasterStore } from "src/app/stores/masters/internal-audit/audit-finding-categories-store";
import { AuditFindingCategoriesService } from "../../services/masters/internal-audit/audit-finding-categories/audit-finding-categories.service";
import { AuditableItemService } from "../../services/masters/internal-audit/auditable-item/auditable-item.service";
import { AuditableItemMasterStore } from "src/app/stores/masters/internal-audit/auditable-item-store";
import { AuditStore } from "src/app/stores/internal-audit/audit/audit-store";
import { AuditService } from "../../services/internal-audit/audit/audit.service";
import { OrganizationLevelSettingsStore } from "src/app/stores/settings/organization-level-settings.store";
import { StakeholderTypeService } from "../../services/masters/organization/stakeholder-type/stakeholder-type.service";
import { SectionMasterStore } from "src/app/stores/masters/organization/section-store";
import { SectionService } from "../../services/masters/organization/section/section.service";
import { MeetingCategoryMasterStore } from "src/app/stores/masters/mrm/meeting-category-store";
import { MeetingCategoryService } from "../../services/masters/mrm/meeting-category/meeting-category.service";
import { MeetingPlanStatusMasterStore } from "src/app/stores/masters/mrm/meeting-plan-status-store";
import { MeetingPlanStatusService } from "../../services/masters/mrm/meeting-plan-status/meeting-plan-status.service";
import { VenueService } from "../../services/masters/general/venue/venue.service";
import { VenueMasterStore } from "src/app/stores/masters/general/venue-store";
import { MeetingsStore } from "src/app/stores/mrm/meetings/meetings-store";
import { MeetingPlanService } from "../../services/mrm/meeting-plan/meeting-plan.service";
import { MeetingPlanStore } from "src/app/stores/mrm/meeting-plan/meeting-plan-store";
import { MeetingActionPlanStatusMasterStore } from "src/app/stores/masters/mrm/meeting-action-plan-status-store";
import { MeetingActionPlanStatusService } from "../../services/masters/mrm/meeting-action-plan-status/meeting-action-plan-status.service";
import { DocumentTypeMasterStore } from "src/app/stores/masters/knowledge-hub/document-types-store";
import { DocumentTypesService } from "../../services/masters/knowledge-hub/document-types/document-types.service";
import { DocumentAccessTypeMasterStore } from "src/app/stores/masters/knowledge-hub/document-access-type-store";
import { DocumentAccessTypeService } from "../../services/masters/knowledge-hub/document-access-type/document-access-type.service";
import { DocumentStatusMasterStore } from "src/app/stores/masters/knowledge-hub/document-status-store";
import { DocumentStatusService } from "../../services/masters/knowledge-hub/document-status/document-status.service";
import { MeetingsService } from "../../services/mrm/meetings/meetings.service";
import { DocumentsStore } from "src/app/stores/knowledge-hub/documents/documents.store";
import { DocumentsService } from "../../services/knowledge-hub/documents/documents.service";
import { DocumentChangeRequestTypesMasterStore } from "src/app/stores/masters/knowledge-hub/document-change-request-type-store";
import { DocumentChangeRequestTypeService } from "../../services/masters/knowledge-hub/document-change-request-type/document-change-request-type.service";
import { changeRequestStore } from "src/app/stores/knowledge-hub/change-request/change-request.store";
import { FrameworksStore } from "src/app/stores/business-assessments/frameworks.store";
import { FrameworksService } from "../../services/business-assessments/frameworks/frameworks.service";
import { JsoObservationTypeMasterStore } from "src/app/stores/masters/jso/jso-observation-type-store";
import { JsoObservationTypeService } from "../../services/masters/jso/jso-observation-type/jso-observation-type.service";
import { JsoObservationStore } from "src/app/stores/jso/jso-observations/jso-observations-store";
import { UnsafeActionCategoryMasterStore } from "src/app/stores/masters/jso/unsafe-action-category-store";
import { UnsafeActionCategoryService } from "../../services/masters/jso/unsafe-action-category/unsafe-action-category.service";
import { UnsafeActionSubCategoryService } from "../../services/masters/jso/unsafe-action-sub-category/unsafe-action-sub-category.service";
import { UnsafeActionSubCategoryMasterStore } from "src/app/stores/masters/jso/unsafe-action-sub-category-store";
import { JsoUnsafeActionObservedGroupMasterStore } from "src/app/stores/masters/jso/unsafe-action-observed-group-store";
import { UnsafeActionObservedGroupService } from "../../services/masters/jso/unsafe-action-observed-group/unsafe-action-observed-group.service";
import { IncidentCategoriesMasterStore } from "src/app/stores/masters/incident-management/incident-categories-master-store";
import { IncidentCategoriesService } from "../../services/masters/incident-management/incident-categories/incident-categories.service";
import { IncidentSubCategoryMasterStore } from "src/app/stores/masters/incident-management/incident-sub-category-master-store";
import { IncidentSubCategoryService } from "../../services/masters/incident-management/incident-sub-category/incident-sub-category.service";
import { IncidentDamageTypeMasterStore } from "src/app/stores/masters/incident-management/incident-damage-type-master-store";
import { IncidentDamageTypeService } from "../../services/masters/incident-management/incident-damage-type/incident-damage-type.service";
import { IncidentStatusMasterStore } from "src/app/stores/masters/incident-management/incident-status-master-store";
import { IncidentStatusService } from "../../services/masters/incident-management/incident-status/incident-status.service";
import { IncidentService } from "../../services/incident-management/incident/incident.service";
import { IncidentStore } from "src/app/stores/incident-management/incident/incident-store";
import { IncidentCorrectiveActionStatusService } from "../../services/masters/incident-management/incident-corrective-action-status/incident-corrective-action-status.service";
import { IncidentCorrectiveActionStatusMasterStore } from "src/app/stores/masters/incident-management/incident-corrective-action-status-store";
import { ComplianceTypeMasterStore } from "src/app/stores/masters/compliance-management/compliance-type-master.store";
import { ComplianceTypeService } from 'src/app/core/services/masters/compliance-management/compliance-type/compliance-type.service';
import { ComplianceAreaMasterStore } from "src/app/stores/masters/compliance-management/compliance-area-store";
import { ComplianceAreaService } from "../../services/masters/compliance-management/compliance-area/compliance-area.service";
import { ComplianceSectionMasterStore } from "src/app/stores/masters/compliance-management/compliance-section-store";
import { ComplianceSectionService } from "../../services/masters/compliance-management/compliance-section/compliance-section.service";
import { SlaCategoryMasterStore } from "src/app/stores/masters/compliance-management/sla-category-store";
import { SlaCategoryService } from "../../services/masters/compliance-management/sla-category/sla-category.service";
import { AuthStore } from "src/app/stores/auth.store";
import { RiskDashboardStore } from "src/app/stores/risk-management/risk-dashboard/risk-dashboard-store";
import { TrainingCategoryMasterStore } from "src/app/stores/masters/training/training-category-master-store";
import { TrainingCategoryService } from "../../services/masters/training/training-category/training-category.service";
import { TrainingStatusMasterStore } from "src/app/stores/masters/training/training-status-master-store";
import { TrainingStatusService } from "../../services/masters/training/training-status/training-status.service";
import { CompetencyGroupMasterStore } from "src/app/stores/masters/human-capital/competency-group-master.store";
import { CompetencyGroupService } from "../../services/masters/human-capital/competency-group/competency-group.service";
import { CompetencyMasterStore } from "src/app/stores/masters/human-capital/competency-master.store";
import { CompetencyService } from "../../services/masters/human-capital/competency/competency.service";
import { RiskSourceMasterStore } from "src/app/stores/masters/risk-management/risk-source-store";
import { RiskSourceService } from "../../services/masters/risk-management/risk-source/risk-source.service";
import { RiskControlPlanMasterStore } from "src/app/stores/masters/risk-management/risk-control-plan-store";
import { RiskControlPlanService } from "../../services/masters/risk-management/risk-control-plan/risk-control-plan.service";
import { TrainingDashboardStore } from "src/app/stores/training/training-dashboard/training-dashboard-store";
import { ExternalAuditTypesService } from "../../services/masters/external-audit/external-audit-types/external-audit-types.service";
import { ExternalAuditTypesMasterStore } from "src/app/stores/masters/external-audit/external-audit-types-store";
import { FindingsService } from "../../services/external-audit/findings/findings.service";
import { FindingMasterStore } from "src/app/stores/external-audit/findings/findings-store";
import { RootCauseCategoriesService } from "../../services/masters/internal-audit/root-cause-categories/root-cause-categories.service";
import { FindingImpactAnalysisCategoryService } from "../../services/masters/internal-audit/finding-impact-analysis-category/finding-impact-analysis-category.service";
import { FindingImpactAnalysisCategoryMasterStore } from "src/app/stores/masters/internal-audit/finding-impact-analysis-category-store";
import { RootCauseCategoryMasterStore } from "src/app/stores/masters/internal-audit/root-cause-categories-store";
import { ExternalAuditCorrectiveActionStore } from "src/app/stores/external-audit/corrective-actions/corrective-actions-store";
import { AssetCategoryService } from "../../services/masters/asset-management/asset-category/asset-category.service";
import { AssetCategoryStore } from "src/app/stores/masters/asset-management/asset-category-store";
import { AssetTypesMasterStore } from "src/app/stores/masters/asset-management/asset-types-master.store";
import { AssetTypesService } from "../../services/masters/asset-management/asset-types/asset-types.service";
import { AssetSubCategoryStore } from "src/app/stores/masters/asset-management/asset-sub-category-store";
import { AssetSubCategoryService } from "../../services/masters/asset-management/asset-sub-category/asset-sub-category.service";
import { AssetInvestmentTypesService } from "../../services/masters/asset-management/asset-investment-types/asset-investment-types.service";
import { AssetInvestmentTypesMasterStore } from "src/app/stores/masters/asset-management/asset-investment-types-store";
import { PhysicalConditionRankingsMasterStore } from "src/app/stores/masters/asset-management/physical-condition-rankings-store";
import { PhysicalConditionRankingsService } from "../../services/masters/asset-management/physical-condition-rankings/physical-condition-rankings.service";
import { SuppliersMasterStore } from "src/app/stores/masters/suppliers-management/suppliers";
import { SuppliersService } from "../../services/masters/suppliers-management/suppliers/suppliers.service";
import { FindingCorrectiveActionStatusesMasterStore } from "src/app/stores/masters/internal-audit/finding-corrective-action-statuses.store";
import { FindingCorrectiveActionStatusesService } from "../../services/masters/internal-audit/finding-corrective-action-statuses/finding-corrective-action-statuses.service";
import { AssetMaintenanceCategoriesMasterStore } from "src/app/stores/masters/asset-management/asset-maintenance-categories";
import { AssetMaintenanceCategoriesService } from "../../services/masters/asset-management/asset-maintenance-categories/asset-maintenance-categories.service";
import { AssetMaintenanceTypesMasterStore } from "src/app/stores/masters/asset-management/asset-maintenance-types-store";
import { AssetMaintenanceTypesService } from "../../services/masters/asset-management/asset-maintenance-types/asset-maintenance-types.service";
import { AssetMaintenanceScheduleFrequenciesMasterStore } from "src/app/stores/masters/asset-management/asset-maintenance-schedule-frequencies-store";
import { AssetMaintenanceScheduleFrequenciesService } from "../../services/masters/asset-management/asset-maintenance-schedule-frequencies/asset-maintenance-schedule-frequencies.service";
import { AssetMaintenanceStatusesMasterStore } from "src/app/stores/masters/asset-management/asset-maintenance-statuses";
import { AssetMaintenanceStatusesService } from "../../services/masters/asset-management/asset-maintenance-statuses/asset-maintenance-statuses.service";
import { ComplianceStatusMasterStore } from "src/app/stores/masters/compliance-management/compliance-status-store";
import { ComplianceStatusService } from "../../services/masters/compliance-management/compliance-status/compliance-status.service";
import { TestAndExerciseStatusesMasterStore } from "src/app/stores/masters/bcm/test-and-exercise-statuses-store";
import { TestAndExerciseStatusesService } from "../../services/masters/bcm/test-and-exercise-statuses/test-and-exercise-statuses.service";
import { TestAndExerciseTypesMasterStore } from "src/app/stores/masters/bcm/test-and-exercise-types.master.store";
import { TestAndExerciseTypesService } from "../../services/masters/bcm/test-and-exercise-types/test-and-exercise-types.service";
import { BusinessContinuityPlanStatusMasterStore } from "src/app/stores/masters/bcm/business-continuity-plan-status.store";
import { BusinessContinuityPlanStatusService } from "../../services/masters/bcm/business-continuity-plan-status/business-continuity-plan-status.service";
import { UnitService } from "../../services/masters/human-capital/unit/unit.service";
import { UnitMasterStore } from "src/app/stores/masters/human-capital/unit-store";
import { ActionPlansStore } from "src/app/stores/strategy-management/action-plans.store";
import { ActionPlansService } from "../../services/strategy-management/action-plans/action-plans.service";
import { StrategyInitiativeActionPlanStatusMasterStore } from "src/app/stores/masters/strategy/strategy-initiative-action-plan-status-store";
import { StrategyInitiativeActionPlanStatusService } from "../../services/masters/strategy/strategy-initiative-action-plan-status/strategy-initiative-action-plan-status.service";
import { InitiativeService } from "../../services/strategy-management/initiatives/initiative.service";
import { StrategyInitiativeStore } from "src/app/stores/strategy-management/initiative.store";
import { FocusAreaMasterStore } from "src/app/stores/masters/strategy/focus-area-master-store";
import { FocusAreaService } from "../../services/masters/strategy/focus-area/focus-area.service";
import { ObjectiveMasterStore } from "src/app/stores/masters/strategy/objective.store";
import { ObjectiveService } from "../../services/masters/strategy/objective/objective.service";
import { StrategyInitiativeActionsMasterStore } from "src/app/stores/masters/strategy/strategy-initiative-actions.store";
import { StrategyInitiativeActionsService } from "../../services/masters/strategy/strategy-initiative-actions/strategy-initiative-actions.service";
import { StrategyInitiativeReviewFrequencyMasterStore } from "src/app/stores/masters/strategy/strategy-initiative-review-frequencies-store";
import { StrategyInitiativeReviewFrequencyService } from "../../services/masters/strategy/strategy-initiative-review-frequencies/strategy-initiative-review-frequencies.service";
import { KpiCalculationTypesMasterStore } from "src/app/stores/masters/strategy/kpi-calculation-type.store";
import { KpiCalculationTypesService } from "../../services/masters/strategy/kpi-calculation-types/kpi-calculation-types.service";
import { StrategyKpiDataTypesMasterStore } from "src/app/stores/masters/strategy/strategy-kpi-data-types-store";
import { StrategyKpiDataTypesService } from "../../services/masters/strategy/strategy-kpi-data-types/strategy-kpi-data-types.service";
import { FindingStatusesMasterStore } from "src/app/stores/masters/internal-audit/finding-statuses";
import { FindingStatusesService } from "../../services/masters/internal-audit/finding-statuses/finding-statuses.service";
import { StrategyProfileStatusService } from "../../services/masters/strategy/strategy-profile-status/strategy-profile-status.service";
import { StrategyProfileStatusMasterStore } from "src/app/stores/masters/strategy/strategy-profile-status-store";
import { BusinessAssessmentStatusService } from "../../services/masters/business-assessment/business-assessment-status/business-assessment-status.service";
import { BusinessAssessmentStatusMasterStore } from "src/app/stores/masters/business-assessment/business-assessment-status-store";
import { BcsStatusService } from "../../services/masters/bcm/bcs-status/bcs-status.service";
import { BcsStatusMasterStore } from "src/app/stores/masters/bcm/bcs-status-store";
import { RegionService } from "../../services/masters/general/region/region.service";
import { CountryService } from "../../services/masters/general/country/country.service";
import { RegionMasterStore } from "src/app/stores/masters/general/region-store";
import { CountryMasterStore } from "src/app/stores/masters/general/country-store";
import { ExternalAuditService } from "../../services/external-audit/external-audit/external-audit.service";
import { ExternalAuditMasterStore } from "src/app/stores/external-audit/external-audit/external-audit-store";
import { AuditPlanStatusesService } from "../../services/masters/internal-audit/audit-plan-statuses/audit-plan-statuses.service";
import { AuditPlanStatusesMasterStore } from "src/app/stores/masters/internal-audit/audit-plan-statuses.store";
import { LocationService } from "../../services/masters/general/location/location.service";
import { LocationMasterStore } from "src/app/stores/masters/general/location-store";
import { ProjectContractTypeMasterStore } from "src/app/stores/masters/project-monitoring/project-contract-type-store";
import { ProjectContractTypeService } from "../../services/masters/project-monitoring/project-contract-type/project-contract-type.service";
import { ProjectPriorityService } from "../../services/masters/project-monitoring/project-priority/project-priority.service";
import { ProjectPriorityMasterStore } from "src/app/stores/masters/project-monitoring/project-priority-store";
import { ProjectMonitoringStatusMasterStore } from "src/app/stores/masters/project-monitoring/project-monitoring-status-store";
import { ProjectMonitoringStatusService } from "../../services/masters/project-monitoring/project-monitoring-status/project-monitoring-status.service";
import { ProjectMonitoringService } from "../../services/project-monitoring/project-monitoring/project-monitoring.service";
import { ProjectMonitoringStore } from "src/app/stores/project-monitoring/project-monitoring.store";
import { ProjectIssueService } from "../../services/project-monitoring/project-issue/project-issue.service";
import { ProjectIssueStore } from "src/app/stores/project-monitoring/project-issue-store";
import { ProjectIssueStatusService } from "../../services/masters/project-monitoring/project-issue-status/project-issue-status.service";
import { ProjectIssueStatusMasterStore } from "src/app/stores/masters/project-monitoring/project-issue-store";
import { ProjectClosureStatusService } from "../../services/masters/project-monitoring/project-closure-status/project-closure-status.service";
import { ProjectClosureStatusMasterStore } from "src/app/stores/masters/project-monitoring/project-closure-status-store";
import { ProjectChangeRequestStatusService } from "../../services/masters/project-monitoring/project-change-request-status/project-change-request-status.service";
import { ProjectChangeRequestStatusMasterStore } from "src/app/stores/masters/project-monitoring/project-change-request-status-store";
import { KpiManagementStatusMasterStore } from "src/app/stores/masters/kpi-management/kpi-management-status-store";
import { KpiManagementStatusService } from "../../services/masters/kpi-management/kpi-management-status/kpi-management-status.service";
import { KpisService } from "../../services/kpi-management/kpi/kpis.service";
import { KpisStore } from "src/app/stores/kpi-management/kpi/kpis-store";
import { KpiScoreStatusMasterStore } from "src/app/stores/masters/kpi-management/kpi-score-status";
import { KpiScoreStatusesService } from "../../services/masters/kpi-management/kpi-score-statuses/kpi-score-statuses.service";
import { KpiImprovementPlanStatusMasterStore } from "src/app/stores/masters/kpi-management/kpi-improvement-plan-status";
import { KpiImprovementPlanStatuesService } from "../../services/masters/kpi-management/kpi-improvement-plan-statues/kpi-improvement-plan-statues.service";
import { BcsTypesMasterStore } from "src/app/stores/masters/bcm/bcs-type-store";
import { BcsTypes } from "../../models/masters/bcm/bcs-type";
import { BcsTypeService } from "../../services/masters/bcm/bcs-type/bcs-type.service";
import { BcmStrategyStore } from "src/app/stores/bcm/strategy/bcm-strategy-store";
import { DocumentCategoryMasterStore } from "src/app/stores/masters/knowledge-hub/document-category-store";
import { DocumentSubCategoryMasterStore } from "src/app/stores/masters/knowledge-hub/document-sub-categories-store";
import { DocumentSubSubCategoryMasterStore } from "src/app/stores/masters/knowledge-hub/document-sub-sub-categories-store";
import { DocumentFamilyMasterStore } from "src/app/stores/masters/knowledge-hub/document-family-store";
import { DocumentCategoryService } from "../../services/masters/knowledge-hub/document-category/document-category.service";
import { DocumentFamilyService } from "../../services/masters/knowledge-hub/document-family/document-family.service";
import { DocumentSubCategoriesService } from "../../services/masters/knowledge-hub/document-sub-categories/document-sub-categories.service";
import { DocumentSubSubCategoriesService } from "../../services/masters/knowledge-hub/document-sub-sub-categories/document-sub-sub-categories.service";
import { EventTypeService } from 'src/app/core/services/masters/event-monitoring/event-type/event-type.service';
import { EventTypeMasterStore } from 'src/app/stores/masters/event-monitoring/event-type-store';
import { StatusMasterStore } from 'src/app/stores/masters/event-monitoring/status-store';
import { StatusService } from 'src/app/core/services/masters/event-monitoring/status.service';
import { TaskStatusService } from 'src/app/core/services/masters/event-monitoring/task-status/task-status.service';
import { TaskstatusMasterStore } from 'src/app/stores/masters/event-monitoring/task-status-store';
import { EventClosureStatusMasterStore } from 'src/app/stores/masters/event-monitoring/event-closure-status-store';
import { EventClosureStatusService } from 'src/app/core/services/masters/event-monitoring/event-closure-status/event-closure-status.service';
import { EventChaneRequestStatusMasterStore } from 'src/app/stores/masters/event-monitoring/event-change-request-status-store';
import { EventChangeRequestStatusService } from 'src/app/core/services/masters/event-monitoring/event-change-request-status/event-change-request-status.service';
import { AmAuditCategoryMasterStore } from "src/app/stores/masters/audit-management/am-audit-category-store";
import { AmAuditCategoryService } from "../../services/masters/audit-management/am-audit-category/am-audit-category.service";
import { AnnualPlanFrequencyMasterStore } from "src/app/stores/masters/audit-management/annual-plan-frequency-store";
import { AnnualPlanFrequencyService } from "../../services/masters/audit-management/annual-plan-frequency/annual-plan-frequency.service";
import { AnnualAuditPlanFrequencyItemService } from "../../services/masters/audit-management/annual-audit-plan-frequency-item/annual-audit-plan-frequency-item.service";
import { AnnualPlanFrequencyItemMasterStore } from "src/app/stores/masters/audit-management/annual-audit-plan-frequency-item-store";
import { AuditStatusesService } from "../../services/masters/audit-management/audit-statuses/audit-statuses.service";
import { AuditStatusesMasterStore } from "src/app/stores/masters/audit-management/audit-statuses-store";
import { AmAuditableItemStore } from "src/app/stores/audit-management/am-audit-plan/am-auditable-item.store";
import { AmAuditableItemService } from "../../services/audit-management/am-audit-plan/am-auditable-item/am-auditable-item.service";
import { AuditTestPlanStatusMasterStore } from "src/app/stores/masters/audit-management/audit-test-plan-status-store";
import { AuditTestPalnStatusService } from "../../services/masters/audit-management/audit-test-plan-status/audit-test-paln-status.service";
import { InformationRequestStatusesService } from "../../services/masters/audit-management/information-request-statuses/information-request-statuses.service";
import { InformationRequestStatusMasterStore } from "src/app/stores/masters/audit-management/information-request-statuses-store";
import { KpiCategoryService } from "../../services/masters/human-capital/kpi-category/kpi-category.service";
import { KpiCategoryMasterStore } from "src/app/stores/masters/human-capital/kpi-category-master.store";
import { KpiTypesService } from "../../services/masters/strategy/kpi-types/kpi-types.service";
import { KpiTypesMasterStore } from "src/app/stores/masters/strategy/kpi-types-store";
import { KpiReviewFrequenciesService } from "../../services/masters/kpi-management/kpi-review-frequencies/kpi-review-frequencies.service";
import { KpiReviewFrequenciesStore } from "src/app/stores/masters/kpi-management/kpi-review-frequencies-store";
import { CustomerCompliantTypeService } from "../../services/masters/customer-engagement/customer-compliant-type/customer-compliant-type.service";
import { CustomerTypeMasterStore } from "src/app/stores/masters/customer-engagement/customer-compliant-type-store";
import { CustomerComplaintSourceService } from "../../services/masters/customer-engagement/customer-complaint-source/customer-complaint-source.service";
import { CustomerCompliantStatusService } from "../../services/masters/customer-engagement/customer-complaint-status/customer-compliant-status.service";
import { CustomerComplaintSourceMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-source-store';
import { CustomerCompliantStatusMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-status-store';
import { CustomersService } from 'src/app/core/services/customer-satisfaction/customers/customers.service';
import { CustomersStore } from 'src/app/stores/customer-engagement/customers/customers-store';
import { CustomerComplaintInvestigationStatusService } from "../../services/masters/customer-engagement/customer-complaint-investigation-status/customer-complaint-investigation-status.service";
import { CustomerComplaintInvestigationStatusMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-investigation-status-store';
import { CustomerComplaintActionTypesService } from "../../services/masters/customer-engagement/customer-complaint-action-types/customer-complaint-action-types.service";
import { CustomerComplaintActionTypesMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-action-types';
import { CustomerComplaintActionPlanStatusesService } from "../../services/masters/customer-engagement/customer-complaint-action-plan-statuses/customer-complaint-action-plan-statuses.service";
import { CustomerComplaintActionPlanStatusesMasterStore } from "src/app/stores/masters/customer-engagement/customer-complaint-action-plan-statuses";
import { ProcessService } from "../../services/bpm/process/process.service";
import { ProcessStore } from "src/app/stores/bpm/process/processes.store";
import { StrategyService } from "../../services/strategy-management/strategy/strategy.service";
import { StrategyStore } from "src/app/stores/strategy-management/strategy.store";
import { ObjectiveScoreService } from "../../services/strategy-management/objective/objective-score.service";
import { ObjectiveScoreStore } from "src/app/stores/strategy-management/objective-score.store";
import { ControlModeService } from "../../services/masters/bpm/control-mode/control-mode.service";
import { ControlModeMasterStore } from "src/app/stores/masters/bpm/control-mode.store";
import { ControlEfficiencyMeasuresService } from "../../services/masters/risk-management/control-efficiency-measures/control-efficiency-measures.service";
import { ControlEfficiencyMeasuresMasterStore } from "src/app/stores/masters/risk-management/control-efficiency-measures-store";
import { ProjectTypeService } from "../../services/masters/project-management/project-type/project-type.service";
import { ProjectTypeMasterStore } from "src/app/stores/masters/project-management/project-type-store";
import { ProjectCategoryService } from "../../services/masters/project-management/project-category/project-category.service";
import { ProjectCategoryMasterStore } from "src/app/stores/masters/project-management/project-category-store";
import { AmAuditControlSelfAssessmentStatusService } from "../../services/masters/audit-management/am-audit-control-self-assessment-status/am-audit-control-self-assessment-status.service";
import { AuditManagementControlSelfAssessmentStatusStore } from "src/app/stores/masters/audit-management/am-audit-control-self-assessment-status-store";
import { RootCauseSubCategoriesService } from "../../services/masters/internal-audit/root-cause-sub-categories/root-cause-sub-categories.service";
import { RootCauseSubCategoryMasterStore } from "src/app/stores/masters/internal-audit/root-cause-sub-categories-store";
import { PeriodicityService } from "../../services/masters/event-monitoring/periodicity/periodicity.service";
import { PeriodicityMasterStore } from "src/app/stores/masters/event-monitoring/periodicity-store";
import { EntranceService } from "../../services/masters/event-monitoring/entrance/entrance.service";
import { EntranceMasterStore } from "src/app/stores/masters/event-monitoring/entrance-store";
import { TargetAudienceService } from "../../services/masters/event-monitoring/target-audience/target-audience.service";
import { TargetAudienceMasterStore } from "src/app/stores/masters/event-monitoring/target-audience-store";
import { RangeService } from "../../services/masters/event-monitoring/range/range.service";
import { RangeMasterStore } from "src/app/stores/masters/event-monitoring/range-store";
import { DimensionService } from "../../services/masters/event-monitoring/dimension/dimension.service";
import { DimensionMasterStore } from "src/app/stores/masters/event-monitoring/dimension-store";
import { SpaceTypeService } from "../../services/masters/event-monitoring/space-type/space-type.service";
import { SpaceTypeMasterStore } from "src/app/stores/masters/event-monitoring/space-type-store";
import { EventsService } from "../../services/event-monitoring/events/events.service";
import { EventsStore } from "src/app/stores/event-monitoring/events/event.store";
import { TaskPhaseService } from "../../services/masters/event-monitoring/task-phase/task-phase.service";
import { TaskPhaseMasterStore } from "src/app/stores/masters/event-monitoring/task-phase-store";
import { BAActionPlanStore } from "src/app/stores/business-assessments/assessments/assessment-action-plan.store";
import { AssessmentsService } from "../../services/business-assessments/assessments.service";
import { AssessmentsStore } from "src/app/stores/business-assessments/assessments/assessments.store";
import { BaActionPlanStatusService } from "../../services/masters/business-assessment/ba-action-pla-status/ba-action-plan-status.service";
import { BAActionPlanStatusStore } from "src/app/stores/masters/business-assessment/ba-action-plan-status.store";
import { AssetStatusService } from "../../services/masters/asset-management/asset-status/asset-status.service";
import { AssetStatusStore } from "src/app/stores/masters/asset-management/asset-status-store";
import { AssetRatingsMasterStore } from "src/app/stores/masters/asset-management/asset-ratings-store";
import { AssetRatingsService } from "../../services/masters/asset-management/asset-ratings/asset-ratings.service";
import { AssetRegisterService } from "../../services/asset-management/asset-register/asset-register.service";
import { AssetRegisterStore } from "src/app/stores/asset-management/asset-register/asset-register-store";
import { AssetCalculationMethodService } from "../../services/masters/asset-management/asset-calculation-method/asset-calculation-method.service";
import { AssetCalculationMethodMasterStore } from "src/app/stores/masters/asset-management/asset-calculation-method";
import { AssetMatrixCategoriesService } from "../../services/masters/asset-management/asset-matrix-categories/asset-matrix-categories.service";
import { AssetMatrixCategoriesMasterStore } from "src/app/stores/masters/asset-management/asset-matrix-categories";
import { BcpService } from "../../services/bcm/bcp/bcp.service";
import { BcpStore } from "src/app/stores/bcm/bcp/bcp-store";
import { BiaTireService } from "../../services/masters/bcm/bia-tire/bia-tire.service";
import { BiaTireMasterStore } from "src/app/stores/masters/bcm/bia-tire";
import { MsAditFindingStatusMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-finding-status-store';
import { MsAuditFindingStatusService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-finding-status/ms-audit-finding-status.service';
import { MsAuditCategoryMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-category-store';
import { MsAuditCategoryService } from "../../services/masters/ms-audit-management/ms-audit-category/ms-audit-category.service";
import { MockDrillPlanService } from "../../services/mock-drill/mock-drill-plan/mock-drill-plan.service";
import { MockDrillPlanStore } from "src/app/stores/mock-drill/mock-drill-plan/mock-drill-plan-store";
import { MockDrillTypesService } from "../../services/masters/mock-drill/mock-drill-types/mock-drill-types.service";
import { MockDrillTypesMasterStore } from "src/app/stores/masters/mock-drill/mock-drill-types-store";
import { MockDrillStatusService } from "../../services/masters/mock-drill/mokc-drill-status/mock-drill-status.service";
import { MockDrillStatusMasterStore } from "src/app/stores/masters/mock-drill/mock-drill-status-store";
import { MSAuditFindingCAStatusesMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-finding-ca-statuses-store';
import { MsAuditFindingCaStatusesService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-finding-ca-statuses/ms-audit-finding-ca-statuses.service';
import { MsAuditNonConfirmitiesStore } from 'src/app/stores/ms-audit-management/ms-audit-non-confirmities/ms-audit-non-confirmities.store'
import { AuditNonConfirmityService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-non-confirmity/audit-non-confirmity.service';
import { AuditNonConfirmityStore } from "src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store";
import { MsAuditModesMasterStore } from "src/app/stores/masters/ms-audit-management/ms-audit-modes-store";
import { MsAuditModesService } from "../../services/masters/ms-audit-management/ms-audit-modes/ms-audit-modes.service";
import { MsAditPlanStatusMasterStore } from "src/app/stores/masters/ms-audit-management/ms-audit-plan-status-store";
import { MsAuditPlanStatusService } from "../../services/masters/ms-audit-management/ms-audit-plan-status/ms-audit-plan-status.service";
import { MsAuditProgramsStore } from "src/app/stores/ms-audit-management/ms-audit-programs/ms-audit-programs-store";
import { MsAuditProgramsService } from "../../services/ms-audit-management/ms-audit-programs/ms-audit-programs.service";
import { MsAuditStatusesMasterStore } from "src/app/stores/masters/ms-audit-management/ms-audit-statuses-store";
import { MsAuditStatusesService } from "../../services/masters/ms-audit-management/ms-audit-statuses/ms-audit-statuses.service";
import { MsAuditPlansStore } from "src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store";
import { MsAuditPlansService } from "../../services/ms-audit-management/ms-audit-plans/ms-audit-plans.service";
import { MsAuditFindingCategoryMasterStore } from "src/app/stores/masters/ms-audit-management/ms-audit-finding-categories-store";
import { MsAuditFindingCategoriesService } from "../../services/masters/ms-audit-management/ms-audit-finding-categories/ms-audit-finding-categories.service";
import { MsAuditScheduleStatusMasterStore } from "src/app/stores/masters/ms-audit-management/ms-audit-schedule-status-store";
import { MsAuditScheduleStatusesService } from "../../services/masters/ms-audit-management/ms-audit-schedule-statuses/ms-audit-schedule-statuses.service";
import { MsAuditService } from "../../services/ms-audit-management/ms-audit/ms-audit.service";
import { MsAuditStore } from "src/app/stores/ms-audit-management/ms-audits/ms-audit-store";
import { StakeholdersStore } from "src/app/stores/organization/stakeholders/stakeholders.store";
import { CyberIncidentClassificationService } from "../../services/masters/cyber-incident/cyber-incident-classification/cyber-incident-classification.service";
import { CyberIncidentClassificationMasterStore } from "src/app/stores/masters/cyber-incident/cyber-incident-classification-store";
import { CyberIncidentStatusService } from "../../services/masters/cyber-incident/cyber-incident-status/cyber-incident-status.service";
import { CyberIncidentStatusMasterStore } from "src/app/stores/masters/cyber-incident/cyber-incident-status-store";
import { CyberIncidentCorrectiveActionStatusService } from "../../services/masters/cyber-incident/cyber-incident-corrective-action-status/cyber-incident-corrective-action-status.service";
import { CyberIncidentCorrectiveActionStatusMasterStore } from "src/app/stores/masters/cyber-incident/cyber-incident-corrective-action-status-store";
import { CyberIncidentService } from "../../services/cyber-incident/cyber-incident.service";
import { CyberIncidentStore } from "src/app/stores/cyber-incident/cyber-incident-store";




declare var $: any;

@Component({
    selector: 'app-right-sidebar-layout',
    templateUrl: './right-sidebar.layout.html',
    styleUrls: ['./right-sidebar.layout.scss']
})
export class RightSideMenuLayout implements OnInit, OnDestroy {

    statuses: any = [];

    AppStore = AppStore;
    ProcessStore = ProcessStore;
    RightSidebarLayoutStore = RightSidebarLayoutStore;
    IssueCategoryMasterStore = IssueCategoryMasterStore;
    DesignationMasterStore = DesignationMasterStore;
    DivisionStore = DivisionMasterStore;
    SubSectionStore = SubSectionMasterStore;
    IssueDomainMasterStore = IssueDomainMasterStore;
    IssueTypeMasterStore = IssueTypeMasterStore;
    DepartmentStore = DepartmentMasterStore;
    SubsidiaryStore = SubsidiaryStore;
    BranchesStore = BranchesStore;
    MsTypeMasterStore = MsTypeMasterStore;
    MsTypeVersionMasterStore = MsTypeVersionMasterStore;
    BusinessProductsStore = BusinessProductsStore;
    BusinessServiceStore = BusinessServiceStore;
    ProccessGroupStore = ProcessGroupsMasterStore;
    ProccessCategoryStore = ProcessCategoryMasterStore;
    RiskRatingStore = RiskRatingMasterStore;
    AssetRatingStore = AssetRatingsMasterStore;
    UsersStore = UsersStore;
    ControlCategoryStore = ControlCategoryMasterStore;
    ControlTypesStore = ControlTypesMasterStore;
    ControlModeStore = ControlModeMasterStore;
    ControlEfficiencyMeasuresStore = ControlEfficiencyMeasuresMasterStore;
    ControlSubCategoryStore = ControlSubcategoryMasterStore;
    LanguageSettingsStore = LanguageSettingsStore;
    RiskTypeStore = RiskTypeMasterStore;
    StakeholderTypeStore = StakeholderTypeMasterStore;
    StakeholdersStore = StakeholdersStore;
    RiskClassificationStore = RiskClassificationMasterStore;
    RiskCategoryStore = RiskCategoryMasterStore;
    RiskStatusStore = RiskStatusMasterStore;
    RiskTreatmentStatusStore = RiskTreatmentStatusesMasterStore;
    RiskControlPlanMasterStore = RiskControlPlanMasterStore;
    RiskSourceMasterStore = RiskSourceMasterStore;
    RiskStore = RisksStore;
    BcmStrategyStore = BcmStrategyStore;
    AuditItemCategoryStore = AuditItemCategoryMasterStore;
    AuditItemtypeStore = AuditItemTypeMasterStore;
    AuditReportStatusStore = AuditReportStatusMasterStore;
    AuditProgramMasterStore = AuditProgramMasterStore;
    AuditPlanStore = AuditPlanStore;
    AuditObjectiveStore = AuditObjectiveMasterStore;
    AuditCriteriaStore = AuditCriterionMasterStore;
    AuditFindingCategoryStore = AuditFindingCategoryMasterStore;
    AuditableItemStore = AuditableItemMasterStore;
    AuditStore = AuditStore;
    OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
    SectionMasterStore = SectionMasterStore;
    MeetingCategoryMasterStore = MeetingCategoryMasterStore;
    MeetingPlanStatusMasterStore = MeetingPlanStatusMasterStore;
    VenueMasterStore = VenueMasterStore;
    MeetingsStore = MeetingsStore;
    MeetingPlanStore = MeetingPlanStore;
    MeetingActionPlanStatusMasterStore = MeetingActionPlanStatusMasterStore;
    MeetingStore = MeetingsStore;
    DocumentTypeMasterStore = DocumentTypeMasterStore;
    DocumentAccessTypeMasterStore = DocumentAccessTypeMasterStore;
    DocumentStatusMasterStore = DocumentStatusMasterStore;
    DocumentsStore = DocumentsStore;
    DocumentChangeRequestTypesMasterStore = DocumentChangeRequestTypesMasterStore;
    changeRequestStore = changeRequestStore;
    FrameworksStore = FrameworksStore;
    ActionPlanStatusStore = BAActionPlanStatusStore;
    AssessmentsStore = AssessmentsStore;
    JsoObservationTypeMasterStore = JsoObservationTypeMasterStore;
    JsoObservationStore = JsoObservationStore;
    UnsafeActionCategoryMasterStore = UnsafeActionCategoryMasterStore;
    UnsafeActionSubCategoryMasterStore = UnsafeActionSubCategoryMasterStore;
    JsoUnsafeActionObservedGroupMasterStore = JsoUnsafeActionObservedGroupMasterStore;
    IncidentCategoriesMasterStore = IncidentCategoriesMasterStore;
    IncidentSubCategoryMasterStore = IncidentSubCategoryMasterStore;
    IncidentDamageTypeMasterStore = IncidentDamageTypeMasterStore;
    IncidentStatusMasterStore = IncidentStatusMasterStore;
    IncidentStore = IncidentStore;
    IncidentCorrectiveActionStatusMasterStore = IncidentCorrectiveActionStatusMasterStore;
    ComplianceTypeMasterStore = ComplianceTypeMasterStore;
    ComplianceAreaMasterStore = ComplianceAreaMasterStore;
    ComplianceSectionMasterStore = ComplianceSectionMasterStore;
    SlaCategoryMasterStore = SlaCategoryMasterStore;
    RiskDashboardStore = RiskDashboardStore;
    TrainingCategoryMasterStore = TrainingCategoryMasterStore;
    TrainingStatusMasterStore = TrainingStatusMasterStore;
    CompetencyGroupMasterStore = CompetencyGroupMasterStore;
    CompetencyMasterStore = CompetencyMasterStore;
    ExternalAuditTypesMasterStore = ExternalAuditTypesMasterStore;
    FindingMasterStore = FindingMasterStore;
    AuthStore = AuthStore;
    RootCauseCategoryStore = RootCauseCategoryMasterStore;
    RootCauseSubCategoryStore = RootCauseSubCategoryMasterStore;
    FindingImpactAnalysisCategoryStore = FindingImpactAnalysisCategoryMasterStore;
    ExternalAuditCorrectiveActionStore = ExternalAuditCorrectiveActionStore;
    AssetCategoryStore = AssetCategoryStore;
    AssetMatrixCategoriesMasterStore = AssetMatrixCategoriesMasterStore;
    AssetCalculationMethodMasterStore = AssetCalculationMethodMasterStore;
    AssetRegisterStore = AssetRegisterStore;
    AssetTypesMasterStore = AssetTypesMasterStore;
    AssetStatusMasterStore = AssetStatusStore;
    AssetSubCategoryStore = AssetSubCategoryStore;
    AssetInvestmentTypesMasterStore = AssetInvestmentTypesMasterStore;
    PhysicalConditionRankingsMasterStore = PhysicalConditionRankingsMasterStore;
    SuppliersMasterStore = SuppliersMasterStore;
    FindingCorrectiveActionStatusesMasterStore = FindingCorrectiveActionStatusesMasterStore;
    AssetMaintenanceCategoriesMasterStore = AssetMaintenanceCategoriesMasterStore;
    AssetMaintenanceTypesMasterStore = AssetMaintenanceTypesMasterStore;
    AssetMaintenanceScheduleFrequenciesMasterStore = AssetMaintenanceScheduleFrequenciesMasterStore;
    AssetMaintenanceStatusesMasterStore = AssetMaintenanceStatusesMasterStore;
    ComplianceStatusMasterStore = ComplianceStatusMasterStore;
    TestAndExerciseStatusesMasterStore = TestAndExerciseStatusesMasterStore;
    TestAndExerciseTypesMasterStore = TestAndExerciseTypesMasterStore;
    BusinessContinuityPlanStatusMasterStore = BusinessContinuityPlanStatusMasterStore;
    BcpStore = BcpStore;
    BiaTireMasterStore = BiaTireMasterStore;
    UnitMasterStore = UnitMasterStore;
    StrategyInitiativeStore = StrategyInitiativeStore;
    StrategyStore = StrategyStore;
    StrategyInitiativeActionPlanStatusMasterStore = StrategyInitiativeActionPlanStatusMasterStore;
    FocusAreaMasterStore = FocusAreaMasterStore;
    ObjectiveMasterStore = ObjectiveMasterStore;
    StrategyInitiativeActionsMasterStore = StrategyInitiativeActionsMasterStore;
    StrategyInitiativeReviewFrequencyMasterStore = StrategyInitiativeReviewFrequencyMasterStore;
    KpiCalculationTypesMasterStore = KpiCalculationTypesMasterStore;
    StrategyKpiDataTypesMasterStore = StrategyKpiDataTypesMasterStore;
    FindingStatusesMasterStore = FindingStatusesMasterStore;
    StrategyProfileStatusMasterStore = StrategyProfileStatusMasterStore;
    BusinessAssessmentStatusMasterStore = BusinessAssessmentStatusMasterStore;
    BcsStatusMasterStore = BcsStatusMasterStore;
    RegionMasterStore = RegionMasterStore;
    CountryMasterStore = CountryMasterStore;
    ExternalAuditMasterStore = ExternalAuditMasterStore;
    AuditPlanStatusesMasterStore = AuditPlanStatusesMasterStore;
    LocationMasterStore = LocationMasterStore;
    ProjectContractTypeMasterStore = ProjectContractTypeMasterStore;
    ProjectPriorityMasterStore = ProjectPriorityMasterStore;
    EventPeriodicityMasterStore = PeriodicityMasterStore;
    EventEntranceMasterStore = EntranceMasterStore;
    EventDimensionMasterStore = DimensionMasterStore;
    EventSpaceTypeMasterStore = SpaceTypeMasterStore;
    EventRangeMasterStore = RangeMasterStore;
    EventTargetAudienceMasterStore = TargetAudienceMasterStore;
    ProjectMonitoringStatusMasterStore = ProjectMonitoringStatusMasterStore;
    ProjectMonitoringStore = ProjectMonitoringStore;
    ProjectCategoryStore = ProjectCategoryMasterStore;
    ProjectTypeStore = ProjectTypeMasterStore;
    ProjectIssueStore = ProjectIssueStore;
    ProjectIssueStatusMasterStore = ProjectIssueStatusMasterStore;
    ProjectClosureStatusMasterStore = ProjectClosureStatusMasterStore;
    ProjectChangeRequestStatusMasterStore = ProjectChangeRequestStatusMasterStore;
    // *KPI Management
    KpisStore = KpisStore;
    KpiTypesMasterStore = KpiTypesMasterStore;
    KpiCategoryMasterStore = KpiCategoryMasterStore;
    KpiScoreStatusMasterStore = KpiScoreStatusMasterStore;
    KpiReviewFrequenciesStore = KpiReviewFrequenciesStore;
    KpiManagementStatusMasterStore = KpiManagementStatusMasterStore;
    KpiImprovementPlanStatusMasterStore = KpiImprovementPlanStatusMasterStore;
    // **KPI Management
    // KH and BA  Filters Starts
    DocumentCategoryMasterStore = DocumentCategoryMasterStore;
    DocumentSubCategoryMasterStore = DocumentSubCategoryMasterStore;
    DocumentSubSubCategoryMasterStore = DocumentSubSubCategoryMasterStore;
    DocumentFamilyMasterStore = DocumentFamilyMasterStore;
    // KH and BA Filters Ends
    BcsTypesMasterStore = BcsTypesMasterStore;
    EventTypeMasterStore = EventTypeMasterStore;
    EventStore = EventsStore;
    TaskPhaseStore = TaskPhaseMasterStore;
    StatusMasterStore = StatusMasterStore;
    TaskstatusMasterStore = TaskstatusMasterStore;
    EventClosureStatusMasterStore = EventClosureStatusMasterStore;
    EventChaneRequestStatusMasterStore = EventChaneRequestStatusMasterStore;
    // Audit management filter starts
    AmAuditCategoryMasterStore = AmAuditCategoryMasterStore;
    AmAuditControlSelfAssessmentStatusStore = AuditManagementControlSelfAssessmentStatusStore;
    AnnualPlanFrequencyMasterStore = AnnualPlanFrequencyMasterStore;
    AnnualPlanFrequencyItemMasterStore = AnnualPlanFrequencyItemMasterStore;
    AuditStatusesMasterStore = AuditStatusesMasterStore;
    AmAuditableItemStore = AmAuditableItemStore;
    AuditTestPlanStatusMasterStore = AuditTestPlanStatusMasterStore;
    InformationRequestStatusMasterStore = InformationRequestStatusMasterStore;
    //Customer Engagement filter starts
    CustomerTypeMasterStore = CustomerTypeMasterStore;
    CustomerCompliantStatusMasterStore = CustomerCompliantStatusMasterStore;
    CustomerComplaintSourceMasterStore = CustomerComplaintSourceMasterStore;
    CustomersStore = CustomersStore;
    CustomerComplaintInvestigationStatusMasterStore = CustomerComplaintInvestigationStatusMasterStore;
    CustomerComplaintActionTypesMasterStore = CustomerComplaintActionTypesMasterStore;
    CustomerComplaintActionPlanStatusesMasterStore = CustomerComplaintActionPlanStatusesMasterStore;
    ObjectiveScoreStore = ObjectiveScoreStore;
    MsAditFindingStatusMasterStore = MsAditFindingStatusMasterStore;
    MsAuditCategoryMasterStore = MsAuditCategoryMasterStore;
    // Mock Drill
    MockDrillPlanStore = MockDrillPlanStore;
    MockDrillTypesMasterStore = MockDrillTypesMasterStore;
    MockDrillStatusMasterStore = MockDrillStatusMasterStore;

    //Ms Audit
    MSAuditFindingCAStatusesMasterStore=MSAuditFindingCAStatusesMasterStore;
    MsAuditNonConfirmitiesStore=MsAuditNonConfirmitiesStore;
    AuditNonConfirmityStore=AuditNonConfirmityStore;
    MsAuditModesMasterStore = MsAuditModesMasterStore;
    MsAditPlanStatusMasterStore = MsAditPlanStatusMasterStore;
    MsAuditProgramsStore = MsAuditProgramsStore;
    MsAuditStatusesMasterStore = MsAuditStatusesMasterStore;
    MsAuditPlansStore = MsAuditPlansStore;
    MsAuditFindingCategoryMasterStore = MsAuditFindingCategoryMasterStore;
    MsAuditScheduleStatusMasterStore = MsAuditScheduleStatusMasterStore;
    MsAuditStore = MsAuditStore

    //Cyber Incident
    CyberIncidentClassificationMasterStore = CyberIncidentClassificationMasterStore;
    CyberIncidentStatusMasterStore = CyberIncidentStatusMasterStore;
    CyberIncidentCorrectiveActionStatusMasterStore = CyberIncidentCorrectiveActionStatusMasterStore;
    CyberIncidentStore = CyberIncidentStore;

    riskRatingScores = [];
    years = [];
    months = [
        { title: 'Jan', id: 1 },
        { title: 'Feb', id: 2 },
        { title: 'Mar', id: 3 },
        { title: 'Apr', id: 4 },
        { title: 'May', id: 5 },
        { title: 'Jun', id: 6 },
        { title: 'Jul', id: 7 },
        { title: 'Aug', id: 8 },
        { title: 'Sep', id: 9 },
        { title: 'Oct', id: 10 },
        { title: 'Nov', id: 11 },
        { title: 'Dec', id: 12 }
    ];
    quarters = [
        { title: 'Q1', id: 1, months: [1, 2, 3] },
        { title: 'Q2', id: 2, months: [4, 5, 6] },
        { title: 'Q3', id: 3, months: [7, 8, 9] },
        { title: 'Q4', id: 4, months: [10, 11, 12] }
    ];

    status_default = [
        { title: 'Active', id: 'active', },
        { title: 'Inactive', id: 'inactive', },
    ];

    licenseStatus = [
        { title: 'Active', id: 'active', },
        { title: 'Passive', id: 'passive', },
    ];

    activePassiveStatus = [
        { title: 'Active', id: 1, },
        { title: 'Passive', id: 0, },
    ]

    issue_category_ng_model: any[] = [];
    issue_domain_ng_model: any[] = [];
    department_ng_model: any[] = [];
    ms_types_ng_model: any[] = [];
    ms_types_audit_program_ng_model:any[]=[];
    ms_type_version_ng_model: any[] = [];
    service_category_ng_modal: any[] = [];
    product_category_ng_modal: any[] = []
    accountable_ng_modal: any[] = [];
    process_group_ng_modal: any[] = [];
    proccess_category_ng_modal: any[] = [];
    informed_user_ng_modal: any[] = [];
    hc_employee_ng_modal: any[] = [];
    hc_performed_by_ng_modal: any[] = [];
    test_and_exercise_lead_user_ng_modal: any[] = [];
    kpi_owner_ng_modal: any[] = [];
    asset_owner_ng_modal: any[] = [];
    responsible_user_ng_modal: any[] = [];
    risk_responsible_user_ng_modal: any[] = [];
    event_owner_ng_modal: any[] = [];
    consulted_user_ng_modal: any[] = [];
    control_type_ng_modal: any[] = [];
    control_mode_ng_modal: any[] = [];
    control_efficiency_measure_ng_modal: any[] = [];
    control_category_ng_modal: any[] = [];
    control_sub_category_ng_modal: any[] = [];
    designation_ng_modal: any[] = [];
    reporting_user_ng_modal: any[] = [];
    language_ng_modal: any[] = [];
    risk_types_ng_modal: any[] = [];
    stakeholder_ng_modal: any[] = [];
    risk_classification_ng_modal: any[] = [];
    risk_category_ng_modal: any[] = [];
    risk_status_ng_modal: any[] = [];
    risk_source_ng_modal: any[] = [];
    customer_complaint_type_ng_modal: any[] = [];
    customer_complaint_source_ng_modal: any[] = [];
    customer_complaint_status_ng_modal: any[] = [];
    customer_investigation_status_ng_modal: any[] = [];
    customer_complaint_action_type_ng_modal: any[] = [];
    customer_complaint_action_status_ng_modal: any[] = [];
    customer_ng_modal: any[] = [];
    risk_control_plan_ng_modal: any[] = [];
    risk_owner_ng_modal: any[] = [];
    subsidiary_ng_modal: any[] = [];
    division_ng_modal: any[] = [];
    risk_treatment_status_ng_modal: any[] = [];
    risk_ng_modal: any[] = [];
    auditable_category_ng_modal: any[] = [];
    auditable_item_ng_modal: any[] = [];
    audit_program_status_ng_modal: any[] = [];
    audit_program_ng_modal: any[] = [];
    audit_leader_ng_modal: any[] = [];
    audit_plan_ng_modal: any[] = [];
    audit_object_ng_modal: any[] = [];
    audit_criteria_ng_modal: any[] = [];
    finding_category_ng_model: any[] = [];
    auditable_itemz_ng_model: any[] = [];
    audit_item_ng_model: any[] = [];
    sub_section_ng_modal: any[] = [];
    section_ng_modal: any[] = [];
    meeting_category_ng_modal: any[] = [];
    meeting_plan_ng_modal: any[] = [];
    meeting_status_ng_modal: any[] = [];
    venue_ng_modal: any[] = [];
    orgaizer_ng_modal: any[] = [];
    meeting_plan_item_modal: any[] = [];
    meeting_action_plan_status_modal: any[] = [];
    meeting_plan_title_modal: any[] = [];
    document_type_modal: any[] = [];
    document_access_modal: any[] = [];
    document_satus_modal: any[] = [];
    document_title_modal: any[] = [];
    document_user_ng_modal: any[] = [];
    inherent_risk_score_ng_modal: any[] = [];
    bcm_strategy_solution_score_modal: any[] = [];
    residual_risk_rating_ng_modal: any[] = [];
    inherent_risk_rating_ng_modal: any[] = [];
    residual_risk_score_ng_modal: any[] = [];
    document_change_request_type_modal: any[] = [];
    document_request_satus_modal: any[] = [];
    document_request_user_ng_modal: any[] = [];
    business_assessment_framework_modal: any[] = [];
    business_assessment_action_plan_status_modal: any[] = [];
    business_assessment_modal: any[] = [];
    business_assessment_status_modal: any[] = [];
    jso_observation_status_modal: any[] = [];
    unsafe_action_category_modal: any[] = [];
    unsafe_action_sub_category_modal: any[] = [];
    unsafe_action_observed_group_modal: any[] = [];
    incidente_category_modal: any[] = [];
    incidente_sub_category_modal: any[] = [];
    incidente_damage_type_modal: any[] = [];
    incidente_status_modal: any[] = [];
    incident_title_modal: any[] = [];
    incident_corrective_action_status_modal: any[] = [];
    project_issue_corrective_action_status_modal: any[] = [];
    compliance_document_type_modal: any[] = [];
    compliance_document_area_modal: any[] = [];
    compliance_document_section_modal: any[] = [];
    compliance_status_modal: any[] = [];
    region_modal: any[] = [];
    country_modal: any[] = [];
    sla_category_modal: any[] = [];
    training_category_modal: any[] = [];
    training_status_modal: any[] = [];
    training_competency_group_modal: any[] = [];
    training_competency_modal: any[] = [];
    finding_status_modal: any[] = [];
    ea_type_modal: any[] = [];
    audit_report_status_modal: any[] = [];
    ea_finding_modal: any[] = [];
    ea_root_cause_category_modal: any[] = [];
    ea_root_cause_sub_category_modal: any[] = [];
    ea_impact_analysis_category_modal: any[] = [];
    ea_finding_corrective_action_status_modal: any[] = [];
    ea_modal: any[] = [];
    audit_plan_status_modal: any[] = [];
    external_audit_modal: any[] = [];
    asset_category_modal: any[] = [];
    asset_matrix_category_modal: any[] = [];
    asset_calculation_method_modal: any[] = [];
    asset_modal: any[] = [];
    asset_type_modal: any[] = [];
    asset_status_modal: any[] = [];
    asset_sub_category_modal: any[] = [];
    asset_investment_type_modal: any[] = [];
    asset_physical_condition_ranking_modal: any[] = [];
    asset_custodian_modal: any[] = [];
    asset_supplier_modal: any[] = [];
    process_modal: any[] = [];
    asset_maintenance_category_modal: any[] = [];
    asset_maintenance_type_modal: any[] = [];
    asset_maintenance_schedule_frequency_modal: any[] = [];
    asset_maintenance_status_modal: any[] = [];
    //*KPI Management
    kpi_management_status_modal: any[] = [];
    kpis_modal: any[] = [];
    kpis_score_status_modal: any[] = [];
    kpi_improvement_plnas_status_modal: any[] = [];
    kpi_category_modal: any[] = [];
    kpi_category_id_modal: any[] = [];
    kpi_type_modal: any[] = [];
    kpi_type_id_modal: any[] = [];
    kpi_management_kpi_review_frequency_modal: any[] = [];
    kpi_review_frequency_modal: any[] = [];
    //**KPI Management
    test_and_exercise_status_modal: any[] = [];
    role_modal: any[] = [];
    test_and_exercise_type_modal: any[] = [];
    bcp_status_modal: any[] = [];
    bcm_modal: any[] = [];
    bia_tier_modal: any[] = [];
    bcs_status_modal: any[] = [];
    bcm_status_type_modal: any[] = [];
    target_unit_modal: any[] = [];
    strategy_initiative_modal: any[] = [];
    strategy_profile_modal: any[] = [];
    strategy_initiative_action_plan_status_modal: any[] = [];
    strategy_profile_focus_area_modal: any[] = [];
    strategy_profile_objective_modal: any[] = [];
    kpi_scoreboard_objective_modal: any[] = [];
    kpi_scoreboard_focus_area_modal: any[] = [];
    strategy_initiative_action_modal: any[] = [];
    strategy_review_frequency_modal: any[] = [];
    kpi_calculation_type_modal: any[] = [];
    strategy_kpi_data_type_modal: any[] = [];
    strategy_initiative_milestone_modal: any[] = [];
    strategy_profile_status_modal: any[] = [];
    target_date_model = null;
    start_date_model = null;
    end_date_model = null;
    date_model = null;
    expiry_date_model = null;
    reactionDisposer: IReactionDisposer;
    ngModalChangeSubscription: any;
    project_location_modal: any[] = [];
    project_contract_type_modal: any[] = [];
    project_manager_modal: any[] = [];
    am_audit_manager_modal: any[] = [];
    am_audit_requested_by_modal: any[] = [];
    ms_audit_leader_modal: any[] = [];
    non_confirmity_status_modal: any[] = [];
    ms_audit_category_modal: any[] = [];
    project_priority_modal: any[] = []
    project_monitoring_status_modal: any[] = []
    project_modal: any[] = [];
    parent_project_modal: any[] = [];
    project_type_modal: any[] = [];
    project_category_modal: any[] = [];
    project_issue_modal: any[] = [];
    project_issue_status_modal: any[] = [];
    project_monitor_closure_status_modal: any[] = [];
    project_change_request_statu_modal: any[] = [];
    issue_types_ng_modal: any[] = [];
    document_category_modal: any[] = [];
    document_sub_category_modal: any[] = [];
    document_sub_sub_category_modal: any[] = [];
    document_family_modal: any[] = [];
    event_location_modal: any[] = [];
    event_type_modal: any[] = [];
    task_phase_modal: any[] = [];
    event_modal: any[] = [];
    event_priority_modal = [];
    event_periodicity_modal = [];
    event_entrance_modal = [];
    event_range_modal = [];
    event_dimension_modal = [];
    event_space_type_modal = [];
    event_target_audience_modal = [];
    event_status_modal = [];
    event_task_status_modal = [];
    event_closure_status_modal = [];
    event_change_request_status_modal = [];
    am_audit_category_modal: any[] = [];
    am_audit_control_self_assesement_status_modal: any[] = [];
    am_anual_plan_frequency_modal: any[] = [];
    am_anual_plan_frequency_item_modal: any[] = [];
    am_audit_status_modal: any[] = [];
    am_audit_test_plan_status_modal: any[] = [];
    am_audit_info_request_status_modal: any[] = [];
    am_annual_plan_auditable_item_modal: any[] = [];
    ms_audit_finding_ca_status_ng_modal: any[] = [];
    ms_audit_finding_ng_modal: any[] = [];
    ms_audit_mode_ng_modal: any[] = [];
    ms_audit_plan_status_modal:any[]=[];
    ms_audit_program_modal:any[]=[];
    ms_audit_status_modal:any[]=[];
    ms_audit_plan_modal:any[]=[];
    ms_audit_finding_category_modal:any[]=[];
    ms_audit_schedule_status_modal:any[]=[];
    audit_team_leader_modal: any[] = [];
    audit_team_user_modal:any[]=[];
    auditor_user_modal:any[]=[];
    status_modal: any[] = [];
    ms_audit_modal:any[]=[];
    scores = [{ title: '1', value: 1, id: 1 },
    { title: '2', value: 2, id: 2 },
    { title: '3', value: 3, id: 3 },
    { title: '4', value: 4, id: 4 },
    { title: '5', value: 5, id: 5 }];
    clickedScore: any;
    filterSubscription: any;
    // MOck Drill
    mock_drill_plan_ng_modal: any[] = [];
    mock_drill_type_ng_modal: any[] = [];
    mock_drill_status_ng_modal: any[] = [];
    mock_drill_controller_ng_modal: any[] = [];
    incident_classification_modal:any[]=[];
    cyber_incident_status_modal:any[]=[];
    cyber_incident_modal:any[]=[];
    cyber_incident_corrective_action_status_modal:any[]=[];
    constructor(
        private _rightSidebarFilterService: RightSidebarFilterService,
        private _utilityService: UtilityService,
        private _cdr: ChangeDetectorRef,
        private _issueCategoryService: IssueCategoryService,
        private _designationService: DesignationService,
        private _divisionService: DivisionService,
        private _subSectionService: SubSectionService,
        private _processService: ProcessService,
        private _issueDomainService: IssueDomainService,
        private _issueTypeService: IssueTypeService,
        private _departmentService: DepartmentService,
        private _subsidiaryService: SubsidiaryService,
        private _branchService: BranchService,
        private _msTypeService: MsTypeService,
        private _msTypeVersionService: MsTypeVersionService,
        private _businessService: BusinessServicesService,
        private _productsService: OrganizationproductsService,
        private _processGroupService: ProcessGroupsService,
        private _processCategoryService: ProcessCategoriesService,
        private _usersService: UsersService,
        private _helperService: HelperServiceService,
        private _bpmFileService: BpmFileService,
        private _imageService: ImageServiceService,
        private _controlCategService: ControlCategoryService,
        private _controlTypesService: ControlTypesService,
        private _controlModeService: ControlModeService,
        private _controlEfficiencyMeasureService: ControlEfficiencyMeasuresService,
        private _controlSubCatService: ControlSubcategoryService,
        private _languageService: LanguageService,
        private _riskTypesService: RiskTypeService,
        private _stakeholderService: StakeholderService,
        private _riskClassificationService: RiskClassificationService,
        private _riskCategoryService: RiskCategoryService,
        private _riskStatusService: RiskStatusService,
        private _riskTreatmentStatusService: RiskTreatmentStatusesService,
        private _riskRatingService: RiskRatingService,
        private _assetRatingService: AssetRatingsService,
        private _riskService: RisksService,
        private _riskSourceService: RiskSourceService,
        private _riskControlPlanService: RiskControlPlanService,
        private _auditableItemTypesService: AuditableItemTypeService,
        private _auditableItemCategoryService: AuditableItemCategoryService,
        private _auditReportStatusService: AuditReportStatusesService,
        private _auditProgranService: AuditProgramService,
        private _auditPlanService: AuditPlanService,
        private _auditObjectiveService: AuditObjectiveService,
        private _auditCriteriaService: AuditCriterionService,
        private _auditFindingCategoryService: AuditFindingCategoriesService,
        private _auditableItemService: AuditableItemService,
        private _auditService: AuditService,
        private _stakeholderTypeService: StakeholderTypeService,
        private _sectionService: SectionService,
        private _meetingCategoryService: MeetingCategoryService,
        private _meetingStatusService: MeetingPlanStatusService,
        private _venueService: VenueService,
        private _meetingPlanService: MeetingPlanService,
        private _actionPlanStatusService: MeetingActionPlanStatusService,
        private _meetingService: MeetingsService,
        private _documentTypesService: DocumentTypesService,
        private _documentAccessTypeService: DocumentAccessTypeService,
        private _documentStatusService: DocumentStatusService,
        private _documentsService: DocumentsService,
        private _documentChangeRequestTypeService: DocumentChangeRequestTypeService,
        private _frameworksService: FrameworksService,
        private _BaActionPlanStatusService: BaActionPlanStatusService,
        private _assessmentsService: AssessmentsService,
        private _jsoObservationTypeService: JsoObservationTypeService,
        private _unsafeActionCategoryService: UnsafeActionCategoryService,
        private _UnsafeActionSubCategoryService: UnsafeActionSubCategoryService,
        private _jsoUnsafeActionObservedGroupService: UnsafeActionObservedGroupService,
        private _incidentCategoriesService: IncidentCategoriesService,
        private _incidentSubCategoryService: IncidentSubCategoryService,
        private _incidentDamageTypesService: IncidentDamageTypeService,
        private _incidentStatusService: IncidentStatusService,
        private _incidentService: IncidentService,
        private _incidentCorrectiveActionStatus: IncidentCorrectiveActionStatusService,
        private _complianceTypeService: ComplianceTypeService,
        private _complianceAreaService: ComplianceAreaService,
        private _complianceSectionService: ComplianceSectionService,
        private _slaCategoryService: SlaCategoryService,
        private _trainingCategoryService: TrainingCategoryService,
        private _trainingStatusService: TrainingStatusService,
        private _competencyGroupService: CompetencyGroupService,
        private _competencyService: CompetencyService,
        private _externalAuditTypesService: ExternalAuditTypesService,
        private _findingsService: FindingsService,
        private _rootCauseCategoryService: RootCauseCategoriesService,
        private _rootCauseSubCategoryService: RootCauseSubCategoriesService,
        private _findingImpactAnalysisService: FindingImpactAnalysisCategoryService,
        private _assetCategoryService: AssetCategoryService,
        private _assetMatrixCategoryService: AssetMatrixCategoriesService,
        private _assetCalculationMethodService: AssetCalculationMethodService,
        private _assetRegisterService: AssetRegisterService,
        private _assetTypesService: AssetTypesService,
        private _assetStatusService: AssetStatusService,
        private _assetSubCategoryService: AssetSubCategoryService,
        private _assetInvestmentTypesService: AssetInvestmentTypesService,
        private _physicalConditionRankingsService: PhysicalConditionRankingsService,
        private _suppliersService: SuppliersService,
        private _findingCorrectiveActionStatusesService: FindingCorrectiveActionStatusesService,
        private _assetMaintenanceCategoriesService: AssetMaintenanceCategoriesService,
        private _assetMaintenanceTypesService: AssetMaintenanceTypesService,
        private _assetMaintenanceScheduleFrequenciesService: AssetMaintenanceScheduleFrequenciesService,
        private _assetMaintenanceStatusesService: AssetMaintenanceStatusesService,
        private _kpiManagementStatusService: KpiManagementStatusService,//KPI Management
        private _kpiTypesService: KpiTypesService,//KPI Management
        private _kpisService: KpisService,//KPI Management
        private _kpiCategoryService: KpiCategoryService,//KPI Management
        private _kpiReviewFrequenciesService: KpiReviewFrequenciesService,//Master
        private _kpiScoreStatusesService: KpiScoreStatusesService,//KPI Management
        private _kpiImprovementPlanStatuesService: KpiImprovementPlanStatuesService,//KPI Management
        private _complianceStatusService: ComplianceStatusService,
        private _testExcerciseStatusService: TestAndExerciseStatusesService,
        private _testAndExerciseTypes: TestAndExerciseTypesService,
        private _businessContinuityPlanStatusService: BusinessContinuityPlanStatusService,
        private _biaTierService: BiaTireService,
        private _bcpService: BcpService,
        private _unitService: UnitService,
        private _intiativeService: InitiativeService,
        private _profileService : StrategyService,
        private _strategyInitiativeActionPlanStatusService: StrategyInitiativeActionPlanStatusService,
        private _focusAreaService: FocusAreaService,
        private _objectivesService: ObjectiveService,
        private _strategyInitiativeActionService: StrategyInitiativeActionsService,
        private _strategyInitiativeReviewFrequencyService: StrategyInitiativeReviewFrequencyService,
        private _kpiCalculationTypesService: KpiCalculationTypesService,
        private _strategyKpiDataTypesService: StrategyKpiDataTypesService,
        private _findingStatusesService: FindingStatusesService,
        private _strategyProfileStatusService: StrategyProfileStatusService,
        private _businessAssessmentStatusService: BusinessAssessmentStatusService,
        private _bcsStatusService: BcsStatusService,
        private _regionService: RegionService,
        private _countryService: CountryService,
        private _externalAuditService: ExternalAuditService,
        private _auditPlanStatusesService: AuditPlanStatusesService,
        private _locationService: LocationService,
        private _projectContractTypeService: ProjectContractTypeService,
        private _projectPriorityService: ProjectPriorityService,
        private _eventPeriodicityService: PeriodicityService,
        private _eventEntranceService: EntranceService,
        private _eventRangeService: RangeService,
        private _eventDimensionService: DimensionService,
        private _eventSpaceTypeService: SpaceTypeService,
        private _eventTargetAudienceService: TargetAudienceService,
        private _projectMonitoringStatusService: ProjectMonitoringStatusService,
        private _projectService: ProjectMonitoringService,
        private _projectCategoryService: ProjectCategoryService,
        private _projectTypeService: ProjectTypeService,
        private _projectIssueService: ProjectIssueService,
        private _projectIssueStatusService: ProjectIssueStatusService,
        private _projectClosureStatusService: ProjectClosureStatusService,
        private _projectChangeRequestStatusService: ProjectChangeRequestStatusService,
        private _bcsTypes: BcsTypeService,
        private _documentFamilyService: DocumentFamilyService,
        private _documentCategoryService: DocumentCategoryService,
        private _documentSubCategoryService: DocumentSubCategoriesService,
        private _documentSubSubCategoryService: DocumentSubSubCategoriesService,
        private _eventTypeService: EventTypeService,
        private _eventService: EventsService,
        private _statusService: StatusService,
        private _taskPhaseService: TaskPhaseService,
        private _taskstatusService: TaskStatusService,
        private _eventClosureStatusService: EventClosureStatusService,
        private _eventChangeRequestStatusService: EventChangeRequestStatusService,
        private _auditCategoryService: AmAuditCategoryService,
        private _auditControlSelfAssesementStatusService: AmAuditControlSelfAssessmentStatusService,
        private _annualPlanFrequencyService: AnnualPlanFrequencyService,
        private _annualPlanFrequencyItemService: AnnualAuditPlanFrequencyItemService,
        private _auditStatusesService: AuditStatusesService,
        private _amAuditableItemService: AmAuditableItemService,
        private _auditTestPlanStatusService: AuditTestPalnStatusService,
        private _informationRequestStatusesService: InformationRequestStatusesService,
        private _customerCompliantTypeService: CustomerCompliantTypeService,
        private _customerComplaintSourceService: CustomerComplaintSourceService,
        private _customerCompliantStatusService: CustomerCompliantStatusService,
        private _customerComplaintInvestigationStatusService: CustomerComplaintInvestigationStatusService,
        private _customerComplaintActionTypesService: CustomerComplaintActionTypesService,
        private _customerComplaintActionPlanStatusesService: CustomerComplaintActionPlanStatusesService,
        private _customersService: CustomersService,
        private _service: StrategyService,
        private _objectiveScoreService: ObjectiveScoreService,
        private _msAuditFindingStatusService: MsAuditFindingStatusService,
        private _msAuditCategoryService: MsAuditCategoryService,
        private _mockDrillPlanService: MockDrillPlanService,
        private _mockDrillTypeService: MockDrillTypesService,
        private _mockDrillStatusService: MockDrillStatusService,
        private _msAuditFindingCaStatusesService: MsAuditFindingCaStatusesService,
        private _auditNonConfirmityService : AuditNonConfirmityService,
        private _msAuditModesService: MsAuditModesService,
        private _msAuditPlanStatusService: MsAuditPlanStatusService,
        private _msAuditProgramsService: MsAuditProgramsService,
        private _msAuditStatusesService: MsAuditStatusesService,
        private _msAuditPlansService: MsAuditPlansService,
        private _msAuditFindingCategoriesService: MsAuditFindingCategoriesService,
        private _msAuditScheduleStatusesService: MsAuditScheduleStatusesService,
        private _msAuditService: MsAuditService,
        private _cyberIncidentClassificationService: CyberIncidentClassificationService,
        private _cyberIncidentStatusService: CyberIncidentStatusService,
        private _cyberIncidentService: CyberIncidentService,
        private _cyberIncidentCorrectiveActionStatusService: CyberIncidentCorrectiveActionStatusService
    ) { }


    /**
     * @description
     * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
     * Add 'implements OnInit' to the class.
     *
     * @memberof RightSideMenuLayout
     */
    ngOnInit() {
        this.ngModalChangeSubscription = this._rightSidebarFilterService.ngmodalChangeEmitter.subscribe(res => {
            this.processNgModalValues(res);
        })

        this.filterSubscription = this._rightSidebarFilterService.getFilterEnableMessage().subscribe(message => {
            if (message?.value) {
                const filtersForCurrentPage: string[] = RightSidebarLayoutStore.filtersForCurrentPage
                this.checkAndSetFilters(filtersForCurrentPage);
                this.getUsers();
                this.getRisks();
                this.setYears();
            }
        });

        // this.reactionDisposer = autorun(() => {



        // });

    }

    checkAndSetFilters(filtersForCurrentPage: string[]) {
        let index = filtersForCurrentPage.findIndex(e => e == 'issue_category_ids');
        if ((index >= 0)) this._issueCategoryService.getAllItems().subscribe();
        this.issue_category_ng_model = RightSidebarLayoutStore.getSelectedFilterValuesFor('issue_category_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'role');
        let indexDesignation = filtersForCurrentPage.findIndex(e => e == 'designation');
        if (((index >= 0) || (indexDesignation >= 0))) this._designationService.getItemsWithoutFilter().subscribe();

        // index = filtersForCurrentPage.findIndex(e => e == 'sub_section_ids');
        // if ((index >= 0) && this.section_ng_modal && AuthStore.getActivityPermission(100,'SUB_SECTION_LIST')) this._subSectionService.getItems(false, 
        // '&section_ids='+this._helperService.createParameterFromArray(this.section_ng_modal)).subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'division_ids');
        if ((index >= 0) && this.subsidiary_ng_modal) this._divisionService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'risk_treatment_status_ids');
        if ((index >= 0)) this._riskTreatmentStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'risk_ids');
        if ((index >= 0)) this._riskService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'auditable_item_category_ids');
        if ((index >= 0)) this._auditableItemCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'auditable_item_type_ids');
        if ((index >= 0)) this._auditableItemTypesService.getAllItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'audit_program_status_ids');
        if ((index >= 0)) this._auditReportStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'audit_program_ids');
        if ((index >= 0)) this._auditProgranService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'audit_plan_ids');
        if ((index >= 0)) this._auditPlanService.getAllItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'audit_objective_ids');
        if ((index >= 0)) this._auditObjectiveService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'audit_criteria_ids');
        if ((index >= 0)) this._auditCriteriaService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'finding_category_ids');
        if ((index >= 0)) this._auditFindingCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'auditable_item_ids');
        if ((index >= 0)) this._auditableItemService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'audit_ids');
        if ((index >= 0)) this._auditService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'meeting_category_ids');
        if ((index >= 0)) this._meetingCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'meeting_plan_status_ids');
        if ((index >= 0)) this._meetingStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'meeting_status_ids');
        if ((index >= 0)) this._meetingStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'venue_ids');
        if ((index >= 0)) this._venueService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'meeting_plan_ids');
        if ((index >= 0)) this._meetingPlanService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'meeting_action_plan_status_ids');
        if ((index >= 0)) this._actionPlanStatusService.getAllItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'meeting_ids');
        if ((index >= 0)) this._meetingService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'document_type_ids');
        if ((index >= 0)) this._documentTypesService.getAllItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'document_access_type_ids');
        if ((index >= 0)) this._documentAccessTypeService.getAllItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'document_status_ids');
        if ((index >= 0)) {
            this._documentStatusService.getItems().subscribe(res =>{
                for (let i of res['data']) {
                    if (i.type == 'archived' || i.type == 'expired' || i.type == 'published' || i.type == 'approved'
                    || i.type == 'rejected' || i.type == 'reverted' || i.type == 'in-review' || i.type == 'draft') {
                      this.statuses.push(i);
                    }
                  }
                this._utilityService.detectChanges(this._cdr);
            });
        } 

        index = filtersForCurrentPage.findIndex(e => e == 'inherent_risk_score');
        if ((index >= 0)) this.processRiskRatingScores();

        index = filtersForCurrentPage.findIndex(e => e == 'solution_scores');
        if ((index >= 0)) this.scores;

        index = filtersForCurrentPage.findIndex(e => e == 'document_change_request_status_ids');
        if ((index >= 0)) this._documentStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'business_assessment_framework_ids');
        if ((index >= 0)) this._frameworksService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'business_assessment_action_plan_status_ids');
        if ((index >= 0)) this._BaActionPlanStatusService.getAllItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'business_assessment_ids');
        if ((index >= 0)) this._assessmentsService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'business_assessment_status_ids');
        if ((index >= 0)) this._businessAssessmentStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'jso_observation_type_ids');
        if ((index >= 0)) this._jsoObservationTypeService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'unsafe_action_category_ids');
        if ((index >= 0)) this._unsafeActionCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'unsafe_action_sub_category_ids');
        if ((index >= 0)) this._UnsafeActionSubCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'unsafe_action_observed_group_ids');
        if ((index >= 0)) this._jsoUnsafeActionObservedGroupService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'incident_category_ids');
        if ((index >= 0)) this._incidentCategoriesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'incident_sub_category_ids');
        if ((index >= 0)) this._incidentSubCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'incident_damage_type_ids');
        if ((index >= 0)) this._incidentDamageTypesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'incident_status_ids');
        if ((index >= 0)) this._incidentStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'incident_ids');
        if ((index >= 0)) this._incidentService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'incident_corrective_action_status_ids');
        if ((index >= 0)) this._incidentCorrectiveActionStatus.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'project_issue_corrective_action_status_ids');
        if ((index >= 0)) this._incidentCorrectiveActionStatus.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'document_compliance_document_type_ids');
        if ((index >= 0)) this._complianceTypeService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'document_compliance_area_ids');
        if ((index >= 0)) this._complianceAreaService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'document_compliance_section_ids');
        if ((index >= 0)) this._complianceSectionService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'compliance_status_ids');
        if ((index >= 0)) this._complianceStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'region_ids');
        if ((index >= 0)) this._regionService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'country_ids');
        if ((index >= 0)) this._countryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'sla_category_ids');
        if ((index >= 0)) this._slaCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'training_category_ids');
        if ((index >= 0)) this._trainingCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'training_status_ids');
        if ((index >= 0)) this._trainingStatusService.getItems(false, '&training_dashboard_status=true', false).subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'training_competency_group_ids');
        if ((index >= 0)) this._competencyGroupService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'training_competency_ids');
        if ((index >= 0)) this._competencyService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'finding_status_ids');
        if ((index >= 0)) this._findingStatusesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'external_audit_type_ids');
        if ((index >= 0)) this._externalAuditTypesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'audit_report_status_ids');
        if ((index >= 0)) this._auditReportStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'finding_ids');
        if ((index >= 0)) this._findingsService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'root_cause_category_ids');
        if ((index >= 0)) this._rootCauseCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'root_cause_sub_category_ids');
        if ((index >= 0)) this._rootCauseSubCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'impact_analysis_category_ids');
        if ((index >= 0)) this._findingImpactAnalysisService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'finding_corrective_action_status_ids');
        if ((index >= 0)) this._findingCorrectiveActionStatusesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'external_audit_ids');
        if ((index >= 0)) this._externalAuditService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'audit_plan_status_ids');
        if ((index >= 0)) this._auditPlanStatusesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'asset_category_ids');
        if ((index >= 0)) this._assetCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'asset_matrix_category_ids');
        if ((index >= 0)) this._assetMatrixCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'asset_calculation_method_ids');
        if ((index >= 0)) this._assetCalculationMethodService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'asset_ids');
        if ((index >= 0)) this._assetRegisterService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'asset_type_ids');
        if ((index >= 0)) this._assetTypesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'asset_status_ids');
        if ((index >= 0)) this._assetStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'asset_sub_category_ids');
        if ((index >= 0)) this._assetSubCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'asset_investment_type_ids');
        if ((index >= 0)) this._assetInvestmentTypesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'physical_condition_ranking_ids');
        if ((index >= 0)) this._physicalConditionRankingsService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'custodian_ids');
        if ((index >= 0)) this._designationService.getItemsWithoutFilter().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'supplier_ids');
        if ((index >= 0)) this._suppliersService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'process_ids');
        if ((index >= 0)) this._processService.getAllItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'asset_maintenance_category_ids');
        if ((index >= 0)) this._assetMaintenanceCategoriesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'asset_maintenance_type_ids');
        if ((index >= 0)) this._assetMaintenanceTypesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'asset_maintenance_schedule_frequency_ids');
        if ((index >= 0)) this._assetMaintenanceScheduleFrequenciesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'asset_maintenance_status_ids');
        if ((index >= 0)) this._assetMaintenanceStatusesService.getItems().subscribe();
        // *KPI Management
        index = filtersForCurrentPage.findIndex(e => e == 'kpi_management_status_ids');
        if ((index >= 0)) this._kpiManagementStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'kpi_type');
        if ((index >= 0)) this._kpiTypesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'kpi_type_ids');
        if ((index >= 0)) this._kpiTypesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'kpi_category');
        if ((index >= 0)) this._kpiCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'kpi_category_ids');
        if ((index >= 0)) this._kpiCategoryService.getItems().subscribe();
        //kpi score
        index = filtersForCurrentPage.findIndex(e => e == 'kpi_management_kpi_ids');
        if ((index >= 0)) this._kpisService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'kpi_management_kpi_score_status_ids');
        if ((index >= 0)) this._kpiScoreStatusesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'kpi_management_kpi_improvement_plan_status_ids');
        if ((index >= 0)) this._kpiImprovementPlanStatuesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'kpi_review_frequency');
        if ((index >= 0)) this._kpiReviewFrequenciesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'review_frequency_ids');
        if ((index >= 0)) this._kpiReviewFrequenciesService.getItems().subscribe();
        // **KPI Management
        index = filtersForCurrentPage.findIndex(e => e == 'test_and_exercise_status_ids');
        if ((index >= 0)) this._testExcerciseStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'role_ids');
        if ((index >= 0)) this._usersService.getRoles().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'test_and_exercise_type_ids');
        if ((index >= 0)) this._testAndExerciseTypes.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'bcp_status_ids');
        if ((index >= 0)) this._businessContinuityPlanStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'bia_tire_ids');
        if ((index >= 0)) this._biaTierService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'bcm_ids');
        if ((index >= 0)) this._bcpService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'bcs_status_ids');
        if ((index >= 0)) this._bcsStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'business_continuity_strategy_type_ids');
        if ((index >= 0)) this._bcsTypes.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'target_unit_ids');
        if ((index >= 0)) this._unitService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'strategy_initiative_ids');
        if ((index >= 0)) this._intiativeService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'strategy_profile_ids');
        if ((index >= 0)) this._profileService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'strategy_initiative_action_plan_status_ids');
        if ((index >= 0)) this._strategyInitiativeActionPlanStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'strategy_profile_focus_area_ids');
        if ((index >= 0)) this._focusAreaService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'strategy_profile_objective_ids');
        if ((index >= 0)) this._objectivesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'strategy_kpi_scoreboard_focus_area_ids');
        if ((index >= 0)) this._service.focusAreaListForFilter().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'strategy_kpi_scoreboard_objective_ids');
        if ((index >= 0)) this._objectiveScoreService.getItems(true, '?strategy_profile_ids=' + StrategyStore.strategyProfileId).subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'strategy_initiative_action_ids');
        if ((index >= 0)) this._strategyInitiativeActionService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'strategy_review_frequency_ids');
        if ((index >= 0)) this._strategyInitiativeReviewFrequencyService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'kpi_calculation_type_ids');
        if ((index >= 0)) this._kpiCalculationTypesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'strategy_kpi_data_type_ids');
        if ((index >= 0)) this._strategyKpiDataTypesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'strategy_initiative_milestone_ids');
        if ((index >= 0)) this._intiativeService.getMilestons().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'strategy_profile_status_ids');
        if ((index >= 0)) this._strategyProfileStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'residual_risk_score');
        if ((index >= 0)) this.processRiskRatingScores();

        index = filtersForCurrentPage.findIndex(e => e == 'document_change_request_type_ids');
        if ((index >= 0)) this._documentChangeRequestTypeService.getAllItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'residual_risk_rating_ids');
        if ((index >= 0)) this._riskRatingService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'inherent_risk_rating_ids');
        if ((index >= 0)) this._riskRatingService.getItems().subscribe();

        // index = filtersForCurrentPage.findIndex(e => e == 'document_ids');
        // if ((index >= 0)) this._documentsService.getAllItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'sub_section_ids');
        if ((index >= 0) && this.section_ng_modal && AuthStore.getActivityPermission(100, 'SUB_SECTION_LIST')) this._subSectionService.getItems(false,
            '&section_ids=' + this._helperService.createParameterFromArray(this.section_ng_modal)).subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'section_ids');
        if ((index >= 0)) this._sectionService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'process_group_ids');
        if ((index >= 0)) this._processGroupService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'process_category_ids');
        if ((index >= 0)) this._processCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'risk_rating_ids');
        if ((index >= 0)) this._riskRatingService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'asset_rating_ids');
        if ((index >= 0)) this._assetRatingService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'process_risk_rating_ids');
        if ((index >= 0)) this._riskRatingService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'control_type_ids');
        if ((index >= 0)) this._controlTypesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'control_mode_ids');
        if ((index >= 0)) this._controlModeService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'control_efficiency_measure_ids');
        if ((index >= 0)) this._controlEfficiencyMeasureService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'control_category_ids');
        if ((index >= 0)) this._controlCategService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'control_sub_category_ids');
        if ((index >= 0)) this._controlSubCatService.getAllItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'designation_ids');
        if ((index >= 0)) this._designationService.getItemsWithoutFilter().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'language_ids');
        if ((index >= 0)) this._languageService.getAllItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'risk_type_ids');
        if ((index >= 0)) this._riskTypesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'stakeholder_ids');
        if ((index >= 0)) this._stakeholderService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'risk_classification_ids');
        if ((index >= 0)) this._riskClassificationService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'risk_category_ids');
        if ((index >= 0)) this._riskCategoryService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'risk_status_ids');
        if ((index >= 0)) this._riskStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'risk_source_ids');
        if ((index >= 0)) this._riskSourceService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'risk_control_plan_ids');
        if ((index >= 0)) this._riskControlPlanService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'issue_domain_ids');
        if ((index >= 0)) this._issueDomainService.getAllItems().subscribe();
        this.issue_domain_ng_model = RightSidebarLayoutStore.getSelectedFilterValuesFor('issue_domain_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'issue_type_ids');
        if ((index >= 0)) this._issueTypeService.getAllItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'stakeholder_type_ids');
        if ((index >= 0)) this._stakeholderTypeService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'department_ids');
        if ((index >= 0)) this._departmentService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'organization_ids');
        if ((index >= 0)) this._subsidiaryService.getAllItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'branch');
        if ((index >= 0)) this._branchService.getAllItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'ms_type_id');
        if ((index >= 0)) this._msTypeService.getAllItems().subscribe();
        this.ms_types_ng_model = RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_type_id');

        index = filtersForCurrentPage.findIndex(e => e == 'ms_type_ids');
        if ((index >= 0)) this._msTypeService.getAllItems().subscribe();
        this.ms_types_audit_program_ng_model = RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_type_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'ms_type_version_id');
        if ((index >= 0)) this._msTypeVersionService.getAllItems().subscribe();
        this.ms_type_version_ng_model = RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_type_version_id');

        index = filtersForCurrentPage.findIndex(e => e == 'service_category_id');
        if ((index >= 0)) this._businessService.getServiceCategories().subscribe();
        this.service_category_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('service_category_id');

        index = filtersForCurrentPage.findIndex(e => e == 'product_category_id');
        if ((index >= 0)) this._productsService.getProductCategories().subscribe();
        this.product_category_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('product_category_id');

        index = filtersForCurrentPage.findIndex(e => e == 'accountable_user_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.accountable_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('accountable_user_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'responsible_user_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.risk_responsible_user_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('responsible_user_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'risk_responsible_user_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.risk_responsible_user_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('risk_responsible_user_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'owner_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.event_owner_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('owner_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'risk_owner_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.risk_owner_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('risk_owner_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'audit_leader_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.audit_leader_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('audit_leader_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'organizer_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.orgaizer_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('organizer_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'created_by_user_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.document_user_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('created_by_user_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'user_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.document_user_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('user_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'consulted_user_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.consulted_user_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('consulted_user_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'informed_user_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.informed_user_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('informed_user_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'employee_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.hc_employee_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('employee_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'performed_by_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.hc_performed_by_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('performed_by_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'test_and_exercise_lead_user_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.test_and_exercise_lead_user_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('test_and_exercise_lead_user_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'kpi_owner_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.kpi_owner_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('kpi_owner_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'asset_owner_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.asset_owner_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('asset_owner_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'reporting_to_ids');
        if ((index >= 0)) this._usersService.getUsersWithoutFilter().subscribe();
        this.reporting_user_ng_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('reporting_to_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'project_manager_ids');
        if ((index >= 0)) this._usersService.getAllItems().subscribe();
        this.project_manager_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('project_manager_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'project_contract_type_ids');
        if ((index >= 0)) this._projectContractTypeService.getItems().subscribe();
        this.project_contract_type_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('project_contract_type_ids');


        index = filtersForCurrentPage.findIndex(e => e == 'project_priority_ids');
        if ((index >= 0)) this._projectPriorityService.getItems().subscribe();
        this.project_priority_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('project_priority_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'event_priority_ids');
        if ((index >= 0)) this._projectPriorityService.getItems().subscribe();
        this.event_priority_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('event_priority_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'event_periodicity_ids');
        if ((index >= 0)) this._eventPeriodicityService.getItems().subscribe();
        this.event_periodicity_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('event_periodicity_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'event_entrance_ids');
        if ((index >= 0)) this._eventEntranceService.getItems().subscribe();
        this.event_entrance_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('event_entrance_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'event_range_ids');
        if ((index >= 0)) this._eventRangeService.getItems().subscribe();
        this.event_range_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('event_range_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'event_dimension_ids');
        if ((index >= 0)) this._eventDimensionService.getItems().subscribe();
        this.event_dimension_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('event_dimension_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'event_space_type_ids');
        if ((index >= 0)) this._eventSpaceTypeService.getItems().subscribe();
        this.event_space_type_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('event_space_type_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'event_target_audience_ids');
        if ((index >= 0)) this._eventTargetAudienceService.getItems().subscribe();
        this.event_target_audience_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('event_target_audience_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'task_phase_ids');
        if ((index >= 0)) this._taskPhaseService.getItems().subscribe();
        this.task_phase_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('task_phase_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'event_status_ids');
        if ((index >= 0)) this._statusService.getItems().subscribe();
        this.event_status_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('event_status_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'event_task_status_ids');
        if ((index >= 0)) this._taskstatusService.getItems().subscribe();
        this.event_task_status_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('event_task_status_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'event_closure_status_ids');
        if ((index >= 0)) this._eventClosureStatusService.getItems().subscribe();
        this.event_closure_status_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('event_closure_status_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'event_change_request_status_ids');
        if ((index >= 0)) this._eventChangeRequestStatusService.getItems().subscribe();
        this.event_change_request_status_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('event_change_request_status_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'project_monitoring_status_ids');
        if ((index >= 0)) this._projectMonitoringStatusService.getItems().subscribe();
        this.project_monitoring_status_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('project_monitoring_status_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'project_ids');
        if ((index >= 0)) this._projectService.getItems().subscribe();
        this.project_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('project_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'parent_id');
        if ((index >= 0)) this._projectService.getItems().subscribe();
        this.parent_project_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('parent_id');

        index = filtersForCurrentPage.findIndex(e => e == 'project_category_ids');
        if ((index >= 0)) this._projectCategoryService.getItems().subscribe();
        this.project_category_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('project_category_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'project_type_ids');
        if ((index >= 0)) this._projectTypeService.getItems().subscribe();
        this.project_type_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('project_type_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'project_issue_ids');
        if ((index >= 0)) this._projectIssueService.getAllItems().subscribe();
        this.project_issue_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('project_issue_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'project_issue_status_ids');
        if ((index >= 0)) this._projectIssueStatusService.getItems().subscribe();
        this.project_issue_status_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('project_issue_status_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'project_monitor_closure_status_ids');
        if ((index >= 0)) this._projectClosureStatusService.getItems().subscribe();
        this.project_monitor_closure_status_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('project_monitor_closure_status_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'location_ids');
        if ((index >= 0)) this._locationService.getAllItems().subscribe();
        this.project_location_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('location_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'event_location_ids');
        if ((index >= 0)) this._locationService.getAllItems().subscribe();
        this.event_location_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('event_location_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'event_type_ids');
        if ((index >= 0)) this._eventTypeService.getItems().subscribe();
        this.event_type_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('event_type_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'event_ids');
        if ((index >= 0)) this._eventService.getItems().subscribe();
        this.event_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('event_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'project_change_request_status_ids');
        if ((index >= 0)) this._projectChangeRequestStatusService.getItems().subscribe();
        this.project_change_request_statu_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('project_change_request_status_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'document_category_ids');
        if ((index >= 0)) this._documentCategoryService.getItems().subscribe();
        this.document_category_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('document_category_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'document_sub_category_ids');
        if ((index >= 0)) this._documentSubCategoryService.getItems().subscribe();
        this.document_sub_category_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('document_sub_category_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'document_sub_sub_category_ids');
        if ((index >= 0)) this._documentSubSubCategoryService.getItems().subscribe();
        this.document_sub_sub_category_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('document_sub_sub_category_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'document_family_ids');
        if ((index >= 0)) this._documentFamilyService.getItems().subscribe();
        this.document_family_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('document_family_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'am_audit_category_ids');
        if ((index >= 0)) this._auditCategoryService.getItems().subscribe();
        this.am_audit_category_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('am_audit_category_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'am_audit_control_self_assesement_status_ids');
        if ((index >= 0)) this._auditControlSelfAssesementStatusService.getItems().subscribe();
        this.am_audit_control_self_assesement_status_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('am_audit_control_self_assesement_status_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'am_annual_plan_frequency_ids');
        if ((index >= 0)) this._annualPlanFrequencyService.getItems().subscribe();
        this.am_anual_plan_frequency_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('am_annual_plan_frequency_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'am_annual_plan_frequency_item_ids');
        if ((index >= 0)) this._annualPlanFrequencyItemService.getItems().subscribe();
        this.am_anual_plan_frequency_item_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('am_annual_plan_frequency_item_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'am_audit_status_ids');
        if ((index >= 0)) this._auditStatusesService.getItems().subscribe();
        this.am_audit_status_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('am_audit_status_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'am_audit_test_plan_status_ids');
        if ((index >= 0)) this._auditTestPlanStatusService.getItems().subscribe();
        this.am_audit_test_plan_status_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('am_audit_test_plan_status_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'status');
        if ((index >= 0)) this._processService.getStatusIds().subscribe();
        this.status_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('status');

        index = filtersForCurrentPage.findIndex(e => e == 'am_audit_information_request_status_ids');
        if ((index >= 0)) this._informationRequestStatusesService.getItems().subscribe();
        this.am_audit_info_request_status_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('am_audit_information_request_status_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'am_annual_plan_auditable_item_ids');
        if ((index >= 0)) this._amAuditableItemService.getAuditableItems().subscribe();
        this.am_annual_plan_auditable_item_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('am_annual_plan_auditable_item_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'audit_manager_ids');
        let params = '?is_auditor=true'
        if ((index >= 0)) this._usersService.getAllItems(params).subscribe();
        this.am_audit_manager_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('audit_manager_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'requested_by_user_ids');
        if ((index >= 0)) this._usersService.getAllItems().subscribe();
        this.am_audit_requested_by_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('requested_by_user_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'ms_lead_auditor_ids');
        if ((index >= 0)) this._usersService.getAllItems().subscribe();
        this.ms_audit_leader_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_lead_auditor_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'ms_audit_finding_status_ids');
        if ((index >= 0)) this._msAuditFindingStatusService.getItems().subscribe();
        this.non_confirmity_status_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_audit_finding_status_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'ms_audit_category_ids');
        if ((index >= 0)) this._msAuditCategoryService.getItems().subscribe();
        this.ms_audit_category_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_audit_category_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'ms_audit_finding_corrective_action_status_ids');
        if ((index >= 0)) this._msAuditFindingCaStatusesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'ms_audit_finding_ids');
        if ((index >= 0)) this._auditNonConfirmityService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'ms_audit_mode_ids');
        if ((index >= 0)) this._msAuditModesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'ms_audit_plan_status_ids');
        if ((index >= 0)) this._msAuditPlanStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'ms_audit_program_ids');
        if ((index >= 0)) this._msAuditProgramsService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'ms_audit_status_ids');
        if ((index >= 0)) this._msAuditStatusesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'ms_audit_plan_ids');
        if ((index >= 0)) this._msAuditPlansService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'ms_audit_finding_category_ids');
        if ((index >= 0)) this._msAuditFindingCategoriesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'ms_audit_schedule_status_ids');
        if ((index >= 0)) this._msAuditScheduleStatusesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'customer_complaint_type_ids');
        if ((index >= 0)) this._customerCompliantTypeService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'customer_complaint_source_ids');
        if ((index >= 0)) this._customerComplaintSourceService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'customer_complaint_status_ids');
        if ((index >= 0)) this._customerCompliantStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'customer_complaint_investigation_status_ids');
        if ((index >= 0)) this._customerComplaintInvestigationStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'customer_complaint_action_type_ids');
        if ((index >= 0)) this._customerComplaintActionTypesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'customer_complaint_action_plan_status_ids');
        if ((index >= 0)) this._customerComplaintActionPlanStatusesService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'customer_ids');
        if ((index >= 0)) this._customersService.getItems().subscribe();

        // Mock Drill
        index = filtersForCurrentPage.findIndex(e => e == 'mock_drill_plan_ids');
        if ((index >= 0)) this._mockDrillPlanService.getItems(false, '&used_plan_id').subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'mock_drill_type_ids');
        if ((index >= 0)) this._mockDrillTypeService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'mock_drill_status_ids');
        if ((index >= 0)) this._mockDrillStatusService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'incident_controller_ids');
        if ((index >= 0)) this._usersService.getAllItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'ms_audit_ids');
        if ((index >= 0)) this._msAuditService.getItems().subscribe();

        index = filtersForCurrentPage.findIndex(e => e == 'cyber_incident_classification_ids');
        if ((index >= 0)) this._cyberIncidentClassificationService.getItems().subscribe();
        this.incident_classification_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('cyber_incident_classification_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'cyber_incident_status_ids');
        if ((index >= 0)) this._cyberIncidentStatusService.getItems().subscribe();
        this.cyber_incident_status_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('cyber_incident_status_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'cyber_incident_ids');
        if ((index >= 0)) this._cyberIncidentService.getAllItems().subscribe();
        this.cyber_incident_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('cyber_incident_ids');

        index = filtersForCurrentPage.findIndex(e => e == 'cyber_incident_corrective_action_status_ids');
        if ((index >= 0)) this._cyberIncidentCorrectiveActionStatusService.getItems().subscribe();
        this.cyber_incident_corrective_action_status_modal = RightSidebarLayoutStore.getSelectedFilterValuesFor('cyber_incident_corrective_action_status_ids');
    }

    setYears() {
        this.years = [];
        var dt = new Date().getFullYear();
        for (var i = 0; i < 4; i++) {
            this.years.push({ title: (dt - i), id: (dt - i) });
        }
    }

    cancel() {
        AppStore.closeRightSidebar();
        this._rightSidebarFilterService.disableFilter(false);
        //this.filterSubscription.unsubscribe();
    }

    dateChange(e) {
        this.target_date_model = e;
        this.setOrUnsetItem('target_date', this._helperService.processDate(this.target_date_model, 'join'));
    }

    dateChangeStartDate(e) {
        this.start_date_model = e;
        this.setOrUnsetItem('start_date', this._helperService.processDate(this.start_date_model, 'join'));
    }

    dateChangeEndDate(e) {
        this.end_date_model = e;
        this.setOrUnsetItem('end_date', this._helperService.processDate(this.end_date_model, 'join'));
    }

    dateChangeDate(e) {
        this.date_model = e;
        this.setOrUnsetItem('date', this._helperService.processDate(this.date_model, 'join'));
    }

    expiryDateChange(e) {
        this.expiry_date_model = e;
        this.setOrUnsetItem('expiry_date', this._helperService.processDate(this.expiry_date_model, 'expiry_date'));
    }

    scoreClick(value, index) {
        BcmStrategyStore._singleStrategies.solutions[index]['score' + index] = value;
        this.clickedScore = value;
    }



    reset() {
        this.issue_category_ng_model = [];
        this.issue_domain_ng_model = [];
        this.department_ng_model = [];
        this.ms_types_ng_model = [];
        this.ms_types_audit_program_ng_model=[];
        this.ms_type_version_ng_model = [];
        this.product_category_ng_modal = [];
        this.service_category_ng_modal = [];
        this.accountable_ng_modal = [];
        this.process_group_ng_modal = [];
        this.proccess_category_ng_modal = [];
        this.informed_user_ng_modal = [];
        this.hc_employee_ng_modal = [];
        this.hc_performed_by_ng_modal = [];
        this.test_and_exercise_lead_user_ng_modal = [];
        this.kpi_owner_ng_modal = [];
        this.asset_owner_ng_modal = [];
        this.reporting_user_ng_modal = [];
        this.responsible_user_ng_modal = [];
        this.risk_responsible_user_ng_modal = [];
        this.event_owner_ng_modal = [];
        this.consulted_user_ng_modal = [];
        this.control_type_ng_modal = [];
        this.control_mode_ng_modal = [];
        this.control_efficiency_measure_ng_modal = [];
        this.control_category_ng_modal = [];
        this.control_sub_category_ng_modal = [];
        this.designation_ng_modal = [];
        this.language_ng_modal = [];
        this.risk_types_ng_modal = [];
        this.stakeholder_ng_modal = [];
        this.risk_classification_ng_modal = [];
        this.risk_category_ng_modal = [];
        this.risk_status_ng_modal = [];
        this.risk_source_ng_modal = [];
        this.customer_complaint_type_ng_modal = [];
        this.customer_complaint_source_ng_modal = [];
        this.customer_complaint_status_ng_modal = [];
        this.customer_investigation_status_ng_modal = [];
        this.customer_complaint_action_type_ng_modal = [];
        this.customer_complaint_action_status_ng_modal = [];
        this.customer_ng_modal = [];
        this.risk_control_plan_ng_modal = [];
        this.risk_owner_ng_modal = [];
        this.subsidiary_ng_modal = [];
        this.division_ng_modal = [];
        this.issue_types_ng_modal = [];
        this.risk_treatment_status_ng_modal = [];
        this.risk_ng_modal = [];
        this.auditable_category_ng_modal = [];
        this.auditable_item_ng_modal = [];
        this.audit_program_status_ng_modal = [];
        this.audit_program_ng_modal = [];
        this.audit_leader_ng_modal = [];
        this.audit_plan_ng_modal = [];
        this.audit_object_ng_modal = [];
        this.audit_criteria_ng_modal = [];
        this.finding_category_ng_model = [];
        this.auditable_itemz_ng_model = [];
        this.audit_item_ng_model = [];
        this.sub_section_ng_modal = [];
        this.section_ng_modal = [];
        this.meeting_category_ng_modal = [];
        this.meeting_plan_ng_modal = [];
        this.meeting_status_ng_modal = [];
        this.venue_ng_modal = [];
        this.orgaizer_ng_modal = [];
        this.meeting_plan_item_modal = [];
        this.meeting_action_plan_status_modal = [];
        this.meeting_plan_title_modal = [];
        this.document_type_modal = [];
        this.document_access_modal = [];
        this.document_satus_modal = [];
        this.document_title_modal = [];
        this.document_user_ng_modal = [];
        this.inherent_risk_score_ng_modal = [];
        this.bcm_strategy_solution_score_modal = [];
        this.residual_risk_rating_ng_modal = [];
        this.inherent_risk_rating_ng_modal = [];
        this.residual_risk_score_ng_modal = [];
        this.document_change_request_type_modal = [];
        this.document_request_satus_modal = [];
        this.document_request_user_ng_modal = [];
        this.business_assessment_framework_modal = [];
        this.business_assessment_action_plan_status_modal = [];
        this.business_assessment_modal = [];
        this.business_assessment_status_modal = [];
        this.jso_observation_status_modal = [];
        this.unsafe_action_category_modal = [];
        this.unsafe_action_sub_category_modal = [];
        this.unsafe_action_observed_group_modal = [];
        this.incidente_category_modal = [];
        this.incidente_sub_category_modal = [];
        this.incidente_damage_type_modal = [];
        this.incidente_status_modal = [];
        this.incident_title_modal = [];
        this.incident_corrective_action_status_modal = [];
        this.project_issue_corrective_action_status_modal = [];
        this.compliance_document_type_modal = [];
        this.compliance_document_area_modal = [];
        this.compliance_document_section_modal = [];
        this.compliance_status_modal = [];
        this.region_modal = [];
        this.country_modal = [];
        this.sla_category_modal = [];
        this.training_category_modal = [];
        this.training_status_modal = [];
        this.training_competency_group_modal = [];
        this.training_competency_modal = [];
        this.finding_status_modal = [];
        this.ea_type_modal = [];
        this.audit_report_status_modal = [];
        this.ea_finding_modal = [];
        this.ea_root_cause_category_modal = [];
        this.ea_root_cause_sub_category_modal = [];
        this.ea_impact_analysis_category_modal = [];
        this.ea_finding_corrective_action_status_modal = [];
        this.ea_modal = [];
        this.audit_plan_status_modal = [];
        this.external_audit_modal = [];
        this.asset_category_modal = [];
        this.asset_matrix_category_modal = [];
        this.asset_calculation_method_modal = [];
        this.asset_modal = [];
        this.asset_type_modal = [];
        this.asset_status_modal = [];
        this.asset_sub_category_modal = [];
        this.asset_investment_type_modal = [];
        this.asset_physical_condition_ranking_modal = [];
        this.asset_custodian_modal = [];
        this.asset_supplier_modal = [];
        this.process_modal = [];
        this.asset_maintenance_category_modal = [];
        this.asset_maintenance_type_modal = [];
        this.asset_maintenance_schedule_frequency_modal = [];
        this.asset_maintenance_status_modal = [];
        //*KPI Management
        this.kpi_management_status_modal = [];
        this.kpis_modal = [];
        this.kpis_score_status_modal = [];
        this.kpi_improvement_plnas_status_modal = [];
        this.kpi_category_modal = [];
        this.kpi_category_id_modal = [];
        this.kpi_type_modal = [];
        this.kpi_type_id_modal = [];
        this.kpi_management_kpi_review_frequency_modal = [];
        this.kpi_review_frequency_modal = [];
        //**KPI Management
        this.test_and_exercise_status_modal = [];
        this.role_modal = [];
        this.test_and_exercise_type_modal = [];
        this.bcp_status_modal = [];
        this.bcm_modal = [];
        this.bia_tier_modal = [];
        this.bcs_status_modal = [];
        this.bcm_status_type_modal = [];
        this.target_unit_modal = [];
        this.strategy_initiative_modal = [];
        this.strategy_profile_modal = [];
        this.strategy_initiative_action_plan_status_modal = [];
        this.strategy_profile_focus_area_modal = [];
        this.strategy_profile_objective_modal = [];
        this.kpi_scoreboard_objective_modal = [];
        this.kpi_scoreboard_focus_area_modal = [];
        this.strategy_initiative_action_modal = [];
        this.strategy_review_frequency_modal = [];
        this.kpi_calculation_type_modal = [];
        this.strategy_kpi_data_type_modal = [];
        this.strategy_initiative_milestone_modal = [];
        this.strategy_profile_status_modal = [];
        this.project_location_modal = [];
        this.project_contract_type_modal = [];
        this.project_manager_modal = [];
        this.am_audit_manager_modal = [];
        this.am_audit_requested_by_modal = [];
        this.ms_audit_leader_modal = [];
        this.non_confirmity_status_modal = [];
        this.ms_audit_category_modal = [];
        this.project_priority_modal = [];
        this.project_monitoring_status_modal = [];
        this.project_modal = [];
        this.parent_project_modal = [];
        this.project_type_modal = [];
        this.project_category_modal = [];
        this.project_issue_modal = [];
        this.project_issue_status_modal = [];
        this.project_monitor_closure_status_modal = [];
        this.target_date_model = null;
        this.start_date_model = null;
        this.end_date_model = null;
        this.date_model = null;
        this.expiry_date_model = null;
        this.event_location_modal = [];
        this.event_type_modal = [];
        this.task_phase_modal = [];
        this.event_modal = [];
        this.event_priority_modal = [];
        this.event_periodicity_modal = [];
        this.event_entrance_modal = [];
        this.event_range_modal = [];
        this.event_dimension_modal = [];
        this.event_space_type_modal = [];
        this.event_target_audience_modal = [];
        this.event_status_modal = [];
        this.event_task_status_modal = [];
        this.event_closure_status_modal = [];
        this.event_change_request_status_modal = [];
        this.am_audit_category_modal = [];
        this.am_audit_control_self_assesement_status_modal = [];
        this.am_anual_plan_frequency_modal = [];
        this.am_anual_plan_frequency_item_modal = [];
        this.am_audit_status_modal = [];
        this.am_audit_test_plan_status_modal = [];
        this.am_audit_info_request_status_modal = [];
        this.am_annual_plan_auditable_item_modal = [];
        this.status_modal = [];
        this.mock_drill_plan_ng_modal = [];
        this.mock_drill_type_ng_modal = [];
        this.mock_drill_status_ng_modal = [];
        this.mock_drill_controller_ng_modal = [];
        this.ms_audit_finding_ca_status_ng_modal=[];
        this.ms_audit_finding_ng_modal=[];
        this.audit_team_user_modal=[];
        this.audit_team_leader_modal=[];
        this.auditor_user_modal=[];
        this.ms_audit_mode_ng_modal=[];
        this.ms_audit_plan_status_modal=[];
        this.ms_audit_program_modal=[];
        this.ms_audit_status_modal=[];
        this.ms_audit_plan_modal=[];
        this.ms_audit_finding_category_modal=[];
        this.ms_audit_schedule_status_modal=[];
        this.ms_audit_modal=[];
        this.incident_classification_modal=[];
        this.cyber_incident_status_modal=[];
        this.cyber_incident_modal=[];
        this.cyber_incident_corrective_action_status_modal=[];
        RightSidebarLayoutStore.resetFilter();
        this._rightSidebarFilterService.emitFilterChange();
        this._utilityService.detectChanges(this._cdr);
    }

    setOrUnsetItem(item: string, value: any, event?, status?) {
        if (event) {
            if (event.target.checked) {
                this.RiskStore.corporate = true;
            } else {
                this.RiskStore.corporate = false;
            }
        }
        // if(item=='status'){
        //     if(value=='active')
        //     UsersStore.selectedStatus = 'active';
        //     else
        //     UsersStore.selectedStatus = 'inactive';
        // }
        if (item == 'training_status_ids')
            TrainingDashboardStore.trainingStatus = value.title;
        if (status)
            this._rightSidebarFilterService.unsetFilterItemValues(item)
        this._rightSidebarFilterService.setOrUnsetFilterItem(item, value);
        // console.log(item, value);
    }

    selectMultipleAdd(item: string, id) {
        this.setOrUnsetItem(item, id);
    }

    selectMultipleRemove(item: string, data) {
        this.setOrUnsetItem(item, data.value);
    }

    clearItems(item: string) {
        this._rightSidebarFilterService.unsetFilterItemValues(item);
    }

    processArrays(ngModalArray, filterArray) {
        let difference = ngModalArray.filter(x => !filterArray.includes(x));
        let ids = null;
        if (difference.length > 0) ids = difference[0].id;
        return ids;
    }

    processNgModalValues(item) {
        let id = null;
        switch (item) {
            case 'issue_category_ids':
                id = this.processArrays(this.issue_category_ng_model, RightSidebarLayoutStore.getSelectedFilterValuesFor('issue_category_ids'));
                this.issue_category_ng_model = this.issue_category_ng_model.filter(s => s.id != id);
                break;
            case 'issue_domain_ids':
                id = this.processArrays(this.issue_domain_ng_model, RightSidebarLayoutStore.getSelectedFilterValuesFor('issue_domain_ids'));
                this.issue_domain_ng_model = this.issue_domain_ng_model.filter(s => s.id != id);
                break;
            case 'issue_type_ids':
                id = this.processArrays(this.issue_types_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('issue_type_ids'));
                this.issue_types_ng_modal = this.issue_types_ng_modal.filter(s => s.id != id);
                break;
            case 'department_ids':
                id = this.processArrays(this.department_ng_model, RightSidebarLayoutStore.getSelectedFilterValuesFor('department_ids'));
                this.department_ng_model = this.department_ng_model.filter(s => s.id != id);
                break;
            case 'ms_type_id':
                id = this.processArrays(this.ms_types_ng_model, RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_type_id'));
                this.ms_types_ng_model = this.ms_types_ng_model.filter(s => s.id != id);
                break;
            case 'ms_type_ids':
                id = this.processArrays(this.ms_types_audit_program_ng_model, RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_type_ids'));
                this.ms_types_audit_program_ng_model = this.ms_types_audit_program_ng_model.filter(s => s.id != id);
                break;
            case 'ms_type_version_id':
                id = this.processArrays(this.ms_type_version_ng_model, RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_type_version_id'));
                this.ms_type_version_ng_model = this.ms_type_version_ng_model.filter(s => s.id != id);
                break;
            case 'product_category_id':
                id = this.processArrays(this.product_category_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('product_category_id'));
                this.product_category_ng_modal = this.product_category_ng_modal.filter(s => s.id != id);
                break;
            case 'service_category_id':
                id = this.processArrays(this.ms_type_version_ng_model, RightSidebarLayoutStore.getSelectedFilterValuesFor('service_category_id'));
                this.ms_type_version_ng_model = this.ms_type_version_ng_model.filter(s => s.id != id);
                break;
            case 'accountable_user_ids':
                id = this.processArrays(this.accountable_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('accountable_user_ids'));
                this.accountable_ng_modal = this.accountable_ng_modal.filter(s => s.id != id);
                break;
            case 'process_group_ids':
                id = this.processArrays(this.process_group_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('process_group_ids'));
                this.process_group_ng_modal = this.process_group_ng_modal.filter(s => s.id != id);
                break;
            case 'process_category_ids':
                id = this.processArrays(this.proccess_category_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('process_category_ids'));
                this.proccess_category_ng_modal = this.proccess_category_ng_modal.filter(s => s.id != id);
                break;
            case 'informed_user_ids':
                id = this.processArrays(this.informed_user_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('informed_user_ids'));
                this.informed_user_ng_modal = this.informed_user_ng_modal.filter(s => s.id != id);
                break;
            case 'employee_ids':
                id = this.processArrays(this.hc_employee_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('employee_ids'));
                this.hc_employee_ng_modal = this.hc_employee_ng_modal.filter(s => s.id != id);
                break;
            case 'performed_by_ids':
                id = this.processArrays(this.hc_performed_by_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('performed_by_ids'));
                this.hc_performed_by_ng_modal = this.hc_performed_by_ng_modal.filter(s => s.id != id);
                break;
            case 'test_and_exercise_lead_user_ids':
                id = this.processArrays(this.test_and_exercise_lead_user_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('test_and_exercise_lead_user_ids'));
                this.test_and_exercise_lead_user_ng_modal = this.test_and_exercise_lead_user_ng_modal.filter(s => s.id != id);
                break;
            case 'kpi_owner_ids':
                id = this.processArrays(this.kpi_owner_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('kpi_owner_ids'));
                this.kpi_owner_ng_modal = this.kpi_owner_ng_modal.filter(s => s.id != id);
                break;
            case 'asset_owner_ids':
                id = this.processArrays(this.asset_owner_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('asset_owner_ids'));
                this.asset_owner_ng_modal = this.asset_owner_ng_modal.filter(s => s.id != id);
                break;
            case 'responsible_user_ids':
                id = this.processArrays(this.responsible_user_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('responsible_user_ids'));
                this.responsible_user_ng_modal = this.responsible_user_ng_modal.filter(s => s.id != id);
                break;

            case 'risk_responsible_user_ids':
                id = this.processArrays(this.risk_responsible_user_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('risk_responsible_user_ids'));
                this.risk_responsible_user_ng_modal = this.risk_responsible_user_ng_modal.filter(s => s.id != id);
                break;

            case 'owner_ids':
                id = this.processArrays(this.event_owner_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('owner_ids'));
                this.event_owner_ng_modal = this.event_owner_ng_modal.filter(s => s.id != id);
                break;
            case 'consulted_user_ids':
                id = this.processArrays(this.consulted_user_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('consulted_user_ids'));
                this.consulted_user_ng_modal = this.consulted_user_ng_modal.filter(s => s.id != id);
                break;
            case 'control_mode_ids':
                id = this.processArrays(this.control_mode_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('control_mode_ids'));
                this.control_mode_ng_modal = this.control_mode_ng_modal.filter(s => s.id != id);
                break;
            case 'control_type_ids':
                id = this.processArrays(this.control_type_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('control_type_ids'));
                this.control_type_ng_modal = this.control_type_ng_modal.filter(s => s.id != id);
                break;
            case 'control_efficiency_measure_ids':
                id = this.processArrays(this.control_efficiency_measure_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('control_efficiency_measure_ids'));
                this.control_efficiency_measure_ng_modal = this.control_efficiency_measure_ng_modal.filter(s => s.id != id);
                break;
            case 'control_category_ids':
                id = this.processArrays(this.control_category_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('control_category_ids'));
                this.control_category_ng_modal = this.control_category_ng_modal.filter(s => s.id != id);
                break;
            case 'control_sub_category_ids':
                id = this.processArrays(this.control_sub_category_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('control_sub_category_ids'));
                this.control_sub_category_ng_modal = this.control_sub_category_ng_modal.filter(s => s.id != id);
                break;
            case 'designation_ids':
                id = this.processArrays(this.designation_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('designation_ids'));
                this.designation_ng_modal = this.designation_ng_modal.filter(s => s.id != id);
                break;
            case 'reporting_to_ids':
                id = this.processArrays(this.reporting_user_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('reporting_to_ids'));
                this.reporting_user_ng_modal = this.reporting_user_ng_modal.filter(s => s.id != id);
                break;
            case 'language_ids':
                id = this.processArrays(this.language_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('language_ids'));
                this.language_ng_modal = this.language_ng_modal.filter(s => s.id != id);
                break;
            case 'risk_type_ids':
                id = this.processArrays(this.risk_types_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('risk_type_ids'));
                this.risk_types_ng_modal = this.risk_types_ng_modal.filter(s => s.id != id);
                break;
            case 'stakeholder_ids':
                id = this.processArrays(this.stakeholder_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('stakeholder_ids'));
                this.stakeholder_ng_modal = this.stakeholder_ng_modal.filter(s => s.id != id);
                break;
            case 'risk_classification_ids':
                id = this.processArrays(this.risk_classification_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('risk_classification_ids'));
                this.risk_classification_ng_modal = this.risk_classification_ng_modal.filter(s => s.id != id);
                break;
            case 'risk_category_ids':
                id = this.processArrays(this.risk_category_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('risk_category_ids'));
                this.risk_category_ng_modal = this.risk_category_ng_modal.filter(s => s.id != id);
                break;
            case 'risk_status_ids':
                id = this.processArrays(this.risk_status_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('risk_status_ids'));
                this.risk_status_ng_modal = this.risk_status_ng_modal.filter(s => s.id != id);
                break;
            case 'risk_source_ids':
                id = this.processArrays(this.risk_source_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('risk_source_ids'));
                this.risk_source_ng_modal = this.risk_source_ng_modal.filter(s => s.id != id);
                break;
            case 'customer_complaint_type_ids':
                id = this.processArrays(this.customer_complaint_type_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('customer_complaint_type_ids'));
                this.customer_complaint_type_ng_modal = this.customer_complaint_type_ng_modal.filter(s => s.id != id);
                break;
            case 'customer_complaint_source_ids':
                id = this.processArrays(this.customer_complaint_source_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('customer_complaint_source_ids'));
                this.customer_complaint_source_ng_modal = this.customer_complaint_source_ng_modal.filter(s => s.id != id);
                break;
            case 'customer_complaint_status_ids':
                id = this.processArrays(this.customer_complaint_status_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('customer_complaint_status_ids'));
                this.customer_complaint_status_ng_modal = this.customer_complaint_status_ng_modal.filter(s => s.id != id);
                break;
            case 'customer_complaint_investigation_status_ids':
                id = this.processArrays(this.customer_investigation_status_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('customer_complaint_investigation_status_ids'));
                this.customer_investigation_status_ng_modal = this.customer_investigation_status_ng_modal.filter(s => s.id != id);
                break;
            case 'customer_complaint_action_type_ids':
                id = this.processArrays(this.customer_complaint_action_type_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('customer_complaint_action_type_ids'));
                this.customer_complaint_action_type_ng_modal = this.customer_complaint_action_type_ng_modal.filter(s => s.id != id);
                break;
            case 'customer_complaint_action_plan_status_ids':
                id = this.processArrays(this.customer_complaint_action_status_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('customer_complaint_action_plan_status_ids'));
                this.customer_complaint_action_status_ng_modal = this.customer_complaint_action_status_ng_modal.filter(s => s.id != id);
                break;
            case 'customer_ids':
                id = this.processArrays(this.customer_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('customer_ids'));
                this.customer_ng_modal = this.customer_ng_modal.filter(s => s.id != id);
                break;
            case 'risk_control_plan_ids':
                id = this.processArrays(this.risk_control_plan_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('risk_control_plan_ids'));
                this.risk_control_plan_ng_modal = this.risk_control_plan_ng_modal.filter(s => s.id != id);
                break;
            case 'risk_owner_ids':
                id = this.processArrays(this.risk_owner_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('risk_owner_ids'));
                this.risk_owner_ng_modal = this.risk_owner_ng_modal.filter(s => s.id != id);
                break;
            case 'organization_ids':
                id = this.processArrays(this.subsidiary_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('organization_ids'));
                this.subsidiary_ng_modal = this.subsidiary_ng_modal.filter(s => s.id != id);
                break;
            case 'division_ids':
                id = this.processArrays(this.division_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('division_ids'));
                this.division_ng_modal = this.division_ng_modal.filter(s => s.id != id);
                break;
            case 'risk_treatment_status_ids':
                id = this.processArrays(this.risk_treatment_status_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('risk_treatment_status_ids'));
                this.risk_treatment_status_ng_modal = this.risk_treatment_status_ng_modal.filter(s => s.id != id);
                break;
            case 'risk_ids':
                id = this.processArrays(this.risk_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('risk_ids'));
                this.risk_ng_modal = this.risk_ng_modal.filter(s => s.id != id);
                break;
            case 'auditable_item_category_ids':
                id = this.processArrays(this.auditable_category_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('auditable_item_category_ids'));
                this.auditable_category_ng_modal = this.auditable_category_ng_modal.filter(s => s.id != id);
                break;
            case 'auditable_item_type_ids':
                id = this.processArrays(this.auditable_item_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('auditable_item_type_ids'));
                this.auditable_item_ng_modal = this.auditable_item_ng_modal.filter(s => s.id != id);
                break;
            case 'audit_program_status_ids':
                id = this.processArrays(this.audit_program_status_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('audit_program_status_ids'));
                this.audit_program_status_ng_modal = this.audit_program_status_ng_modal.filter(s => s.id != id);
                break;
            case 'audit_program_ids':
                id = this.processArrays(this.audit_program_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('audit_program_ids'));
                this.audit_program_ng_modal = this.audit_program_ng_modal.filter(s => s.id != id);
                break;
            case 'audit_leader_ids':
                id = this.processArrays(this.audit_leader_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('audit_leader_ids'));
                this.audit_leader_ng_modal = this.audit_leader_ng_modal.filter(s => s.id != id);
                break;
            case 'audit_plan_ids':
                id = this.processArrays(this.audit_plan_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('audit_plan_ids'));
                this.audit_plan_ng_modal = this.audit_plan_ng_modal.filter(s => s.id != id);
                break;
            case 'audit_objective_ids':
                id = this.processArrays(this.audit_object_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('audit_objective_ids'));
                this.audit_object_ng_modal = this.audit_object_ng_modal.filter(s => s.id != id);
                break;
            case 'audit_criteria_ids':
                id = this.processArrays(this.audit_criteria_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('audit_criteria_ids'));
                this.audit_criteria_ng_modal = this.audit_criteria_ng_modal.filter(s => s.id != id);
                break;
            case 'finding_category_ids':
                id = this.processArrays(this.finding_category_ng_model, RightSidebarLayoutStore.getSelectedFilterValuesFor('finding_category_ids'));
                this.finding_category_ng_model = this.finding_category_ng_model.filter(s => s.id != id);
                break;
            case 'auditable_item_ids':
                id = this.processArrays(this.auditable_itemz_ng_model, RightSidebarLayoutStore.getSelectedFilterValuesFor('auditable_item_ids'));
                this.auditable_itemz_ng_model = this.auditable_itemz_ng_model.filter(s => s.id != id);
                break;
            case 'audit_ids':
                id = this.processArrays(this.audit_item_ng_model, RightSidebarLayoutStore.getSelectedFilterValuesFor('audit_ids'));
                this.audit_item_ng_model = this.audit_item_ng_model.filter(s => s.id != id);
                break;
            case 'sub_section_ids':
                id = this.processArrays(this.sub_section_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('sub_section_ids'));
                this.sub_section_ng_modal = this.sub_section_ng_modal.filter(s => s.id != id);
                break;
            case 'section_ids':
                id = this.processArrays(this.section_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('section_ids'));
                this.section_ng_modal = this.section_ng_modal.filter(s => s.id != id);
                break;
            case 'meeting_category_ids':
                id = this.processArrays(this.meeting_category_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('meeting_category_ids'));
                this.meeting_category_ng_modal = this.meeting_category_ng_modal.filter(s => s.id != id);
                break;
            case 'meeting_plan_status_ids':
                id = this.processArrays(this.meeting_plan_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('meeting_plan_status_ids'));
                this.meeting_plan_ng_modal = this.meeting_plan_ng_modal.filter(s => s.id != id);
                break;
            case 'meeting_status_ids':
                id = this.processArrays(this.meeting_status_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('meeting_status_ids'));
                this.meeting_status_ng_modal = this.meeting_status_ng_modal.filter(s => s.id != id);
                break;
            case 'venue_ids':
                id = this.processArrays(this.venue_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('venue_ids'));
                this.venue_ng_modal = this.venue_ng_modal.filter(s => s.id != id);
                break;
            case 'organizer_ids':
                id = this.processArrays(this.orgaizer_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('organizer_ids'));
                this.orgaizer_ng_modal = this.orgaizer_ng_modal.filter(s => s.id != id);
                break;
            case 'meeting_plan_ids':
                id = this.processArrays(this.meeting_plan_item_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('meeting_plan_ids'));
                this.meeting_plan_item_modal = this.meeting_plan_item_modal.filter(s => s.id != id);
                break;
            case 'meeting_action_plan_status_ids':
                id = this.processArrays(this.meeting_action_plan_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('meeting_action_plan_status_ids'));
                this.meeting_action_plan_status_modal = this.meeting_action_plan_status_modal.filter(s => s.id != id);
                break;
            case 'meeting_ids':
                id = this.processArrays(this.meeting_plan_title_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('meeting_ids'));
                this.meeting_plan_title_modal = this.meeting_plan_title_modal.filter(s => s.id != id);
                break;
            case 'document_type_ids':
                id = this.processArrays(this.document_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('document_type_ids'));
                this.document_type_modal = this.document_type_modal.filter(s => s.id != id);
                break;
            case 'document_access_type_ids':
                id = this.processArrays(this.document_access_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('document_access_type_ids'));
                this.document_access_modal = this.document_access_modal.filter(s => s.id != id);
                break;
            case 'document_status_ids':
                id = this.processArrays(this.document_satus_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('document_status_ids'));
                this.document_satus_modal = this.document_satus_modal.filter(s => s.id != id);
                break;
            case 'document_ids':
                id = this.processArrays(this.document_title_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('document_ids'));
                this.document_title_modal = this.document_title_modal.filter(s => s.id != id);
                break;
            case 'created_by_user_ids':
                id = this.processArrays(this.document_user_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('created_by_user_ids'));
                this.document_user_ng_modal = this.document_user_ng_modal.filter(s => s.id != id);
                break;
            case 'inherent_risk_score':
                id = this.processArrays(this.inherent_risk_score_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('inherent_risk_score'));
                this.inherent_risk_score_ng_modal = this.inherent_risk_score_ng_modal.filter(s => s.id != id);
                break;
            case 'residual_risk_rating_ids':
                id = this.processArrays(this.residual_risk_rating_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('residual_risk_rating_ids'));
                this.residual_risk_rating_ng_modal = this.residual_risk_rating_ng_modal.filter(s => s.id != id);
                break
            case 'solution_scores':
                id = this.processArrays(this.bcm_strategy_solution_score_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('solution_scores'));
                this.bcm_strategy_solution_score_modal = this.bcm_strategy_solution_score_modal.filter(s => s.id != id);
                break;
            case 'inherent_risk_rating_ids':
                id = this.processArrays(this.inherent_risk_rating_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('inherent_risk_rating_ids'));
                this.inherent_risk_rating_ng_modal = this.inherent_risk_rating_ng_modal.filter(s => s.id != id);
                break;
            case 'residual_risk_score':
                id = this.processArrays(this.residual_risk_score_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('residual_risk_score'));
                this.residual_risk_score_ng_modal = this.residual_risk_score_ng_modal.filter(s => s.id != id);
                break;
            case 'document_change_request_type_ids':
                id = this.processArrays(this.document_change_request_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('document_change_request_type_ids'));
                this.document_change_request_type_modal = this.document_change_request_type_modal.filter(s => s.id != id);
                break;
            case 'document_change_request_status_ids':
                id = this.processArrays(this.document_request_satus_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('document_change_request_status_ids'));
                this.document_request_satus_modal = this.document_request_satus_modal.filter(s => s.id != id);
                break;
            case 'user_ids':
                id = this.processArrays(this.document_request_user_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('user_ids'));
                this.document_request_user_ng_modal = this.document_request_user_ng_modal.filter(s => s.id != id);
                break;
            case 'business_assessment_framework_ids':
                id = this.processArrays(this.business_assessment_framework_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('business_assessment_framework_ids'));
                this.business_assessment_framework_modal = this.business_assessment_framework_modal.filter(s => s.id != id);
                break;
            case 'business_assessment_action_plan_status_ids':
                id = this.processArrays(this.business_assessment_action_plan_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('business_assessment_action_plan_status_ids'));
                this.business_assessment_action_plan_status_modal = this.business_assessment_action_plan_status_modal.filter(s => s.id != id);
                break;
            case 'business_assessment_ids':
                id = this.processArrays(this.business_assessment_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('business_assessment_ids'));
                this.business_assessment_modal = this.business_assessment_modal.filter(s => s.id != id);
                break;
            case 'business_assessment_status_ids':
                id = this.processArrays(this.business_assessment_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('business_assessment_status_ids'));
                this.business_assessment_status_modal = this.business_assessment_status_modal.filter(s => s.id != id);
                break;
            case 'target_date':
                id = this.processArrays(this.target_date_model, RightSidebarLayoutStore.getSelectedFilterValuesFor('target_date'));
                this.target_date_model = this.target_date_model.filter(s => s.id != id);
                break;
            case 'start_date':
                id = this.processArrays(this.start_date_model, RightSidebarLayoutStore.getSelectedFilterValuesFor('start_date'));
                this.start_date_model = this.start_date_model.filter(s => s.id != id);
                break;
            case 'end_date':
                id = this.processArrays(this.end_date_model, RightSidebarLayoutStore.getSelectedFilterValuesFor('end_date'));
                this.end_date_model = this.end_date_model.filter(s => s.id != id);
                break;
            case 'date':
                id = this.processArrays(this.date_model, RightSidebarLayoutStore.getSelectedFilterValuesFor('date'));
                this.date_model = this.date_model.filter(s => s.id != id);
                break;
            case 'expiry_date':
                id = this.processArrays(this.expiry_date_model, RightSidebarLayoutStore.getSelectedFilterValuesFor('expiry_date'));
                this.expiry_date_model = this.expiry_date_model.filter(s => s.id != id);
                break;
            case 'jso_observation_type_ids':
                id = this.processArrays(this.jso_observation_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('jso_observation_type_ids'));
                this.jso_observation_status_modal = this.jso_observation_status_modal.filter(s => s.id != id);
                break;
            case 'unsafe_action_category_ids':
                id = this.processArrays(this.unsafe_action_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('unsafe_action_category_ids'));
                this.unsafe_action_category_modal = this.unsafe_action_category_modal.filter(s => s.id != id);
                break;
            case 'unsafe_action_sub_category_ids':
                id = this.processArrays(this.unsafe_action_sub_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('unsafe_action_sub_category_ids'));
                this.unsafe_action_sub_category_modal = this.unsafe_action_sub_category_modal.filter(s => s.id != id);
                break;
            case 'unsafe_action_observed_group_ids':
                id = this.processArrays(this.unsafe_action_observed_group_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('unsafe_action_observed_group_ids'));
                this.unsafe_action_observed_group_modal = this.unsafe_action_observed_group_modal.filter(s => s.id != id);
                break;
            case 'incident_category_ids':
                id = this.processArrays(this.incidente_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('incident_category_ids'));
                this.incidente_category_modal = this.incidente_category_modal.filter(s => s.id != id);
                break;
            case 'incident_sub_category_ids':
                id = this.processArrays(this.incidente_sub_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('incident_sub_category_ids'));
                this.incidente_sub_category_modal = this.incidente_sub_category_modal.filter(s => s.id != id);
                break;
            case 'incident_damage_type_ids':
                id = this.processArrays(this.incidente_damage_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('incident_damage_type_ids'));
                this.incidente_damage_type_modal = this.incidente_damage_type_modal.filter(s => s.id != id);
                break;
            case 'incident_status_ids':
                id = this.processArrays(this.incidente_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('incident_status_ids'));
                this.incidente_status_modal = this.incidente_status_modal.filter(s => s.id != id);
                break;
            case 'incident_ids':
                id = this.processArrays(this.incident_title_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('incident_ids'));
                this.incident_title_modal = this.incident_title_modal.filter(s => s.id != id);
                break;
            case 'incident_corrective_action_status_ids':
                id = this.processArrays(this.incident_corrective_action_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('incident_corrective_action_status_ids'));
                this.incident_corrective_action_status_modal = this.incident_corrective_action_status_modal.filter(s => s.id != id);
                break;
            case 'project_issue_corrective_action_status_ids':
                id = this.processArrays(this.project_issue_corrective_action_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('project_issue_corrective_action_status_ids'));
                this.project_issue_corrective_action_status_modal = this.project_issue_corrective_action_status_modal.filter(s => s.id != id);
                break;
            case 'document_compliance_document_type_ids':
                id = this.processArrays(this.compliance_document_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('document_compliance_document_type_ids'));
                this.compliance_document_type_modal = this.compliance_document_type_modal.filter(s => s.id != id);
                break;
            case 'document_compliance_area_ids':
                id = this.processArrays(this.compliance_document_area_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('document_compliance_area_ids'));
                this.compliance_document_area_modal = this.compliance_document_area_modal.filter(s => s.id != id);
                break;
            case 'document_compliance_section_ids':
                id = this.processArrays(this.compliance_document_section_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('document_compliance_section_ids'));
                this.compliance_document_section_modal = this.compliance_document_section_modal.filter(s => s.id != id);
                break;
            case 'compliance_status_ids':
                id = this.processArrays(this.compliance_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('compliance_status_ids'));
                this.compliance_status_modal = this.compliance_status_modal.filter(s => s.id != id);
                break;
            case 'region_ids':
                id = this.processArrays(this.region_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('region_ids'));
                this.region_modal = this.region_modal.filter(s => s.id != id);
                break;
            case 'country_ids':
                id = this.processArrays(this.country_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('country_ids'));
                this.country_modal = this.country_modal.filter(s => s.id != id);
                break;
            case 'sla_category_ids':
                id = this.processArrays(this.sla_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('sla_category_ids'));
                this.sla_category_modal = this.sla_category_modal.filter(s => s.id != id);
                break;
            case 'training_category_ids':
                id = this.processArrays(this.training_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('training_category_ids'));
                this.training_category_modal = this.training_category_modal.filter(s => s.id != id);
                break;
            case 'training_status_ids':
                id = this.processArrays(this.training_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('training_status_ids'));
                this.training_status_modal = this.training_status_modal.filter(s => s.id != id);
                break;
            case 'training_competency_group_ids':
                id = this.processArrays(this.training_competency_group_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('training_competency_group_ids'));
                this.training_competency_group_modal = this.training_competency_group_modal.filter(s => s.id != id);
                break;
            case 'training_competency_ids':
                id = this.processArrays(this.training_competency_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('training_competency_ids'));
                this.training_competency_modal = this.training_competency_modal.filter(s => s.id != id);
                break;
            case 'finding_status_ids':
                id = this.processArrays(this.finding_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('finding_status_ids'));
                this.finding_status_modal = this.finding_status_modal.filter(s => s.id != id);
                break;
            case 'external_audit_type_ids':
                id = this.processArrays(this.ea_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('external_audit_type_ids'));
                this.ea_type_modal = this.ea_type_modal.filter(s => s.id != id);
                break;
            case 'audit_report_status_ids':
                id = this.processArrays(this.audit_report_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('audit_report_status_ids'));
                this.audit_report_status_modal = this.audit_report_status_modal.filter(s => s.id != id);
                break;
            case 'finding_ids':
                id = this.processArrays(this.ea_finding_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('finding_ids'));
                this.ea_finding_modal = this.ea_finding_modal.filter(s => s.id != id);
                break;
            case 'root_cause_category_ids':
                id = this.processArrays(this.ea_root_cause_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('root_cause_category_ids'));
                this.ea_root_cause_category_modal = this.ea_root_cause_category_modal.filter(s => s.id != id);
                break;
            case 'root_cause_sub_category_ids':
                id = this.processArrays(this.ea_root_cause_sub_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('root_cause_sub_category_ids'));
                this.ea_root_cause_sub_category_modal = this.ea_root_cause_sub_category_modal.filter(s => s.id != id);
                break;
            case 'impact_analysis_category_ids':
                id = this.processArrays(this.ea_impact_analysis_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('impact_analysis_category_ids'));
                this.ea_impact_analysis_category_modal = this.ea_impact_analysis_category_modal.filter(s => s.id != id);
                break;
            case 'finding_corrective_action_status_ids':
                id = this.processArrays(this.ea_finding_corrective_action_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('finding_corrective_action_status_ids'));
                this.ea_finding_corrective_action_status_modal = this.ea_finding_corrective_action_status_modal.filter(s => s.id != id);
                break;
            case 'external_audit_ids':
                id = this.processArrays(this.external_audit_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('external_audit_ids'));
                this.external_audit_modal = this.external_audit_modal.filter(s => s.id != id);
                break;
            case 'audit_plan_status_ids':
                id = this.processArrays(this.audit_plan_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('audit_plan_status_ids'));
                this.audit_plan_status_modal = this.audit_plan_status_modal.filter(s => s.id != id);
                break;
            case 'asset_category_ids':
                id = this.processArrays(this.asset_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('asset_category_ids'));
                this.asset_category_modal = this.asset_category_modal.filter(s => s.id != id);
                break;
            case 'asset_matrix_category_ids':
                id = this.processArrays(this.asset_matrix_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('asset_matrix_category_ids'));
                this.asset_matrix_category_modal = this.asset_matrix_category_modal.filter(s => s.id != id);
                break;
            case 'asset_calculation_method_ids':
                id = this.processArrays(this.asset_calculation_method_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('asset_calculation_method_ids'));
                this.asset_calculation_method_modal = this.asset_calculation_method_modal.filter(s => s.id != id);
                break;
            case 'asset_ids':
                id = this.processArrays(this.asset_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('asset_ids'));
                this.asset_modal = this.asset_modal.filter(s => s.id != id);
                break;
            case 'asset_type_ids':
                id = this.processArrays(this.asset_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('asset_type_ids'));
                this.asset_type_modal = this.asset_type_modal.filter(s => s.id != id);
                break;
            case 'asset_status_ids':
                id = this.processArrays(this.asset_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('asset_status_ids'));
                this.asset_status_modal = this.asset_status_modal.filter(s => s.id != id);
                break;
            case 'asset_sub_category_ids':
                id = this.processArrays(this.asset_sub_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('asset_sub_category_ids'));
                this.asset_sub_category_modal = this.asset_sub_category_modal.filter(s => s.id != id);
                break;
            case 'asset_investment_type_ids':
                id = this.processArrays(this.asset_investment_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('asset_investment_type_ids'));
                this.asset_investment_type_modal = this.asset_investment_type_modal.filter(s => s.id != id);
                break;
            case 'physical_condition_ranking_ids':
                id = this.processArrays(this.asset_physical_condition_ranking_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('physical_condition_ranking_ids'));
                this.asset_physical_condition_ranking_modal = this.asset_physical_condition_ranking_modal.filter(s => s.id != id);
                break;
            case 'custodian_ids':
                id = this.processArrays(this.asset_custodian_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('custodian_ids'));
                this.asset_custodian_modal = this.asset_custodian_modal.filter(s => s.id != id);
                break;
            case 'supplier_ids':
                id = this.processArrays(this.asset_supplier_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('supplier_ids'));
                this.asset_supplier_modal = this.asset_supplier_modal.filter(s => s.id != id);
                break;
            case 'process_ids':
                id = this.processArrays(this.process_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('process_ids'));
                this.process_modal = this.process_modal.filter(s => s.id != id);
                break;
            case 'asset_maintenance_category_ids':
                id = this.processArrays(this.asset_maintenance_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('asset_maintenance_category_ids'));
                this.asset_maintenance_category_modal = this.asset_maintenance_category_modal.filter(s => s.id != id);
                break;
            case 'asset_maintenance_type_ids':
                id = this.processArrays(this.asset_maintenance_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('asset_maintenance_type_ids'));
                this.asset_maintenance_type_modal = this.asset_maintenance_type_modal.filter(s => s.id != id);
                break;
            case 'asset_maintenance_schedule_frequency_ids':
                id = this.processArrays(this.asset_maintenance_schedule_frequency_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('asset_maintenance_schedule_frequency_ids'));
                this.asset_maintenance_schedule_frequency_modal = this.asset_maintenance_schedule_frequency_modal.filter(s => s.id != id);
                break;
            case 'asset_maintenance_status_ids':
                id = this.processArrays(this.asset_maintenance_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('asset_maintenance_status_ids'));
                this.asset_maintenance_status_modal = this.asset_maintenance_status_modal.filter(s => s.id != id);
                break;
            //*KPI Management
            case 'kpi_management_status_ids':
                id = this.processArrays(this.kpi_management_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('kpi_management_status_ids'));
                this.kpi_management_status_modal = this.kpi_management_status_modal.filter(s => s.id != id);
                break;
            case 'kpi_management_kpi_ids':
                id = this.processArrays(this.kpis_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('kpi_management_kpi_ids'));
                this.kpis_modal = this.kpis_modal.filter(s => s.id != id);
                break;
            case 'kpi_management_kpi_score_status_ids':
                id = this.processArrays(this.kpis_score_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('kpi_management_kpi_score_status_ids'));
                this.kpis_score_status_modal = this.kpis_score_status_modal.filter(s => s.id != id);
                break;
            case 'kpi_management_kpi_improvement_plan_status_ids':
                id = this.processArrays(this.kpi_improvement_plnas_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('kpi_management_kpi_improvement_plan_status_ids'));
                this.kpi_improvement_plnas_status_modal = this.kpi_improvement_plnas_status_modal.filter(s => s.id != id);
                break;
            case 'kpi_category':
                id = this.processArrays(this.kpi_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('kpi_category'));
                this.kpi_category_modal = this.kpi_category_modal.filter(s => s.id != id);
                break;
            case 'kpi_category_ids':
                id = this.processArrays(this.kpi_category_id_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('kpi_category_ids'));
                this.kpi_category_id_modal = this.kpi_category_id_modal.filter(s => s.id != id);
                break;
            case 'kpi_type':
                id = this.processArrays(this.kpi_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('kpi_type'));
                this.kpi_type_modal = this.kpi_type_modal.filter(s => s.id != id);
                break;
            case 'kpi_type_ids':
                id = this.processArrays(this.kpi_type_id_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('kpi_type_ids'));
                this.kpi_type_id_modal = this.kpi_type_id_modal.filter(s => s.id != id);
                break;
            case 'kpi_review_frequency':
                id = this.processArrays(this.kpi_management_kpi_review_frequency_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('kpi_review_frequency'));
                this.kpi_management_kpi_review_frequency_modal = this.kpi_management_kpi_review_frequency_modal.filter(s => s.id != id);
                break;
            case 'review_frequency_ids':
                id = this.processArrays(this.kpi_review_frequency_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('review_frequency_ids'));
                this.kpi_review_frequency_modal = this.kpi_review_frequency_modal.filter(s => s.id != id);
                break;
            //**KPI Management    
            case 'test_and_exercise_status_ids':
                id = this.processArrays(this.test_and_exercise_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('test_and_exercise_status_ids'));
                this.test_and_exercise_status_modal = this.test_and_exercise_status_modal.filter(s => s.id != id);
                break;
            case 'role_ids':
                id = this.processArrays(this.role_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('role_ids'));
                this.role_modal = this.role_modal.filter(s => s.id != id);
                break;
            case 'test_and_exercise_type_ids':
                id = this.processArrays(this.test_and_exercise_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('test_and_exercise_type_ids'));
                this.test_and_exercise_type_modal = this.test_and_exercise_type_modal.filter(s => s.id != id);
                break;
            case 'bcp_status_ids':
                id = this.processArrays(this.bcp_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('bcp_status_ids'));
                this.bcp_status_modal = this.bcp_status_modal.filter(s => s.id != id);
                break;
            case 'bcm_ids':
                id = this.processArrays(this.bcm_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('bcm_ids'));
                this.bcm_modal = this.bcm_modal.filter(s => s.id != id);
                break;
            case 'bia_tire_ids':
                id = this.processArrays(this.bia_tier_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('bia_tire_ids'));
                this.bia_tier_modal = this.bia_tier_modal.filter(s => s.id != id);
                break;
            case 'bcs_status_ids':
                id = this.processArrays(this.bcs_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('bcs_status_ids'));
                this.bcs_status_modal = this.bcs_status_modal.filter(s => s.id != id);
                break;
            case 'business_continuity_strategy_type_ids':
                id = this.processArrays(this.bcm_status_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('business_continuity_strategy_type_ids'));
                this.bcm_status_type_modal = this.bcm_status_type_modal.filter(s => s.id != id);
                break;
            case 'target_unit_ids':
                id = this.processArrays(this.target_unit_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('target_unit_ids'));
                this.target_unit_modal = this.target_unit_modal.filter(s => s.id != id);
                break;
            case 'strategy_initiative_ids':
                id = this.processArrays(this.strategy_initiative_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('strategy_initiative_ids'));
                this.strategy_initiative_modal = this.strategy_initiative_modal.filter(s => s.id != id);
                break;
            case 'strategy_profile_ids':
                id = this.processArrays(this.strategy_profile_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('strategy_profile_ids'));
                this.strategy_profile_modal = this.strategy_profile_modal.filter(s => s.id != id);
                break;
            case 'strategy_initiative_action_plan_status_ids':
                id = this.processArrays(this.strategy_initiative_action_plan_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('strategy_initiative_action_plan_status_ids'));
                this.strategy_initiative_action_plan_status_modal = this.strategy_initiative_action_plan_status_modal.filter(s => s.id != id);
                break;
            case 'strategy_profile_focus_area_ids':
                id = this.processArrays(this.strategy_profile_focus_area_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('strategy_profile_focus_area_ids'));
                this.strategy_profile_focus_area_modal = this.strategy_profile_focus_area_modal.filter(s => s.id != id);
                break;
            case 'strategy_profile_objective_ids':
                id = this.processArrays(this.strategy_profile_objective_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('strategy_profile_objective_ids'));
                this.strategy_profile_objective_modal = this.strategy_profile_objective_modal.filter(s => s.id != id);
                break;
            case 'strategy_kpi_scoreboard_focus_area_ids':
                id = this.processArrays(this.kpi_scoreboard_focus_area_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('strategy_kpi_scoreboard_focus_area_ids'));
                this.kpi_scoreboard_focus_area_modal = this.kpi_scoreboard_focus_area_modal.filter(s => s.id != id);
                break;
            case 'strategy_kpi_scoreboard_objective_ids':
                id = this.processArrays(this.kpi_scoreboard_objective_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('strategy_kpi_scoreboard_objective_ids'));
                this.kpi_scoreboard_objective_modal = this.kpi_scoreboard_objective_modal.filter(s => s.id != id);
                break;
            case 'strategy_initiative_action_ids':
                id = this.processArrays(this.strategy_initiative_action_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('strategy_initiative_action_ids'));
                this.strategy_initiative_action_modal = this.strategy_initiative_action_modal.filter(s => s.id != id);
                break;
            case 'strategy_review_frequency_ids':
                id = this.processArrays(this.strategy_review_frequency_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('strategy_review_frequency_ids'));
                this.strategy_review_frequency_modal = this.strategy_review_frequency_modal.filter(s => s.id != id);
                break;
            case 'kpi_calculation_type_ids':
                id = this.processArrays(this.kpi_calculation_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('kpi_calculation_type_ids'));
                this.kpi_calculation_type_modal = this.kpi_calculation_type_modal.filter(s => s.id != id);
                break;
            case 'strategy_kpi_data_type_ids':
                id = this.processArrays(this.strategy_kpi_data_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('strategy_kpi_data_type_ids'));
                this.strategy_kpi_data_type_modal = this.strategy_kpi_data_type_modal.filter(s => s.id != id);
                break;
            case 'strategy_initiative_milestone_ids':
                id = this.processArrays(this.strategy_initiative_milestone_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('strategy_initiative_milestone_ids'));
                this.strategy_initiative_milestone_modal = this.strategy_initiative_milestone_modal.filter(s => s.id != id);
                break;
            case 'strategy_profile_status_ids':
                id = this.processArrays(this.strategy_profile_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('strategy_profile_status_ids'));
                this.strategy_profile_status_modal = this.strategy_profile_status_modal.filter(s => s.id != id);
                break;
            case 'location_ids':
                id = this.processArrays(this.project_location_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('location_ids'));
                this.project_location_modal = this.project_location_modal.filter(s => s.id != id);
                break;
            case 'event_location_ids':
                id = this.processArrays(this.event_location_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('event_location_ids'));
                this.event_location_modal = this.event_location_modal.filter(s => s.id != id);
                break;
            case 'task_phase_ids':
                id = this.processArrays(this.task_phase_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('task_phase_ids'));
                this.task_phase_modal = this.task_phase_modal.filter(s => s.id != id);
                break;
            case 'event_type_ids':
                id = this.processArrays(this.event_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('event_type_ids'));
                this.event_type_modal = this.event_type_modal.filter(s => s.id != id);
                break;
            case 'event_ids':
                id = this.processArrays(this.event_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('event_ids'));
                this.event_modal = this.event_modal.filter(s => s.id != id);
                break;
            case 'event_priority_ids':
                id = this.processArrays(this.event_priority_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('event_priority_ids'));
                this.event_priority_modal = this.event_priority_modal.filter(s => s.id != id);
                break;
            case 'event_periodicity_ids':
                id = this.processArrays(this.event_periodicity_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('event_periodicity_ids'));
                this.event_periodicity_modal = this.event_periodicity_modal.filter(s => s.id != id);
                break;
            case 'event_entrance_ids':
                id = this.processArrays(this.event_entrance_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('event_entrance_ids'));
                this.event_entrance_modal = this.event_entrance_modal.filter(s => s.id != id);
                break;
            case 'event_range_ids':
                id = this.processArrays(this.event_range_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('event_range_ids'));
                this.event_range_modal = this.event_range_modal.filter(s => s.id != id);
                break;
            case 'event_dimension_ids':
                id = this.processArrays(this.event_dimension_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('event_dimension_ids'));
                this.event_dimension_modal = this.event_dimension_modal.filter(s => s.id != id);
                break;
            case 'event_space_type_ids':
                id = this.processArrays(this.event_space_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('event_space_type_ids'));
                this.event_space_type_modal = this.event_space_type_modal.filter(s => s.id != id);
                break;
            case 'event_target_audience_ids':
                id = this.processArrays(this.event_target_audience_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('event_target_audience_ids'));
                this.event_target_audience_modal = this.event_target_audience_modal.filter(s => s.id != id);
                break;
            case 'event_status_ids':
                id = this.processArrays(this.event_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('event_status_ids'));
                this.event_status_modal = this.event_status_modal.filter(s => s.id != id);
                break;
            case 'event_task_status_ids':
                id = this.processArrays(this.event_task_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('event_task_status_ids'));
                this.event_task_status_modal = this.event_task_status_modal.filter(s => s.id != id);
                break;
            case 'event_closure_status_ids':
                id = this.processArrays(this.event_closure_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('event_closure_status_ids'));
                this.event_closure_status_modal = this.event_closure_status_modal.filter(s => s.id != id);
                break;
            case 'event_change_request_status_ids':
                id = this.processArrays(this.event_change_request_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('event_change_request_status_ids'));
                this.event_change_request_status_modal = this.event_change_request_status_modal.filter(s => s.id != id);
                break;
            case 'project_manager_ids':
                id = this.processArrays(this.project_manager_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('project_manager_ids'));
                this.project_manager_modal = this.project_manager_modal.filter(s => s.id != id);
                break;
            case 'audit_manager_ids':
                id = this.processArrays(this.am_audit_manager_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('requested_by_user_ids'));
                this.am_audit_manager_modal = this.am_audit_manager_modal.filter(s => s.id != id);
                break;
            case 'requested_by_user_ids':
                id = this.processArrays(this.am_audit_requested_by_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('audit_manager_ids'));
                this.am_audit_requested_by_modal = this.am_audit_requested_by_modal.filter(s => s.id != id);
                break;
            case 'ms_lead_auditor_ids':
                id = this.processArrays(this.ms_audit_leader_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_lead_auditor_ids'));
                this.ms_audit_leader_modal = this.ms_audit_leader_modal.filter(s => s.id != id);
                break;

            case 'ms_audit_finding_status_ids':
                id = this.processArrays(this.non_confirmity_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_audit_finding_status_ids'));
                this.non_confirmity_status_modal = this.non_confirmity_status_modal.filter(s => s.id != id);
                break;

            case 'ms_audit_category_ids':
                id = this.processArrays(this.ms_audit_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_audit_category_ids'));
                this.ms_audit_category_modal = this.ms_audit_category_modal.filter(s => s.id != id);
                break;

            case 'ms_audit_ids':
                id = this.processArrays(this.ms_audit_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_audit_ids'));
                this.ms_audit_modal = this.ms_audit_modal.filter(s => s.id != id);
                break;

            case 'project_contract_type_ids':
                id = this.processArrays(this.project_contract_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('project_contract_type_ids'));
                this.project_contract_type_modal = this.project_contract_type_modal.filter(s => s.id != id);
                break;
            case 'project_priority_ids':
                id = this.processArrays(this.project_priority_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('project_priority_ids'));
                this.project_priority_modal = this.project_priority_modal.filter(s => s.id != id);
                break;
            case 'project_monitoring_status_ids':
                id = this.processArrays(this.project_monitoring_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('project_monitoring_status_ids'));
                this.project_monitoring_status_modal = this.project_monitoring_status_modal.filter(s => s.id != id);
                break;
            case 'project_category_ids':
                id = this.processArrays(this.project_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('project_category_ids'));
                this.project_category_modal = this.project_category_modal.filter(s => s.id != id);
                break;
            case 'project_type_ids':
                id = this.processArrays(this.project_type_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('project_type_ids'));
                this.project_type_modal = this.project_type_modal.filter(s => s.id != id);
                break;
            case 'project_ids':
                id = this.processArrays(this.project_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('project_ids'));
                this.project_modal = this.project_modal.filter(s => s.id != id);
                break;
            case 'parent_id':
                id = this.processArrays(this.parent_project_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('parent_id'));
                this.parent_project_modal = this.parent_project_modal.filter(s => s.id != id);
                break;
            case 'project_issue_ids':
                id = this.processArrays(this.project_issue_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('project_issue_ids'));
                this.project_issue_modal = this.project_issue_modal.filter(s => s.id != id);
                break;
            case 'project_issue_status_ids':
                id = this.processArrays(this.project_issue_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('project_issue_status_ids'));
                this.project_issue_status_modal = this.project_issue_status_modal.filter(s => s.id != id);
                break;
            case 'project_monitor_closure_status_ids':
                id = this.processArrays(this.project_monitor_closure_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('project_monitor_closure_status_ids'));
                this.project_monitor_closure_status_modal = this.project_monitor_closure_status_modal.filter(s => s.id != id);
                break;
            case 'project_change_request_status_ids':
                id = this.processArrays(this.project_change_request_statu_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('project_change_request_status_ids'));
                this.project_change_request_statu_modal = this.project_change_request_statu_modal.filter(s => s.id != id);
                break;
            case 'document_category_ids':
                id = this.processArrays(this.document_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('document_category_ids'));
                this.document_category_modal = this.document_category_modal.filter(s => s.id != id);
                break;
            case 'document_sub_category_ids':
                id = this.processArrays(this.document_sub_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('document_sub_category_ids'));
                this.document_sub_category_modal = this.document_sub_category_modal.filter(s => s.id != id);
                break;
            case 'document_sub_sub_category_ids':
                id = this.processArrays(this.document_sub_sub_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('document_sub_sub_category_ids'));
                this.project_change_request_statu_modal = this.project_change_request_statu_modal.filter(s => s.id != id);
                break;
            case 'document_family_ids':
                id = this.processArrays(this.document_family_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('document_family_ids'));
                this.project_change_request_statu_modal = this.project_change_request_statu_modal.filter(s => s.id != id);
                break;
            case 'am_audit_control_self_assesement_status_ids':
                id = this.processArrays(this.am_audit_control_self_assesement_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('am_audit_control_self_assesement_status_ids'));
                this.am_audit_control_self_assesement_status_modal = this.am_audit_control_self_assesement_status_modal.filter(s => s.id != id);
                break;
            case 'am_audit_category_ids':
                id = this.processArrays(this.am_audit_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('am_audit_category_ids'));
                this.am_audit_category_modal = this.am_audit_category_modal.filter(s => s.id != id);
                break;
            case 'am_annual_plan_frequency_ids':
                id = this.processArrays(this.am_anual_plan_frequency_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('am_annual_plan_frequency_ids'));
                this.am_anual_plan_frequency_modal = this.am_anual_plan_frequency_modal.filter(s => s.id != id);
                break;
            case 'am_annual_plan_frequency_item_ids':
                id = this.processArrays(this.am_anual_plan_frequency_item_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('am_annual_plan_frequency_item_ids'));
                this.am_anual_plan_frequency_item_modal = this.am_anual_plan_frequency_item_modal.filter(s => s.id != id);
                break;
            case 'am_audit_status_ids':
                id = this.processArrays(this.am_audit_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('am_audit_status_ids'));
                this.am_audit_status_modal = this.am_audit_status_modal.filter(s => s.id != id);
                break;
            case 'am_audit_test_plan_status_ids':
                id = this.processArrays(this.am_audit_test_plan_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('am_audit_test_plan_status_ids'));
                this.am_audit_test_plan_status_modal = this.am_audit_test_plan_status_modal.filter(s => s.id != id);
                break;
            case 'status':
                id = this.processArrays(this.status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('status'));
                this.status_modal = this.status_modal.filter(s => s.id != id);
                break;
            case 'am_audit_information_request_status_ids':
                id = this.processArrays(this.am_audit_info_request_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('am_audit_information_request_status_ids'));
                this.am_audit_info_request_status_modal = this.am_audit_info_request_status_modal.filter(s => s.id != id);
                break;
            case 'am_annual_plan_auditable_item_ids':
                id = this.processArrays(this.am_annual_plan_auditable_item_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('am_annual_plan_auditable_item_ids'));
                this.am_annual_plan_auditable_item_modal = this.am_annual_plan_auditable_item_modal.filter(s => s.id != id);
                break;
            // Mock Drill
            case 'mock_drill_plan_ids':
                id = this.processArrays(this.mock_drill_plan_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('mock_drill_plan_ids'));
                this.mock_drill_plan_ng_modal = this.mock_drill_plan_ng_modal.filter(s => s.id != id);
                break;
            case 'mock_drill_type_ids':
                id = this.processArrays(this.mock_drill_type_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('mock_drill_type_ids'));
                this.mock_drill_type_ng_modal = this.mock_drill_type_ng_modal.filter(s => s.id != id);
                break;
            case 'mock_drill_status_ids':
                id = this.processArrays(this.mock_drill_status_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('mock_drill_status_ids'));
                this.mock_drill_status_ng_modal = this.mock_drill_status_ng_modal.filter(s => s.id != id);
                break;
            case 'incident_controller_ids':
                id = this.processArrays(this.mock_drill_controller_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('incident_controller_ids'));
                this.mock_drill_controller_ng_modal = this.mock_drill_controller_ng_modal.filter(s => s.id != id);
                break;

            case 'ms_audit_finding_corrective_action_status_ids':
                id = this.processArrays(this.ms_audit_finding_ca_status_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_audit_finding_corrective_action_status_ids'));
                this.ms_audit_finding_ca_status_ng_modal = this.ms_audit_finding_ca_status_ng_modal.filter(s => s.id != id);
                break;

            case 'ms_audit_finding_corrective_action_status_ids':
                id = this.processArrays(this.ms_audit_finding_ca_status_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_audit_finding_corrective_action_status_ids'));
                this.ms_audit_finding_ca_status_ng_modal = this.ms_audit_finding_ca_status_ng_modal.filter(s => s.id != id);
                break; 

            case 'ms_audit_finding_ids':
                id = this.processArrays(this.ms_audit_finding_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_audit_finding_ids'));
                this.ms_audit_finding_ng_modal = this.ms_audit_finding_ng_modal.filter(s => s.id != id);
                break; 
            
            case 'ms_audit_finding_category_ids':
                id = this.processArrays(this.ms_audit_finding_category_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_audit_finding_category_ids'));
                this.ms_audit_finding_category_modal = this.ms_audit_finding_category_modal.filter(s => s.id != id);
                break;

            case 'ms_audit_mode_ids':
                id = this.processArrays(this.ms_audit_mode_ng_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_audit_mode_ids'));
                this.ms_audit_mode_ng_modal = this.ms_audit_mode_ng_modal.filter(s => s.id != id);
                break; 

            case 'ms_audit_plan_ids':
                id = this.processArrays(this.ms_audit_plan_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_audit_plan_ids'));
                this.ms_audit_plan_modal = this.ms_audit_plan_modal.filter(s => s.id != id);
                break;

            case 'ms_audit_program_ids':
                id = this.processArrays(this.ms_audit_program_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_audit_program_ids'));
                this.ms_audit_program_modal = this.ms_audit_program_modal.filter(s => s.id != id);
                break; 

            case 'ms_audit_schedule_status_ids':
                id = this.processArrays(this.ms_audit_schedule_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('ms_audit_schedule_status_ids'));
                this.ms_audit_schedule_status_modal = this.ms_audit_schedule_status_modal.filter(s => s.id != id);
                break;

            case 'cyber_incident_classification_ids':
                id = this.processArrays(this.incident_classification_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('cyber_incident_classification_ids'));
                this.incident_classification_modal = this.incident_classification_modal.filter(s => s.id != id);
                break;

            case 'cyber_incident_status_ids':
                    id = this.processArrays(this.cyber_incident_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('cyber_incident_status_ids'));
                    this.cyber_incident_status_modal = this.cyber_incident_status_modal.filter(s => s.id != id);
                    break;
            case 'cyber_incident_ids':
                        id = this.processArrays(this.cyber_incident_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('cyber_incident_ids'));
                        this.cyber_incident_modal = this.cyber_incident_modal.filter(s => s.id != id);
                        break;
            case 'cyber_incident_corrective_action_status_ids':
                    id = this.processArrays(this.cyber_incident_corrective_action_status_modal, RightSidebarLayoutStore.getSelectedFilterValuesFor('cyber_incident_corrective_action_status_ids'));
                    this.cyber_incident_corrective_action_status_modal = this.cyber_incident_corrective_action_status_modal.filter(s => s.id != id);
                    break;
        }
        this._utilityService.detectChanges(this._cdr);
    }

    getDefaultImage(type) {
        return this._imageService.getDefaultImageUrl(type);
    }

    createImageUrl(type, token) {
        return this._bpmFileService.getThumbnailPreview(type, token);
    }

    getStringsFormatted(stringArray, characterLength, seperator) {
        return this._helperService.getFormattedName(stringArray, characterLength, seperator);
    }

    customSearchFn(term: string, item: any) {
        term = term.toLowerCase();
        // Creating and array of space saperated term and removinf the empty values using filter
        let splitTerm = term.split(' ').filter(t => t);
        let isWordThere = [];
        // Pushing True/False if match is found
        splitTerm.forEach(arr_term => {
            item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
            let search = item['searchLabel'].toLowerCase();
            if (search) isWordThere.push(search.indexOf(arr_term) != -1);
        });

        const all_words = (this_word) => this_word;
        // Every method will return true if all values are true in isWordThere.
        return isWordThere.every(all_words);
    }

    getSubSection() {
        if (this.section_ng_modal.length > 0) {
            var params = '';
            if (this.subsidiary_ng_modal.length > 0)
                params = '&organization_ids=' + this._helperService.
                    createParameterFromArray(this.subsidiary_ng_modal);

            if (this.division_ng_modal.length > 0)
                params += '&division_ids=' + this._helperService.
                    createParameterFromArray(this.division_ng_modal);

            if (this.department_ng_model.length > 0)
                params += '&department_ids=' + this._helperService.
                    createParameterFromArray(this.department_ng_model);

            if (this.section_ng_modal.length > 0 && AuthStore.getActivityPermission(100, 'SUB_SECTION_LIST'))
                params += '&section_ids=' + this._helperService.createParameterFromArray(this.section_ng_modal);
            this._subSectionService.getItems(false, params).subscribe(res => {
                this._utilityService.detectChanges(this._cdr)
            });
        }
    }


    getDivsion() {
        var params = '';
        if (this.subsidiary_ng_modal.length > 0) params = '&organization_ids=' +
            this._helperService.createParameterFromArray(this.subsidiary_ng_modal);
        this._divisionService.getItems(false, params).subscribe(res => {
            this._utilityService.detectChanges(this._cdr)
        });

    }

    getDepartment() {
        var params = '';
        if (this.subsidiary_ng_modal.length > 0)
            params = '&organization_ids=' + this._helperService.
                createParameterFromArray(this.subsidiary_ng_modal);
        if (this.division_ng_modal.length > 0)
            params += '&division_ids=' + this._helperService.
                createParameterFromArray(this.division_ng_modal);
        this._departmentService.getItems(false, params).subscribe(res => {
            this._utilityService.detectChanges(this._cdr)
        });

    }

    getSection() {
        var params = '';
        if (this.subsidiary_ng_modal.length > 0)
            params = '&organization_ids=' + this._helperService.
                createParameterFromArray(this.subsidiary_ng_modal);
        if (this.division_ng_modal.length > 0)
            params += '&division_ids=' + this._helperService.
                createParameterFromArray(this.division_ng_modal);
        if (this.department_ng_model.length > 0)
            params += '&department_ids=' + this._helperService.
                createParameterFromArray(this.department_ng_model);
        this._sectionService.getItems(false, params).subscribe(res => {
            this._utilityService.detectChanges(this._cdr)
        });

    }


    /**
     * @description
     * this method is used for getting users list
     * @param {*} 
     * @memberof RightSideMenuLayout
     */
    getUsers() {
        let params = ''
        this._usersService
            .getUsersWithoutFilter(params)
            .subscribe((res) => {
                this._utilityService.detectChanges(this._cdr);
            });

    }

    getRisks() {
        this._riskService.getItems(false, '').subscribe(res => {
            // RiskDashboardStore.riskDashboardParam=null;
            this._utilityService.detectChanges(this._cdr);
        })
        // this._riskTreatmentService.getItems(false, '', false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    }


    /**
     * @description
     * this method is used for risk rating score list
     *
     * @param {*} 
     * @memberof RightSideMenuLayout
     */
    processRiskRatingScores() {
        let riskRatingFullArray = []
        this._riskRatingService.getItems().subscribe(res => {
            if (res['data'].length > 0) {
                for (let i of res['data']) {
                    if (i.risk_rating_values) {
                        i.risk_rating_values.forEach((score) => {
                            if (!riskRatingFullArray.includes(score)) {
                                riskRatingFullArray.push({ id: score, title: score });
                            }
                        })
                        this.riskRatingScores = riskRatingFullArray.filter((item, pos, self) => self.indexOf(item) == pos)
                    }
                }
            }
        });
    }


    /** Search Start here */

    /**
 * @description
 * this method is used for search item
 *
 * @param {*} 
 * @memberof RightSideMenuLayout
 */
    searchProductCategories(searchTerm: any) {
        this._productsService.getProductCategories('?q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchItem(searchTerm: any) {
        this._businessService.getServiceCategories('?q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchUsers(searchTerm: any) {
        this._usersService.getUsersWithoutFilter('?q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchCustomerComplaintType(searchTerm: any) {
        this._customerCompliantTypeService.getItems(false, '?q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchCustomerComplaintSource(searchTerm: any) {
        this._customerComplaintSourceService.getItems(false, '?q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchCustomerComplaintStatus(searchTerm: any) {
        this._customerCompliantStatusService.getItems(false, '?q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchCustomerInvestigationStatus(searchTerm: any) {
        this._customerComplaintInvestigationStatusService.getItems(false, '?q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchCustomerComplaintActionPlanType(searchTerm: any) {
        this._customerComplaintActionTypesService.getItems(false, '?q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchCustomerComplaintActionPlanStatus(searchTerm: any) {
        this._customerComplaintActionPlanStatusesService.getItems(false, '?q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchCustomers(searchTerm: any) {
        this._customersService.getItems(false, '?q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMsTypeVersions(searchTerm: any) {
        this._msTypeVersionService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMsTypes(searchTerm: any) {
        this._msTypeService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchBranches(searchTerm: any) {
        this._branchService.getItems('?q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchOrganizations(searchTerm: any) {
        this._subsidiaryService.getAllItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchDepartments(searchTerm: any) {
        this._departmentService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchRiskTreatmentStatus(searchTerm: any) {
        this._riskTreatmentStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchControlCategory(searchTerm: any) {
        this._controlCategService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchControlType(searchTerm: any) {
        this._controlTypesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchControlMode(searchTerm: any) {
        this._controlModeService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchControlEfficiencyMeasure(searchTerm: any) {
        this._controlEfficiencyMeasureService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchProcessCategory(searchTerm: any) {
        this._processCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchProcessGroup(searchTerm: any) {
        this._processGroupService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchRisk(searchTerm: any) {
        this._riskService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchIssueTypes(searchTerm: any) {
        this._issueTypeService.getAllItems('q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchIssueDomains(searchTerm: any) {
        this._issueDomainService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchSubSections(searchTerm: any) {
        if (this.section_ng_modal && AuthStore.getActivityPermission(100, 'SUB_SECTION_LIST')) this._subSectionService.getItems(false,
            '&q=' + searchTerm.term + '&section_ids=' + this._helperService.createParameterFromArray(this.section_ng_modal)).subscribe();
        // this._subSectionService.getItems(false,'&q='+searchTerm.term).subscribe(res=>{
        //     this._utilityService.detectChanges(this._cdr);
        // });
    }

    searchSubsidiaries(searchTerm: any) {
        this._subsidiaryService.getAllItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchNonConfirmityStatus(searchTerm: any) {
        this._msAuditFindingStatusService.getItems(true, 'q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMsAuditCategory(searchTerm: any) {
        this._msAuditCategoryService.getItems(true, '?q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }


    searchDivisions(searchTerm: any) {
        this._divisionService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchDesignations(searchTerm: any) {
        this._designationService.getItemsWithoutFilter('?q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchIssueCategories(searchTerm: any) {
        this._issueCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchSection(searchTerm: any) {
        this._sectionService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }


    searchControlSubCategories(searchTerm: any) {
        this._controlSubCatService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAuditableItem(searchTerm: any) {
        this._auditableItemService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAudit(searchTerm: any) {
        this._auditService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchFindingCategory(searchTerm: any) {
        this._auditFindingCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchLanguage(searchTerm: any) {
        this._languageService.getAllItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchRiskStatus(searchTerm: any) {
        this._riskStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAuditableItemCategory(searchTerm: any) {
        this._auditableItemCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAuditStatus(searchTerm: any) {
        this._auditReportStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAuditableItemType(searchTerm: any) {
        this._auditableItemTypesService.getAllItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAuditProgram(searchTerm: any) {
        this._auditProgranService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAuditPlan(searchTerm: any) {
        this._auditPlanService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAuditPlanStatuses(searchTerm: any) {
        this._auditPlanStatusesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAuditObjective(searchTerm: any) {
        this._auditObjectiveService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAuditCriteria(searchTerm: any) {
        this._auditCriteriaService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchRiskClassification(searchTerm: any) {
        this._riskClassificationService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchRiskCategory(searchTerm: any) {
        this._riskCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchRiskType(searchTerm: any) {
        this._riskTypesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchRiskSource(searchTerm: any) {
        this._riskSourceService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchRiskControlPlan(searchTerm: any) {
        this._riskControlPlanService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchStakeholders(searchTerm: any) {
        this._stakeholderService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchDesignation(searchTerm: any) {
        this._designationService.getItemsWithoutFilter('?q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMeetingCategory(searchTerm: any) {
        this._meetingCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMeetingPlanStatus(searchTerm: any) {
        this._meetingStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchVenue(searchTerm: any) {
        this._venueService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMeetingPlan(searchTerm: any) {
        this._meetingPlanService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMeetingActionPlanStatus(searchTerm: any) {
        this._actionPlanStatusService.getAllItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMeeting(searchTerm: any) {
        this._meetingService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchDocumentType(searchTerm: any) {
        this._documentTypesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchDocumentAccess(searchTerm: any) {
        this._documentAccessTypeService.getAllItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchDocumentStatus(searchTerm: any) {
        this.statuses = [];
        this._documentStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            for (let i of res['data']) {
                if (i.type == 'archived' || i.type == 'expired' || i.type == 'published' || i.type == 'approved'
                || i.type == 'rejected' || i.type == 'reverted' || i.type == 'in-review' || i.type == 'draft') {
                  this.statuses.push(i);
                }
              }
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchDocumentTitle(searchTerm: any) {
        this._documentsService.getAllItems('', false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchRiskRateCategory(searchTerm: any) {
        this._riskRatingService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchSolutionScore(searchTerm: any) {

        return this.scores.filter(() => {
            this.scores['value'] == searchTerm;
        })
    }

    searchRequestStatus(searchTerm: any) {
        this._documentChangeRequestTypeService.getAllItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAssessmentFramework(searchTerm: any) {
        this._frameworksService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchActionPlan(searchTerm: any) {
        this._BaActionPlanStatusService.getAllItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAssessment(searchTerm: any) {
        this._assessmentsService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAssessmentStatus(searchTerm: any) {
        this._frameworksService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchUnsafeActionCategory(searchTerm: any) {
        this._unsafeActionCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchUnsafeActionSubCategory(searchTerm: any) {
        this._UnsafeActionSubCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchUnsafeActionObservedGroup(searchTerm: any) {
        this._jsoUnsafeActionObservedGroupService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }
    searchIncidentCategory(searchTerm: any) {
        this._incidentCategoriesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }
    searchIncidentSubCategory(searchTerm: any) {
        this._incidentSubCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchIncidentDamageType(searchTerm: any) {
        this._incidentDamageTypesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }
    searchIncidentStatus(searchTerm: any) {
        this._incidentStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchIncidentCorrectiveActionStatus(searchTerm: any) {
        this._incidentCorrectiveActionStatus.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchComplianceDocumentType(searchTerm: any) {
        this._complianceTypeService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchComplianceDocumentArea(searchTerm: any) {
        this._complianceAreaService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchComplianceDocumentSection(searchTerm: any) {
        this._complianceSectionService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchSlaCategory(searchTerm: any) {
        this._slaCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchTrainingCategory(searchTerm: any) {
        this._trainingCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchTrainingStatus(searchTerm: any) {
        this._trainingStatusService.getItems(false, '&q=' + searchTerm.term + '&training_dashboard_status=true').subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchTrainingCompetencyGroup(searchTerm: any) {
        this._competencyGroupService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchTrainingCompetency(searchTerm: any) {
        this._competencyService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAuditType(searchTerm: any) {
        this._externalAuditTypesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAuditFinding(searchTerm: any) {
        this._findingsService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAuditRootcauseCategory(searchTerm: any) {
        this._rootCauseCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAuditRootcauseSubCategory(searchTerm: any) {
        this._rootCauseSubCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchImpactAnalysisCategory(searchTerm: any) {
        this._findingImpactAnalysisService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchFindingCorrectiveActionStatuses(searchTerm: any) {
        this._findingCorrectiveActionStatusesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchExternalAudit(searchTerm: any) {
        this._externalAuditService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAssetCategory(searchTerm: any) {
        this._assetCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAssetMatrixCategory(searchTerm: any) {
        this._assetMatrixCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAssetCalculationMethod(searchTerm: any) {
        this._assetCalculationMethodService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAsset(searchTerm: any) {
        this._assetRegisterService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAssetTypes(searchTerm: any) {
        this._assetTypesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAssetStatus(searchTerm: any) {
        this._assetStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAssetSubCategory(searchTerm: any) {
        this._assetSubCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAssetInvestmentType(searchTerm: any) {
        this._assetInvestmentTypesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchPhysicalConditionRanking(searchTerm: any) {
        this._physicalConditionRankingsService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchCustodian(searchTerm: any) {
        this._designationService.getItemsWithoutFilter('?q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchSupplier(searchTerm: any) {
        this._suppliersService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchProcess(searchTerm: any) {
        this._processService.getAllItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAssetMaintenanceCategory(searchTerm: any) {
        this._assetMaintenanceCategoriesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAssetMaintenanceType(searchTerm: any) {
        this._assetMaintenanceTypesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }
    searchAssetMaintenanceScheduleFrequency(searchTerm: any) {
        this._assetMaintenanceScheduleFrequenciesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAssetMaintenanceStatus(searchTerm: any) {
        this._assetMaintenanceStatusesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    // *KPI Management
    searchKpiMagementStatus(searchTerm: any) {
        this._kpiManagementStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchKpiScoreStatus(searchTerm: any) {
        this._kpiScoreStatusesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchKpiCategory(searchTerm: any) {
        this._kpiCategoryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchKpiType(searchTerm: any) {
        this._kpiTypesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchkpiReviewFrequency(searchTerm: any) {
        this._kpiReviewFrequenciesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchkpiReviewFrequencies(searchTerm: any) {
        this._kpiReviewFrequenciesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    //kpi improvement plans
    searchKpiImprovementPlansStatus(searchTerm: any) {
        this._kpiImprovementPlanStatuesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    //kpi score
    searchKpi(searchTerm: any) {
        this._kpisService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }
    // **KPI Management

    searchComplianceStatus(searchTerm: any) {
        this._complianceStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchTestAndExerciseStatus(searchTerm: any) {
        this._testExcerciseStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchTestAndExerciseType(searchTerm: any) {
        this._testAndExerciseTypes.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchBCPStatus(searchTerm: any) {
        this._businessContinuityPlanStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchBiaTier(searchTerm: any) {
        this._biaTierService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchBCM(searchTerm: any) {
        this._bcpService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchTargetUnit(searchTerm: any) {
        this._unitService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchStrategyInitiative(searchTerm: any) {
        this._intiativeService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchStrategyInitiativeActionPlanStatus(searchTerm: any) {
        this._strategyInitiativeActionPlanStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchProfileFocusArea(searchTerm: any) {
        this._focusAreaService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchProfileObjective(searchTerm: any) {
        this._objectivesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchKPIScoreboardFocusArea(searchTerm: any) {
        this._service.focusAreaList(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchKPIScoreboardObjective(searchTerm: any) {
        this._objectivesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchInitiativeAction(searchTerm: any) {
        this._strategyInitiativeActionService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchStrategyInitiativeReviewFrequency(searchTerm: any) {
        this._strategyInitiativeReviewFrequencyService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchKpiCalculationTypes(searchTerm: any) {
        this._kpiCalculationTypesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchStrategyKpiDataTypes(searchTerm: any) {
        this._strategyKpiDataTypesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchFindingStatuses(searchTerm: any) {
        this._findingStatusesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchStrategyMilesstone(searchTerm: any) {
        this._intiativeService.getMilestons('?=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchStrategyProfileStatus(searchTerm: any) {
        this._strategyProfileStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAssessmentAssessmentStatus(searchTerm: any) {
        this._businessAssessmentStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchBcsStatus(searchTerm: any) {
        this._bcsStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchBcsType(searchTerm: any) {
        this._bcsTypes.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchRegion(searchTerm: any) {
        this._regionService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchCountry(searchTerm: any) {
        this._countryService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchRoles(searchTerm: any) {
        this._usersService.getRoles('?=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchAuditReportStatus(searchTerm: any) {
        this._auditReportStatusService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchLocations(searchTerm: any) {
        this._locationService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchContractType(searchTerm: any) {
        this._projectContractTypeService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchPriority(searchTerm: any) {
        this._projectPriorityService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchPeriodicity(searchTerm: any) {
        this._eventPeriodicityService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchEntrance(searchTerm: any) {
        this._eventEntranceService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchRange(searchTerm: any) {
        this._eventRangeService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchDimension(searchTerm: any) {
        this._eventDimensionService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchSpaceType(searchTerm: any) {
        this._eventSpaceTypeService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchTargetAudience(searchTerm: any) {
        this._eventTargetAudienceService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchEventStatus(searchTerm: any) {
        this._statusService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchTaskPhase(searchTerm: any) {
        this._taskPhaseService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchEventTaskStatus(searchTerm: any) {
        this._taskstatusService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchEventClosureStatus(searchTerm: any) {
        this._eventClosureStatusService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchEventChangeRequestStatus(searchTerm: any) {
        this._eventChangeRequestStatusService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchProjectStatus(searchTerm: any) {
        this._projectMonitoringStatusService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchAmAuditCategory(searchTerm: any) {
        this._auditCategoryService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchAmAuditControlSelfAssesementStatus(searchTerm: any) {
        this._auditControlSelfAssesementStatusService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchAmAnualPlanFrequency(searchTerm: any) {
        this._annualPlanFrequencyService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchAmAnualPlanFrequencyItem(searchTerm: any) {
        this._annualPlanFrequencyItemService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchAmAuditStatus(searchTerm: any) {
        this._auditStatusesService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchAmAuditTestPlanStatus(searchTerm: any) {
        this._auditTestPlanStatusService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchStatus(searchTerm: any) {
        this._processService.getStatusIds(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchAmAuditInfoRequestStatus(searchTerm: any) {
        this._informationRequestStatusesService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchAmAnualPlanAuditableItem(searchTerm: any) {
        this._amAuditableItemService.getAuditableItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchProject(searchTerm: any) {
        this._projectService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchParentProject(searchTerm: any) {
        this._projectService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchProjectCategory(searchTerm: any) {
        this._projectCategoryService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchProjectType(searchTerm: any) {
        this._projectTypeService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchProjectIssue(searchTerm: any) {
        this._projectIssueService.getAllItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }

    searchProjectIssueStatus(searchTerm: any) {
        this._projectIssueStatusService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchProjectClosureStatus(searchTerm: any) {
        this._projectClosureStatusService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchProjectChangeRequestStatus(searchTerm: any) {
        this._projectChangeRequestStatusService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }
    searchDocumentCategories(searchTerm: any) {
        this._documentCategoryService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }
    searchDocumentSubCategories(searchTerm: any) {
        this._documentSubCategoryService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }
    searchDocumentSubSubCategories(searchTerm: any) {
        this._documentSubSubCategoryService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }
    searchDocumentFamily(searchTerm: any) {
        this._documentFamilyService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });

    }
    searchEventType(searchTerm: any) {
        this._eventTypeService.getItems(false, '&=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }
    searchEvent(searchTerm: any) {
        this._eventService.getItems('&=' + searchTerm.term, false).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }
    // Mock Drill
    searchMockDrillPlan(searchTerm: any) {
        this._mockDrillPlanService.getItems(false, '&used_plan_id&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }
    searchMockDrillType(searchTerm: any) {
        this._mockDrillTypeService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }
    searchMockDrillStatus(searchTerm: any) {
        this._mockDrillStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchFindingCAStatus(searchTerm: any) {
        this._msAuditFindingCaStatusesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchFindingMsAudit(searchTerm: any) {
        this._auditNonConfirmityService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMSAuditMode(searchTerm: any) {
        this._msAuditModesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMSAuditPlanStatus(searchTerm: any) {
        this._msAuditPlanStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMSAuditProgram(searchTerm: any) {
        this._msAuditProgramsService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMSAuditStatus(searchTerm: any) {
        this._msAuditStatusesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMSAuditPlan(searchTerm: any) {
        this._msAuditPlansService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMSAuditFindingCategory(searchTerm: any) {
        this._msAuditFindingCategoriesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMSAuditScheduleStatus(searchTerm: any) {
        this._msAuditScheduleStatusesService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchMSAudit(searchTerm: any) {
        this._msAuditService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchIncidentClassification(searchTerm: any) {
        this._cyberIncidentClassificationService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchCyberIncidentStatus(searchTerm: any) {
        this._cyberIncidentStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchCyberIncident(searchTerm: any) {
        this._cyberIncidentService.getAllItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }

    searchCyberIncidentCorrectiveActionStatus(searchTerm: any) {
        this._cyberIncidentCorrectiveActionStatusService.getItems(false, '&q=' + searchTerm.term).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
        });
    }
    /** Search end  */



    /**
 * @description
 * Called once, before the instance is destroyed.
 * Add 'implements OnDestroy' to the class.
 *
 * @memberof RightSideMenuLayout
 */
    ngOnDestroy() {
        if (this.reactionDisposer) this.reactionDisposer();
        ObjectiveScoreStore.unsetObjectives();
        this.filterSubscription.unsubscribe();
    }

}