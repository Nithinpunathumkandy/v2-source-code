import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  modalChange: EventEmitter<number> = new EventEmitter();
  userGuide: EventEmitter<number> = new EventEmitter();
  productCategory: EventEmitter<number> = new EventEmitter();
  serviceCategory: EventEmitter<number> = new EventEmitter();
  userDocument: EventEmitter<number> = new EventEmitter();
  userKpiControl: EventEmitter<number> = new EventEmitter();
  userDocumentControl: EventEmitter<number> = new EventEmitter();
  userJdControl: EventEmitter<number> = new EventEmitter();
  msTypeVersion: EventEmitter<number> = new EventEmitter();
  msType: EventEmitter<number> = new EventEmitter();
  bpmAssetModal: EventEmitter<number> = new EventEmitter();
  incidentCategories: EventEmitter<number> = new EventEmitter();
  bcpTemplateAdd: EventEmitter<number> = new EventEmitter();
  ocFullView: EventEmitter<number> = new EventEmitter();
  jsoCategory: EventEmitter<number> = new EventEmitter();
  jsoSubCategory: EventEmitter<number> = new EventEmitter();
  jsoUnsafeActionObservedGroup: EventEmitter<number> = new EventEmitter();
  jsoUnsafeActionSubCategory: EventEmitter<number> = new EventEmitter();
  jsoUnsafeActionCategory: EventEmitter<number> = new EventEmitter();
  jsoObservationType: EventEmitter<number> = new EventEmitter();
  trainingCategory: EventEmitter<number> = new EventEmitter();
  strategyInitiativeAction: EventEmitter<number> = new EventEmitter()
  incidentSubCategory: EventEmitter<number> = new EventEmitter();
  objectiveMasterModalControl: EventEmitter<number> = new EventEmitter();
  otherUsersModalControl: EventEmitter<number> = new EventEmitter();
  controlSubCategory: EventEmitter<number> = new EventEmitter();
  controlCategory: EventEmitter<number> = new EventEmitter();
  controlMode: EventEmitter<number> = new EventEmitter();
  productCategoryMasterControl: EventEmitter<number> = new EventEmitter();
  complianceRegisterFocusControl: EventEmitter<number> = new EventEmitter();
  serviceCategoryMasterControl: EventEmitter<number> = new EventEmitter();
  organizationComplainesCategory: EventEmitter<number> = new EventEmitter();
  organizationComplianceType: EventEmitter<number> = new EventEmitter();
  slaCategory: EventEmitter<number> = new EventEmitter();
  storageTypes: EventEmitter<number> = new EventEmitter();
  businessApplicationType: EventEmitter<number> = new EventEmitter();
  PhysicalConditionRankings: EventEmitter<number> = new EventEmitter();
  AssetMaintenanceCategories: EventEmitter<number> = new EventEmitter();
  AssetMatrixCategories: EventEmitter<number> = new EventEmitter();
  processAccessibility: EventEmitter<number> = new EventEmitter();
  msAuditTeam: EventEmitter<number> = new EventEmitter();
  msAuditCheckList: EventEmitter<number> = new EventEmitter();
  msAuditChooseCheckList: EventEmitter<number> = new EventEmitter();
  msAuditAddAnswerCheckList: EventEmitter<number> = new EventEmitter();
  msAuditNonConformity: EventEmitter<number> = new EventEmitter();

  /*cyber incidents*/
  addCyberIncidentModal: EventEmitter<number> = new EventEmitter();
  cyberIncidentClassification: EventEmitter<number> = new EventEmitter();
  cyberIncidentImpactAnalysisCategory: EventEmitter<number> = new EventEmitter();
  cyberIncidentWorkflowAddModal: EventEmitter<any> = new EventEmitter();
  cyberIncidentWorkflowHistory:EventEmitter<number> = new EventEmitter();
  cyberIncidentWorkflow:EventEmitter<number> = new EventEmitter();
  cyberIncidentFilePreview:EventEmitter<number> = new EventEmitter();
  addCyberIncidentCAModal:EventEmitter<number> = new EventEmitter();
  cyberIncidentCommentModal:EventEmitter<number> = new EventEmitter();
  cyberIncidentCaHistoryModal: EventEmitter<any> = new EventEmitter();
  cyberIncidentCaUpdateModal: EventEmitter<any> = new EventEmitter();
  cyberIncidentReportConclusionModal: EventEmitter<any> = new EventEmitter();

  eventInfluence: EventEmitter<number> = new EventEmitter();
  supportives: EventEmitter<number> = new EventEmitter()
  RiskImpactGuideline: EventEmitter<number> = new EventEmitter();
  TestAndExerciseRecoveryLevel: EventEmitter<number> = new EventEmitter();
  TestAndExerciseChecklist: EventEmitter<number> = new EventEmitter();
  IsmsVulnerability: EventEmitter<number> = new EventEmitter();
  CustomerComplaintSource: EventEmitter<number> = new EventEmitter();
  IsmsRiskMatrixRatingLevel: EventEmitter<number> = new EventEmitter();
  IsmsSoa: EventEmitter<number> = new EventEmitter();
  supplier: EventEmitter<number> = new EventEmitter();
  storageLocation: EventEmitter<number> = new EventEmitter();
  backupFrequency: EventEmitter<number> = new EventEmitter();
  periodicBackup: EventEmitter<number> = new EventEmitter();
  businessApplications: EventEmitter<number> = new EventEmitter();
  FindingsList: EventEmitter<boolean> = new EventEmitter();
  msAuditCategory: EventEmitter<any> = new EventEmitter();
  FindingsQuickCorrection: EventEmitter<boolean> = new EventEmitter();
  processOperationFrequency: EventEmitter<number> = new EventEmitter();
  testAndExerciseTypes: EventEmitter<number> = new EventEmitter();
  processOperationMode: EventEmitter<number> = new EventEmitter();
  recordRetentionPolicies: EventEmitter<number> = new EventEmitter();
  auditItemControl: EventEmitter<number> = new EventEmitter();
  projectmonitoriingValidationModal: EventEmitter<number> = new EventEmitter();
  eventMonitoriingValidationModal: EventEmitter<number> = new EventEmitter();
  auditCategoriesControl: EventEmitter<number> = new EventEmitter();
  auditCriteriaControl: EventEmitter<number> = new EventEmitter();
  KpiReviewFrequenciesControl: EventEmitter<number> = new EventEmitter();
  needsExpectationControl: EventEmitter<number> = new EventEmitter();
  StrategyPerformancesControl: EventEmitter<number> = new EventEmitter();
  auditableItemControl: EventEmitter<number> = new EventEmitter();
  auditObjectiveControl: EventEmitter<number> = new EventEmitter();
  countryControl: EventEmitter<number> = new EventEmitter();
  auditCheckListControl: EventEmitter<number> = new EventEmitter();
  auditFindingCategoryControl: EventEmitter<number> = new EventEmitter();

  externalFindingCategoryControl: EventEmitter<number> = new EventEmitter();
  findingImpactAnalysisCategoryControl: EventEmitter<number> = new EventEmitter();
  rootCauseCategoryControl: EventEmitter<number> = new EventEmitter();
  rootCauseSubCategoryControl: EventEmitter<number> = new EventEmitter();
  childModalCloseControl: EventEmitter<number> = new EventEmitter();
  externalAuditTypesControl: EventEmitter<number> = new EventEmitter();
  labelControl: EventEmitter<number> = new EventEmitter();
  profileSlider: EventEmitter<number> = new EventEmitter();
  deletePopup: EventEmitter<boolean> = new EventEmitter();
  customDatePopup: EventEmitter<boolean> = new EventEmitter();
  strategicAlignmentModal: EventEmitter<boolean> = new EventEmitter();
  eventStrategicThemeModal: EventEmitter<boolean> = new EventEmitter();
  ProjectPaymentModal: EventEmitter<boolean> = new EventEmitter();
  detailPopup: EventEmitter<boolean> = new EventEmitter();
  viewMorePopup: EventEmitter<boolean> = new EventEmitter();
  commonModal: EventEmitter<any> = new EventEmitter();
  docTypePopup: EventEmitter<boolean> = new EventEmitter();
  controlTypes: EventEmitter<number> = new EventEmitter();
  division: EventEmitter<number> = new EventEmitter();
  riskArea: EventEmitter<number> = new EventEmitter();
  riskLibrary: EventEmitter<number> = new EventEmitter();
  riskSource: EventEmitter<number> = new EventEmitter();
  riskInfoWorkflow: EventEmitter<number> = new EventEmitter();
  amAuditPlanWorkflow: EventEmitter<number> = new EventEmitter();
  amAuditMode: EventEmitter<number> = new EventEmitter();
  amAnnualAuditPlanWorkflow: EventEmitter<number> = new EventEmitter();
  correctiveActionStatus: EventEmitter<number> = new EventEmitter();
  msAuditCheklistGroup: EventEmitter<number> = new EventEmitter();
  riskInfoHistory: EventEmitter<number> = new EventEmitter();
  amAuditPlanHistory: EventEmitter<number> = new EventEmitter();
  amAnnualAuditPlanHistory: EventEmitter<number> = new EventEmitter();
  riskJourneyWorkflow: EventEmitter<number> = new EventEmitter();
  riskJourneyHistory: EventEmitter<number> = new EventEmitter();
  ismsRiskInfoWorkflow: EventEmitter<number> = new EventEmitter();
  ismsRiskInfoHistory: EventEmitter<number> = new EventEmitter();
  ismsRiskJourneyWorkflow: EventEmitter<number> = new EventEmitter();
  ismsRiskJourneyHistory: EventEmitter<number> = new EventEmitter();
  keyRiskIndicator: EventEmitter<number> = new EventEmitter();
  strategicObjectives: EventEmitter<number> = new EventEmitter();
  organisationChanges: EventEmitter<number> = new EventEmitter();
  riskKRI: EventEmitter<number> = new EventEmitter();
  moduleSubemnu: EventEmitter<number> = new EventEmitter();
  modulemenu: EventEmitter<number> = new EventEmitter();
  riskViewMore: EventEmitter<number> = new EventEmitter();
  riskRcaModalControl: EventEmitter<number> = new EventEmitter();
  riskCategory: EventEmitter<number> = new EventEmitter();
  riskSubCategory: EventEmitter<number> = new EventEmitter();
  riskImpactAnalysis: EventEmitter<number> = new EventEmitter();
  impactCategory: EventEmitter<number> = new EventEmitter();
  riskControlPlan: EventEmitter<number> = new EventEmitter();
  riskcategory: EventEmitter<number> = new EventEmitter();
  riskcontrolplan: EventEmitter<number> = new EventEmitter();
  RiskWorkflowCommentModal: EventEmitter<number> = new EventEmitter();
  auditPlanWorkflowCommentModal: EventEmitter<number> = new EventEmitter();
  amAnnualAuditPlanWorkflowCommentModal: EventEmitter<number> = new EventEmitter();
  RiskJourneyWorkflowCommentModal: EventEmitter<number> = new EventEmitter();
  ismsRiskWorkflowCommentModal: EventEmitter<number> = new EventEmitter();
  ismsRiskJourneyWorkflowCommentModal: EventEmitter<number> = new EventEmitter();
  controlEfficienyMeasures: EventEmitter<number> = new EventEmitter();
  issueSelect: EventEmitter<number> = new EventEmitter();
  businessApplicationSelect: EventEmitter<number> = new EventEmitter();
  serviceSelect: EventEmitter<number> = new EventEmitter();
  riskSelect: EventEmitter<number> = new EventEmitter();
  reportingFrequency: EventEmitter<number> = new EventEmitter();
  projectSelect: EventEmitter<number> = new EventEmitter();
  departmentControl: EventEmitter<number> = new EventEmitter();
  sectionControl: EventEmitter<number> = new EventEmitter();
  subSectionControl: EventEmitter<number> = new EventEmitter();
  competencyControl: EventEmitter<number> = new EventEmitter();
  competencyGroupControl: EventEmitter<number> = new EventEmitter();
  designationControl: EventEmitter<number> = new EventEmitter();
  designationDetailControl: EventEmitter<number> = new EventEmitter;
  competencyAddControl: EventEmitter<number> = new EventEmitter;
  designationGradeControl: EventEmitter<number> = new EventEmitter();
  designationLevelControl: EventEmitter<number> = new EventEmitter();
  designationZoneControl: EventEmitter<number> = new EventEmitter();
  kpiCategoryControl: EventEmitter<number> = new EventEmitter();
  documentCategoryControl: EventEmitter<number> = new EventEmitter();
  complianceAreaControl: EventEmitter<number> = new EventEmitter();
  complianceSectionControl: EventEmitter<number> = new EventEmitter();
  complianceFrequencyControl: EventEmitter<number> = new EventEmitter();
  complianceStatusControl: EventEmitter<number> = new EventEmitter();
  documentTypesControl: EventEmitter<number> = new EventEmitter();
  documentFamilyControl: EventEmitter<number> = new EventEmitter();
  documentSubCategoryControl: EventEmitter<number> = new EventEmitter();
  documentSubSubCategoryControl: EventEmitter<number> = new EventEmitter();
  documentTagControl: EventEmitter<number> = new EventEmitter();
  frameworkControl: EventEmitter<number> = new EventEmitter();
  maturityModalControl: EventEmitter<number> = new EventEmitter();
  conrolAssessmentModalControl: EventEmitter<number> = new EventEmitter();
  controlAssessmentActionModalControl: EventEmitter<number> = new EventEmitter();
  controlAssessmentCaUpdateModal: EventEmitter<number> = new EventEmitter();
  controlAssessmentCaHistoryModal: EventEmitter<number> = new EventEmitter();
  assessmentControl: EventEmitter<number> = new EventEmitter();
  ModalStyle: EventEmitter<number> = new EventEmitter();
  activityModal: EventEmitter<number> = new EventEmitter();
  arciMatrixModal: EventEmitter<number> = new EventEmitter();
  sidebarFilterChanged: EventEmitter<void> = new EventEmitter();
  processGroupModal: EventEmitter<number> = new EventEmitter();
  processCategoryModal: EventEmitter<number> = new EventEmitter();
  noConnectionModal: EventEmitter<boolean> = new EventEmitter();
  idleTimeoutModal: EventEmitter<boolean> = new EventEmitter();
  stakeHolderType: EventEmitter<number> = new EventEmitter();
  regionControl: EventEmitter<number> = new EventEmitter();
  unitModalControl: EventEmitter<number> = new EventEmitter();
  reportFrequencyControl: EventEmitter<number> = new EventEmitter();
  humanCapitalUnitControl: EventEmitter<number> = new EventEmitter();
  humanCapitalKpiChildControl: EventEmitter<number> = new EventEmitter();
  industryCategoryControl: EventEmitter<number> = new EventEmitter();
  closeUnitChildModal: EventEmitter<number> = new EventEmitter();
  addCustomerComplaintActionPlanModal: EventEmitter<number> = new EventEmitter();
  customerComplaint: EventEmitter<number> = new EventEmitter();
  addProjectTaskModal: EventEmitter<number> = new EventEmitter();
  addCustomersDetails: EventEmitter<number> = new EventEmitter();
  mileStoneModal: EventEmitter<number> = new EventEmitter();
  templateChildComponent: EventEmitter<any> = new EventEmitter();
  deleteTemplate: EventEmitter<any> = new EventEmitter();
  editTemplate: EventEmitter<any> = new EventEmitter();
  childNote: EventEmitter<any> = new EventEmitter();
  editChildNote: EventEmitter<any> = new EventEmitter();
  deleteChildNote: EventEmitter<any> = new EventEmitter();
  addchildCheckList: EventEmitter<any> = new EventEmitter();
  addchildControl: EventEmitter<any> = new EventEmitter();
  changeRequestWorkflow: EventEmitter<any> = new EventEmitter();
  changeRequestWorkflowHistory: EventEmitter<any> = new EventEmitter();
  externalUserChangeReq: EventEmitter<any> = new EventEmitter();

  deleteChildCheckList: EventEmitter<any> = new EventEmitter();
  deleteChildControl: EventEmitter<any> = new EventEmitter();
  passPCDA: EventEmitter<any> = new EventEmitter();
  passCheckList: EventEmitter<any> = new EventEmitter();
  industryControl: EventEmitter<any> = new EventEmitter();
  timezoneMasterControl: EventEmitter<any> = new EventEmitter();
  locationMasterControl: EventEmitter<any> = new EventEmitter();
  strategicObjectivesMapping: EventEmitter<any> = new EventEmitter();
  closeKpiCategoryChild: EventEmitter<any> = new EventEmitter();
  rcaModalControl: EventEmitter<any> = new EventEmitter();
  correctiveActionModalControl: EventEmitter<any> = new EventEmitter();
  findingCorrectiveActionModalControl: EventEmitter<any> = new EventEmitter();
  stakeholderNeedsAndExpectationsControl: EventEmitter<any> = new EventEmitter();
  stakeholderNeedExpectationFormModalControl: EventEmitter<any> = new EventEmitter();

  auditableItemcontrolAddModalControl: EventEmitter<any> = new EventEmitter();
  projectInformationAddModalControl: EventEmitter<any> = new EventEmitter();
  projectStakeholderModal: EventEmitter<any> = new EventEmitter();
  projectTeamModal: EventEmitter<any> = new EventEmitter();
  externalUsers: EventEmitter<any> = new EventEmitter();
  eventexternalUsers: EventEmitter<any> = new EventEmitter();
  projectDocumentModal: EventEmitter<any> = new EventEmitter();
  eventDocumentModal: EventEmitter<any> = new EventEmitter();
  eventOverviewModal: EventEmitter<any> = new EventEmitter();
  projectClosureModal: EventEmitter<any> = new EventEmitter();
  projectRiskModal: EventEmitter<any> = new EventEmitter();
  projectIssueCaModal: EventEmitter<any> = new EventEmitter();
  lessonLearntCaModal: EventEmitter<any> = new EventEmitter();
  closureWorkflowModal: EventEmitter<any> = new EventEmitter();
  closureWorkflowCommentModal: EventEmitter<any> = new EventEmitter();
  closureWorkflowHistory: EventEmitter<any> = new EventEmitter();
  projectBudgetModal: EventEmitter<any> = new EventEmitter();
  eventBudgetModal: EventEmitter<any> = new EventEmitter();
  eventClosureModal: EventEmitter<any> = new EventEmitter();
  eventClosureMainModal: EventEmitter<any> = new EventEmitter();
  eventSpecificationModal: EventEmitter<any> = new EventEmitter();
  eventTaskModal: EventEmitter<any> = new EventEmitter();
  percentageModal: EventEmitter<any> = new EventEmitter();
  eventLessonLearnedModal: EventEmitter<any> = new EventEmitter();
  eventStakeholderModal: EventEmitter<any> = new EventEmitter();
  eventChecklistModal: EventEmitter<any> = new EventEmitter();
  eventViewMoreModal: EventEmitter<any> = new EventEmitter();
  eventDeliverableModal: EventEmitter<any> = new EventEmitter();
  eventRefCodeModal: EventEmitter<any> = new EventEmitter();
  projectChangeReqBudgetModal: EventEmitter<any> = new EventEmitter();
  controlsChildModal: EventEmitter<any> = new EventEmitter();
  importRiskModal: EventEmitter<any> = new EventEmitter();
  importProcessModal: EventEmitter<any> = new EventEmitter();
  addAuditProgramModal: EventEmitter<any> = new EventEmitter();
  addCheckListModal: EventEmitter<any> = new EventEmitter();
  newChecklistAddModal: EventEmitter<any> = new EventEmitter();
  addChecklistModal:EventEmitter<any> = new EventEmitter();
  addContractAssessmentModal:EventEmitter<any> = new EventEmitter();

  modalDismiss: EventEmitter<any> = new EventEmitter();
  activityDetailsmodalDismiss: EventEmitter<any> = new EventEmitter();

  importAuditableItemModal: EventEmitter<any> = new EventEmitter();

  importRiskFromAuditProgranModal: EventEmitter<any> = new EventEmitter();
  importProcessFromAuditProgramModal: EventEmitter<any> = new EventEmitter();
  faq: EventEmitter<number> = new EventEmitter();
  otherDocuments: EventEmitter<number> = new EventEmitter();


  venue: EventEmitter<number> = new EventEmitter();
  meetingCategory: EventEmitter<number> = new EventEmitter();
  meetingCriteria: EventEmitter<number> = new EventEmitter();
  meetingObjective: EventEmitter<number> = new EventEmitter();
  meetingAgenda: EventEmitter<number> = new EventEmitter();
  addCriteriaModal: EventEmitter<any> = new EventEmitter();
  addObjectiveModal: EventEmitter<any> = new EventEmitter();
  addParticipantsModal: EventEmitter<any> = new EventEmitter();
  addMeetingPlanParticipantsModal: EventEmitter<any> = new EventEmitter();
  actionPlanUpadateModal: EventEmitter<any> = new EventEmitter();
  meetingPlanDateUpadateModal: EventEmitter<boolean> = new EventEmitter();
  actionPlanHistoryModal: EventEmitter<any> = new EventEmitter();
  meetingMomTab: EventEmitter<boolean> = new EventEmitter();
  meetingPlanCancelModal: EventEmitter<any> = new EventEmitter();
  //kpi
  kpiRevertModal: EventEmitter<any> = new EventEmitter();
  kpiSubmitModal: EventEmitter<any> = new EventEmitter();
  kpiApproveModal: EventEmitter<any> = new EventEmitter();
  kpiWorkflowModal: EventEmitter<any> = new EventEmitter();
  kpiWorkflowHistoryModal: EventEmitter<any> = new EventEmitter();
  kpiActivityLogsModal: EventEmitter<any> = new EventEmitter();
  updateScoreModal: EventEmitter<any> = new EventEmitter();
  projectActivityModal: EventEmitter<any> = new EventEmitter();
  //kpi score
  kpiScoreReviewSubmitModal: EventEmitter<any> = new EventEmitter();
  kpiScoreRevertModal: EventEmitter<any> = new EventEmitter();
  //kpi improvement plans
  kpiImprovementPlansUpadateModal: EventEmitter<any> = new EventEmitter();
  kpiImprovementPlansHistoryModal: EventEmitter<any> = new EventEmitter();
  //**kpi

  // ms audit module
  //ms audit schulels 
  MsAuditSchedulesUpdateModal: EventEmitter<any> = new EventEmitter();
  // **ms audit module 

  addNewAuditCategoryFromAuditPlan: EventEmitter<any> = new EventEmitter();
  chooseAuditorsModal: EventEmitter<any> = new EventEmitter();
  projectTimeCategory: EventEmitter<any> = new EventEmitter();
  projectCostCategory: EventEmitter<any> = new EventEmitter();
  projectCategory: EventEmitter<any> = new EventEmitter();
  projectTaskCategory: EventEmitter<any> = new EventEmitter();
  projectTaskPriorities: EventEmitter<any> = new EventEmitter();
  projectTaskWeightage: EventEmitter<any> = new EventEmitter();
  porjectRolesControl: EventEmitter<any> = new EventEmitter();
  profileQualificationModal: EventEmitter<any> = new EventEmitter();
  profileExperienceModal: EventEmitter<any> = new EventEmitter();
  profileCertificateModal: EventEmitter<any> = new EventEmitter();
  riskTreatmentUpdateModal: EventEmitter<any> = new EventEmitter();
  ismsRiskTreatmentUpdateModal: EventEmitter<any> = new EventEmitter();
  incidentCorrectiveActionUpdateModal: EventEmitter<any> = new EventEmitter();
  lessonLearntCaUpdateModal: EventEmitter<any> = new EventEmitter();
  eventCorrectiveActionUpdateModal: EventEmitter<any> = new EventEmitter();
  profileModal: EventEmitter<any> = new EventEmitter();
  slaDocumentRenewModel: EventEmitter<any> = new EventEmitter();
  slaCOntractModal: EventEmitter<any> = new EventEmitter();
  slaDocumentPreviewModal: EventEmitter<any> = new EventEmitter();
  correctiveACtionPreviewModal: EventEmitter<any> = new EventEmitter();
  customerCorrectiveACtionPreviewModal: EventEmitter<any> = new EventEmitter();
  JsoModel: EventEmitter<any> = new EventEmitter();
  JsoUnsafeActionModel: EventEmitter<any> = new EventEmitter();
  closeUnsafeActionModel: EventEmitter<any> = new EventEmitter();
  criteriaItemAddModalControl: EventEmitter<any> = new EventEmitter();
  objectiveItemAddModalControl: EventEmitter<any> = new EventEmitter();
  findingItemAddModalControl: EventEmitter<any> = new EventEmitter();
  NonConformityItemAddModalControl: EventEmitter<any> = new EventEmitter();
  agendaItemAddModalControl: EventEmitter<any> = new EventEmitter();
  khDocumentModal: EventEmitter<any> = new EventEmitter();
  quickUpload: EventEmitter<any> = new EventEmitter();
  issueCategoryModal: EventEmitter<any> = new EventEmitter();


  auditorsAuditeesAddModalControl: EventEmitter<any> = new EventEmitter();

  IAfindingsRcaModalControl: EventEmitter<any> = new EventEmitter();

  ModalType: EventEmitter<any> = new EventEmitter();
  trainingMatrixDetails: EventEmitter<any> = new EventEmitter();

  caFindingsModalControl: EventEmitter<any> = new EventEmitter();
  checklistAnswersAddModalControl: EventEmitter<any> = new EventEmitter();

  quickCorrectionAddModalControl: EventEmitter<any> = new EventEmitter();

  auditScheduleDateonlyUpdateModal: EventEmitter<any> = new EventEmitter();

  rcaRootCausechild: EventEmitter<any> = new EventEmitter();
  rcaRootCauseSubChild: EventEmitter<any> = new EventEmitter();
  addNewControlEvent: EventEmitter<any> = new EventEmitter();
  addNewControlFocusEvent: EventEmitter<any> = new EventEmitter();

  actionPlanModalEvent: EventEmitter<any> = new EventEmitter();
  commentModal: EventEmitter<any> = new EventEmitter();
  auditTemplateAddModal: EventEmitter<any> = new EventEmitter();
  incidentTemplateAddModal: EventEmitter<any> = new EventEmitter();
  executiveSummaryModal: EventEmitter<any> = new EventEmitter();
  ermDetailsModal: EventEmitter<any> = new EventEmitter();
  executiveAddReportModal: EventEmitter<any> = new EventEmitter();
  quickRiskAssessmentModal: EventEmitter<any> = new EventEmitter();
  quickRiskAddProcessAssessmentModal: EventEmitter<any> = new EventEmitter();
  quickRiskAddObservationProcessAssessmentModal: EventEmitter<any> = new EventEmitter();
  quickRiskAddMitigation: EventEmitter<any> = new EventEmitter();
  trainingModal: EventEmitter<any> = new EventEmitter();
  trainingCompleteModal: EventEmitter<any> = new EventEmitter();
  editErmDetailRiskModal: EventEmitter<any> = new EventEmitter();
  editErmDetailRiskTreatmentModal: EventEmitter<any> = new EventEmitter();
  auditWorkflowAddModal: EventEmitter<any> = new EventEmitter();
  auditWorkflowUserAddModal: EventEmitter<any> = new EventEmitter();
  incidentflowUserAddModal: EventEmitter<any> = new EventEmitter();
  auditWorkflowDesignationAddModal: EventEmitter<any> = new EventEmitter();
  auditWorkflowHeadUnitAddModal: EventEmitter<any> = new EventEmitter();
  auditWorkflowTeamAddModal: EventEmitter<any> = new EventEmitter();
  auditWorkflowRoleAddModal: EventEmitter<any> = new EventEmitter();
  auditWorkflowCommonAddModal: EventEmitter<any> = new EventEmitter();
  incidentWorkflowCommonAddModal: EventEmitter<any> = new EventEmitter();

  folderRenameModal: EventEmitter<any> = new EventEmitter();
  currencyControl: EventEmitter<any> = new EventEmitter();
  riskRatingListControlModal: EventEmitter<any> = new EventEmitter();
  checklistAllViewTableModal: EventEmitter<any> = new EventEmitter();
  checklistSingleViewModal: EventEmitter<any> = new EventEmitter();
  checklistsSingleViewModalFocusControl: EventEmitter<any> = new EventEmitter();
  generateAuditReportModalControl: EventEmitter<any> = new EventEmitter();
  incidentDamageTypeModalControl: EventEmitter<any> = new EventEmitter();
  focusAreaModalControl: EventEmitter<any> = new EventEmitter();
  strategicThemeModalControl: EventEmitter<any> = new EventEmitter();
  objectiveModalControl: EventEmitter<any> = new EventEmitter();
  incidentDamageSeverityModalControl: EventEmitter<any> = new EventEmitter();
  incidentTypeModalControl: EventEmitter<any> = new EventEmitter();
  incidentRootCauseModalControl: EventEmitter<any> = new EventEmitter();
  incidentInvestigatorMoadlControl: EventEmitter<any> = new EventEmitter();
  searchData: EventEmitter<any> = new EventEmitter();
  workflowRoleAddModal: EventEmitter<any> = new EventEmitter();
  workflowIncidentRoleAddModal: EventEmitter<any> = new EventEmitter();

  workflowCommonAddModal: EventEmitter<any> = new EventEmitter();
  workflowTeamAddModal: EventEmitter<any> = new EventEmitter();
  workflowIncidentTeamAddModal: EventEmitter<any> = new EventEmitter();

  workflowHeadUnitAddModal: EventEmitter<any> = new EventEmitter();
  workflowIncidentHeadUnitAddModal: EventEmitter<any> = new EventEmitter();

  workflowSystemRoleModal: EventEmitter<any> = new EventEmitter();
  workflowDesignationAddModal: EventEmitter<any> = new EventEmitter();
  workflowIncidentDesignationAddModal: EventEmitter<any> = new EventEmitter();

  workflowUserAddModal: EventEmitter<any> = new EventEmitter();
  workflowActivityLog: EventEmitter<any> = new EventEmitter();
  documentUpdateModal: EventEmitter<any> = new EventEmitter();
  reviewHistoryModal: EventEmitter<any> = new EventEmitter();
  caResolveModalControl: EventEmitter<any> = new EventEmitter();
  cahistoryModalControl: EventEmitter<any> = new EventEmitter();
  initiativeHistoryModalControl: EventEmitter<any> = new EventEmitter();
  // objectiveHistoryModalControl : EventEmitter<any> = new EventEmitter();
  // KPIHistoryModalControl : EventEmitter<any> = new EventEmitter();
  profileHistoryModalControl: EventEmitter<any> = new EventEmitter();
  witnessAddModalControl: EventEmitter<any> = new EventEmitter();
  witnessAddDetailsModalControl: EventEmitter<any> = new EventEmitter();
  incidentRootCauseAddModalControl: EventEmitter<any> = new EventEmitter();

  InvolvedPersonAddModalControl: EventEmitter<any> = new EventEmitter();
  InvolvedPersonAddDetailModalControl: EventEmitter<any> = new EventEmitter();
  InvolvedWitnessAddModalControl: EventEmitter<any> = new EventEmitter();
  InvestigationProgressModal: EventEmitter<any> = new EventEmitter();
  InvolvedWitnessAddDetailsModalControl: EventEmitter<any> = new EventEmitter();
  AddInvestigationModalControl: EventEmitter<any> = new EventEmitter();

  investigationDesModalControl: EventEmitter<any> = new EventEmitter();
  investigationDesDetailsModalControl: EventEmitter<any> = new EventEmitter();
  eventOutcomeModalControl: EventEmitter<any> = new EventEmitter();
  significantDesModalControl: EventEmitter<any> = new EventEmitter();
  significantDesDetailsModalControl: EventEmitter<any> = new EventEmitter();
  recommendationsDesModalControl: EventEmitter<any> = new EventEmitter();
  recommendationsDesDetailsModalControl: EventEmitter<any> = new EventEmitter();
  referenceDesModalControl: EventEmitter<any> = new EventEmitter();
  referenceDesDetailsModalControl: EventEmitter<any> = new EventEmitter();
  personInvolvedAddModalControl: EventEmitter<any> = new EventEmitter();
  personInvolvedAddDetailModalControl: EventEmitter<any> = new EventEmitter();
  KHTemplateModal: EventEmitter<any> = new EventEmitter();
  riskWorkflowAddModal: EventEmitter<any> = new EventEmitter();
  ismsRiskWorkflowAddModal: EventEmitter<any> = new EventEmitter();
  auditManagementWorkflowAddModal: EventEmitter<any> = new EventEmitter();
  auditManagementAuditPlanAddModal: EventEmitter<any> = new EventEmitter();
  auditManagementAuditAddModal: EventEmitter<any> = new EventEmitter();
  auditManagementAnnualAuditPlanAddModal: EventEmitter<any> = new EventEmitter();
  bcpWorkflowAddModal: EventEmitter<any> = new EventEmitter();
  incidentWorkflowAddModal: EventEmitter<any> = new EventEmitter();
  incidentReportAddModal: EventEmitter<any> = new EventEmitter();
  mrmWorkflowAddModal: EventEmitter<any> = new EventEmitter();
  kpiWorkflowAddModal: EventEmitter<any> = new EventEmitter();
  historyPopup: EventEmitter<any> = new EventEmitter();
  documentWorkflow: EventEmitter<any> = new EventEmitter();
  addIncidentCorrectiveAction: EventEmitter<any> = new EventEmitter();
  closeHistoryModal: EventEmitter<any> = new EventEmitter();
  closeInvestigationHistoryModal: EventEmitter<any> = new EventEmitter();
  addComplianceRegister: EventEmitter<any> = new EventEmitter();
  addComplianceStatus: EventEmitter<any> = new EventEmitter();
  addComplianceReport: EventEmitter<any> = new EventEmitter();

  externalAuditCaResolveModal: EventEmitter<any> = new EventEmitter();
  externalAuditCaUpdateModal: EventEmitter<any> = new EventEmitter();
  externalAuditCaHistoryModal: EventEmitter<any> = new EventEmitter();
  productControl: EventEmitter<any> = new EventEmitter();
  customerControl: EventEmitter<any> = new EventEmitter();
  submitPopup: EventEmitter<any> = new EventEmitter();
  checkinModal: EventEmitter<any> = new EventEmitter();
  quickRiskAddReportModal: EventEmitter<any> = new EventEmitter();
  actionModal: EventEmitter<any> = new EventEmitter();
  initiativeMoreModalControl: EventEmitter<any> = new EventEmitter();


  AssetCategory: EventEmitter<any> = new EventEmitter();
  AssetSubCategory: EventEmitter<any> = new EventEmitter();
  AssetLocation: EventEmitter<any> = new EventEmitter();
  AssetSpecification: EventEmitter<any> = new EventEmitter();
  AssetMaintenance: EventEmitter<any> = new EventEmitter();

  /** */
  projectMileStoneModal: EventEmitter<any> = new EventEmitter();
  eventMilestoneModal: EventEmitter<any> = new EventEmitter();
  eventProgressModal: EventEmitter<any> = new EventEmitter();
  projectScopeModal: EventEmitter<any> = new EventEmitter();
  eventScopeModal: EventEmitter<any> = new EventEmitter();
  projectOutcomesModal: EventEmitter<any> = new EventEmitter();
  projectDeliverablesModal: EventEmitter<any> = new EventEmitter();
  projectChangeRequestModal: EventEmitter<any> = new EventEmitter();
  projectChangeRequestItemsModal: EventEmitter<any> = new EventEmitter();
  projectMProgressModal: EventEmitter<any> = new EventEmitter();
  previewModal: EventEmitter<any> = new EventEmitter();
  actionPlanModal: EventEmitter<any> = new EventEmitter();
  focusAreaModal: EventEmitter<any> = new EventEmitter();
  focusAreaMasterModal: EventEmitter<any> = new EventEmitter();
  notesModal: EventEmitter<any> = new EventEmitter();
  settingsModal: EventEmitter<any> = new EventEmitter();
  kpiModal: EventEmitter<any> = new EventEmitter();
  strategyKpiModal: EventEmitter<any> = new EventEmitter();
  whiteSheetModal: EventEmitter<any> = new EventEmitter();
  objectiveModal: EventEmitter<any> = new EventEmitter();
  strategyKpiDetailsModal: EventEmitter<any> = new EventEmitter();
  strategyObjectiveModal: EventEmitter<any> = new EventEmitter();
  strategyObjectiveTargetModal: EventEmitter<any> = new EventEmitter();
  reviewFrequencyModal: EventEmitter<any> = new EventEmitter();
  strategyProfileModal: EventEmitter<any> = new EventEmitter();
  strategyMappingObjectiveTypeModal: EventEmitter<any> = new EventEmitter();
  mappingPopupModal: EventEmitter<any> = new EventEmitter();
  strategyMappingObjectDetailPopupModal: EventEmitter<any> = new EventEmitter();
  strategyMappingfocusAreaPopupModal: EventEmitter<any> = new EventEmitter();
  strategyMappingObjectivePopupModal: EventEmitter<any> = new EventEmitter();
  strategyMappingInitiativeDetailPopupModal: EventEmitter<any> = new EventEmitter();
  strategyMappingProfilePopupModal: EventEmitter<any> = new EventEmitter();
  strategyWorkflowAddModal: EventEmitter<any> = new EventEmitter();
  projectWorkflowAddModal: EventEmitter<any> = new EventEmitter();
  objectiveTargetBreakDownModalControl: EventEmitter<any> = new EventEmitter();
  /**   */
  biaRatingModal: EventEmitter<any> = new EventEmitter();
  ImpactCategoryModal: EventEmitter<any> = new EventEmitter();
  ImpactScenarioModal: EventEmitter<any> = new EventEmitter();
  ImpactAreaModal: EventEmitter<any> = new EventEmitter();
  BiaScaleModal: EventEmitter<any> = new EventEmitter();
  BiaImpactCategoryInformationModal: EventEmitter<any> = new EventEmitter();
  BiaTireModal: EventEmitter<any> = new EventEmitter();
  TierConfigModal: EventEmitter<any> = new EventEmitter();
  ApplicationTypeModal: EventEmitter<any> = new EventEmitter();
  RelatedProcessModal: EventEmitter<any> = new EventEmitter();
  VitalModal: EventEmitter<any> = new EventEmitter();
  ArciModal: EventEmitter<any> = new EventEmitter();
  fileUploadPopup: EventEmitter<any> = new EventEmitter();
  assetTypes: EventEmitter<number> = new EventEmitter();
  projectContractType: EventEmitter<number> = new EventEmitter();
  entrance: EventEmitter<number> = new EventEmitter();
  eventType: EventEmitter<number> = new EventEmitter();
  objectiveType: EventEmitter<number> = new EventEmitter();
  auditTestPlanStatus: EventEmitter<number> = new EventEmitter();
  auditControlSelfAssessmentUpdateStatus: EventEmitter<number> = new EventEmitter();
  eventMaturityMatrixType: EventEmitter<number> = new EventEmitter();
  eventEngagementStratergy: EventEmitter<number> = new EventEmitter();
  spaceType: EventEmitter<number> = new EventEmitter();
  dimension: EventEmitter<number> = new EventEmitter();
  checklist: EventEmitter<number> = new EventEmitter();
  riskImpactArea: EventEmitter<number> = new EventEmitter();
  status: EventEmitter<number> = new EventEmitter();
  taskstatus: EventEmitter<number> = new EventEmitter();
  locations: EventEmitter<number> = new EventEmitter();
  communication: EventEmitter<number> = new EventEmitter();
  range: EventEmitter<number> = new EventEmitter();
  periodicity: EventEmitter<number> = new EventEmitter();
  targetAudience: EventEmitter<number> = new EventEmitter();
  eventEquipment: EventEmitter<number> = new EventEmitter();
  eventClosureChecklist: EventEmitter<number> = new EventEmitter();
  projectPriority: EventEmitter<number> = new EventEmitter();
  projectTheme: EventEmitter<number> = new EventEmitter();
  projectObjective: EventEmitter<number> = new EventEmitter();
  projectKpi: EventEmitter<number> = new EventEmitter();
  customers: EventEmitter<number> = new EventEmitter();
  competencyTypes: EventEmitter<number> = new EventEmitter();
  introButtonClickedEvent: EventEmitter<any> = new EventEmitter();
  IncidentInvestigationWorkflow: EventEmitter<any> = new EventEmitter();
  IncidentInvestigationWorkflowCommentModal: EventEmitter<any> = new EventEmitter();
  IncidentInfoWorkflowCommentModal: EventEmitter<any> = new EventEmitter();
  IncidentInfoWorkflow: EventEmitter<any> = new EventEmitter();
  IncidentCaWorkflowCommentModal: EventEmitter<any> = new EventEmitter();
  IncidentCaWorkflow: EventEmitter<any> = new EventEmitter();
  IncidentCaHistory: EventEmitter<any> = new EventEmitter();
  IncidentInfoHistory: EventEmitter<any> = new EventEmitter();
  InvestigationInfoHistory: EventEmitter<any> = new EventEmitter();
  ComplianceWorkflowAddModal: EventEmitter<any> = new EventEmitter();
  ComplianceRegisterHistory: EventEmitter<any> = new EventEmitter();
  TestAndExercisesHistory: EventEmitter<any> = new EventEmitter();
  BiaHistory: EventEmitter<any> = new EventEmitter();
  projectClosureHistory: EventEmitter<any> = new EventEmitter();
  ProjectMonitorHistory: EventEmitter<any> = new EventEmitter();
  ProjectMonitorWorkflow: EventEmitter<any> = new EventEmitter();
  ProjectMonitorHistoryComments: EventEmitter<any> = new EventEmitter();
  AmAuditCategory: EventEmitter<any> = new EventEmitter();


  ComplianceRegisterWorkflow: EventEmitter<any> = new EventEmitter();
  TestAndExercisesWorkflow: EventEmitter<any> = new EventEmitter();
  BiaWorkflow: EventEmitter<any> = new EventEmitter();
  projectClosureWorkflow: EventEmitter<any> = new EventEmitter();
  ComplianceRegisterWorkflowCommentModal: EventEmitter<any> = new EventEmitter();
  TestAndExercisesWorkflowCommentModal: EventEmitter<any> = new EventEmitter();
  BiaCommentModal: EventEmitter<any> = new EventEmitter();
  projectClosureCommentModal: EventEmitter<any> = new EventEmitter();
  projectChangeRequestCommentModal: EventEmitter<any> = new EventEmitter();
  objectiveReviewCommentModal: EventEmitter<any> = new EventEmitter();
  kpiReviewCommentModal: EventEmitter<any> = new EventEmitter();
  actionPlanReviewCommentModal: EventEmitter<any> = new EventEmitter();

  projectChangeRequestWorkflowModal: EventEmitter<any> = new EventEmitter();
  projectChangeRequestWorkflowHistoryModal: EventEmitter<any> = new EventEmitter();
  objectiveWorkflowHistoryModal: EventEmitter<any> = new EventEmitter();
  strategyKpiWorkflowHistoryModal: EventEmitter<any> = new EventEmitter();


  ProjectMonitoringCommentModal: EventEmitter<any> = new EventEmitter();
  strategyCommentModal: EventEmitter<any> = new EventEmitter();
  SlaContractHistory: EventEmitter<any> = new EventEmitter();
  SlaContractWorkflow: EventEmitter<any> = new EventEmitter();
  SlaContractWorkflowCommentModal: EventEmitter<any> = new EventEmitter();
  planMeasureMainHistory: EventEmitter<any> = new EventEmitter();
  planMeasureMainComment: EventEmitter<any> = new EventEmitter();
  assetMatrixForm: EventEmitter<any> = new EventEmitter();
  assetCategoryForm: EventEmitter<any> = new EventEmitter();
  maintenanceScheduleForm: EventEmitter<any> = new EventEmitter();
  maintenanceScheduleReview: EventEmitter<any> = new EventEmitter();
  maintenanceShutdownReview: EventEmitter<any> = new EventEmitter();
  maintenanceScheduleHistory: EventEmitter<any> = new EventEmitter();
  maintenanceShutdownHistory: EventEmitter<any> = new EventEmitter();
  kpiMesureHistoryAllModal: EventEmitter<any> = new EventEmitter();

  addCustomerComplaint: EventEmitter<any> = new EventEmitter();
  eventMaturityMatrixParameter: EventEmitter<any> = new EventEmitter();
  addCustomerInvestigation: EventEmitter<any> = new EventEmitter();
  addBcpModal: EventEmitter<any> = new EventEmitter();
  addBcpClauseModal: EventEmitter<any> = new EventEmitter();
  previewFocus: EventEmitter<any> = new EventEmitter();
  bcpChildClauseEvent: EventEmitter<any> = new EventEmitter();
  kpiMesureModal: EventEmitter<any> = new EventEmitter();
  objectiveScore: EventEmitter<any> = new EventEmitter();
  planMesureModal: EventEmitter<any> = new EventEmitter();
  fileUploadPreviewFocus: EventEmitter<any> = new EventEmitter();
  kpiMesureHistoryModal: EventEmitter<any> = new EventEmitter();
  bcmRiskAssessmentModal: EventEmitter<any> = new EventEmitter();
  eventRiskAssessmentModal: EventEmitter<any> = new EventEmitter();
  kpiPlanMeasueModal: EventEmitter<any> = new EventEmitter();
  callTreeModal: EventEmitter<any> = new EventEmitter();
  addAllReviewModal: EventEmitter<any> = new EventEmitter();
  otherResponsibleUserModal: EventEmitter<number> = new EventEmitter();
  strategicFocusAreaMapping: EventEmitter<boolean> = new EventEmitter();
  bcpChangeRequestModal: EventEmitter<any> = new EventEmitter();
  addPlanMeasureModal: EventEmitter<any> = new EventEmitter();
  bcpCallTreeAddUser: EventEmitter<number> = new EventEmitter();
  addBcmRiskTreatmentModal: EventEmitter<number> = new EventEmitter();
  bcmRiskTreatmentUpdateModal: EventEmitter<number> = new EventEmitter();
  bcsTypeModalControl: EventEmitter<number> = new EventEmitter();
  exerciseAddModal: EventEmitter<number> = new EventEmitter();
  exerciseOutcomeModal: EventEmitter<number> = new EventEmitter();
  bcpCallTreeChangeEvent: EventEmitter<any> = new EventEmitter();
  bcmStrategyWorkflowEvent: EventEmitter<any> = new EventEmitter();
  assetsMappingModal: EventEmitter<any> = new EventEmitter();
  complianceMappingModal: EventEmitter<any> = new EventEmitter();
  incidentMappingModal: EventEmitter<any> = new EventEmitter();
  projectMonitoringMappingModal: EventEmitter<any> = new EventEmitter();
  projectManagementMappingModal: EventEmitter<any> = new EventEmitter();
  meetingMappingModal: EventEmitter<any> = new EventEmitter();
  TrainingMappingModal: EventEmitter<any> = new EventEmitter();
  KpiMappingModal: EventEmitter<any> = new EventEmitter();
  bcpSearchModal: EventEmitter<any> = new EventEmitter();
  SoaImplementationStatusesSource: EventEmitter<number> = new EventEmitter();
  strategyWorkFlowHistoryModal: EventEmitter<any> = new EventEmitter();
  projectDeliverable: EventEmitter<any> = new EventEmitter();

  // For Testing KH New Design
  deletePopup_temp: EventEmitter<boolean> = new EventEmitter();
  templateChildComponent_temp: EventEmitter<any> = new EventEmitter();
  deleteTemplate_temp: EventEmitter<any> = new EventEmitter();
  editTemplate_temp: EventEmitter<any> = new EventEmitter();
  childNote_temp: EventEmitter<any> = new EventEmitter();
  editChildNote_temp: EventEmitter<any> = new EventEmitter();
  deleteChildNote_temp: EventEmitter<any> = new EventEmitter();
  addCheckListModal_temp: EventEmitter<any> = new EventEmitter();
  addchildCheckList_temp: EventEmitter<any> = new EventEmitter();
  addchildControl_temp: EventEmitter<any> = new EventEmitter()
  deleteChildCheckList_temp: EventEmitter<any> = new EventEmitter();
  deleteChildControl_temp: EventEmitter<any> = new EventEmitter();
  commonModal_temp: EventEmitter<any> = new EventEmitter();
  ModalType_temp: EventEmitter<any> = new EventEmitter();
  passPCDA_temp: EventEmitter<any> = new EventEmitter();
  passCheckList_temp: EventEmitter<any> = new EventEmitter();
  openKHCommentBox: EventEmitter<any> = new EventEmitter();

  // For Testing KH New Design
  projectDiscussion: EventEmitter<any> = new EventEmitter();

  addChildSection: EventEmitter<any> = new EventEmitter();
  deleteChildSection: EventEmitter<any> = new EventEmitter();
  editChildSection: EventEmitter<any> = new EventEmitter();
  sectionModalAction: EventEmitter<any> = new EventEmitter();
  MasterListDocumentAddModal: EventEmitter<any> = new EventEmitter();
  eventTeamModal: EventEmitter<any> = new EventEmitter();
  eventMember: EventEmitter<any> = new EventEmitter();
  eventSecondaryOwnerModal: EventEmitter<any> = new EventEmitter();
  eventSecondaryOwnerDetailModal: EventEmitter<any> = new EventEmitter();
  eventObjectModal: EventEmitter<any> = new EventEmitter();
  CommentBox: EventEmitter<any> = new EventEmitter();
  DocumentRenewModal: EventEmitter<any> = new EventEmitter();
  DocumentHistoryModal: EventEmitter<any> = new EventEmitter();
  documentPreviewModal: EventEmitter<any> = new EventEmitter();
  documentSearch: EventEmitter<any> = new EventEmitter();
  EventWorkflowAddModal: EventEmitter<any> = new EventEmitter();
  EventChangeReqProjectBudgetModal: EventEmitter<any> = new EventEmitter();
  EventApproveCommentModal: EventEmitter<any> = new EventEmitter();
  EventMonitorHistoryModal: EventEmitter<any> = new EventEmitter();
  EventWorkflowModal: EventEmitter<any> = new EventEmitter();
  matrixPlanModal: EventEmitter<any> = new EventEmitter();
  eventCRScopeModal: EventEmitter<any> = new EventEmitter();
  eventChangeReqModal: EventEmitter<any> = new EventEmitter();
  eventChangeReqEventDateModal: EventEmitter<any> = new EventEmitter();
  eventChangeReqEventBudgetModal: EventEmitter<any> = new EventEmitter();
  eventChangeReqEventScopeModal: EventEmitter<any> = new EventEmitter();
  eventChangeReqEventDeliverableModal: EventEmitter<any> = new EventEmitter();
  businessAssessmentActionPlanForm: EventEmitter<any> = new EventEmitter();
  amDodumentTypeModel: EventEmitter<any> = new EventEmitter();
  amInformationRequestModal: EventEmitter<any> = new EventEmitter();
  amAuditDocumentModal: EventEmitter<any> = new EventEmitter();
  amAuditCommencementLetterModal: EventEmitter<any> = new EventEmitter();
  amAuditMeetingModal: EventEmitter<any> = new EventEmitter();
  amAuditTestPlanModal: EventEmitter<any> = new EventEmitter();
  amAuditFieldWorkModal: EventEmitter<any> = new EventEmitter();
  amAuditFindingModal: EventEmitter<any> = new EventEmitter();
  amAuditFindingCaModal: EventEmitter<any> = new EventEmitter();
  amAuditFindingCaUpdateModal: EventEmitter<any> = new EventEmitter();
  amAuditFindingCaHistoryModal: EventEmitter<any> = new EventEmitter();
  amCSAModal: EventEmitter<any> = new EventEmitter();
  amCSAQuestionModal: EventEmitter<any> = new EventEmitter();
  amReportUpdateModal: EventEmitter<any> = new EventEmitter();
  businessAssessmentChildActionPlanForm: EventEmitter<any> = new EventEmitter();
  editDocumentModal: EventEmitter<any> = new EventEmitter();
  msAuditAdd: EventEmitter<any> = new EventEmitter();
  msAuditeesAdd: EventEmitter<any> = new EventEmitter();
  baActionPlanStatusModal: EventEmitter<any> = new EventEmitter();
  baActionPlanHistoryModal: EventEmitter<any> = new EventEmitter();
  addMsAuditDoc: EventEmitter<any> = new EventEmitter();
  msAuditPreviewModal: EventEmitter<any> = new EventEmitter();
  complianceRegisterActionPlanModal: EventEmitter<any> = new EventEmitter();
  exerciseActionPlanModal: EventEmitter<any> = new EventEmitter();
  activeDirectorySettingModal: EventEmitter<any> = new EventEmitter();
  amPreliminaryWorkflow: EventEmitter<any> = new EventEmitter();
  amDraftWorkflow: EventEmitter<any> = new EventEmitter();
  amFinalWorkflow: EventEmitter<any> = new EventEmitter();
  amPreliminaryHistory: EventEmitter<any> = new EventEmitter();
  amDraftHistory: EventEmitter<any> = new EventEmitter();
  amFinalHistory: EventEmitter<any> = new EventEmitter();
  amPreliminaryWorkflowCommentModal: EventEmitter<any> = new EventEmitter();
  amDraftWorkflowCommentModal: EventEmitter<any> = new EventEmitter();
  amFinalWorkflowCommentModal: EventEmitter<any> = new EventEmitter();
  userPopupModal: EventEmitter<any> = new EventEmitter();
  agendaFormModal: EventEmitter<any> = new EventEmitter();
  msAuditFollowUpActionPlan: EventEmitter<number> = new EventEmitter();
  msAuditFollowUp: EventEmitter<number> = new EventEmitter();
  auditReportAgendaModal: EventEmitter<any> = new EventEmitter();
  annualAuditSummaryModal: EventEmitter<any> = new EventEmitter();
  auditReportModal: EventEmitter<any> = new EventEmitter();
  auditProgramReportModal: EventEmitter<any> = new EventEmitter();
  caRejectModal: EventEmitter<any> = new EventEmitter();
  caHistorytModal: EventEmitter<any> = new EventEmitter();
  chooseAuditProgramModal: EventEmitter<number> = new EventEmitter();
  AuditHistoryComments: EventEmitter<any> = new EventEmitter();
  msAuditWorkflowAddModal: EventEmitter<any> = new EventEmitter();
  AuditWorkflow: EventEmitter<any> = new EventEmitter();
  AuditHistory: EventEmitter<any> = new EventEmitter();
  MOMModal: EventEmitter<any> = new EventEmitter();
  mapActionPlanModal: EventEmitter<any> = new EventEmitter();
  detailsMapActionPlanModal: EventEmitter<any> = new EventEmitter();
  detailsMapActionPlanPreviewModal: EventEmitter<any> = new EventEmitter();
  // Time Tracker
  addTimeTrackerModalControl: EventEmitter<any> = new EventEmitter();
  detailsTimeTrackerModalControl: EventEmitter<any> = new EventEmitter();
  documentMovePopup: EventEmitter<any> = new EventEmitter();
  sharePopup: EventEmitter<any> = new EventEmitter();
  msAuditMarkAudit: EventEmitter<number> = new EventEmitter();
  startMsAuditModal: EventEmitter<any> = new EventEmitter();
  msAuditFindingCategory: EventEmitter<any> = new EventEmitter();

  //Mock Drill
  mockDrillTypeModel: EventEmitter<any> = new EventEmitter();
  mockDrillResponseServiceModel: EventEmitter<any> = new EventEmitter();
  mockDrillEvacuationRoleModel: EventEmitter<any> = new EventEmitter();
  mockDrillChecksModel: EventEmitter<any> = new EventEmitter();
  mockDrillScenarioModel: EventEmitter<any> = new EventEmitter();
  userMockDrillModal: EventEmitter<any> = new EventEmitter();
  reviewMockDrillModal: EventEmitter<any> = new EventEmitter();
  mockDrillHistoryModal: EventEmitter<any> = new EventEmitter();

  //ms audit
  participantsPopUpModal: EventEmitter<number> = new EventEmitter();
  auditPlanObjectiveModal: EventEmitter<number> = new EventEmitter();
  auditPlanCriteriaModal: EventEmitter<number> = new EventEmitter();
  msAuditPlanCriteria: EventEmitter<number> = new EventEmitter();
  msAuditPlanObjective: EventEmitter<number> = new EventEmitter();
  auditPlanActivityLogsModal: EventEmitter<any> = new EventEmitter();
  auditScheduleActivityLogsModal: EventEmitter<any> = new EventEmitter();
  auditActivityLogsModal: EventEmitter<any> = new EventEmitter();

  eventMappingModal: EventEmitter<number> = new EventEmitter();
  siteMappingModal: EventEmitter<number> = new EventEmitter();
  amCSAWorkflow: EventEmitter<any> = new EventEmitter();
  amCSAHistory: EventEmitter<any> = new EventEmitter();
  amCSAWorkflowComment: EventEmitter<any> = new EventEmitter();
  cyberIncidentRcaModalControl:EventEmitter<any> = new EventEmitter();
  mockDrillWorkflowAddModal: EventEmitter<any> = new EventEmitter();
  cyberIncidentIAModal:EventEmitter<any> = new EventEmitter();
  cyberIncidentWorkflowCommonAddModal: EventEmitter<any> = new EventEmitter();
  constructor() { }

  dismissMsAuditPreviewModal() {
    this.msAuditPreviewModal.emit();
  }

  dismissMsAuditDocModal() {
    this.addMsAuditDoc.emit();
  }

  dismissMsAuditStartModal() {
    this.startMsAuditModal.emit();
  }

  dismissAddAuditorModal(value) {
    this.msAuditAdd.emit(value)
  }

  dismissAddAuditeesModal(value) {
    this.msAuditeesAdd.emit(value)
  }

  dismissEventChangeReqModal() {
    this.eventChangeReqModal.emit()
  }

  dismissEventChangeReqEventDateModal() {
    this.eventChangeReqEventDateModal.emit()
  }

  dismissEventChangeReqEventBudgetModal() {
    this.eventChangeReqEventBudgetModal.emit()
  }

  dismissEventChangeReqEventScopeModal() {
    this.eventChangeReqEventScopeModal.emit()
  }

  dismissEventChangeReqEventDeliverableModal() {
    this.eventChangeReqEventDeliverableModal.emit()
  }

  dismissEventCRScopeModal() {
    this.eventCRScopeModal.emit()
  }

  dismissEventChangeReqBudgetModal() {
    this.EventChangeReqProjectBudgetModal.emit()
  }

  dismissEventWorkflowModal() {
    this.EventWorkflowModal.emit()
  }

  dismissMatrixPlanModal() {
    this.matrixPlanModal.emit()
  }

  dismissEventMonitorHistoryModal() {
    this.EventMonitorHistoryModal.emit();
  }

  dismissEventApproveCommentModal() {
    this.EventApproveCommentModal.emit();
  }

  dismissEventWorkflowAddModal() {
    this.EventWorkflowAddModal.emit()
  }


  dismissSoaImplementationStatusesControlModal() {
    this.SoaImplementationStatusesSource.emit()
  }

  dismissStrategyWorkFlowHistoryModal() {
    this.strategyWorkFlowHistoryModal.emit();
  }

  dismissAssetsMapping() {
    this.assetsMappingModal.emit();
  }

  dismissComplianceMapping() {
    this.complianceMappingModal.emit();
  }

  dismissIncidentMapping() {
    this.incidentMappingModal.emit();
  }

  dismissProjectMonitoringMapping() {
    this.projectMonitoringMappingModal.emit();
  }

  dismissProjectManagementMapping() {
    this.projectManagementMappingModal.emit();
  }

  dismissMeetingMapping() {
    this.meetingMappingModal.emit();
  }

  dismissTrainingMapping() {
    this.TrainingMappingModal.emit();
  }

  dismissExerciseOutcome() {
    this.exerciseOutcomeModal.emit();
  }

  dismissBcmStrategyWorkflowModal() {
    this.bcmStrategyWorkflowEvent.emit();
  }

  dismissExerciseAdd() {
    this.exerciseAddModal.emit();
  }
  dismissbcsTypeModal() {
    this.bcsTypeModalControl.emit()
  }

  dismissOtherResponsibleUserModal() {
    this.otherResponsibleUserModal.emit()

  }

  dismissstrategicFocusAreaMapping() {
    this.strategicFocusAreaMapping.emit()
  }

  dismissKpiPlanMeasureModal() {
    this.kpiPlanMeasueModal.emit()
  }

  dismissbcmRiskAssessmentModal() {
    this.bcmRiskAssessmentModal.emit()
  }

  dismisseventRiskAssessmentModal() {
    this.eventRiskAssessmentModal.emit()
  }

  dismisskpiMesureModal() {
    this.kpiMesureModal.emit()
  }

  dismissObjectiveScoreModal() {
    this.objectiveScore.emit()
  }
  dismissplnMesureModal() {
    this.planMesureModal.emit()
  }

  dismisskpiMesureHistoryModal() {
    this.kpiMesureHistoryModal.emit()
  }
  dismisskpiMesureHistoryAllModal() {
    this.kpiMesureHistoryAllModal.emit()
  }


  dismissCustomerComplaint() {
    this.customerComplaint.emit()
  }

  dismissCustomerComplaintModal() {
    this.addCustomerComplaint.emit()
  }

  dismissCustomerInvestigationModal() {
    this.addCustomerInvestigation.emit()
  }

  dismissmsAuditFindingCategoryModal(id) {
    this.msAuditFindingCategory.emit(id);
  }

  dismissSlaContractHistoryModal() {
    this.SlaContractHistory.emit()
  }

  dismissSlaContractWorkflowModal() {
    this.SlaContractWorkflow.emit()
  }

  dismissSlaContractWorkflowCommentModal() {
    this.SlaContractWorkflowCommentModal.emit()
  }



  dismissTestAndExercisesHistoryModal() {
    this.TestAndExercisesHistory.emit()
  }

  dismissBiaHistoryModal() {
    this.BiaHistory.emit()
  }

  dismissProjectClosureHistoryModal() {
    this.projectClosureHistory.emit()
  }

  dismissProjectMonitorHistoryModal() {
    this.ProjectMonitorHistory.emit()
  }

  dismissProjectMonitorHistoryCommentModal() {
    this.ProjectMonitorHistoryComments.emit()
  }

  dismissProjectMonitorWorkflowModal() {
    this.ProjectMonitorWorkflow.emit()
  }

  dismissComplianceRegisterHistoryModal() {
    this.ComplianceRegisterHistory.emit()
  }

  dismissComplianceRegisterWorkflowModal() {
    this.ComplianceRegisterWorkflow.emit()
  }

  dismissTestAndExercisesWorkflowModal() {
    this.TestAndExercisesWorkflow.emit()
  }

  dismissBiaWorkflowModal() {
    this.BiaWorkflow.emit()
  }

  dismissprojectClosureWorkflowModal() {
    this.projectClosureWorkflow.emit()
  }

  dismissComplianceRegisterWorkflowCommentModal() {
    this.ComplianceRegisterWorkflowCommentModal.emit()
  }

  dismissTestAndExercisesWorkflowCommentModal() {
    this.TestAndExercisesWorkflowCommentModal.emit()
  }

  dismissBiaCommentModal() {
    this.BiaCommentModal.emit()
  }

  dismissKpiMapping() {
    this.KpiMappingModal.emit();
  }

  dismissProjectClosureCommentModal() {
    this.projectClosureCommentModal.emit()
  }

  dismissProjectChangeRequestCommentModal() {
    this.projectChangeRequestCommentModal.emit()
  }

  dismissObjectiveReviewCommentModal() {
    this.objectiveReviewCommentModal.emit()
  }

  dismissKpiReviewCommentModal() {
    this.kpiReviewCommentModal.emit()
  }

  dismissActionPlanReviewCommentModal() {
    this.actionPlanReviewCommentModal.emit()
  }




  dismissProjectChangeRequestWorkflowModal() {
    this.projectChangeRequestWorkflowModal.emit()
  }

  dismissProjectChangeRequestWorkflowHistoryModal() {
    this.projectChangeRequestWorkflowHistoryModal.emit()
  }

  dismissObjectiveWorkflowHistoryModal() {
    this.objectiveWorkflowHistoryModal.emit()
  }
  dismissKPIWorkflowHistoryModal() {
    this.strategyKpiWorkflowHistoryModal.emit()
  }




  dismissProjectMonitoringCommentModal() {
    this.ProjectMonitoringCommentModal.emit()
  }
  dismissStrategyCommentModal() {
    this.strategyCommentModal.emit()
  }

  dismissComplianceWorkflowAddModal() {
    this.ComplianceWorkflowAddModal.emit();
  }

  dismissInvestigationInfoHistoryModal() {
    this.InvestigationInfoHistory.emit()
  }

  dismissInfoHistoryModal() {
    this.IncidentInfoHistory.emit()
  }

  dismissCaHistoryModal() {
    this.IncidentCaHistory.emit()
  }

  dismissIncidentCaWorkflowModal() {
    this.IncidentCaWorkflow.emit()
  }

  dismissIncidentCaWorkflowCommentModal() {
    this.IncidentCaWorkflowCommentModal.emit()
  }

  dismissIncidentInfoWorkflowModal() {
    this.IncidentInfoWorkflow.emit()
  }

  dismissIncidentInfoWorkflowCommentModal() {
    this.IncidentInfoWorkflowCommentModal.emit()
  }

  dismissIncidentInvestigationWorkflowModal() {
    this.IncidentInvestigationWorkflow.emit()
  }

  dismissIncidentInvestigationWorkflowCommentModal() {
    this.IncidentInvestigationWorkflowCommentModal.emit()
  }

  dismissArciModal() {
    this.ArciModal.emit();
  }

  dismissVitalModal() {
    this.VitalModal.emit();
  }

  dismissRelatedProcess() {
    this.RelatedProcessModal.emit()
  }

  dismissApplicationTypeModal() {
    this.ApplicationTypeModal.emit();
  }

  dismissTierConfigModal() {
    this.TierConfigModal.emit();
  }
  dismissBiaScaleModal() {
    this.BiaScaleModal.emit();
  }
  dismissBiaTireModal() {
    this.BiaTireModal.emit();
  }

  dismissBiaImpactCategoryInformationModal() {
    this.BiaImpactCategoryInformationModal.emit();
  }

  dismissImpactAreaModal() {
    this.ImpactAreaModal.emit();
  }
  dismissImpactScenarioModal() {
    this.ImpactScenarioModal.emit();
  }

  dismissImpactCategoryModal() {
    this.ImpactCategoryModal.emit();
  }

  dismissBiaRatingModal() {
    this.biaRatingModal.emit();
  }
  /** */

  dismissMileStoneModal() {
    this.mileStoneModal.emit();
  }

  dismissActionPlansModal() {
    this.actionPlanModal.emit();
  }

  dismissFocuAreaModal() {
    this.focusAreaModal.emit();
  }

  dismissObjectiveTargetBreakDownModalControl(data) {
    this.objectiveTargetBreakDownModalControl.emit(data);
  }

  dismissAddAllReviewModal() {
    this.addAllReviewModal.emit();
  }

  dismissAddPlanMeasureModal() {
    this.addPlanMeasureModal.emit();
  }
  dismissFocusAreaMasterModal() {
    this.focusAreaMasterModal.emit();
  }

  dismissNotesModal() {
    this.notesModal.emit();
  }

  dismisssettingsModal() {
    this.settingsModal.emit();
  }

  dismissStrategyKpiModal() {
    this.strategyKpiModal.emit()
  }

  dismissWhiteSheetModal() {
    this.whiteSheetModal.emit();
  }

  dismissPlanMeasureMainHistoryModal() {
    this.planMeasureMainHistory.emit();
  }

  dismissPlanMeasureMainCommentModal() {
    this.planMeasureMainComment.emit();
  }

  dismissprojectmonitoringValidationModal() {
    this.projectmonitoriingValidationModal.emit()

  }
  dismissEventMonitoringValidationModal() {
    this.eventMonitoriingValidationModal.emit()

  }
  dismissObjectiveModal() {
    this.objectiveModal.emit();
  }

  dismissStrategyKpiDetailsModal() {
    this.strategyKpiDetailsModal.emit();
  }

  dismissStrategyObjectiveModal() {
    this.strategyObjectiveModal.emit();
  }

  dismissReviewFrequencyModal() {
    this.reviewFrequencyModal.emit();
  }

  dismissStrategyObjectiveTargetModal() {
    this.strategyObjectiveTargetModal.emit();
  }

  dismissStrategyProfileModal(id?) {
    this.strategyProfileModal.emit(id);
  }

  dismissStrategyMappingObjectiveTypeModal(id?) {
    this.strategyMappingObjectiveTypeModal.emit(id);
  }

  dismissMappingPopup() {
    this.mappingPopupModal.emit();
  }

  dismissStrategyMappingInitiativePopup() {
    this.strategyMappingInitiativeDetailPopupModal.emit();
  }

  dismissStrategyMappingprofilePopup() {
    this.strategyMappingProfilePopupModal.emit();
  }

  dismissStrategyMappingObjectPopup() {
    this.strategyMappingObjectDetailPopupModal.emit();
  }

  dismissMappingFocusAreaPopup() {
    this.strategyMappingfocusAreaPopupModal.emit();
  }

  dismissMappingObjectivePopup() {
    this.strategyMappingObjectivePopupModal.emit();
  }

  dismissKpiModal() {
    this.kpiModal.emit();
  }

  dismissStrategyWorkflowAddModal() {
    this.strategyWorkflowAddModal.emit();
  }
  dismissProjectWorkflowAddModal() {
    this.projectWorkflowAddModal.emit();
  }



  introButtonClicked() {
    this.introButtonClickedEvent.emit();
  }

  /** */

  dismisscomplianceRegisterFocusControl() {
    this.complianceRegisterFocusControl.emit();
  }

  dismissExternalAuditCaResolveModal() {
    this.externalAuditCaResolveModal.emit();
  }

  dismissExternalAuditCaUpdateModal() {
    this.externalAuditCaUpdateModal.emit();
  }

  dismissExternalAuditCaHistoryModal() {
    this.externalAuditCaHistoryModal.emit();
  }

  dismissKpiWorkflowAddModal() {
    this.kpiWorkflowAddModal.emit();
  }

  dismissWrmWorkflowAddModal() {
    this.mrmWorkflowAddModal.emit();
  }

  dismissRiskWorkflowAddModal() {
    this.riskWorkflowAddModal.emit();
  }

  dismissIsmsRiskWorkflowAddModal() {
    this.ismsRiskWorkflowAddModal.emit();
  }

  dismissAuditManagementWorkflowAddModal() {
    this.auditManagementWorkflowAddModal.emit();
  }

  dismissAuditManagementAuditPlanAddModal() {
    this.auditManagementAuditPlanAddModal.emit();
  }

  dismissAuditManagementAuditAddModal() {
    this.auditManagementAuditAddModal.emit();
  }

  dismissAuditManagementAnnualAuditPlanAddModal() {
    this.auditManagementAnnualAuditPlanAddModal.emit();
  }

  dismissBcpWorkflowAddModal() {
    this.bcpWorkflowAddModal.emit();
  }


  dismissIncidentWorkflowAddModal() {
    this.incidentWorkflowAddModal.emit();
  }

  dismissIncidenReportAddModal() {
    this.incidentReportAddModal.emit();
  }

  dismissWitnessModalControl() {
    this.witnessAddModalControl.emit();
  }
  dismissWitnessDetailsModalControl() {
    this.witnessAddDetailsModalControl.emit();
  }

  dismissrootCauseModalControl() {
    this.incidentRootCauseAddModalControl.emit();
  }

  dismissInvolvedWitnessModalControl() {
    this.InvolvedWitnessAddModalControl.emit();
  }

  dismissInvestigationProgressModalControl() {
    this.InvestigationProgressModal.emit();
  }

  dismissInvolvedWitnessDetailsModalControl() {
    this.InvolvedWitnessAddDetailsModalControl.emit();
  }

  dismissInvolvedPersonModalControl() {
    this.InvolvedPersonAddModalControl.emit();
  }


  dismissInvolvedPersonDetailsModalControl() {
    this.InvolvedPersonAddDetailModalControl.emit();
  }

  dismissAddInvestigationModalControl() {
    this.AddInvestigationModalControl.emit();
  }

  dismissOtherUsersModalControl() {
    this.otherUsersModalControl.emit();
  }

  dismissHistoryModalControl() {
    this.closeHistoryModal.emit();
  }

  dismissInvestigationHistoryModalControl() {
    this.closeInvestigationHistoryModal.emit();
  }


  dismissInvestigationModalControl() {
    this.investigationDesModalControl.emit();
  }
  dismissInvestigationDetailsModalControl() {
    this.investigationDesDetailsModalControl.emit();
  }

  dismissEventOutcomesModalControl() {
    this.eventOutcomeModalControl.emit();
  }

  dismisssignificantModalControl() {
    this.significantDesModalControl.emit();
  }
  dismisssignificantDetailsModalControl() {
    this.significantDesDetailsModalControl.emit();
  }
  dismissrecommendationsModalControl() {
    this.recommendationsDesModalControl.emit();
  }
  dismissrecommendationsDetailsModalControl() {
    this.recommendationsDesDetailsModalControl.emit();
  }
  dismissreferenceModalControl() {
    this.referenceDesModalControl.emit();
  }

  dismissreferenceDetailsModalControl() {
    this.referenceDesDetailsModalControl.emit();
  }

  dismissAddInvestigatorModalControl() {
    this.incidentInvestigatorMoadlControl.emit();
  }

  dismissAddIncidentCorrectiveAction() {
    this.addIncidentCorrectiveAction.emit();
  }

  dismissAddComplianceRegister() {
    this.addComplianceRegister.emit();
  }

  dismissAddComplianceReport() {
    this.addComplianceReport.emit();
  }
  dismissAddComplianceStatus() {
    this.addComplianceStatus.emit();
  }

  dismissTrainingMatrixDetails() {
    this.trainingMatrixDetails.emit();
  }

  dismissPersonInvolvedModalControl() {
    this.personInvolvedAddModalControl.emit();
  }
  dismissPersonInvolvedDetailModalControl() {
    this.personInvolvedAddDetailModalControl.emit();
  }
  dismissCaResolveModalControlModal() {
    this.caResolveModalControl.emit();
  }

  dismissCahistoryControlModal() {
    this.cahistoryModalControl.emit();
  }

  dismissProfileHistoryControlModal() {
    this.profileHistoryModalControl.emit();
  }
  dismissInitiativeHistoryControlModal() {
    this.initiativeHistoryModalControl.emit();
  }
  // dismissObjectiveHistoryControlModal(){
  //   this.objectiveHistoryModalControl.emit();
  // }
  // dismissKPIHistoryControlModal(){
  //   this.KPIHistoryModalControl.emit();
  // }

  dismissGenerateAuditReportModalControl() {
    this.generateAuditReportModalControl.emit();
  }
  dismissChecklistsSingleViewFocusControl() {
    this.checklistsSingleViewModalFocusControl.emit();
  }
  dismissChecklistSingleViewModal() {
    this.checklistSingleViewModal.emit();
  }
  dissmissChecklistAllViewTableModal() {
    this.checklistAllViewTableModal.emit();
  }
  dismissAuditWorkflowRoleAddModal() {
    this.auditWorkflowRoleAddModal.emit();
  }

  dismissAuditWorkflowCommonAddModal() {
    this.auditWorkflowCommonAddModal.emit();
  }

  dismissIncidentWorkflowCommonAddModal() {
    this.incidentWorkflowCommonAddModal.emit();
  }


  dismissAuditWorkflowTeamAddModal() {
    this.auditWorkflowTeamAddModal.emit();
  }

  dismissAuditWorkflowHeadUnitAddModal() {
    this.auditWorkflowHeadUnitAddModal.emit();
  }

  dismissAuditWorkflowDesignationAddModal() {
    this.auditWorkflowDesignationAddModal.emit();
  }

  dismissAuditWorkflowUserAddModal() {
    this.auditWorkflowUserAddModal.emit();
  }

  dismissIncidentWorkflowUserAddModal() {
    this.incidentflowUserAddModal.emit();
  }

  dismissRiskRatingListControlModal() {
    this.riskRatingListControlModal.emit();
  }
  dismissAuditWorkflowModal() {
    this.auditWorkflowAddModal.emit();
  }

  dismissTemplateModal() {
    this.auditTemplateAddModal.emit();
  }

  dismissIncidentTemplateModal() {
    this.incidentTemplateAddModal.emit();
  }

  dismissActionPlanModal() {
    this.actionPlanModalEvent.emit();
  }
  dismissAddNewControlFocus() {
    this.addNewControlFocusEvent.emit();
  }
  dismissAddNewControl() {
    this.addNewControlEvent.emit();
  }
  dismissRcaRootCauseSubChildModal() {
    this.rcaRootCauseSubChild.emit();
  }

  dismissRcaRootCauseChildModal() {
    this.rcaRootCausechild.emit();
  }

  dismissDateOnlyUpdateAuditSchedule() {
    this.auditScheduleDateonlyUpdateModal.emit();
  }

  dismissQuickCorrectionModal() {
    this.quickCorrectionAddModalControl.emit();
  }

  dismissFindingFormChecklistModal() {
    this.checklistAnswersAddModalControl.emit();
  }

  dismissAuditorsAuditeesAddModal() {
    this.auditorsAuditeesAddModalControl.emit();
  }

  dismissIaRcaAddModal() {
    this.IAfindingsRcaModalControl.emit();
  }

  dismissIaCaModal() {
    this.caFindingsModalControl.emit();
  }


  dismissChooseAuditorsModal() {
    this.chooseAuditorsModal.emit();
  }

  dissmissNewAuditCategoryFromAuditPlanModal() {
    this.addNewAuditCategoryFromAuditPlan.emit();
  }
  dismissAddCriteriaModal() {
    this.addCriteriaModal.emit();
  }

  dismissAddObjectiveModal() {
    this.addObjectiveModal.emit();
  }
  dismissNewImportRiskModal() {
    this.importRiskFromAuditProgranModal.emit();

  }

  dismissNewImportProcessModal() {
    this.importProcessFromAuditProgramModal.emit();
  }

  dismissImportAuditableItemsModal() {
    this.importAuditableItemModal.emit();
  }

  dismissNewChecklistAddModal() {
    this.newChecklistAddModal.emit();
  }
  dismissAddCheckListModal() {
    this.addCheckListModal.emit();
    this.addCheckListModal_temp.emit();
  }

  dismissAddAuditProgramModal() {
    this.addAuditProgramModal.emit();
  }

  dismissImportRiskModal() {
    this.importRiskModal.emit();
  }

  dismissImportProcessModal() {
    this.importProcessModal.emit();
  }

  dismissIssueCategoryModal() {
    this.modalChange.emit(1);
  }

  dismissIssueModal() {
    this.modalChange.emit(2);
  }

  dismissIssueDomainModal() {
    this.modalChange.emit(3);
  }

  dismissUserGuideModal() {
    this.userGuide.emit();
  }

  dismissIssueTypeModal() {
    this.modalChange.emit(4);
  }

  dismissStakeHolderModal() {
    this.modalChange.emit(5);
  }

  dismissNeedsModal() {
    this.modalChange.emit(6);
  }

  dismissProcessesModal() {
    this.modalChange.emit(7);
  }

  dismissIssueStatusModal() {
    this.modalChange.emit(8);
  }



  dismissProductCategory() {
    this.productCategory.emit(null);
  }

  dismissServiceCategory() {
    this.serviceCategory.emit(null);
  }

  dismissUserDocumentModal() {
    this.userDocument.emit(1);
  }

  dismissMsTypeVersionModal(msType) {
    this.msTypeVersion.emit(msType);
  }

  dismissMsTypeModal() {
    this.msType.emit(null);
  }

  dismissincidentcategoriesModal() {
    this.incidentCategories.emit(null);
  }

  dismissbcpTemplateAdd() {
    this.bcpTemplateAdd.emit(null);
  }

  dismissOcFullViewModal() {
    this.ocFullView.emit(null);
  }

  dismissjsoCategoryModal() {
    this.jsoCategory.emit(null);
  }

  dismissjsoSubCategoryModal() {
    this.jsoSubCategory.emit(null);
  }

  dismissjsoUnsafeActionObservedGroupModal() {
    this.jsoUnsafeActionObservedGroup.emit(null);
  }

  dismissjsoUnsafeActionSubCategoryModal() {
    this.jsoUnsafeActionSubCategory.emit(null);
  }

  dismissjsoUnsafeActionCategoryModal() {
    this.jsoUnsafeActionCategory.emit(null);
  }

  dismissjsoObservationTypeModal() {
    this.jsoObservationType.emit(null);
  }

  dismissTrainingCategoryModal() {
    this.trainingCategory.emit(null);
  }

  dismissStrategyInitiativeActionModal() {
    this.strategyInitiativeAction.emit(null);
  }

  dismissincidentsubcategoryModal() {
    this.incidentSubCategory.emit(null);
  }
  dismissObjectiveMasterModal() {
    this.objectiveMasterModalControl.emit();
  }
  dismissProductCategorymasterModal() {
    this.productCategoryMasterControl.emit();
  }

  dismissServiceCategoryMasterModal() {
    this.serviceCategoryMasterControl.emit();
  }

  dismissControlCategoryModal() {
    this.controlCategory.emit()
  }

  dismissControlModeModal() {
    this.controlMode.emit()
  }

  dismissExecutiveSummaryModal() {
    this.executiveSummaryModal.emit();
  }

  dismissErmDetailsModal() {
    this.ermDetailsModal.emit();
  }

  dissmissExecutiveAddReportModal() {
    this.executiveAddReportModal.emit();
  }

  dissmissQuickRiskAddReportModal() {
    this.quickRiskAddReportModal.emit();
  }
  dismissQuickRiskAssessmentModal() {
    this.quickRiskAssessmentModal.emit();
  }

  dismissQuickAddProcessRiskAssessmentModal() {
    this.quickRiskAddProcessAssessmentModal.emit();
  }

  dismissQuickAddObservationRiskAssessmentModal() {
    this.quickRiskAddObservationProcessAssessmentModal.emit();
  }

  dismissQuickRiskAddMitigationModal() {
    this.quickRiskAddMitigation.emit();
  }

  dismissTrainingModal() {
    this.trainingModal.emit();
  }

  dismissTrainingCompleteModal() {
    this.trainingCompleteModal.emit();
  }

  dissmissEditErmDetailRiskModal() {
    this.editErmDetailRiskModal.emit();
  }

  dissmissEditErmDetailRiskTreatmentModal() {
    this.editErmDetailRiskTreatmentModal.emit();
  }

  dismissAuditItemControlModal() {
    this.auditItemControl.emit()
  }

  dismissNeedExpectationModal() {
    this.needsExpectationControl.emit();
  }

  dismissStrategyPerformancesModal() {
    this.StrategyPerformancesControl.emit();
  }

  dismissExternalAuditTypesModal() {
    this.externalAuditTypesControl.emit();
  }

  dismissAuditCategoryControlModal() {
    this.auditCategoriesControl.emit()
  }

  dismissAuditCriteriaControlModal() {
    this.auditCriteriaControl.emit()
  }

  dismissKpiReviewFrequenciesControlModal() {
    this.KpiReviewFrequenciesControl.emit()//kpi
  }

  dismissKpiUpdateScoreModal(res) {
    this.updateScoreModal.emit(res)//kpi
  }

  dismissProjectActivityModal() {
    this.projectActivityModal.emit()//kpi
  }

  dismissAuditObjectiveControlModal() {
    this.auditObjectiveControl.emit()
  }

  dismissAUditableItemControlModal() {
    this.auditableItemControl.emit();
  }

  dismissAuditCheckListControlModal() {
    this.auditCheckListControl.emit()
  }

  dismissAuditFindingCategoryControlModal() {
    this.auditFindingCategoryControl.emit()
  }

  dismissExternalFindingCategoryControlModal() {
    this.externalFindingCategoryControl.emit()
  }

  dismissFindingImpactCategoryControlModal() {
    this.findingImpactAnalysisCategoryControl.emit()
  }

  dismissRootCausecategoryControlModal() {
    this.rootCauseCategoryControl.emit()
  }

  dismissRootCauseSubCategoryControlModal() {
    this.rootCauseSubCategoryControl.emit()
  }

  dismissChildModalCloseControl() {
    this.childModalCloseControl.emit();
  }

  dismissOrganizationComplainesCategoryControlModal() {
    this.organizationComplainesCategory.emit()
  }

  dismissOrganizationComplianceTypeControlModal() {
    this.organizationComplianceType.emit();
  }

  dismissSlaCategoryControlModal() {
    this.slaCategory.emit();
  }

  dismissAssetLocationControl() {
    this.AssetLocation.emit();
  }

  dismissAssetSpecificationControl() {
    this.AssetSpecification.emit();
  }

  dismissAssetMaintenanceControl() {
    this.AssetMaintenance.emit();
  }

  dismissAssetCategoryControlModal() {
    this.AssetCategory.emit();
  }

  dismissAssetSubCategoryControlModal() {
    this.AssetSubCategory.emit();
  }

  dismissStorageTypesControlModal() {
    this.storageTypes.emit();
  }

  dismissBusinessApplicationTypeModal() {
    this.businessApplicationType.emit();
  }
  dismissProcessAccessibilityControlModal() {
    this.processAccessibility.emit();
  }

  dismissmsAuditTeamModal() {
    this.msAuditTeam.emit();
  }

  dismissAuditCheckListModal() {
    this.msAuditCheckList.emit();
  }

  dismissAuditChooseCheckListModal() {
    this.msAuditChooseCheckList.emit()
  }

  dismissAuditNonConfirmityModal() {
    this.msAuditNonConformity.emit()
  }

  dismissAuditAddAnswerModal() {
    this.msAuditAddAnswerCheckList.emit()
  }

  dismissEventInfluenceControlModal() {
    this.eventInfluence.emit();
  }

  dismissRiskImpactGuidelineControlModal() {
    this.RiskImpactGuideline.emit();
  }

  dismissTestAndExerciseRecoveryLevelControlModal() {
    this.TestAndExerciseRecoveryLevel.emit();
  }

  dismissTestAndExerciseChecklistControlModal() {
    this.TestAndExerciseChecklist.emit();
  }

  dismissIsmsVulnerabilityControlModal() {
    this.IsmsVulnerability.emit();
  }

  dismissCustomerComplaintSourceControlModal() {
    this.CustomerComplaintSource.emit();
  }


  dismissIsmsRiskMatrixRatingLevelControlModal() {
    this.IsmsRiskMatrixRatingLevel.emit();
  }

  dismissIsmsSOAModal() {
    this.IsmsSoa.emit();
  }


  dismissBusinessApplicationsModal() {
    this.businessApplications.emit();
  }

  dismissFindingsListModal() {
    this.FindingsList.emit();
  }

  dismissmsAuditCategoryModal(id) {
    this.msAuditCategory.emit(id);
  }

  dismissFindingsQuickCorrectionModal() {
    this.FindingsQuickCorrection.emit();
  }

  dismissPhysicalConditionRankingsModal() {
    this.PhysicalConditionRankings.emit();
  }

  dismissAssetMaintenanceCategoriesModal() {
    this.AssetMaintenanceCategories.emit();
  }

  dismissAssetMatrixCategoriesModal() {
    this.AssetMatrixCategories.emit();
  }



  dismissSupplierModal() {
    this.supplier.emit();
  }

  dismissStorageLocationModal() {
    this.storageLocation.emit();
  }

  dismissBackupFrequencyModal() {
    this.backupFrequency.emit();
  }

  dismissPeriodicBackupModal() {
    this.periodicBackup.emit();
  }

  dismissProcessOperationFrequencyModal() {
    this.processOperationFrequency.emit();
  }

  dismissStrategicAlignmentModal() {
    this.strategicAlignmentModal.emit();
  }

  dismissEventStrategicThemeModal() {
    this.eventStrategicThemeModal.emit();
  }

  dismissStrategicPaymentModal() {
    this.ProjectPaymentModal.emit();
  }


  dismissTestAndExerciseTypesModal() {
    this.testAndExerciseTypes.emit();
  }

  dismissProcessOperationModeModal() {
    this.processOperationMode.emit();
  }

  dismissRecordRetentionPoliciesModal() {
    this.recordRetentionPolicies.emit();
  }

  dismissRegionControlModal() {
    this.regionControl.emit();
  }
  dismissCurrencyControlModal() {
    this.currencyControl.emit();
  }

  dismissOrganizationDivisionControlModal() {
    this.division.emit()
  }

  dismissRiskAreaControlModal() {
    this.riskArea.emit()
  }

  dismissRiskLibraryControlModal() {
    this.riskLibrary.emit()
  }

  dismissRiskSourceControlModal() {
    this.riskSource.emit()
  }

  dissmissAmAuditControlMode() {
    this.amAuditMode.emit();
  }

  dissmissCorrectiveActionStatus() {
    this.correctiveActionStatus.emit();
  }

  dissmissMsAuditCheklistGroup() {
    this.msAuditCheklistGroup.emit();
  }

  dismissRiskInfoWorkflowModal() {
    this.riskInfoWorkflow.emit()
  }

  dismissAuditPlanWorkflowModal() {
    this.amAuditPlanWorkflow.emit()
  }
  dismissAmPreliminaryWorkflowModal() {
    this.amPreliminaryWorkflow.emit()
  }
  dismissAmDraftWorkflowModal() {
    this.amDraftWorkflow.emit()
  }
  dismissAmFinalWorkflowModal() {
    this.amFinalWorkflow.emit()
  }

  dismissAnnualAuditPlanWorkflowModal() {
    this.amAnnualAuditPlanWorkflow.emit()
  }


  dismissRiskInfoHistoryModal() {
    this.riskInfoHistory.emit()
  }

  dismissAuditPlanHistoryModal() {
    this.amAuditPlanHistory.emit()
  }
  dismissAmPreliminaryHistoryModal() {
    this.amPreliminaryHistory.emit()
  }
  dismissAmDraftHistoryModal() {
    this.amDraftHistory.emit()
  }
  dismissAmFinalHistoryModal() {
    this.amFinalHistory.emit()
  }

  dismissAnnualAuditPlanHistoryModal() {
    this.amAnnualAuditPlanHistory.emit()
  }

  dismissRiskJourneyWorkflowModal() {
    this.riskJourneyWorkflow.emit()
  }


  dismissRiskJourneyHistoryModal() {
    this.riskJourneyHistory.emit()
  }


  dismissIsmsRiskInfoWorkflowModal() {
    this.ismsRiskInfoWorkflow.emit()
  }

  dismissTimeTrackerDetailsModal() {
    this.detailsTimeTrackerModalControl.emit()

  }


  dismissIsmsRiskInfoHistoryModal() {
    this.ismsRiskInfoHistory.emit()
  }

  dismissIsmsRiskJourneyWorkflowModal() {
    this.ismsRiskJourneyWorkflow.emit()
  }


  dismissIsmsRiskJourneyHistoryModal() {
    this.ismsRiskJourneyHistory.emit()
  }

  dismisskeyRiskIndicatorModal() {
    this.keyRiskIndicator.emit()
  }

  dismissStrategicObjectivesModal() {
    this.strategicObjectives.emit()
  }

  dismissOrganisationChangesModal() {
    this.organisationChanges.emit()
  }

  dismissKRIModal() {
    this.riskKRI.emit()
  }

  dismissModuleSubmenuModal() {
    this.moduleSubemnu.emit()
  }

  dismissmodulemenuModal() {
    this.modulemenu.emit()
  }


  dismissRiskViewMorePopup() {
    this.riskViewMore.emit()
  }

  dismissRiskRcaModal() {
    this.riskRcaModalControl.emit()
  }

  dismissRiskCategoryControlModal() {
    this.riskCategory.emit()
  }

  dismissRiskSubCategoryControlModal() {
    this.riskSubCategory.emit()
  }

  dismissImpactCategoryControlModal() {
    this.impactCategory.emit();
  }

  dismissRiskImpactAnalysisModal() {
    this.riskImpactAnalysis.emit();
  }

  dismissRiskControlPlanControlModal() {
    this.riskControlPlan.emit()
  }

  dismissControlEfficiencyMeasuresControlModal() {
    this.controlEfficienyMeasures.emit()
  }

  dismissVenueControlModal() {
    this.venue.emit()
  }

  dismissCustomerSelectModal() {
    this.customerControl.emit();
  }

  dismissProjectSelectModal() {
    this.projectSelect.emit();
  }

  dismissIssueSelectModal() {
    this.issueSelect.emit();
  }

  dismissBusinessApplicationSelectModal() {
    this.businessApplicationSelect.emit();
  }

  dismissServiceSelectModal() {
    this.serviceSelect.emit();
  }

  dismissRiskSelectModal() {
    this.riskSelect.emit();
  }

  dismissreportingFrequencyModal() {
    this.reportingFrequency.emit();
  }

  dismissAddParticipantsModal(value) {
    this.addParticipantsModal.emit(value);
  }

  dismissMeetingPlanAddParticipantsModal(close) {
    this.addMeetingPlanParticipantsModal.emit(close);
  }

  dismissOrganizationDepartmentControlModal() {
    this.departmentControl.emit()
  }

  dismissOrganizationSectionControlModal() {
    this.sectionControl.emit()
  }

  dismissOrganizationSubSectionControlModal() {
    this.subSectionControl.emit()
  }

  dismissHumanCaptitalCompetencyControlModal() {
    this.competencyControl.emit()
  }

  dismissHumanCapitalCompetencyGroupControlModal() {
    this.competencyGroupControl.emit()
  }

  dismissHumanCapitalDesignationControlModal() {
    this.designationControl.emit();
  }

  dismissHumanCapitalDesignationCompetencyControlModal() {
    this.designationDetailControl.emit();
  }

  dismissHumanCapitalDesignationCompetencyAddControlModal() {
    this.competencyAddControl.emit();
  }

  dismissHumanCapitalDesignationGradeControlModal() {
    this.designationGradeControl.emit();
  }

  dismissHumanCapitalDesignationlevelControlModal() {
    this.designationLevelControl.emit();
  }

  dismissHumanCapitalDesignationZoneControlModal() {
    this.designationZoneControl.emit();
  }

  dismissHumanCapitalKpiCategoryControlModal() {
    this.kpiCategoryControl.emit();
  }

  dismissHumanCapitalUserKpiCOntrolModal() {
    this.userKpiControl.emit();
  }

  dismissHumanCapitalReportFrequencyModal() {
    this.reportFrequencyControl.emit();
  }

  dismissHumanCapitalUnitModal() {
    this.humanCapitalUnitControl.emit();
  }

  dismissHumanCapitalUserDocumentControlmodal() {
    this.userDocumentControl.emit();
  }

  dismissHumanCapitalUserJdControlModal() {
    this.userJdControl.emit();
  }

  dismissFocusAreaModalControl() {
    this.focusAreaModalControl.emit();
  }

  dismissStrategicThemeModalControl() {
    this.strategicThemeModalControl.emit();
  }

  dismissObjectiveModalControl() {
    this.objectiveModalControl.emit();
  }
  dismissIncidentDamageTypeModalControl() {
    this.incidentDamageTypeModalControl.emit();
  }
  dismissIncidentDamageSeverityModalControl() {
    this.incidentDamageSeverityModalControl.emit();
  }
  dismissIncidentTypeModalControl() {
    this.incidentTypeModalControl.emit();
  }
  dismissIncidentRootCauseModalControl() {
    this.incidentRootCauseModalControl.emit();
  }

  dismissKnowledgeHubDocumentCategoryControlModal() {
    this.documentCategoryControl.emit();
  }

  dismissKnowledgeHubComplianceAreaControlModal() {
    this.complianceAreaControl.emit();
  }

  dismissComplianceSectionControlModal() {
    this.complianceSectionControl.emit();
  }

  dismissComplianceFrequencyControlModal() {
    this.complianceFrequencyControl.emit();
  }

  dismissComplianceStatusControlModal() {
    this.complianceStatusControl.emit();
  }

  dismissKnowledgeHubDocumentTypeControlModal() {
    this.documentTypesControl.emit();
  }

  dismissKnowledgeHubDocumentFamilyControlModal() {
    this.documentFamilyControl.emit();
  }

  dismissKnowledgeHubDocumentSubCategoryModal() {
    this.documentSubCategoryControl.emit();
  }

  dismissKnowledgeHubDocumentSubSubCategoryModal() {
    this.documentSubSubCategoryControl.emit();
  }

  dismissKnowledgeHubTagControlModal() {
    this.documentTagControl.emit();
  }

  dismissFrameworkModal() {
    this.frameworkControl.emit()
  }

  dismissMaturityModal() {
    this.maturityModalControl.emit()
  }

  dismissControlAssessmentModal() {
    this.conrolAssessmentModalControl.emit()
  }
  dismissControlAssessmentActionPlanModal() {
    this.controlAssessmentActionModalControl.emit()
  }

  dismissControlAssessmentUpdateActionPlanModal() {
    this.controlAssessmentCaUpdateModal.emit()
  }

  dismissControlAssessmentHistoryActionPlanModal() {
    this.controlAssessmentCaHistoryModal.emit()
  }


  dismissAssessmentModal() {
    this.assessmentControl.emit()
  }

  dismissLabelModal() {
    this.labelControl.emit();
  }

  dismissIndustryModal() {
    this.industryControl.emit();
  }

  dismissUnitControlModal() {
    this.unitModalControl.emit();
  }

  dismissControlTypesModal() {
    this.controlTypes.emit()
  }

  dismissChildModalClose() {
    this.closeUnitChildModal.emit();
  }

  dissmissAddCustomerComplaintActionPlanModal() {
    this.addCustomerComplaintActionPlanModal.emit();
  }

  dissmissProjectTaskModal() {
    this.addProjectTaskModal.emit();
  }

  dissmissAddCustomersDetails() {
    this.addCustomersDetails.emit();
  }

  dissmissEventMilestoneModal() {
    this.eventMilestoneModal.emit();
  }

  dissmissEventProgressModal() {
    this.eventProgressModal.emit();
  }

  dissmissProjectMilestoneModal() {
    this.projectMileStoneModal.emit();
  }

  dissmissProjectScopeModal() {
    this.projectScopeModal.emit();
  }

  dissmissEventScopeModal() {
    this.eventScopeModal.emit();
  }

  dissmissProjectOutcomesModal() {
    this.projectOutcomesModal.emit();
  }

  dissmissProjectDeliverablesModal() {
    this.projectDeliverablesModal.emit();
  }

  dissmissProjectChangeRequestModal() {
    this.projectChangeRequestModal.emit();
  }

  dissmissProjectChangeRequestItemsModal() {
    this.projectChangeRequestItemsModal.emit();
  }

  dissmissProjectMProgressModal() {
    this.projectMProgressModal.emit();
  }

  dissmissPreviewModal() {
    this.previewModal.emit();
  }

  dismissControlAuditableItemChildModal() {
    this.controlsChildModal.emit();
  }

  dismissTimezoneMasterModal() {
    this.timezoneMasterControl.emit();
  }

  dismissLocationMasterModal(data?) {
    this.locationMasterControl.emit(data);
  }

  dismissStrategicObjectivesMapping() {
    this.strategicObjectivesMapping.emit();
  }

  dismissRcaControlModal() {


    this.rcaModalControl.emit();
  }

  dismissHumanCapitalKpiChildModal() {
    this.humanCapitalKpiChildControl.emit();
  }

  dismissKpiCategoryChildModal() {
    this.closeKpiCategoryChild.emit();
  }

  setModalStyle() {
    this.ModalStyle.emit()
  }

  dismissCountryControlModal() {
    this.countryControl.emit();
  }

  dismissCorrectiveActionModal() {
    this.correctiveActionModalControl.emit();
  }

  dismissFindingCorrectiveActionModal() {
    this.findingCorrectiveActionModalControl.emit();
  }

  dismissIndustryCategoryControlModal() {
    this.industryCategoryControl.emit();
  }

  dismissControlSubcategoryModal(controlCategory) {
    this.controlSubCategory.emit(controlCategory)
  }

  dismissProfileSliderComponent() {
    this.profileSlider.emit();
  }

  dismissDeletePopup(status: boolean) {
    this.deletePopup.emit(status);
    this.deletePopup_temp.emit(status)
  }

  dismissDatePopup(status: boolean) {
    this.customDatePopup.emit(status);
  }

  dismissLogDetailsPopup(status: boolean) {
    this.detailPopup.emit(status);
  }

  dismissViewMorePopup() {
    this.viewMorePopup.emit();
  }
  dismissCommonModal(type?) {
    this.commonModal.emit(type);
    this.commonModal_temp.emit(type)
  }

  dismissDocTypePopup() {
    this.docTypePopup.emit();
  }

  dismissActivityModal() {
    this.activityModal.emit()
  }
  dismissarciMatrixModal() {
    this.arciMatrixModal.emit()
  }

  dismissProcessGroupModal() {
    this.processGroupModal.emit()
  }
  dismissProcessCategoryModal() {
    this.processCategoryModal.emit()
  }

  dismissBpmAssetModal() {
    this.bpmAssetModal.emit()
  }



  dismissAUditableItemControlAddModal() {
    this.auditableItemcontrolAddModalControl.emit();
  }


  dismissProjectInformationAddModal() {
    this.projectInformationAddModalControl.emit();
  }

  dismissProjectStakeholderModal() {
    this.projectStakeholderModal.emit();
  }


  dismissProjectTeamModalModal() {
    this.projectTeamModal.emit();
  }

  dismissExternalUsersModalModal() {
    this.externalUsers.emit();
  }

  dismissEventExternalUsersModalModal() {
    this.eventexternalUsers.emit();
  }

  dismissProjectDocumentModal() {
    this.projectDocumentModal.emit();
  }

  dismissEventDocumentModal() {
    this.eventDocumentModal.emit();
  }

  dismissEventOverviewModal() {
    this.eventOverviewModal.emit();
  }


  dismissprojectClosureModal() {
    this.projectClosureModal.emit();
  }

  dismissProjectRiskModal() {
    this.projectRiskModal.emit();
  }

  dismissProjectIssueCaModal() {
    this.projectIssueCaModal.emit();
  }

  dismissLessonLearntCaModal() {
    this.lessonLearntCaModal.emit();
  }

  dismissClosureWorkflow() {
    this.closureWorkflowModal.emit()
  }

  dismissClosureWorkflowComment() {
    this.closureWorkflowCommentModal.emit()
  }

  dismissClosureWorkflowHistory() {
    this.closureWorkflowHistory.emit()
  }

  dismissProjectBudgetModal() {
    this.projectBudgetModal.emit();
  }

  dismissEventBudgetModal() {
    this.eventBudgetModal.emit();
  }

  dismissEventClosureModal() {
    this.eventClosureModal.emit();
  }

  dismissEventClosureMainModal() {
    this.eventClosureMainModal.emit();
  }

  dismissEventTaskModal() {
    this.eventTaskModal.emit()
  }

  dismissPercentageUpdateModal() {
    this.percentageModal.emit()
  }

  dismissLessonLearnedModal() {
    this.eventLessonLearnedModal.emit()
  }

  dismissEventStakeholderModal() {
    this.eventStakeholderModal.emit()
  }

  dismissEventChecklistModal() {
    this.eventChecklistModal.emit()
  }

  dismissEventViewMoreModal() {
    this.eventViewMoreModal.emit()
  }

  dismissEventSpecificationModal() {
    this.eventSpecificationModal.emit();
  }

  dismissEventDeliverableModal() {
    this.eventDeliverableModal.emit();
  }

  dismissRefCodeModal() {
    this.eventRefCodeModal.emit();
  }

  dismissChangeReqProjectBudgetModal() {
    this.projectChangeReqBudgetModal.emit();
  }

  dismissAmAuditCategoryControlModal() {
    this.AmAuditCategory.emit();
  }

  dismissInitiativeMoreModal() {
    this.initiativeMoreModalControl.emit();
  }
  dismissFaqControlModal() {
    this.faq.emit();
  }

  dissmissOtherDocumentModal() {
    this.otherDocuments.emit();
  }

  dismissMeetingCategoryControlModal() {
    this.meetingCategory.emit();
  }

  dismissMeetingCriteriaControlModal(id) {
    this.meetingCriteria.emit(id);
  }

  dismissMeetingObjectiveControlModal(id) {
    this.meetingObjective.emit(id);
  }

  dismissMeetingAgendaControlModal(id) {
    this.meetingAgenda.emit(id);
  }

  dismissMomTab(value) {
    this.meetingMomTab.emit(value);
  }

  dismissProjectTimeCategoryControlModal() {
    this.projectTimeCategory.emit();
  }

  dismissProjectCostCategoryControlModal() {
    this.projectCostCategory.emit();
  }

  dismissProjectCategoryControlModal(id?) {
    this.projectCategory.emit(id);
  }

  dismissProjectRolesControlModal() {
    this.porjectRolesControl.emit();
  }

  dismissTaskCategoryControlModal() {
    this.projectTaskCategory.emit();
  }

  dismissTaskPrioritiesControlModal() {
    this.projectTaskPriorities.emit();
  }

  dismissDeliverableControlModal() {
    this.projectDeliverable.emit();
  }

  dismissDiscussionControlModal() {
    this.projectDiscussion.emit();
  }

  dismissProfileQualificationModal() {
    this.profileQualificationModal.emit();
  }

  dismissRiskTreatmentUpdateModal() {
    this.riskTreatmentUpdateModal.emit();
  }

  dismissIsmsRiskTreatmentUpdateModal() {
    this.ismsRiskTreatmentUpdateModal.emit();
  }

  dismissIncidentCorrectiveActionUpdateModal() {
    this.incidentCorrectiveActionUpdateModal.emit();
  }

  dismissLessonLearnedCaUpdateModal() {
    this.lessonLearntCaUpdateModal.emit();
  }

  dismissEventCorrectiveActionUpdateModal() {
    this.eventCorrectiveActionUpdateModal.emit();
  }

  dismissSLADocumentRenewModal() {
    this.slaDocumentRenewModel.emit();
  }

  dismissSLAContractModal() {
    this.slaCOntractModal.emit();
  }

  dismissSLADocumentPreviewModal() {
    this.slaDocumentPreviewModal.emit();
  }

  dismissCorrectiveACtionPreviewModal() {
    this.correctiveACtionPreviewModal.emit();
  }

  dismissCustomerCorrectiveActionPreviewModal() {
    this.customerCorrectiveACtionPreviewModal.emit();
  }

  dismissJsoModal() {
    this.JsoModel.emit();
  }

  dismissJsoUnsafeActionModal() {
    this.JsoUnsafeActionModel.emit();
  }

  dismissCloseUnsafeActionModal() {
    this.closeUnsafeActionModel.emit();
  }

  dismissProfileModal() {
    this.profileModal.emit();
  }

  dismissProfileCertificateModal() {
    this.profileCertificateModal.emit();
  }

  dismissProfileExperienceModal() {
    this.profileExperienceModal.emit();
  }

  dismissKhDocumentModal() {
    this.khDocumentModal.emit();
  }

  dismissProductModal() {
    this.productControl.emit();
  }


  showHideNoConnectionModal(status: boolean) {
    this.noConnectionModal.emit(status);
  }

  showHideIdleModal(status: boolean) {
    this.idleTimeoutModal.emit(status);
  }

  setStakeHolderType(typeId) {
    this.stakeHolderType.emit(typeId)
  }

  addTemplateChild(modalType, type, data) {
    let emittedData = {
      type: type,
      data: data
    }
    this.templateChildComponent.emit(emittedData)
    this.templateChildComponent_temp.emit(emittedData)
  }

  deleteTemplateChild(data) {
    this.deleteTemplate.emit(data)
    this.deleteTemplate_temp.emit(data)
  }

  editTemplateChild(data) {
    this.editTemplate.emit(data);
    this.editTemplate_temp.emit(data);
  }

  addChildNotes(id) {
    this.childNote.emit(id)
    this.childNote_temp.emit(id)
  }

  editChildNotes(editData) {
    this.editChildNote.emit(editData)
    this.editChildNote_temp.emit(editData)
  }

  deleteChildNotes(deleteData) {
    this.deleteChildNote.emit(deleteData)
    this.deleteChildNote_temp.emit(deleteData)
  }

  addChildControls(addData) {
    this.addchildControl.emit(addData)
    this.addchildControl_temp.emit(addData)
  }

  addChildCheckLists(addData) {
    this.addchildCheckList.emit(addData)
    this.addchildCheckList_temp.emit(addData)
  }

  dismissCRWorkflow() {
    this.changeRequestWorkflow.emit()
  }

  dismissCRWorkflowHistory() {
    this.changeRequestWorkflowHistory.emit()
  }

  deleteChildCheckLists(deleteData) {
    this.deleteChildCheckList.emit(deleteData)
    this.deleteChildCheckList_temp.emit(deleteData)
  }
  deleteChildControlLists(deleteData) {
    this.deleteChildControl.emit(deleteData)
    this.deleteChildControl_temp.emit(deleteData)
  }
  updatePCDA(data) {
    this.passPCDA.emit(data)
    this.passCheckList_temp.emit(data)
  }

  updateCheckList(data) {
    this.passCheckList.emit(data)
    this.passCheckList_temp.emit(data)
  }

  closeStakeholderNeedsAndExpectationModal() {
    this.stakeholderNeedsAndExpectationsControl.emit();
  }

  openStakeholderNeedExpectationFormModal(status) {
    this.stakeholderNeedExpectationFormModalControl.emit(status);
  }

  dismissModal() {
    this.modalDismiss.emit()
  }

  dismissActivityDetailsModal() {
    this.activityDetailsmodalDismiss.emit()
  }

  dismissMrmCriteriaControlAddModal() {
    this.criteriaItemAddModalControl.emit();
  }

  dismissMrmAgengaControlAddModal() {
    this.agendaItemAddModalControl.emit();
  }

  dismissMrmObjectiveControlAddModal() {
    this.objectiveItemAddModalControl.emit();
  }

  dismissProjectIssueCategoryModal() {
    this.issueCategoryModal.emit();
  }

  dismissMrmFindingControlAddModal() {
    this.findingItemAddModalControl.emit();
  }

  dismissMrmNonConformityAddModal() {
    this.NonConformityItemAddModalControl.emit();
  }

  dismissActionPlanUpdateModal(data) {
    this.actionPlanUpadateModal.emit(data);
  }

  dismissmeetingPlanDateUpadateModal(data) {
    this.meetingPlanDateUpadateModal.emit(data);
  }

  dismissmeetingPlanCancelModal(data) {
    this.meetingPlanCancelModal.emit(data);
  }

  dismissActionPlanHistoryModal() {
    this.actionPlanHistoryModal.emit();
  }

  // kpi
  dismissKpiRevertModal(data) {
    this.kpiRevertModal.emit(data);
  }

  dismissKpiSubmitModal(data) {
    this.kpiSubmitModal.emit(data);
  }

  dismissKpiApproveModal(data) {
    this.kpiApproveModal.emit(data);
  }

  dismisskpiWorkflowModal() {
    this.kpiWorkflowModal.emit();
  }

  dismisskpiWorkflowHistoryModal() {
    this.kpiWorkflowHistoryModal.emit();
  }

  dismisskpiActivityLogsModal() {
    this.kpiActivityLogsModal.emit();
  }

  dismissKpiScoreRivewSubmitModal(data) {//kpi score
    this.kpiScoreReviewSubmitModal.emit(data);
  }

  dismisskpiScoreRevertModal(data) {//kpi score
    this.kpiScoreRevertModal.emit(data);
  }

  dismissKpiImprovementPlansUpdateModal(data) {  //improvement plans
    this.kpiImprovementPlansUpadateModal.emit(data);
  }

  dismissKpiImprovementPlansHistoryModal() {  //improvement plans
    this.kpiImprovementPlansHistoryModal.emit();
  }
  // **kpi

  // ms audit module
  // ms audit schedule
  dismissMsAuditSchedulesUpdateModal(data) {
    this.MsAuditSchedulesUpdateModal.emit(data);
  }
  // ms **audit module 

  dismissQuickUpload() {
    this.quickUpload.emit();
  }

  passModalType(modalType) {
    this.ModalType.emit(modalType)
    this.ModalType_temp.emit(modalType)
  }

  dismissCommentModal() {
    this.commentModal.emit()
  }

  dismissRiskWorkflowCommentModal() {
    this.RiskWorkflowCommentModal.emit()
  }

  dismissAuditPlanWorkflowCommentModal() {
    this.auditPlanWorkflowCommentModal.emit()
  }
  dismissAmPreliminaryWorkflowCommentModal() {
    this.amPreliminaryWorkflowCommentModal.emit()
  }
  dismissAmDraftWorkflowCommentModal() {
    this.amDraftWorkflowCommentModal.emit()
  }
  dismissAmFinalWorkflowCommentModal() {
    this.amFinalWorkflowCommentModal.emit()
  }

  dismissAnnualAuditPlanWorkflowCommentModal() {
    this.amAnnualAuditPlanWorkflowCommentModal.emit()
  }

  dismissRiskJourneyWorkflowCommentModal() {
    this.RiskJourneyWorkflowCommentModal.emit();
  }

  dismissIsmsRiskWorkflowCommentModal() {
    this.ismsRiskWorkflowCommentModal.emit()
  }

  dismissIsmsRiskJourneyWorkflowCommentModal() {
    this.ismsRiskJourneyWorkflowCommentModal.emit();
  }

  dismissFolderRenameModal(type) {
    this.folderRenameModal.emit(type);
  }
  passSearchData(data) {
    this.searchData.emit(data);
  }
  dismissWorkflowRoleAddModal() {
    this.workflowRoleAddModal.emit();
  }
  dismissIncidentWorkflowRoleAddModal() {
    this.workflowIncidentRoleAddModal.emit();
  }

  dismissExternalUserChangeReq() {
    this.externalUserChangeReq.emit()
  }
  dismissWorkflowCommonAddModal() {
    this.workflowCommonAddModal.emit();
  }

  dismissWorkflowTeamAddModal() {
    this.workflowTeamAddModal.emit();
  }
  dismissIncidentWorkflowTeamAddModal() {
    this.workflowIncidentTeamAddModal.emit();
  }


  dismissWorkflowHeadUnitAddModal() {
    this.workflowHeadUnitAddModal.emit();
  }
  dismissIncidentWorkflowHeadUnitAddModal() {
    this.workflowIncidentHeadUnitAddModal.emit();
  }



  dismissWorkflowSystemRoleModal() {
    this.workflowSystemRoleModal.emit();
  }

  dismissWorkflowDesignationAddModal() {
    this.workflowDesignationAddModal.emit();
  }
  dismissIncidentWorkflowDesignationAddModal() {
    this.workflowIncidentDesignationAddModal.emit();
  }



  dismissWorkflowUserAddModal() {
    this.workflowUserAddModal.emit();
  }

  dismissWorkflowActivityLog() {
    this.workflowActivityLog.emit();
  }

  dismissDocumentUpdate() {
    this.documentUpdateModal.emit();
  }

  dismissReviewHistory() {
    this.reviewHistoryModal.emit();
  }

  dismissKHTemplateModal() {
    this.KHTemplateModal.emit()
  }
  dismissHistoryPopup() {
    this.historyPopup.emit()
  }
  dismissDocumentWorkflowPopup() {
    this.documentWorkflow.emit()
  }
  dismissSubmitPopup(type?) {
    this.submitPopup.emit(type)
  }
  dismissCheckinModal() {
    this.checkinModal.emit()
  }
  dismissActionModal() {
    this.actionModal.emit()
  }
  dismissFileUploadPopup() {
    this.fileUploadPopup.emit();
  }

  dismissAssetTypesModal() {
    this.assetTypes.emit()
  }

  dismissEntranceModal() {
    this.entrance.emit()
  }

  dismissProjectContractTypeModal() {
    this.projectContractType.emit()
  }

  dismissTargetAudienceModal() {
    this.targetAudience.emit()
  }

  dismissEventClosureChecklistModal() {
    this.eventClosureChecklist.emit()
  }

  dismissSpaceTypeModal() {
    this.spaceType.emit()
  }

  dismissDimensionModal() {
    this.dimension.emit()
  }

  dismissChecklistModal() {
    this.checklist.emit()
  }

  dismissriskImpactAreaModal() {
    this.riskImpactArea.emit()
  }

  dismissStatusModal() {
    this.status.emit()
  }

  dismissTaskstatusModal() {
    this.taskstatus.emit()
  }

  dismissLocationsModal() {
    this.locations.emit()
  }

  dismissSupportivesModal() {
    this.supportives.emit()
  }

  dismissCommunicationModal() {
    this.communication.emit()
  }


  dismissRangeModal() {
    this.range.emit()
  }

  dismissPeriodicityModal() {
    this.periodicity.emit()
  }

  dismissEventTypeModal() {
    this.eventType.emit()
  }

  dismissObjectiveTypeModal() {
    this.objectiveType.emit()
  }

  dismissAuditTestPlanStatusModel() {
    this.auditTestPlanStatus.emit();
  }
  dismissauditControlSelfAssessmentUpdateStatusModel() {
    this.auditControlSelfAssessmentUpdateStatus.emit()
  }

  dismissEventMaturityMatrixTypeModal() {
    this.eventMaturityMatrixType.emit()
  }

  dismissEventEngagementStratergyModal() {
    this.eventEngagementStratergy.emit()
  }

  dismissEventEquipmentModal() {
    this.eventEquipment.emit()
  }

  dismissProjectPriorityModal() {
    this.projectPriority.emit()
  }

  dismissProjectThemeModal() {
    this.projectTheme.emit()
  }

  dismissProjectObjectiveModal() {
    this.projectObjective.emit()
  }

  dismissProjectKpiModal() {
    this.projectKpi.emit()
  }

  dismissEventMaturityMatrixParameterModal() {
    this.eventMaturityMatrixParameter.emit()
  }

  dismissCustomersModal(data?) {
    this.customers.emit(data)
  }

  dismissCompetencyTypesModal() {
    this.competencyTypes.emit()
  }

  dismissAssetMatrixFormModal() {
    this.assetMatrixForm.emit()
  }

  dismissAssetCategoryFormModal() {
    this.assetCategoryForm.emit()
  }

  dismissMaintenanceScheduleFormModal(data) {
    this.maintenanceScheduleForm.emit(data)
  }

  dismissMaintenanceScheduleReviewModal() {
    this.maintenanceScheduleReview.emit()
  }

  dismissMaintenanceScheduleHistoryModal() {
    this.maintenanceScheduleHistory.emit()
  }

  dismissMaintenanceShutdownHistoryModal() {
    this.maintenanceShutdownHistory.emit()
  }

  dismissMaintenanceShutdownReviewModal() {
    this.maintenanceShutdownReview.emit()
  }

  dismissAddBcpModal() {
    this.addBcpModal.emit();
  }

  dismissBcpClauseModal() {
    this.addBcpClauseModal.emit();
  }

  enablePreviewFocus() {
    this.previewFocus.emit()
  }

  bcpChildClauseChangeEvent(data) {
    this.bcpChildClauseEvent.emit(data);
  }

  setFileUploadPreviewFocus() {
    this.fileUploadPreviewFocus.emit()
  }

  dismissCallTreeModal() {
    this.callTreeModal.emit();
  }

  dismissBcpChangeRequestModal() {
    this.bcpChangeRequestModal.emit()
  }

  addUserToCallTreeModal(id) {
    this.bcpCallTreeAddUser.emit(id);
  }

  callTreeChangeEvent(data) {
    this.bcpCallTreeChangeEvent.emit(data);
  }

  dismissAddBcmRiskTreatmentModal() {
    this.addBcmRiskTreatmentModal.emit();
  }

  dismissBcmRiskTreatmentUpdateModal() {
    this.bcmRiskTreatmentUpdateModal.emit();
  }

  dismissSearchModal() {
    this.bcpSearchModal.emit()
  }

  enableKHCommentBox(contentId) {
    this.openKHCommentBox.emit(contentId)
  }
  passChildSectionData(type, addData) {

    let emittedData = {
      type: type,
      data: addData
    }
    this.addChildSection.emit(emittedData)
  }

  passChildSectionDeleteData(deleteData) {
    this.deleteChildSection.emit(deleteData)
  }

  passChildSectionEditData(editData) {
    this.editChildSection.emit(editData)

  }
  passSectionModalAction(actionType) {
    this.sectionModalAction.emit(actionType)
  }
  dismissMasterListDocumentAddModal(documentId?) {
    this.MasterListDocumentAddModal.emit(documentId)
  }

  dismissEventTeamModal() {
    this.eventTeamModal.emit();
  }

  dismissEventMemberModel() {
    this.eventMember.emit();
  }

  dismissEventSecondaryOwnerModal() {
    this.eventSecondaryOwnerModal.emit();
  }
  dismissEventSecondaryOwnerDetailModal() {
    this.eventSecondaryOwnerDetailModal.emit();
  }
  dismissEventObjectModal() {
    this.eventObjectModal.emit();
  }
  closeCommentBox() {
    this.CommentBox.emit()
  }
  dismissDocumentRenewModal() {
    this.DocumentRenewModal.emit()
  }
  dismissDocumentHistoryModal() {
    this.DocumentHistoryModal.emit()
  }
  dismissDocumentPreviewModal() {
    this.documentPreviewModal.emit();
  }
  dismissDocumentSearchModal() {
    this.documentSearch.emit()
  }
  dismissBAActionPlanModal() {
    this.businessAssessmentActionPlanForm.emit()
  }
  dismissAmDocumentTypeModel() {
    this.amDodumentTypeModel.emit()
  }
  dismissAmInformationRequestModal() {
    this.amInformationRequestModal.emit()
  }
  dismissAmAuditDocumentModal() {
    this.amAuditDocumentModal.emit()
  }
  dismissAmAuditCommencementLetterModal() {
    this.amAuditCommencementLetterModal.emit()
  }
  dismissAmAuditMeetingModal() {
    this.amAuditMeetingModal.emit()
  }
  dismissAmAuditTestPlanModal() {
    this.amAuditTestPlanModal.emit()
  }

  dismissAmAuditFieldWorkModal() {
    this.amAuditFieldWorkModal.emit()
  }
  dismissAmAuditFindingModal() {
    this.amAuditFindingModal.emit()
  }
  dismissAmAuditFindingCaModal() {
    this.amAuditFindingCaModal.emit()
  }
  dismissAmAuditFindingCaUpdateModal() {
    this.amAuditFindingCaUpdateModal.emit()
  }
  dismissAmAuditFindingCaHistoryModal() {
    this.amAuditFindingCaHistoryModal.emit()
  }
  dismissAmCSAModal() {
    this.amCSAModal.emit()
  }

  dismissAmCSAQuestionModal() {
    this.amCSAQuestionModal.emit()
  }

  dismissAmReportUpdateModal() {
    this.amReportUpdateModal.emit()
  }

  dismissBAActionPlanChildModal(documentIndex) {
    this.businessAssessmentChildActionPlanForm.emit(documentIndex)
  }
  dismissEditDocumentModal() {
    this.editDocumentModal.emit()
  }
  dismissBAActionPlanStatusModal(type) {
    this.baActionPlanStatusModal.emit(type)
  }
  dismissBAActionPlanHistoryModal() {
    this.baActionPlanHistoryModal.emit()
  }
  dismissComplianceActionPlanModal() {
    this.complianceRegisterActionPlanModal.emit()
  }

  dismissExerciseActionPlanModal() {
    this.exerciseActionPlanModal.emit()
  }

  dismissActiveDirectorySettingModal() {
    this.activeDirectorySettingModal.emit()
  }

  dismissUserPopupModal() {
    this.userPopupModal.emit()
  }
  dismissAgendaFormModal() {
    this.agendaFormModal.emit()
  }
  dismissAuditFollowUpActionPlanModal() {
    this.msAuditFollowUpActionPlan.emit()
  }
  dismissAuditFollowUpModal() {
    this.msAuditFollowUp.emit()
  }
  dismissAuditReportAgendaForm() {
    this.auditReportAgendaModal.emit()
  }
  dismissAuditAnnualSummaryModal() {
    this.annualAuditSummaryModal.emit()
  }

  dismissAuditReportModal() {
    this.auditReportModal.emit()
  }
  dismissAuditProgramReportModal() {
    this.auditProgramReportModal.emit()
  }

  dismissMsAuditCaRejectModal() {
    this.caRejectModal.emit()
  }

  dismissMsAuditCaHistorytModal() {
    this.caHistorytModal.emit()
  }
  dismissAuditProgramModal() {
    this.chooseAuditProgramModal.emit();
  }
  dismissAuditHistoryCommentModal() {
    this.AuditHistoryComments.emit()
  }
  dismissMsAuditWorkflowAddModal() {
    this.msAuditWorkflowAddModal.emit();
  }
  dismissMsAuditWorkflowModal() {
    this.AuditWorkflow.emit()
  }
  dismissMsAuditHistoryModal() {
    this.AuditHistory.emit()
  }
  dismissAddTimeTrackerModal() {
    this.addTimeTrackerModalControl.emit()
  }

  dismissMarkAuditModal() {
    this.msAuditMarkAudit.emit()
  }

  closeMOMModal() {
    this.MOMModal.emit()
  }
  dismissActionPlanMappingModal() {
    this.mapActionPlanModal.emit()
  }
  dismissDetailsActionPlanMappingModal() {
    this.detailsMapActionPlanModal.emit()
  }

  dismissDetailsActionPlanMappingPreviewModal() {
    this.detailsMapActionPlanPreviewModal.emit()
  }
  dismissDocumentMoveModal() {
    this.documentMovePopup.emit()
  }
  dismissShareDataPopup() {
    this.sharePopup.emit();
  }
  dismissMockDrillTypeModel() {
    this.mockDrillTypeModel.emit()
  }
  dismissMockDrillResponseServiceModel() {
    this.mockDrillResponseServiceModel.emit()
  }
  dismissMockDrillEvacuationRoleModel() {
    this.mockDrillEvacuationRoleModel.emit()
  }
  dismissMockDrillChecksModel() {
    this.mockDrillChecksModel.emit()
  }
  dismissMockDrillScenarioModel() {
    this.mockDrillScenarioModel.emit()
  }
  dismissUserMockDrillModalControl() {
    this.userMockDrillModal.emit()
  }
  dismissReviewMockDrillModalControl() {
    this.reviewMockDrillModal.emit()
  }
  dismissMockDrillHistoryModalControl() {
    this.mockDrillHistoryModal.emit()
  }
  dismissEventMappingModal() {
    this.eventMappingModal.emit();
  }
  dismissSiteMappingModal() {
    this.siteMappingModal.emit();
  }

  dismissAuditMeetingParticipants() {
    this.participantsPopUpModal.emit()
  }
  dismissAuditPlanObjectiveModal() {
    this.auditPlanObjectiveModal.emit()
  }
  dismissAuditPlanCriteriaModal() {
    this.auditPlanCriteriaModal.emit()
  }
  dismissMsAuditPlanCriteriaModal(id?) {
    this.msAuditPlanCriteria.emit(id);
  }
  dismissMsAuditPlanObjectiveModal(id?) {
    this.msAuditPlanObjective.emit(id);
  }
  dismissauditPlanActivityLogsModal() {
    this.auditPlanActivityLogsModal.emit()
  }
  dismissAuditScheduleActivityLogsModal() {
    this.auditScheduleActivityLogsModal.emit()
  }
  dismissAuditActivityLogsModal() {
    this.auditActivityLogsModal.emit()
  }
  dismissCSAWorkflowModal() {
    this.amCSAWorkflow.emit()
  }

  dismissCSAHistoryModal() {
    this.amCSAHistory.emit()
  }

  dismissCSAWorkflowCommentModal() {
    this.amCSAWorkflowComment.emit()
  }
  dismissMockDrillWorkflowAddModal() {
    this.mockDrillWorkflowAddModal.emit()
  }

  /*cyber incidents*/
  dismissCyberIncidentAddModal() {
    this.addCyberIncidentModal.emit()
  }

  dismissCyberIncidentWorkflowAddModal() {
    this.cyberIncidentWorkflowAddModal.emit();
  }

  dismissCyberIncidentClassificationAddModal(id) {
    this.cyberIncidentClassification.emit(id)
  }
  
  dismisscyberIncidentImpactAnalysisCategoryAddModal() {
    this.cyberIncidentImpactAnalysisCategory.emit()
  }

  dismissCyberIncidentWorkflowHistoryModal() {
    this.cyberIncidentWorkflowHistory.emit()
  }

  dismissCyberIncidentWorkflowModal() {
    this.cyberIncidentWorkflow.emit()
  }

  dismissCyberIncidentFilePreviewModal() {
    this.cyberIncidentFilePreview.emit()
  }

  dismissCyberIncidentCAModal() {
    this.addCyberIncidentCAModal.emit()
  }

  dismissCyberIncidentCommentModal() {
    this.cyberIncidentCommentModal.emit()
  }

  dismissCyberIncidentCaHistoryModal() {
    this.cyberIncidentCaHistoryModal.emit();
  }

  dismissCyberIncidentCaUpdateModal() {
    this.cyberIncidentCaUpdateModal.emit();
  }

  dismissCyberInccidentCommentModal() {
    this.cyberIncidentReportConclusionModal.emit();
  }

  dismissComplainceChecklistModal() {
    this.addChecklistModal.emit();
  }

  dismissContractAssessmentModal() {
    this.addContractAssessmentModal.emit();
  }

  dismissCyberIncidentRCAModal() {
    this.cyberIncidentRcaModalControl.emit()
  }
  dismissCyberIncidentIAModal()
  {
    this.cyberIncidentIAModal.emit()
  }

  dismissCyberIncidentWorkflowCommonAddModal() {
    this.cyberIncidentWorkflowCommonAddModal.emit();
  }
  
}
