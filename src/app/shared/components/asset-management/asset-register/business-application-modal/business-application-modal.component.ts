import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BusinessApplications } from 'src/app/core/models/masters/bcm/business-applications';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { BusinessApplicationsService } from 'src/app/core/services/masters/bcm/business-applications/business-applications.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BusinessApplicationsMasterStore } from 'src/app/stores/masters/bcm/business-applications.master.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-business-application-modal',
  templateUrl: './business-application-modal.component.html',
  styleUrls: ['./business-application-modal.component.scss']
})
export class BusinessApplicationModalComponent implements OnInit {
  @Input('businessApplicationModalTitle')businessApplicationModalTitle: any;

  BusinessApplicationsMasterStore = BusinessApplicationsMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  selectedBusinessApplications:BusinessApplications[] = [];
  searchTerm = null;
  emptyBusinessApplications="no_business_applications_available"
  
  constructor(private _utilityService:UtilityService,
    private _businessApplicationsService:BusinessApplicationsService,
    private _eventEmitterService:EventEmitterService,
    private _cdr:ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.selectedBusinessApplications = BusinessApplicationsMasterStore.selectedBusinessApplicationsList;
    this.pageChange(1);
  }

  cancel(){
    if(BusinessApplicationsMasterStore.saveSelected){
      this._eventEmitterService.dismissBusinessApplicationSelectModal(); 
    }
    else{
      this.selectedBusinessApplications=[];
      BusinessApplicationsMasterStore.saveSelected = false;
      this._eventEmitterService.dismissBusinessApplicationSelectModal();  
    }
  }

  pageChange(newPage: number = null) {
    if (newPage) BusinessApplicationsMasterStore.setCurrentPage(newPage);
    else BusinessApplicationsMasterStore.setCurrentPage(1);
    this._businessApplicationsService.getItems(false,null,false).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  save(close: boolean = false){
    BusinessApplicationsMasterStore.saveSelected = true;
    this._businessApplicationsService.selectRequiredBusinessApplications(this.selectedBusinessApplications);
    let title = this.businessApplicationModalTitle?.component ? this.businessApplicationModalTitle?.component : 'item'
    if(this.selectedBusinessApplications.length > 0) this._utilityService.showSuccessMessage('business_application_selected','Selected business applications are mapped with the ' +title + ' successfully!');
    if(close) this.cancel();
  }

  searchBusinessApplication() {
    BusinessApplicationsMasterStore.setCurrentPage(1);
    var searchParams = this.generateSortParams();
    this._businessApplicationsService.getItems(false, searchParams).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  generateSortParams(){
    var params = '';
    // if(this.department_ids) params = params+`department_ids=${this.department_ids}`;
    // if(this.issue_type_id){
    //     params = params + `&issue_type_ids=${this.issue_type_id}`;
    // }
    // if(this.issue_category_id){
    //     params = params + `&issue_category_ids=${this.issue_category_id}`;
    // }
    // if(this.issue_domain_id){
    //     params = params + `&issue_domain_ids=${this.issue_domain_id}`;
    // }
    if(this.searchTerm)
      params = params + `&q=${this.searchTerm}`;
    return params;
  }

  // sortIssues(){
  //   var params = this.generateSortParams();
  //   this._businessApplicationsService.getItems(false,params).subscribe(res=>{
  //     this._utilityService.detectChanges(this._cdr);
  //   });
  // }

  // for sorting
	sortTitle(type: string) {
		this._businessApplicationsService.sortBusinessApplicationList(type, null);
		this.pageChange();
	}

  clear(){
    this.searchTerm='';
    this.pageChange(1);
  }

  selectAllBusinessApplications(e){

    if (e.target.checked) {
      for(let i of BusinessApplicationsMasterStore.allItems){
        var pos = this.selectedBusinessApplications.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.selectedBusinessApplications.push(i);}          
      }
    } else {
      for(let i of BusinessApplicationsMasterStore.allItems){
        var pos = this.selectedBusinessApplications.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.selectedBusinessApplications.splice(pos,1);}    
      }
    }
  }

  businessApplicationPresent(id) {
    const index = this.selectedBusinessApplications.findIndex(e => e.id == id);
    if (index != -1)
      return true;
    else
      return false;
  }

  businessApplicationSelected(items){
    var pos = this.selectedBusinessApplications.findIndex(e=>e.id == items.id);
    if(pos != -1)
        this.selectedBusinessApplications.splice(pos,1);
    else
        this.selectedBusinessApplications.push(items);
  }

}
