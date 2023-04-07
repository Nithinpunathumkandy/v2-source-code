import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, ViewChild,PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';

declare var $: any;
declare var Modernizr: any;

@Component({
  selector: 'app-strategy-report-book',
  templateUrl: './strategy-report-book.component.html',
  styleUrls: ['./strategy-report-book.component.scss']
})
export class StrategyReportBookComponent implements OnInit {
  @ViewChild('container') container: ElementRef;
	@ViewChild('bbBookblock') bbBookblock: ElementRef;
	@ViewChild('bbNavPrev') bbNavPrev: ElementRef;
	@ViewChild('bbNavNext') bbNavNext: ElementRef;
	@ViewChild('tblContents') tblContents: ElementRef;

  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  StrategyStore = StrategyStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
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
	pageNumber:number=1;
  strategyEmptyList : string = 'common_nodata_title';

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone,
  @Inject(DOCUMENT) private document: Document, private _activatedRoute: ActivatedRoute,
  private _strategyService: StrategyService, private _cdr: ChangeDetectorRef, private _utilityService: UtilityService) { 
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

  ngOnInit(): void {
    let id = null;
    this._activatedRoute.params.subscribe(queryParams=>{
      id = queryParams['id'];
      this.getStrategyProfileDetails(id);
    })
	  if (StrategyStore.backToDashboard == true) {
		  SubMenuItemStore.setSubMenuItems([
			  { type: "close", path: "/strategy-management/dashboard" }
		  ]);
	  }
	  else {
		  SubMenuItemStore.setSubMenuItems([
			  { type: "close", path: "/strategy-management/report" }
		  ]);
	  }
  }

  getStrategyProfileDetails(strategyId: number){
    this._strategyService.getItem(strategyId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getFocusArea(){
    this._strategyService.focusAreaList().subscribe(res=>{
     this._utilityService.detectChanges(this._cdr);
    })
  }

  focusAreas(focusAreaList){
    let data = focusAreaList
    if(focusAreaList.length > 1){
      data = data.sort((a,b)=>{return b.weightage - a.weightage  })
    }
    return data
  }

  ngAfterViewInit() {
		// if (this.AuditReportsStore.individualLoaded) {
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
		// }
		
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

  ngOnDestroy() {
		this.removeCss('book');
		this.removeCss('jscroll');
		BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    StrategyStore.__individualProfile = null;
    SubMenuItemStore.makeEmpty();
	StrategyStore.backToDashboard = false;
  }
}
