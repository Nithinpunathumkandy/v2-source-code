import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BusinessServices } from 'src/app/core/models/organization/business_profile/business-services';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BusinessServicesService } from 'src/app/core/services/organization/business_profile/business_services/business-services.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BusinessServiceStore } from 'src/app/stores/organization/business_profile/business-services.store';

@Component({
  selector: 'app-service-modal',
  templateUrl: './service-modal.component.html',
  styleUrls: ['./service-modal.component.scss']
})
export class ServiceModalComponent implements OnInit {
  @Input('serviceModalTitle')serviceModalTitle: any;

  BusinessServiceStore = BusinessServiceStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  selectedServices:BusinessServices[] = [];
  searchTerm = null;
  emptyServices="no_service_available"

  constructor(private _utilityService:UtilityService,
    private _businessService:BusinessServicesService,
    private _eventEmitterService:EventEmitterService,
    private _helperService:HelperServiceService,
    private _cdr:ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.selectedServices = BusinessServiceStore.selectedBusinessServicesList;
    this.pageChange(1);
  }

  cancel(){
    if(BusinessServiceStore.saveSelected){
      this._eventEmitterService.dismissServiceSelectModal(); 
    }
    else{
      this.selectedServices=[];
      BusinessServiceStore.saveSelected = false;
      this._eventEmitterService.dismissServiceSelectModal();  
    }
  }

  pageChange(newPage: number = null) {
    if (newPage) BusinessServiceStore.setCurrentPage(newPage);
    else BusinessServiceStore.setCurrentPage(1);
    this._businessService.getAllItems().subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  save(close: boolean = false){
    BusinessServiceStore.saveSelected = true;
    this._businessService.selectRequiredServices(this.selectedServices);
    let title = this.serviceModalTitle?.component ? this.serviceModalTitle?.component:'item'
    if(this.selectedServices.length > 0) this._utilityService.showSuccessMessage('services_selected','Selected services are mapped with the ' +this._helperService.translateToUserLanguage(title)+ ' successfully!');
    if(close) this.cancel();
  }

  searchService() {
    BusinessServiceStore.setCurrentPage(1);
    var searchParams = this.generateSortParams();
    this._businessService.getAllItems(false,searchParams).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  generateSortParams(){
    var params = '';
    // if(this.issue_domain_id){
    //     params = params + `&issue_domain_ids=${this.issue_domain_id}`;
    // }
    if(this.searchTerm)
      params = params + `&q=${this.searchTerm}`;
    return params;
  }

  clear(){
    this.searchTerm='';
    this.pageChange(1);
  }

  selectAllService(e){

    if (e.target.checked) {
      for(let i of BusinessServiceStore.servicesDetails){
        var pos = this.selectedServices.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.selectedServices.push(i);}          
      }
    } else {
      for(let i of BusinessServiceStore.servicesDetails){
        var pos = this.selectedServices.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.selectedServices.splice(pos,1);}    
      }
    }
  }

  ServicePresent(id) {
    const index = this.selectedServices.findIndex(e => e.id == id);
    if (index != -1)
      return true;
    else
      return false;
  }

  ServicesSelected(items){
    var pos = this.selectedServices.findIndex(e=>e.id == items.id);
    if(pos != -1)
        this.selectedServices.splice(pos,1);
    else
        this.selectedServices.push(items);
  }

}
