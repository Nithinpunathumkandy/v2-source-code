import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { DiscussionBotService } from 'src/app/core/services/general/discussion-bot/discussion-bot.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditReportService } from 'src/app/core/services/internal-audit/report/report/audit-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { DiscussionBotStore } from 'src/app/stores/general/discussion-bot.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditReportsStore } from 'src/app/stores/internal-audit/report/audit-report-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

// amChart imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { AuditReportWorkflowStore } from 'src/app/stores/internal-audit/audit-workflow/audit-report-workflow.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuditWorkflowService } from 'src/app/core/services/internal-audit/audit-workflow/audit-workflow.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AuditWorkflowStore } from 'src/app/stores/internal-audit/audit-workflow/audit-workflow-store';

declare var $: any;
declare var Modernizr: any;
@Component({
	selector: 'app-main-report',
	templateUrl: './main-report.component.html',
	styleUrls: ['./main-report.component.scss']
})
export class MainReportComponent implements AfterViewInit, OnInit, OnDestroy {
	@ViewChild('container') container: ElementRef;
	@ViewChild('bbBookblock') bbBookblock: ElementRef;
	@ViewChild('bbNavPrev') bbNavPrev: ElementRef;
	@ViewChild('bbNavNext') bbNavNext: ElementRef;
	@ViewChild('tblContents') tblContents: ElementRef;
	@ViewChild('submitModal') submitModal: ElementRef;
	@ViewChild('workflowForm') workflowForm: ElementRef;
	@ViewChild('workflowModal') workflowModal: ElementRef;
	@ViewChild('workflowHistory') workflowHistory: ElementRef;
	@ViewChild('viewChecklists', { static: true }) viewChecklists: ElementRef;
	// @ViewChild('navBar') navBar: ElementRef;
	// @ViewChild('plainDev') plainDev: ElementRef;

	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	AuditReportsStore = AuditReportsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	AuditStore = AuditStore;
	AuditReportWorkflowStore=AuditReportWorkflowStore;
	reportObject = {
		component: 'Master',
		type: null
	};

	submitObject = {
		buttonType: null,
		subtitle: '',
	  }
	  checklistObject = {
		component: 'Master',
		values: null,
		type: null,
		from: null
	  };
	submitPopupSubscription: any
	workflowFormSubscription: any;
	workflowEventSubscription:any;
	historyEventSubscription:any;
	viewSingleChecklistsModalSubscription: any;
	reactionDisposer: IReactionDisposer;
	SubMenuItemStore = SubMenuItemStore;
	AppStore = AppStore;

	workflowModalOpened = false;
	workflowHistoryOpened = false;

	$container;
	$bookBlock;
	$items;
	itemsCount;
	current;
	bb;
	$navNext;
	$navPrev;
	$menuItems;
	$tblcontents;
	transEndEventNames;
	transEndEventName;
	supportTransitions;
	pageNumber:number=1;
	emptyListExecutiveSummerires = "No Summaries to show";
	private pieChart: am4charts.PieChart;
	private chart: am4charts.XYChart;

	constructor(
		@Inject(PLATFORM_ID) private platformId, private zone: NgZone,
		@Inject(DOCUMENT) private document: Document,
		private _auditReportService: AuditReportService,
		private _imageService: ImageServiceService,
		private _internalAuditFileService: InternalAuditFileService,
		private route: ActivatedRoute,
		private _cdr: ChangeDetectorRef,
		private _discussionBotService: DiscussionBotService,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService,
		private _documentFileService: DocumentFileService,
		private _eventEmitterService: EventEmitterService,
		private _auditWorkflowService:AuditWorkflowService,
		private _renderer2: Renderer2,
		private _router:Router
		) {
		this.loadCss('bookblock.css', 'book');
		this.loadCss('client-jscroll.css', 'jscroll');


	}

	// Run the function only in the browser
	browserOnly(f: () => void) {
		if (isPlatformBrowser(this.platformId)) {
			this.zone.runOutsideAngular(() => {
				f();
			});
		}
	}

	ngOnInit() {
		AppStore.showDiscussion = true;
		this.reactionDisposer = autorun(() => {

			// this.setSubMenuItems()

			if (SubMenuItemStore.clikedSubMenuItem) {
				switch (SubMenuItemStore.clikedSubMenuItem.type) {
	
					case "submit":
						this.openSubmitPopup('Submit');
					break;
					case "approve":
						this.openWorkflowForm(SubMenuItemStore.clikedSubMenuItem.type)
						break;
					case "revert":
						this.openWorkflowForm(SubMenuItemStore.clikedSubMenuItem.type)
					break;
					case "reject":
						this.openWorkflowForm(SubMenuItemStore.clikedSubMenuItem.type)
					break;
					case "go_to_audit":
						this.gotoAuditDetails()
					break;
					case "history":
						this.openHistoryPopup()
					break;
					case "workflow":
						this.openWorkflowPopup()
					break;
					case "export_to_excel":
						this._auditReportService.export(AuditReportWorkflowStore.auditReportId);
						break;
					default:
						break;
				}
				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();
			}

		})

		SubMenuItemStore.setNoUserTab(true);
		BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
		let id: number;
		this.route.params.subscribe(params => {
			id = +params['id']; // (+) converts string 'id' to a number
			this.getReport(id);
			
		});

		this.submitPopupSubscription = this._eventEmitterService.submitPopup.subscribe(res => { 
			this.closeSubmitPopup()
		})

		this.workflowFormSubscription = this._eventEmitterService.commentModal.subscribe(res => {
			this.closeWorkflowForm();
		  })

		 this.workflowEventSubscription = this._eventEmitterService.riskInfoWorkflow.subscribe(item => {
			this.closeWorkflowPopup();
		  })
	  
		  this.historyEventSubscription = this._eventEmitterService.riskInfoHistory.subscribe(item => {
			this.closeHistoryPopup();
		  })
	  
		  this.viewSingleChecklistsModalSubscription = this._eventEmitterService.checklistSingleViewModal.subscribe(res => {
			this.closeChecklistModal();
		  })
	}

	setSubMenuItems() {
		var subMenuItems=[]

		if((AuditReportsStore.reportDetails.auditReportStatus?.type  == 'draft' ||AuditReportsStore.reportDetails.auditReportStatus?.type  == 'reverted') && AuditReportsStore.reportDetails.is_workflow && AuditReportsStore.reportDetails.submittedBy==null && this.isProperUser())
		subMenuItems=[
			{ activityName: null, submenuItem: { type: 'go_to_audit' } },
			{ activityName: null, submenuItem: { type: 'history' } },
			{ activityName: null, submenuItem: { type: 'workflow' } },
			{ activityName: null, submenuItem: { type: 'submit' } },
			{activityName: null, submenuItem: {type: 'close',path:'../'}},
		]
		 else if(AuditReportsStore.reportDetails.auditReportStatus?.type  == 'draft' ||AuditReportsStore.reportDetails.auditReportStatus?.type  == 'reverted' && AuditReportsStore.reportDetails.is_workflow && AuditReportsStore.reportDetails.submittedBy==null && this.isProperUser())
		subMenuItems=[
			{ activityName: null, submenuItem: { type: 'go_to_audit' } },
			{ activityName: null, submenuItem: { type: 'workflow' } },
			{ activityName: null, submenuItem: { type: 'history' } },
			{ activityName: null, submenuItem: { type: 'submit' } },
			{activityName: null, submenuItem: {type: 'close',path:'../'}},
		]
  
		else if (this.isUser() && AuditReportsStore.reportDetails.auditReportStatus?.type  != 'draft' && AuditReportsStore.reportDetails.auditReportStatus?.type  != 'published'&& AuditReportsStore.reportDetails.auditReportStatus?.type  != 'reverted' ){

				subMenuItems=[
					{ activityName: null, submenuItem: { type: 'go_to_audit' } },
					{ activityName: null, submenuItem: { type: 'workflow' } },
					{ activityName: null, submenuItem: { type: 'history' } },
					{ activityName: null, submenuItem: { type: 'approve' } },
                    { activityName: null, submenuItem: { type: 'revert' } },
					{ activityName: null, submenuItem: { type: 'reject' } },
					{activityName: null, submenuItem: {type: 'close',path:'../'}},
				]

		}
		else{
			subMenuItems=[

				{ activityName: null, submenuItem: { type: 'export_to_excel' } },
				{ activityName: null, submenuItem: { type: 'workflow' } },
				{ activityName: null, submenuItem: { type: 'history' } },
				{ activityName: null, submenuItem: { type: 'go_to_audit' } },
				{activityName: null, submenuItem: {type: 'close',path:'../'}},

			]
		}

		this._helperService.checkSubMenuItemPermissions(700, subMenuItems);

	  }

	  isProperUser() {
        if (AuthStore.user.id == AuditReportsStore.reportDetails?.createdBy.id) {
          return true;
        }
        else {
          return false;
        }
  }


	  isUser() {
		if(AuditReportWorkflowStore?.auditReportWorkflow_loaded){
		  for (let i of AuditReportWorkflowStore?.auditReportWorkflow) {
			if (i.level == AuditReportsStore.reportDetails.next_review_user_level) {
			  var pos = i.audit_report_workflow_item_users.findIndex(e => e.id == AuthStore.user.id)
			  if (pos != -1)
				return true;
			  else
				return false
			}
		  }
		}
		else{
		  return false;
		}
		
	  }
	
	openSubmitPopup(type) {

		// if (type == 'Submit') {
		//   this.submitObject.buttonType = type;
		//   this.submitObject.subtitle = "Are you sure you want to Submit for Review?"
		// }
		// else {
		  this.submitObject.buttonType = type;
		  this.submitObject.subtitle="Are you sure you want to Submit for Review?"
		// }
		
		AuditReportWorkflowStore.submitPopup = true;
		this._utilityService.detectChanges(this._cdr)
		$(this.submitModal.nativeElement).modal('show');
	  }
	  closeSubmitPopup() {
		setTimeout(() => {
			let id: number;
			this.route.params.subscribe(params => {
				id = +params['id']; // (+) converts string 'id' to a number
				this.getReport(id);
			});
			// Getting Workflow Details
		this._auditWorkflowService.getWorkflow().subscribe()
		}, 500);
		AuditReportWorkflowStore.submitPopup = false;
		$(this.submitModal.nativeElement).modal('hide');
		this._utilityService.detectChanges(this._cdr)
	  }

	  openWorkflowForm(type) {

		AuditReportWorkflowStore.type=type
		AuditReportWorkflowStore.workflowForm = true;
		this._utilityService.detectChanges(this._cdr)
		$(this.workflowForm.nativeElement).modal('show');
	
	
	  }
	
	  closeWorkflowForm() {
		// this.getDocumentWorkflow()
		// this.getDocumentDetails()
		this.getReport(AuditReportWorkflowStore.auditReportId)
		AuditReportWorkflowStore.workflowForm = false;
		$(this.workflowForm.nativeElement).modal('hide');
		this._utilityService.detectChanges(this._cdr)
	
	  }
	
	gotoAuditDetails(){
		this._router.navigateByUrl("/internal-audit/audits/"+AuditReportsStore.reportDetails?.audit?.audit_id)
	}

	getReport(id) {
		AuditReportWorkflowStore.auditReportId=id;
		this._auditReportService.getItem(id).subscribe(res => {

			if(res.is_workflow)
				this._auditWorkflowService.getWorkflow().subscribe()
				this.setSubMenuItems()
			// else
			// this.setSubMenuItems()

			this.ngAfterViewInit();
			DiscussionBotStore.setDiscussionMessage([]);
			DiscussionBotStore.setbasePath('/audit-reports/')
			DiscussionBotStore.setDiscussionAPI(id + '/comments');
			this.getDiscussions();
			this.showThumbnailImage(id);
			this.downloadDiscussionThumbnial(id);
			this.getImagePrivew();
			this._utilityService.detectChanges(this._cdr);
		});
	}


	openHistoryPopup() {
		AuditWorkflowStore.setCurrentPage(1);
		this._auditWorkflowService.getHistory().subscribe(res => {
		  this.workflowHistoryOpened = true;
		  this._utilityService.detectChanges(this._cdr);
		  $(this.workflowHistory.nativeElement).modal('show');
		});
	
	
	
	  }

	  closeHistoryPopup() {
		this.workflowHistoryOpened = false;
		$(this.workflowHistory.nativeElement).modal('hide');
	  }

	  openWorkflowPopup() {
		this._auditWorkflowService.getWorkflow().subscribe(res => {
		  this.workflowModalOpened = true;
		  this._utilityService.detectChanges(this._cdr);
		  $(this.workflowModal.nativeElement).modal('show');
		  this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
		  this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
		})
	  }

	  closeWorkflowPopup() {

		this.workflowModalOpened = false;
		$(this.workflowModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
		this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
	  }


	ngAfterViewInit() {
		if (this.AuditReportsStore.individualLoaded) {
			setTimeout(() => {
				this.$container = $(this.container.nativeElement);
				this.$bookBlock = $(this.bbBookblock.nativeElement);
				this.$items = this.$bookBlock.children();
				this.itemsCount = this.$items.length;
				this.current = 0;
				this.bb = $(this.bbBookblock.nativeElement).bookblock({
					speed: 800,
					perspective: 2000,
					shadowSides: 0.8,
					shadowFlip: 0.4,
					onEndFlip: (old, page, isLimit) => {

						this.current = page;
						// update TOC current
						this.updateTOC();
						// updateNavigation
						this.updateNavigation(isLimit);
						// initialize jScrollPane on the content div for the new item
						this.setJSP('init');
						// destroy jScrollPane on the content div for the old item
						this.setJSP('destroy', old);

					}
				});
				this.$navNext = $(this.bbNavNext.nativeElement);
				this.$navPrev = $(this.bbNavPrev.nativeElement);
				this.$menuItems = this.$container.find('ul.menu-toc > li');
				this.$tblcontents = $(this.tblContents.nativeElement);
				this.transEndEventNames = {
					'WebkitTransition': 'webkitTransitionEnd',
					'MozTransition': 'transitionend',
					'OTransition': 'oTransitionEnd',
					'msTransition': 'MSTransitionEnd',
					'transition': 'transitionend'
				};
				this.transEndEventName = this.transEndEventNames[Modernizr.prefixed('transition')];
				this.supportTransitions = Modernizr.csstransitions;

				this.init();

			}, 500);
		}
		this.getCharts();
	}

	setPageNumber(direction?,pageNumber?,isMenu:boolean=false,){
		if(!isMenu){
			if(direction=='right'  && this.pageNumber!=AuditReportsStore.reportDetails?.common?.total_page_number){
				this.pageNumber=this.pageNumber+1
			}else{
				this.pageNumber=this.pageNumber-1
			}
		}
		else
		{
			this.pageNumber=pageNumber
		}


	}

	getCharts() {
		setTimeout(() => {
			// Chart code goes in here
			this.browserOnly(() => {
				am4core.useTheme(am4themes_animated);
				this.createPieChart();
				this.createClusteredColumnChart();
				this.chartForFindingRisk();
				this.findingDepartmentChart();
				this.chartForFindingCategory();
			});
		}, 1000);
	}

	chartForFindingCategory() {
		am4core.addLicense("CH199714744");
		let chart = am4core.create("chartForFindingCategorydiv", am4charts.PieChart);
		// Add data
		chart.data = AuditReportsStore.reportDetails?.findings_pi_chart_by_finding_category;

		// Add and configure Series
		let pieSeries = chart.series.push(new am4charts.PieSeries());
		pieSeries.dataFields.value = "count";
		pieSeries.slices.template.propertyFields.fill = "color";
		pieSeries.dataFields.category = "title";
		// pieSeries.slices.template.stroke = am4core.color("#fff");
		pieSeries.slices.template.strokeWidth = 2;
		pieSeries.slices.template.strokeOpacity = 1;

		pieSeries.ticks.template.disabled = true;
		pieSeries.alignLabels = false;

		// Add a legend
		chart.legend = new am4charts.Legend();
		chart.legend.maxWidth = 100;
		chart.legend.maxHeight = 150;
		// chart.legend.scrollable = true;
		chart.legend.position = "bottom";

		// for exporting the data
		chart.exporting.menu = new am4core.ExportMenu();
		chart.exporting.menu.align = "right";
		chart.exporting.filePrefix = "RiskRatings"
		chart.exporting.menu.verticalAlign = "top";

		pieSeries.labels.template.text = "";
		pieSeries.ticks.template.events.on("ready", hideSmall);
		pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
		pieSeries.labels.template.events.on("ready", hideSmall);
		pieSeries.labels.template.events.on("visibilitychanged", hideSmall);

		function hideSmall(ev) {
			if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
				ev.target.hide();
			}
			else {
				ev.target.show();
			}
		}

		// This creates initial animation
		pieSeries.hiddenState.properties.opacity = 1;
		pieSeries.hiddenState.properties.endAngle = -90;
		pieSeries.hiddenState.properties.startAngle = -90;

		this._utilityService.detectChanges(this._cdr);
	}

	chartForFindingRisk() {
		am4core.addLicense("CH199714744");
		let chart = am4core.create("chartForFindingRiskdiv", am4charts.PieChart);
		// Add data
		chart.data = AuditReportsStore.reportDetails?.findings_pi_chart_by_risk_rating;

		// Add and configure Series
		let pieSeries = chart.series.push(new am4charts.PieSeries());
		pieSeries.dataFields.value = "count";
		pieSeries.slices.template.propertyFields.fill = "color";
		pieSeries.dataFields.category = "title";
		// pieSeries.slices.template.stroke = am4core.color("#fff");
		pieSeries.slices.template.strokeWidth = 2;
		pieSeries.slices.template.strokeOpacity = 1;

		pieSeries.ticks.template.disabled = true;
		pieSeries.alignLabels = false;

		// Add a legend
		chart.legend = new am4charts.Legend();
		chart.legend.maxWidth = 100;
		chart.legend.maxHeight = 150;
		// chart.legend.scrollable = true;
		chart.legend.position = "bottom";

		// for exporting the data
		chart.exporting.menu = new am4core.ExportMenu();
		chart.exporting.menu.align = "right";
		chart.exporting.filePrefix = "RiskRatings"
		chart.exporting.menu.verticalAlign = "top";

		pieSeries.labels.template.text = "";
		pieSeries.ticks.template.events.on("ready", hideSmall);
		pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
		pieSeries.labels.template.events.on("ready", hideSmall);
		pieSeries.labels.template.events.on("visibilitychanged", hideSmall);

		function hideSmall(ev) {
			if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
				ev.target.hide();
			}
			else {
				ev.target.show();
			}
		}

		// This creates initial animation
		pieSeries.hiddenState.properties.opacity = 1;
		pieSeries.hiddenState.properties.endAngle = -90;
		pieSeries.hiddenState.properties.startAngle = -90;

		this._utilityService.detectChanges(this._cdr);

	}

	findingDepartmentChart() {
		am4core.addLicense("CH199714744");
		let chart = am4core.create("findingDepartmentChartdiv", am4charts.XYChart);
		// Add data
		// chart.data = AuditProgramMasterStore.individualAuditPrograms.department_wise_diagram;
		var chartData = []

		AuditReportsStore.reportDetails?.findings_bar_chart_by_departments?.forEach(item => {
			var chart_items = {
				"department": item.department,
				"Low": item.green,
				"Medium": item.yellow,
				"High": item.orange,
				"Very High": item.red,
				"Others": item.grey
			}
			chartData.push(chart_items);
		})
		chart.data = chartData;

		// for exporting the data
		chart.exporting.menu = new am4core.ExportMenu();
		chart.exporting.menu.align = "right";
		chart.exporting.filePrefix = "AuditableItemsCountByDepartment"
		chart.exporting.menu.verticalAlign = "top";

		chart.colors.list = [am4core.color('green'), am4core.color('orange'), am4core.color('red'), am4core.color('yellow'), am4core.color('grey')];

		let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = "department";
		// categoryAxis.title.text = "Local country offices";

		let label = categoryAxis.renderer.labels.template;
		label.wrap = true;
		label.maxWidth = 120;
		categoryAxis.renderer.grid.template.location = 0;
		categoryAxis.renderer.minGridDistance = 20;
		categoryAxis.renderer.cellStartLocation = 0.1;
		categoryAxis.renderer.cellEndLocation = 0.9;
		let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.min = 0;
		valueAxis.title.text = "Auditable Items Count";
		this.createSeries(chart, "Low", "Low", false);
		this.createSeries(chart, "High", "High", true);
		this.createSeries(chart, "Very High", "Very High", false);
		this.createSeries(chart, "Medium", "Medium", true);
		this.createSeries(chart, "Others", "Others", true);
		// Add legend
		chart.legend = new am4charts.Legend();
	}

	createClusteredColumnChart() {
		am4core.addLicense("CH199714744");
		let chart = am4core.create("clusteredbarchartdiv", am4charts.XYChart);
		// Add data
		// chart.data = AuditProgramMasterStore.individualAuditPrograms.department_wise_diagram;
		var chartData = []

		AuditReportsStore.reportDetails?.audit_program?.department_wise_diagram.forEach(item => {
			var chart_items = {
				"department": item.department,
				"Low": item.green,
				"Medium": item.yellow,
				"High": item.orange,
				"Very High": item.red,
				"Others": item.grey
			}
			chartData.push(chart_items);
		})
		chart.data = chartData;

		// for exporting the data
		chart.exporting.menu = new am4core.ExportMenu();
		chart.exporting.menu.align = "right";
		chart.exporting.filePrefix = "AuditableItemsCountByDepartment"
		chart.exporting.menu.verticalAlign = "top";

		chart.colors.list = [am4core.color('green'), am4core.color('orange'), am4core.color('red'), am4core.color('yellow'), am4core.color('grey')];

		let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = "department";
		// categoryAxis.title.text = "Local country offices";

		let label = categoryAxis.renderer.labels.template;
		label.wrap = true;
		label.maxWidth = 120;
		categoryAxis.renderer.grid.template.location = 0;
		categoryAxis.renderer.minGridDistance = 20;
		categoryAxis.renderer.cellStartLocation = 0.1;
		categoryAxis.renderer.cellEndLocation = 0.9;
		let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.min = 0;
		valueAxis.title.text = "Auditable Items Count";
		this.createSeries(chart, "Low", "Low", false);
		this.createSeries(chart, "High", "High", true);
		this.createSeries(chart, "Very High", "Very High", false);
		this.createSeries(chart, "Medium", "Medium", true);
		this.createSeries(chart, "Others", "Others", true);
		// Add legend
		chart.legend = new am4charts.Legend();
	}

	createSeries(chart, field, name, stacked) {
		let series = chart.series.push(new am4charts.ColumnSeries());
		series.dataFields.valueY = field;
		// series.columns.template.fill = am4core.color('red');
		series.dataFields.categoryX = "department";
		series.name = name;
		series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
		series.stacked = stacked;
		series.columns.template.width = am4core.percent(100);
	}

	createPieChart() {
		am4core.addLicense("CH199714744");
		let chart = am4core.create("piechartdiv", am4charts.PieChart);
		// Add data
		chart.data = AuditReportsStore.reportDetails?.audit_program?.risk_rating_chart_data;

		// Add and configure Series
		let pieSeries = chart.series.push(new am4charts.PieSeries());
		pieSeries.dataFields.value = "value";
		pieSeries.slices.template.propertyFields.fill = "color";
		pieSeries.dataFields.category = "type";
		// pieSeries.slices.template.stroke = am4core.color("#fff");
		pieSeries.slices.template.strokeWidth = 2;
		pieSeries.slices.template.strokeOpacity = 1;

		pieSeries.ticks.template.disabled = true;
		pieSeries.alignLabels = false;

		// Add a legend
		chart.legend = new am4charts.Legend();
		chart.legend.maxWidth = 100;
		chart.legend.maxHeight = 150;
		// chart.legend.scrollable = true;
		chart.legend.position = "bottom";

		// for exporting the data
		chart.exporting.menu = new am4core.ExportMenu();
		chart.exporting.menu.align = "right";
		chart.exporting.filePrefix = "RiskRatings"
		chart.exporting.menu.verticalAlign = "top";

		pieSeries.labels.template.text = "";
		pieSeries.ticks.template.events.on("ready", hideSmall);
		pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
		pieSeries.labels.template.events.on("ready", hideSmall);
		pieSeries.labels.template.events.on("visibilitychanged", hideSmall);

		function hideSmall(ev) {
			if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
				ev.target.hide();
			}
			else {
				ev.target.show();
			}
		}

		// This creates initial animation
		pieSeries.hiddenState.properties.opacity = 1;
		pieSeries.hiddenState.properties.endAngle = -90;
		pieSeries.hiddenState.properties.startAngle = -90;

		this._utilityService.detectChanges(this._cdr);
	}

	// for user previrews
	assignUserValues(user) {
		if (user) {
			var userInfoObject = {
				first_name: '',
				last_name: '',
				designation: '',
				image_token: '',
				mobile: null,
				email: '',
				id: null,
				department: '',
				status_id: null
			}

			userInfoObject.first_name = user?.first_name;
			userInfoObject.last_name = user?.last_name;
			if (!user.designation.title) {
				userInfoObject.designation = user.designation;
			} else {
				userInfoObject.designation = user.designation?.title;
			}
			userInfoObject.image_token = user.image_token ? user.image_token : user.image ? user.image?.token : null;
			userInfoObject.email = user?.email;
			userInfoObject.mobile = user?.mobile;
			userInfoObject.id = user?.id;
			userInfoObject.status_id = user?.status_id
			userInfoObject.department = user?.department ? user?.department : user?.department?.title ? user?.department?.title : null;
			return userInfoObject;
		}
	}

	// Returns image url according to type and token
	// createImageUrl(type, token) {
	// 	return this._internalAuditFileService.getThumbnailPreview(type, token);
	// }
	createImageUrl(type, token) {
		if(type=='findings')
		return this._internalAuditFileService.getThumbnailPreview(type, token);
		else
		return this._documentFileService.getThumbnailPreview(type, token);
	  
	  }

	// extension check function
	checkExtension(ext, extType) {

		return this._imageService.checkFileExtensions(ext, extType)

	}


	getDiscussions() {
		this._discussionBotService.getDiscussionMessage().subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}
	//   audit-reports/1/comments/1/files/1/download
	downloadDiscussionThumbnial(id) {
		DiscussionBotStore.setThumbnailDownloadAPI(id + '/comments/')
	}

	showThumbnailImage(id) {
		DiscussionBotStore.setShowThumbnailAPI(id + '/comments/')
	}

	getImagePrivew() {
		DiscussionBotStore.setDiscussionThumbnailAPI('/internal-audit/files/audit-report-comment-document/thumbnail?token=')
	}

	loadCss(styleName: string, id) {
		const head = this.document.getElementsByTagName('head')[0];
		let themeLink = this.document.getElementById(id) as HTMLLinkElement;
		if (themeLink) {
			themeLink.href = styleName;
		} else {
			const style = this.document.createElement('link');
			style.id = id;
			style.rel = 'stylesheet';
			style.href = `${styleName}`;
			style.type = 'text/css';
			head.appendChild(style);
		}
	}

	removeCss(id) {
		const head = this.document.getElementsByTagName('head')[0];
		let themeLink = this.document.getElementById(id) as HTMLLinkElement;
		if (themeLink) {
			head.removeChild(themeLink);
		}
	}

	init() {
		this.$navPrev.hide()
		// initialize jScrollPane on the content div of the first item
		this.setJSP('init');
		this.initEvents();

	}

	initEvents() {
		// add navigation events
		this.$navNext.on('click', () => {
			this.bb.next();
			return false;
		});

		this.$navPrev.on('click', () => {
			this.bb.prev();
			return false;
		});

		// add swipe events
		this.$items.on({
			'swipeleft': (event) => {
				if (this.$container.data('opened')) {
					return false;
				}
				this.bb.next();
				return false;
			},
			'swiperight': (event) => {
				if (this.$container.data('opened')) {
					return false;
				}
				this.bb.prev();
				return false;
			}
		});

		// show table of contents
		this.$tblcontents.on('click', () => this.toggleTOC());

		// click a menu item
		let _this = this;
		this.$menuItems.on('click', function () {

			var $el = $(this),
				idx = $el.index(),
				jump = () => {
					_this.bb.jump(idx + 1);
				};

			_this.current !== idx ? _this.closeTOC(jump) : _this.closeTOC();

			return false;

		});

		// reinit jScrollPane on window resize
		$(window).on('debouncedresize', () => {
			// reinitialise jScrollPane on the content div
			this.setJSP('reinit');
		});

	}

	setJSP(action, idx?) {

		var idx = idx === undefined ? this.current : idx,
			$content = this.$items.eq(idx).children('div.content'),
			apiJSP = $content.data('jsp');

		if (action === 'init' && apiJSP === undefined) {
			$content.jScrollPane({ verticalGutter: 0, hideFocus: true });
		}
		else if (action === 'reinit' && apiJSP !== undefined) {
			apiJSP.reinitialise();
		}
		else if (action === 'destroy' && apiJSP !== undefined) {
			apiJSP.destroy();
		}

	}

	updateTOC() {
		this.$menuItems.removeClass('menu-toc-current').eq(this.current).addClass('menu-toc-current');
	}

	updateNavigation(isLastPage) {

		if (this.current === 0) {
			this.$navNext.show();
			this.$navPrev.hide();
		}
		else if (isLastPage) {
			this.$navNext.hide();
			this.$navPrev.show();
		}
		else {
			this.$navNext.show();
			this.$navPrev.show();
		}

	}

	toggleTOC() {
		var opened = this.$container.data('opened');
		opened ? this.closeTOC() : this.openTOC();
	}

	openTOC() {
		this.$navNext.hide();
		this.$navPrev.hide();
		this.$container.addClass('slideRight').data('opened', true);
	}

	closeTOC(callback?) {
		this.updateNavigation(this.current === this.itemsCount - 1);

		this.$container.removeClass('slideRight').data('opened', false);

		let _this = this;

		if (callback) {
			if (_this.supportTransitions) {
				_this.$container.on(_this.transEndEventName, function () {
					$(this).off(_this.transEndEventName);
					callback.call();
				});
			}
			else {
				callback.call();
			}
		}

	}

	reportDetails() {
		this._auditReportService.getItem(AuditReportsStore.lastInsertedId).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}

	// scrollEvent = (event: any): void => {
	// 	if(event.target.documentElement){
	// 	  const number = event.target.documentElement.scrollTop;
	// 	  if(number > 50){
	// 		this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
	// 		this._renderer2.addClass(this.navBar.nativeElement,'affix');
	// 		// this.plainDev.style.height = '45px';
	// 	  }
	// 	  else{
	// 		this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
	// 		this._renderer2.removeClass(this.navBar.nativeElement,'affix');
	// 		// this.plainDev.nativeElement.style.height = 'auto';
	// 	  }
	// 	}
	//   }

	// Returns default image
	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}



	createImagePreview(type, token) {
		return this._imageService.getThumbnailPreview(type, token)
	}


	getTimezoneFormatted(time){
		return this._helperService.timeZoneFormatted(time);
	  }

// dataCheck(data){
// console.log(data)
// }
	//   View More Checklist/Findings Data
	viewSingleChecklist(checkListData) {
		console.log(checkListData)
		this.checklistObject.type = 'Add';
		this.checklistObject.values = {
		  schedule_id: checkListData?.audit_schedule_id,
		  id: checkListData?.audit_checklist_answer_key_id
		}
		$('.modal-backdrop').add();
		document.body.classList.add('modal-open')
		this._renderer2.setStyle(this.viewChecklists.nativeElement, 'display', 'block');
		this._renderer2.removeAttribute(this.viewChecklists.nativeElement, 'aria-hidden');
	
		setTimeout(() => {
		  this._renderer2.addClass(this.viewChecklists.nativeElement, 'show')
		  this._utilityService.detectChanges(this._cdr)
		}, 100);
	  }
	  closeChecklistModal() {
		this.checklistObject.type = null;
		this.checklistObject.values = null;
		this._renderer2.removeClass(this.viewChecklists.nativeElement, 'show')
		document.body.classList.remove('modal-open')
		this._renderer2.setStyle(this.viewChecklists.nativeElement, 'display', 'none');
		this._renderer2.setAttribute(this.viewChecklists.nativeElement, 'aria-hidden', 'true');
		$('.modal-backdrop').remove();
	
		setTimeout(() => {
		  this._renderer2.removeClass(this.viewChecklists.nativeElement, 'show')
		  this._utilityService.detectChanges(this._cdr)
		}, 200);

	  }

	ngOnDestroy() {
		this.removeCss('book');
		this.removeCss('jscroll');
		BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		AuditReportsStore.individualLoaded = false;
		this.workflowEventSubscription.unsubscribe()
		this.submitPopupSubscription.unsubscribe()
		this.workflowFormSubscription.unsubscribe()
		this.historyEventSubscription.unsubscribe()
	}
}
