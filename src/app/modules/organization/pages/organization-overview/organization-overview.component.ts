import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IReactionDisposer, toJS } from 'mobx';
import { OrganizationOverviewService } from 'src/app/core/services/organization/overview/organization-overview.service';
import { OrganizationModulesService } from 'src/app/core/services/settings/organization-modules/organization-modules.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationOverviewStore } from 'src/app/stores/organization/organization_overview/organization-overview-store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

declare var $: any;
@Component({
  selector: 'app-organization-overview',
  templateUrl: './organization-overview.component.html',
  styleUrls: ['./organization-overview.component.scss']
})
export class OrganizationOverviewComponent implements OnInit,OnDestroy {
  @ViewChild('overviewModal', { static: true }) overviewModal: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('contentArea') contentArea: ElementRef;

  AuthStore = AuthStore;
  OrganizationOverviewStore = OrganizationOverviewStore;
  OrganizationModulesStore = OrganizationModulesStore;
  documentsArray : any
  selectedMsTypePos: any = 0;
  loaded:boolean=false
  idd : any = 0;
  mainModuleIndex:number = 0;
  x:number
  filteredArray=[]
  
  reactionDisposer: IReactionDisposer;
  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _overViewService: OrganizationOverviewService,
    private _organizationModuleService: OrganizationModulesService
    
  ) { }

  ngOnInit(): void {
  
    NoDataItemStore.setNoDataItems({ title: "common_no_data_user_guide" }); 
    setTimeout(() => {
      if(OrganizationModulesStore.organizationModules.length>0) {
        this.getModules(toJS(OrganizationModulesStore.getOrganziationModulesByModuleGroup(100)));
        // let id = OrganizationModulesStore.getOrganziationModulesByModuleGroup(100)[0]?.module_id;
        let id = this.filteredArray[0].module_id;
        this.setIndex(id,0);
        this._utilityService.detectChanges(this._cdr);
      }
      else {
        this._organizationModuleService.getAllItems().subscribe(res=>{
          setTimeout(() => {
            this.getModules(toJS(OrganizationModulesStore.getOrganziationModulesByModuleGroup(100)));
            // let id = OrganizationModulesStore.getOrganziationModulesByModuleGroup(100)[0]?.module_id;
            let id = this.filteredArray[0].module_id;
            this.setIndex(id,0);
            this._utilityService.detectChanges(this._cdr);
          },100);
        });
      }
      
    }, 500); 

    setTimeout(() => {
      $(this.contentArea.nativeElement).focus();
    }, 250);
    
    
  }

    setIndex(id,index?){
      this.loaded=false
      this.selectedMsTypePos = 0;
      this.x = index
      this.mainModuleIndex=index
          this._overViewService.getOverviewDetails('?module_group_ids=100&module_ids='+id).subscribe(res=>{
            this.loaded=true
            this.documentsArray = res
            if(this.documentsArray.data.length > 0){
              setTimeout(() => {
                this.setScrollBar();   
              }, 50);
            }
            // else this.unsetScrollBar();
            this._utilityService.detectChanges(this._cdr);                     
          })                             
    }

    getModules(data){
      this.filteredArray= data.filter(items=>items.is_menu==1)
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
      
      if(this.documentsArray?.data.length-1 == this.selectedMsTypePos || this.documentsArray?.data.length == 0){
        this.loaded=false
        this.x = this.mainModuleIndex+=1
        this.setIndex(this.filteredArray[this.x]?.module_id,this.x)
        this.selectedMsTypePos = 0 ;
        this.documentsArray = []
        
      }else{
        this.selectedMsTypePos +=1
        this.setScrollBar();
      }      
    }

    prev(){
      if(this.selectedMsTypePos == 0){
        this.loaded=false
        this.x = this.mainModuleIndex-=1
        this.setIndex(this.filteredArray[this.x]?.module_id,this.x)
        this.selectedMsTypePos = 0;
        this.documentsArray = []
        
      }else{
        this.selectedMsTypePos -=1
        this.setScrollBar();
      }      
    }

    passId(pos){
      this.selectedMsTypePos = pos;
      this.setScrollBar();
      this._utilityService.detectChanges(this._cdr);
    }

    imageUrl(token) { return this._overViewService.getThumbnailPreview('overview', token);}


    ngOnDestroy(){
      NoDataItemStore.unsetNoDataItems();
    }

  

}
