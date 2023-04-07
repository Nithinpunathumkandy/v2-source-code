import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild, Input } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditReportsStore } from 'src/app/stores/internal-audit/report/audit-report-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { IncidentReportService } from 'src/app/core/services/incident-management/report/incident-report.service';
import { IncidentReportStore } from 'src/app/stores/incident-management/report/incident-report.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { IncidentFileService } from 'src/app/core/services/incident-management/incident-file-service/incident-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthStore } from 'src/app/stores/auth.store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
declare var $: any;
declare var Modernizr: any;

@Component({
	selector: 'app-incident-report-detail',
	templateUrl: './incident-report-detail.component.html',
	styleUrls: ['./incident-report-detail.component.scss']
})
export class IncidentReportDetailComponent implements OnInit {

	@Input ('source') IncidentReportObject: any;

	@ViewChild('container') container: ElementRef;
	@ViewChild('bbBookblock') bbBookblock: ElementRef;
	@ViewChild('bbNavPrev') bbNavPrev: ElementRef;
	@ViewChild('bbNavNext') bbNavNext: ElementRef;
	@ViewChild('tblContents') tblContents: ElementRef;

	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	AuthStore = AuthStore;
	IncidentReportStore = IncidentReportStore
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	AuditStore = AuditStore;
	emptyMessage="no_data_found";

	reportObject = {
		component: 'Master',
		type: null
	};
	previewObject = {
		preview_url: null,
		file_details: null,
		uploaded_user: null,
		created_at: "",
		component: "investigation-item",
		componentId: null,
	};

	userDetailObject = {
		first_name: '',
		last_name: '',
		designation: '',
		image_token: '',
		mobile: null,
		email: '',
		id: null,
		department: '',
		status_id: null,
	  }

	navigate: string = 'itemv1';

	reactionDisposer: IReactionDisposer;
	SubMenuItemStore = SubMenuItemStore;
	AppStore = AppStore;
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
	moreData = false;
	view_items_more: boolean;
	witnessData: any;
	moreDataWitness: boolean = false;
	emptyIntro="no_data_found";

	constructor(
		@Inject(PLATFORM_ID) private platformId, private zone: NgZone,
		@Inject(DOCUMENT) private document: Document,
		private _imageService: ImageServiceService,
		private _cdr: ChangeDetectorRef,
		private _utilityService: UtilityService,
		private _IncidentReportService: IncidentReportService,
		private _humanCapitalService: HumanCapitalService,
		private _incidentFileService: IncidentFileService,
		private _sanitizer: DomSanitizer,
	) {
		this.loadCss('bookblock.css', 'book');
		this.loadCss('client-jscroll.css', 'jscroll')
	}

	ngOnInit(): void {
		this.getReport();
		// if(IncidentReportStore.reportDetails?.introduction?.introduction?.data == null){
		// 	NoDataItemStore.setNoDataItems({title: "no_data_found"});
		// }	
	}

	getReport() {
		let id = this.IncidentReportObject.reportId;
		this._IncidentReportService.getItem(id).subscribe(res => {
			this.ngAfterViewInit();
			this._utilityService.detectChanges(this._cdr);
		});
	}
	ngAfterViewInit() {
		if (this.IncidentReportStore.individualLoaded) {
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
				this._utilityService.detectChanges(this._cdr);
			}, 500);
		}
	}

	redirect(type) {
		this.navigate = type
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
	createImageUrl(type, token) {
		return this._incidentFileService.getThumbnailPreview(type, token);
	}

	createImageUrls(token) {
		return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
	}

	downloadAuditPlanDocument(type, incidentDocument) {

		event.stopPropagation();
		switch (type) {
			case "downloadIncidentDocument":
				this._incidentFileService.downloadFile(
					"investigation-item",
					incidentDocument.incident_investigation_id,
					incidentDocument.id,
					incidentDocument.name,
					null,
					incidentDocument
				);
				break;

		}

	}

	// extension check function
	checkExtension(ext, extType) {
		return this._imageService.checkFileExtensions(ext, extType)
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
		this._utilityService.detectChanges(this._cdr);
	}

	toggleTOC() {
		var opened = this.$container.data('opened');
		opened ? this.closeTOC() : this.openTOC();
	}

	scrollbyIndex(index) {
		document.getElementById(index).scrollIntoView({
			behavior: "smooth",
			block: "start",
			inline: "nearest"
		});
	}

	openTOC() {
		this.$navNext.hide();
		this.$navPrev.hide();
		this.$container.addClass('slideRight').data('opened', true);
		this.$container.removeClass('p-0').data('opened', true);
	}

	closeTOC(callback?) {
		this.updateNavigation(this.current === this.itemsCount - 1);
		this.$container.removeClass('slideRight').data('opened', false);
		this.$container.addClass('p-0').data('opened', false);
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

	// Returns default image
	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}

	createImagePreview(type, token) {
		return this._imageService.getThumbnailPreview(type, token)
	}

	viewIncidentDocument(incidentDocument) {
		this._incidentFileService.Preview(incidentDocument.id, incidentDocument.incident_investigation_id).subscribe(res => {
			var resp: any = this._utilityService.getDownLoadLink(
				res,
				incidentDocument.name
			);
			this.openPreviewModal(resp, incidentDocument);
		}),
			(error) => {
				if (error.status == 403) {
					this._utilityService.showErrorMessage(
						"Error",
						"Permission Denied"
					);
				} else {
					this._utilityService.showErrorMessage(
						"Error",
						"Unable to generate Preview"
					);
				}
			};
	}

	openPreviewModal(filePreview, document) {
		let previewItem = null;
		if (filePreview) {
			previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
			this.previewObject.preview_url = previewItem;
			this.previewObject.file_details = document;
			this.previewObject.component == 'investigation-item'
			this._utilityService.detectChanges(this._cdr);
		}
	}

	getCreatedByPopupDetails(users, created?: string) {
		let userDetial: any = {};
		userDetial['first_name'] = users?.first_name;
		userDetial['last_name'] = users?.last_name;
		userDetial['designation'] = users?.designation;
		userDetial['image_token'] = users?.image?.token;
		userDetial['email'] = users?.email;
		userDetial['mobile'] = users?.mobile;
		userDetial['id'] = users?.id;
		userDetial['department'] = users?.department;
		userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
		userDetial['created_at'] = created ? created : null;
		return userDetial;

	}

	othersWitness() {
		let item = IncidentReportStore.reportDetails?.incident_investigation?.incident_witness_other_users?.data.slice(0, 2)
		return item
	}

	othersInvolved() {
		let item = IncidentReportStore.reportDetails?.incident_investigation?.incident_involved_other_users?.data.slice(0, 2)
		return item
	}

	showMore(type) {
		if (type == 'more') {
			this.moreData = true;
		} else {
			this.moreData = false;
		}
	}

	showMoreWitness(type) {
		if (type == 'more') {
			this.moreDataWitness = true;
		} else {
			this.moreDataWitness = false;
		}
	}

	getPopupDetails(team_members) {
		
		if (team_members) {
		  this.userDetailObject.first_name = team_members.first_name ? team_members.first_name : '';
		  this.userDetailObject.last_name = team_members.last_name ? team_members.last_name : '';
		  this.userDetailObject.designation = team_members.designation ? team_members.designation?.title : team_members.designation;
		  this.userDetailObject.image_token = team_members.image?.token ? team_members.image?.token : team_members.image_token;
		  this.userDetailObject.email = team_members.email;
		  this.userDetailObject.mobile = team_members.mobile;
		  this.userDetailObject.id = team_members.id;
		  this.userDetailObject.department = team_members.department?.title ? team_members.department?.title : null;
		  this.userDetailObject.status_id = team_members.status_id ? team_members.status_id : 1;
		  return this.userDetailObject;
		}
	
	  }

	  getNoDataSource(type){
		let noDataSource = {
		  noData: this.emptyMessage, border: false, imageAlign: type
		}
		return noDataSource;
	  }

	ngOnDestroy() {
		this.removeCss('book');
		this.removeCss('jscroll');
		BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		AuditReportsStore.individualLoaded = false;
		this.moreDataWitness = false;
		this.moreData = false;
		IncidentReportStore.fullView = false;
		IncidentReportStore.unsetIndividualIncidentReport();

	}

}
