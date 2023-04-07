import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { SoaService } from 'src/app/core/services/isms/soa/soa.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { SOAStore } from 'src/app/stores/isms/isms-risks/soa.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-soa-details',
  templateUrl: './soa-details.component.html',
  styleUrls: ['./soa-details.component.scss']
})
export class SoaDetailsComponent implements OnInit {
  @ViewChild("soaFormModal") soaFormModal: ElementRef;
  SOAStore = SOAStore;
  AppStore = AppStore;
  reactionDisposer:IReactionDisposer;
  soaEventSubscription:any;
  emptyMessage="no_data_found";
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  soaObject={
    component:'SOA',
    type:null,
    values:null
  }
  constructor(private _helperService:HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _renderer2:Renderer2,
    private _cdr:ChangeDetectorRef,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private route:ActivatedRoute,
    private _soaService:SoaService
    ) { }

  ngOnInit(): void {

      let id: number;
      this.route.params.subscribe(params => {
        id = +params['id']; // (+) converts string 'id' to a number
        
        this.getSoaDetails(id);
      })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
 
        { activityName: 'UPDATE_SOA', submenuItem: { type: 'edit_modal' } },
        { activityName: null, submenuItem: { type: 'close',path:'/isms/soa'} },
       
      ]    

      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {
              this.updateItem();
              // this._utilityService.detectChanges(this._cdr);
            }, 1000);
            break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      
    })
   

    this.soaEventSubscription = this._eventEmitterService.IsmsSoa.subscribe(item => {
      this.closeFormModal();
    })
  }

  getSoaDetails(id){
    this._soaService.getItem(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  closeFormModal(){
    this.soaObject.type=null;
    this.soaObject.values=null;
    $(this.soaFormModal.nativeElement).modal("hide");
    this._renderer2.setStyle(this.soaFormModal.nativeElement, 'z-index', 99);
    this._renderer2.setStyle(this.soaFormModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.soaFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  
  updateItem(){

    this.soaObject.type='edit';
    this.soaObject.values={
      control:SOAStore.individualSoa,
      soa_status:SOAStore.individualSoa?.soa_status?SOAStore.individualSoa?.soa_status:null,
      soa_implementation_status:SOAStore.individualSoa?.soa_implementation_status?SOAStore.individualSoa?.soa_implementation_status:null,
      justify:SOAStore.individualSoa?.justify,
      method:SOAStore.individualSoa?.method,
      comment:SOAStore.individualSoa?.comment
     
    }
    if(SOAStore.individualSoa.soa_status)
    this.soaObject.values.soa_status['title']=SOAStore.individualSoa.soa_status?.language[0]?.pivot?.title;
    $(this.soaFormModal.nativeElement).modal("show");
    this._renderer2.setStyle(this.soaFormModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.soaFormModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.soaFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);

  }

  
  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SOAStore.unsetsetIndividualSOA();
    this.soaEventSubscription.unsubscribe();
    SOAStore.lastInsertedId = null;

  }

}
