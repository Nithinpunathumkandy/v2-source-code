import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { toJS } from 'mobx';
import { identity } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationOverviewService } from 'src/app/core/services/organization/overview/organization-overview.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationOverviewStore } from 'src/app/stores/organization/organization_overview/organization-overview-store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

declare var $: any;

@Component({
  selector: 'app-audit-management-overview',
  templateUrl: './audit-management-overview.component.html',
  styleUrls: ['./audit-management-overview.component.scss']
})
export class AuditManagementOverviewComponent implements OnInit {

  @ViewChild('overviewModal', { static: true }) overviewModal: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('contentArea') contentArea: ElementRef;

  documentSubscriptionEvent: any = null;
  overviewArray = [];
  OrganizationOverviewStore = OrganizationOverviewStore;
  OrganizationModulesStore = OrganizationModulesStore;
  documentsArray: any
  selectedMsTypePos: any = 0;
  loaded: boolean = false
  mainModuleIndex: number = 0;
  filteredArray = [];
  x: number
  reactionDisposer: IReactionDisposer;
  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _overViewService: OrganizationOverviewService

  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      if (OrganizationModulesStore.organizationModules.length > 0) {
        this.getModules(toJS(OrganizationModulesStore.getOrganziationModulesByModuleGroup(3900)));
        let id = this.filteredArray[0].module_id;
        this.setIndex(id, 0);
        this._utilityService.detectChanges(this._cdr);
      }
      else {
        this._overViewService.getItems().subscribe(res => {
          setTimeout(() => {
            this.getModules(toJS(OrganizationModulesStore.getOrganziationModulesByModuleGroup(3900)));
            let id = this.filteredArray[0].module_id;
            this.setIndex(id, 0);
            this._utilityService.detectChanges(this._cdr);
          }, 100);
        });
      }

    }, 500);
    setTimeout(() => {
      $(this.contentArea.nativeElement).focus();
    }, 250);
  }

  getModules(data) {
    this.filteredArray = data.filter(items => items.is_menu == 1)
  }

  pageChange(newPage: number = null) {
    if (newPage) OrganizationOverviewStore.setCurrentPage(newPage);
    this._overViewService.getItems().subscribe(res => {
      this.overviewArray = [];
      for (const item of OrganizationOverviewStore.allItems) {
        let event = {
          'event_id': item.event_id,
          'id': item?.id,
          'document_id': item.document_id,
          'size': item.size,
          'thumbnail_url': item.thumbnail_url,
          'token': item.token,
          'document_title': item.document_title,
          'ext': item.ext,
          'title': item.document_title,
          'kh_document': item.kh_document,
        }
        this.overviewArray.push(event);
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  closeDocumentModal() {
    setTimeout(() => {
      $(this.overviewModal.nativeElement).modal('hide');
      this._renderer2.removeClass(this.overviewModal.nativeElement, 'show');
      this._renderer2.setStyle(this.overviewModal.nativeElement, 'display', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  //this is for opening add task  
  openNewOverview() {
    // this.OverviewObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.openNewOverviewModal();
  }

  setIndex(id, index) {
    this.loaded = false
    this.selectedMsTypePos = 0;
    this.x = index
    this.mainModuleIndex = index
    this._overViewService.getOverviewDetails('?module_group_ids=3900&module_ids=' + id).subscribe(res => {
      this.loaded = true
      this.documentsArray = res;
      if (this.documentsArray.data.length > 0) {
        setTimeout(() => {
          this.setScrollBar();
        }, 50);
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  passId(pos) {
    this.selectedMsTypePos = pos;
    this._utilityService.detectChanges(this._cdr);
  }

  imageUrl(token) { return this._overViewService.getThumbnailPreview('overview', token); }

  //it will open add modal
  openNewOverviewModal() {
    setTimeout(() => {
      $(this.overviewModal.nativeElement).modal('show');
    }, 100);
  }

  next() {
    if (this.documentsArray?.data.length - 1 == this.selectedMsTypePos || this.documentsArray?.data.length == 0) {
      this.loaded = false
      this.x = this.mainModuleIndex += 1
      this.setIndex(this.filteredArray[this.x]?.module_id, this.x)
      this.selectedMsTypePos = 0;
      this.documentsArray = []
    }
    else {
      this.selectedMsTypePos += 1;
      this.setScrollBar();
    }
  }

  prev() {
    if (this.selectedMsTypePos == 0) {
      this.loaded = false
      this.x = this.mainModuleIndex -= 1
      this.setIndex(this.filteredArray[this.x]?.module_id, this.x)
      this.selectedMsTypePos = 0;
      this.documentsArray = []
    } else {
      this.selectedMsTypePos -= 1;
      this.setScrollBar();
    }
  }

  setScrollBar() {
    let elem: Element = document.getElementById('data-div' + this.selectedMsTypePos);
    setTimeout(() => {
      $(elem).mCustomScrollbar();
    }, 50);
  }

  unsetScrollBar() {
    $(".data-div").mCustomScrollbar('destroy');
  }

  moveTo(type) {
    switch (type) {
      case 'left': $(this.contentArea.nativeElement).animate({
        scrollLeft: "-=300px"
      }, "slow");
        $(this.contentArea.nativeElement).focus();
        break;
      case 'right': $(this.contentArea.nativeElement).animate({
        scrollLeft: "+=300px"
      }, "slow");
        $(this.contentArea.nativeElement).focus();
        break;
    }
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.documentSubscriptionEvent.unsubscribe();
  }

}
