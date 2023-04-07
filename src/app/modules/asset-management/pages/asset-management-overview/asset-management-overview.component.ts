import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { toJS } from 'mobx';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationOverviewService } from 'src/app/core/services/organization/overview/organization-overview.service';
import { OrganizationModulesService } from 'src/app/core/services/settings/organization-modules/organization-modules.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationOverviewStore } from 'src/app/stores/organization/organization_overview/organization-overview-store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

declare var $: any;

@Component({
  selector: 'app-asset-management-overview',
  templateUrl: './asset-management-overview.component.html',
  styleUrls: ['./asset-management-overview.component.scss']
})
export class AssetManagementOverviewComponent implements OnInit {

  @ViewChild('overviewModal', { static: true }) overviewModal: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('contentArea') contentArea: ElementRef;

  loaded:boolean=false
  OrganizationOverviewStore = OrganizationOverviewStore;
  OrganizationModulesStore = OrganizationModulesStore;
  documentsArray : any
  selectedMsTypePos: any = 0;
  AuthStore=AuthStore;
  filteredArray=[];
  x:number
  mainModuleIndex:number = 0;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _overViewService: OrganizationOverviewService,
    private _imageService: ImageServiceService,
    private _organizationModuleService: OrganizationModulesService
    
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      if(OrganizationModulesStore.organizationModules.length>0){
        this.getModules(toJS(OrganizationModulesStore.getOrganziationModulesByModuleGroup(3300)));
        let id = this.filteredArray[0].module_id;
        this.setIndex(id,0);
        this._utilityService.detectChanges(this._cdr);
      }
      else {
        this._organizationModuleService.getAllItems().subscribe(res=>{
          setTimeout(() => {
            this.getModules(toJS(OrganizationModulesStore.getOrganziationModulesByModuleGroup(3300)));
            let id = this.filteredArray[0].module_id;
            this.setIndex(id,0);
           this._utilityService.detectChanges(this._cdr);
          }, 100);
        });
      }
    }, 500);  
    
    setTimeout(() => {
      $(this.contentArea.nativeElement).focus();
    }, 250);
  }

  getModules(data){
    this.filteredArray= data.filter(items=>items.is_menu==1)
  }

    setIndex(id,index?){
      this.loaded = false
      this.selectedMsTypePos = 0;
      this.x = index
      this.mainModuleIndex=index
          this._overViewService.getOverviewDetails('?module_group_ids=3300&module_ids='+id).subscribe(res=>{
            this.loaded=true
            this.documentsArray = res
            if(this.documentsArray.data.length > 0){
              setTimeout(() => {
                this.setScrollBar();   
              }, 50);
            }
            this._utilityService.detectChanges(this._cdr);                     
          })                             
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

    next(){
      if(this.documentsArray?.data.length-1 == this.selectedMsTypePos || this.documentsArray?.data.length == 0){
        this.loaded=false
        this.x = this.mainModuleIndex+=1
        this.setIndex(this.filteredArray[this.x]?.module_id,this.x)
        this.selectedMsTypePos = 0 ;
        this.documentsArray = []
        
      }
      else{
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

    // Returns default image url
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

}
