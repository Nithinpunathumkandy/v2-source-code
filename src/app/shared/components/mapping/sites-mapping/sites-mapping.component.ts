import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Sites } from 'src/app/core/models/masters/general/sites';
import { SitesService } from 'src/app/core/services/masters/general/sites/sites.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SitesMasterStore } from 'src/app/stores/masters/general/sites-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-sites-mapping',
  templateUrl: './sites-mapping.component.html',
  styleUrls: ['./sites-mapping.component.scss']
})
export class SitesMappingComponent implements OnInit {

  @Input('siteModalTitle') siteModalTitle: any;
  @Input('title') title: boolean = false;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  SitesMasterStore = SitesMasterStore;
  searchText
  selectedSites: Sites[] = []
  emptyEventsMessage = "no_sites";

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _sitesService: SitesService,
    private _imageService: ImageServiceService) { }

  ngOnInit(): void {
    this.selectedSites = JSON.parse(JSON.stringify(SitesMasterStore.selectedSites));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) SitesMasterStore.setCurrentPage(newPage);
    let params = '';
    // if (this.removeselected) {
    //   params = 'exclude=' + SitesMasterStore.selectedEvents;
    // }
    this._sitesService.getItems(false, (params ? params : '')).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._sitesService.sortSitesList(type);
    this.pageChange()
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  cancel() {
    if (SitesMasterStore.saveSelected) {
      this._eventEmitterService.dismissSiteMappingModal();
      this.searchText = null;
    }
    else {
      this.selectedSites = [];
      SitesMasterStore.saveSelected = false
      this._eventEmitterService.dismissSiteMappingModal()
      this.searchText = null;
    }
  }

  clear() {
    this.searchText = ''
    this.pageChange(1);
  }

  save(close: boolean = false) {
    AppStore.enableLoading();
    SitesMasterStore.saveSelected = true;
    this._sitesService.selectRequiredSites(this.selectedSites);
    AppStore.disableLoading();
    let title = this.siteModalTitle?.component ? this.siteModalTitle?.component : 'item'
    if (this.selectedSites.length > 0) this._utilityService.showSuccessMessage('sites_selected', 'Selected sites are mapped with the ' + this._helperService.translateToUserLanguage(title) + ' successfully!');
    if (close) this.cancel();

  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  selectAllSites(e) {
    if (e.target.checked) {
      for (let i of SitesMasterStore.allItems) {
        var pos = this.selectedSites.findIndex(e => e.id == i.id);
        if (pos == -1) {
          this.selectedSites.push(i);
        }
      }
    } else {
      for (let i of SitesMasterStore.allItems) {
        var pos = this.selectedSites.findIndex(e => e.id == i.id);
        if (pos != -1) {
          this.selectedSites.splice(pos, 1);
        }
      }
    }
  }

  siteSelected(events) {
    var pos = this.selectedSites.findIndex(e => e.id == events.id);
    if (pos != -1)
      this.selectedSites.splice(pos, 1);
    else
      this.selectedSites.push(events);
  }


  sitePresent(id) {
    const index = this.selectedSites.findIndex(e => e.id == id);
    if (index != -1)
      return true;
    else
      return false;
  }

}
