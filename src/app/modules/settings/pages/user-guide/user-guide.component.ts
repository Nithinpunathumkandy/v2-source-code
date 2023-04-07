import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer, toJS } from 'mobx';
import { OrganizationOverview } from 'src/app/core/models/organization/organization-overview/organization-overview';
import { OrganizationModuleGroup } from 'src/app/core/models/settings/organization-modules';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationOverviewService } from 'src/app/core/services/organization/overview/organization-overview.service';
import { OrganizationModulesService } from 'src/app/core/services/settings/organization-modules/organization-modules.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationOverviewStore } from 'src/app/stores/organization/organization_overview/organization-overview-store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

declare var $: any;
@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {

    @ViewChild('overviewModal', { static: true }) overviewModal: ElementRef;
    @ViewChild('plainDev') plainDev: ElementRef;
    @ViewChild('navBar') navBar: ElementRef;
    @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
    @ViewChild('contentArea') contentArea: ElementRef;

    loaded:boolean=false
    x:number
    mainModuleIndex:number = 0;
    filteredArray=[];
    documentsArray : any
    documentArray: any
    overviewArray = [];
    selectedMsTypePos: any = 0;
    subModule = [];
    module : any;
    id: any;
    AuthStore = AuthStore;
    infoObject = {
      component: 'Master',
      values: null,
      type: null
    };
    popupObject = {
      type: '',
      title: '',
      id: null,
      subtitle: ''
    };
    popupControlOverviewEventSubscription: any;
    infoSubscriptionEvent: any = null;
    OrganizationOverviewStore = OrganizationOverviewStore;
    OrganizationModulesStore=OrganizationModulesStore
    reactionDisposer: IReactionDisposer;
    documentSubscriptionEvent: any;
    selectedModuleGroup: OrganizationModuleGroup;
    selectedModuleIndex: any = 0;

  constructor(private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _overViewService: OrganizationOverviewService,
    private _organizationModuleService: OrganizationModulesService) { }

  ngOnInit(): void
   {
      this.reactionDisposer = autorun(() => { 
        var subMenuItems=[
          {activityName: 'CREATE_USER_GUIDE', submenuItem: {type: 'new_modal'}},
          {activityName:null, submenuItem: {type: 'close', path: '../'}}
        ];
        this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
        
        if (SubMenuItemStore.clikedSubMenuItem) {
          switch (SubMenuItemStore.clikedSubMenuItem.type) {
            case "new_modal":
              setTimeout(() => {
                this.createNewOverview();
              }, 1000);
              break;
          }
          SubMenuItemStore.unSetClickedSubMenuItem();
        }
        NoDataItemStore.setNoDataItems({ title: "common_no_data_user_guide", subtitle: "common_nodata_subtitle", buttonText: "add_content" });
         if (NoDataItemStore.clikedNoDataItem) {
           this.infoObject.type = 'Add';
           this.infoObject.values = null; // for clearing the value
           this._utilityService.detectChanges(this._cdr);
          this.openNewOverviewModal();
         NoDataItemStore.unSetClickedNoDataItem();
        }
      });
      this.documentSubscriptionEvent = this._eventEmitterService.eventOverviewModal.subscribe(item => {
        this.closeDocumentModal()
      })

      // for deleting using delete modal
      this.popupControlOverviewEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.deleteInfo(item);
      })

      // for closing the modal
      this.infoSubscriptionEvent = this._eventEmitterService.userGuide.subscribe(res => {
        this.closeOverviewModal();
        this.getOverviewDetails(OrganizationOverviewStore.selectedModuleId);
      })

      setTimeout(() => {
        this.setInitialData();
      }, 500);  
    
    }

    setInitialData(){
      if(OrganizationModulesStore.organizationModules.length>0){
        this.module = OrganizationModulesStore.organizationModules[0];
        this.getModules(toJS(OrganizationModulesStore.getOrganziationModulesByModuleGroup(this.module?.id)));
        let id = OrganizationModulesStore.getOrganziationModulesByModuleGroup(this.module?.id)[0]?.module_id;
         this.getOverviewDetails(id);
         this.selectedIndex(id,0);
         this.OrganizationOverviewStore.module_group_id = this.module?.id;
         this.OrganizationOverviewStore.module_id = id;
        this._utilityService.detectChanges(this._cdr);
      }
      else {
        this._organizationModuleService.getAllItems().subscribe(res=>{
          setTimeout(() => {
            this.module = OrganizationModulesStore.organizationModules[0];
            this.getModules(toJS(OrganizationModulesStore.getOrganziationModulesByModuleGroup(this.module?.id)));
         let id = OrganizationModulesStore.getOrganziationModulesByModuleGroup(this.module?.id)[0]?.module_id;
         this.getOverviewDetails(id);
         this.selectedIndex(id,0);
         this.OrganizationOverviewStore.module_group_id = this.module?.id;
         this.OrganizationOverviewStore.module_id = id;
         this._utilityService.detectChanges(this._cdr);
          }, 100);
        });
      }
      
    setTimeout(() => {
      $(this.contentArea.nativeElement).focus();
    }, 250);
    
      // this.module = OrganizationModulesStore.organizationModules.length > 0 ? OrganizationModulesStore.organizationModules[0] : null;
      // this.getModules(toJS(OrganizationModulesStore.getOrganziationModulesByModuleGroup(this.module?.id)));
      //   let id = OrganizationModulesStore.getOrganziationModulesByModuleGroup(this.module?.id)[0]?.module_id;
      //    this.getOverviewDetails(id);
      //    this.selectedIndex(id,0);
      //    this.OrganizationOverviewStore.module_group_id = this.module.id;
      //    this.OrganizationOverviewStore.module_id = id;
    }

    getModuleData() {
      this.loaded = false;
      this.selectedModuleIndex = 0;
      this.x = 0;
      this.selectedMsTypePos = 0;
      this.OrganizationOverviewStore.module_group_id = this.module.id;
      let id = null;
      let daata = OrganizationModulesStore.getOrganziationModulesByModuleGroup(this.module.id);
      this.getModules(toJS(OrganizationModulesStore.getOrganziationModulesByModuleGroup(this.module.id)));
        for(let [index,value] of daata.entries()){
          if(value.is_menu == 1){
            id =  value.module_id;
            OrganizationOverviewStore.module_id = value.module_id
            // this.selectedModuleIndex = index;
            break;
          }
        }
      this.getOverviewDetails(id);
    }

    getModules(data){
      this.filteredArray= data.filter(items=>items.is_menu==1)
    }

  // Setting index for active tab
    selectedIndex(id, index) {
      this.loaded = false
      this.selectedMsTypePos = 0;
      this.x = index;
      this.OrganizationOverviewStore.module_id = id;
      this.selectedModuleIndex = index;
      this.getOverviewDetails(id);
    }

    imageUrl(token) { 
      return this._overViewService.getThumbnailPreview('overview', token);
    }

    passId(pos){
      this.selectedMsTypePos = pos;
      this.setScrollBar();
      this._utilityService.detectChanges(this._cdr);
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

    setScrollBar(){
      let elem: Element = document.getElementById('data-div'+this.selectedMsTypePos);
      setTimeout(() => {
        $(elem).mCustomScrollbar();
      }, 50);
    }

    unsetScrollBar(){
      $(".data-div").mCustomScrollbar('destroy');
    }

    next(){
      if(this.documentsArray?.length-1 == this.selectedMsTypePos || this.documentsArray?.length == 0){
        this.loaded=false
        this.x = this.selectedModuleIndex+=1
        this.selectedIndex(this.filteredArray[this.x]?.module_id,this.x)
        this.selectedMsTypePos = 0 ;
        this.documentArray = []
        
      }
      else{
        this.selectedMsTypePos +=1
        this.setScrollBar();
      }      
    }

    prev(){
      if(this.selectedMsTypePos == 0){
        this.loaded=false
        this.x = this.selectedModuleIndex-=1
        this.selectedIndex(this.filteredArray[this.x]?.module_id,this.x)
        this.selectedMsTypePos = 0;
        this.documentsArray = []
        
      }else{
        this.selectedMsTypePos -=1
        this.setScrollBar();
      }      
    }

    pageChange(newPage:number = null){
      let params = `?is_all=true`;
      if (newPage) OrganizationOverviewStore.setCurrentPage(newPage);
      this._overViewService.getItems(params).subscribe(res=>{
        this.overviewArray = [];
        this._utilityService.detectChanges(this._cdr);
      })
    }

    getOverviewDetails(id){
      OrganizationOverviewStore.selectedModuleId = id;
      this._overViewService.getItems('?is_all=true'+'&module_group_ids='+this.module?.id+'&module_ids='+id).subscribe(res=>{
        this.loaded=true
        this.documentsArray = res
        if(this.documentsArray.length > 0){
          setTimeout(() => {
            this.setScrollBar();   
          }, 50);
        }
        // else this.unsetScrollBar();
        this._utilityService.detectChanges(this._cdr);                     
      })
    }

    selectModuleGroup(moduleGroup:OrganizationModuleGroup){
      this.selectedModuleGroup = moduleGroup;
    }

    getDetails(id){
      this._overViewService.getInfoById(id).subscribe(res=>{

      })
    }
  

    openNewOverviewModal() {
      setTimeout(() => {
        $(this.overviewModal.nativeElement).modal('show');
        this._utilityService.detectChanges(this._cdr);
      }, 100);
    }

    closeOverviewModal() {
      this.infoObject.type = null;
      this.infoObject.values = null; // for clearing the value
      setTimeout(() => {
      $(this.overviewModal.nativeElement).modal('hide');
      this._renderer2.removeClass(this.overviewModal.nativeElement,'show');
      this._renderer2.setStyle(this.overviewModal.nativeElement,'display','none');
      $('.modal-backdrop').remove();
    }, 200);
    }

    createNewOverview(){
      this.infoObject.type = 'Add';
      this.infoObject.values = null; // for clearing the value
      this._utilityService.detectChanges(this._cdr);
      this.openNewOverviewModal();
    }

    closeDocumentModal(){
      setTimeout(() => {
        $(this.overviewModal.nativeElement).modal('hide');
        this._renderer2.removeClass(this.overviewModal.nativeElement,'show');
        this._renderer2.setStyle(this.overviewModal.nativeElement,'display','none');
        $('.modal-backdrop').remove();
        this._utilityService.detectChanges(this._cdr);
      }, 200);
    }



    editInfo(id: number) {
      this._overViewService.getInfoById(id).subscribe(res=>{
        event.stopPropagation();
        const info: OrganizationOverview = OrganizationOverviewStore.getInfoById(id);
        //set form value
        this.infoObject.values = {
          id: info?.id,
          module_group_id: info?.module_group_id,
          module_id: info?.module_id,
          title: info?.title,
          description: info?.description,
          documents: info?.documents
        }
        if(res?.documents[0]?.token){
        var purl = this._overViewService.getThumbnailPreview('overview',res?.documents[0]?.token);
          var lDetails = {
                id : res?.documents[0]?.id ? res?.documents[0]?.id : null,
                name: res?.documents[0]?.title ? res?.documents[0]?.title : null,
                ext: res?.documents[0]?.ext ? res?.documents[0]?.ext : null,
                size: res?.documents[0]?.size ? res?.documents[0]?.size : null,
                url: res?.documents[0]?.url ? res?.documents[0]?.url : null,
                token: res?.documents[0]?.token ? res?.documents[0]?.token : null,
                preview: purl,
                thumbnail_url: res?.documents[0]?.thumbnail_url ? res?.documents[0]?.thumbnail_url : null
            };
          this._overViewService.setImageDetails(lDetails,purl,'logo');
        }
        this.infoObject.type = 'Edit';
        this.openNewOverviewModal();
      })
      
    }

    // for delete
    deleteInfoConfirm(id: number) {
      event.stopPropagation();
      this.popupObject.type = '';
      this.popupObject.id = id;
      this.popupObject.title = 'Delete Slide?';
      this.popupObject.subtitle = 'delete_user_guide_subtitle';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
    }

    closeConfirmationPopup(){
      $(this.confirmationPopUp.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }

    // delete function call
    deleteInfo(status: boolean) {
      if (status && this.popupObject.id) {
        this._overViewService.deleteItem(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.closeConfirmationPopup();
          this.getOverviewDetails(OrganizationOverviewStore.selectedModuleId);
          this.clearPopupObject();
        },
        (error=>{
          if(error.status == 405){
            let id = this.popupObject.id;
            this.closeConfirmationPopup();
            this.clearPopupObject();
          }
          else{
            this.closeConfirmationPopup();
            this.clearPopupObject();
          }
        })
        );
      }
      else {
        this.closeConfirmationPopup();
        this.clearPopupObject();
      }
    }

    // for popup object clearing
    clearPopupObject() {
      this.popupObject.id = null;
    }

    ngOnDestroy(){
      NoDataItemStore.unsetNoDataItems();
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.documentSubscriptionEvent.unsubscribe();
      this.popupControlOverviewEventSubscription.unsubscribe();
      this.infoSubscriptionEvent.unsubscribe();

    }


}
