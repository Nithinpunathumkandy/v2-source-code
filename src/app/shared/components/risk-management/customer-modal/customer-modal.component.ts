import { Component, OnInit , ChangeDetectorRef,Input } from '@angular/core';
import { BusinessCustomersStore } from "src/app/stores/organization/business_profile/business-customers.store";
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationCustomersService } from 'src/app/core/services/organization/business_profile/organization-customers/organization-customers.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrganizationfileService } from 'src/app/core/services/organization/organization-file/organizationfile.service';
import { Customers } from 'src/app/core/models/organization/business_profile/business-customers';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.scss']
})
export class CustomerModalComponent implements OnInit {
  @Input('removeselected') removeselected:boolean = false;
  @Input('customerModalTitle')customerModalTitle: any;
  @Input('title') title:boolean=false;
  
  BusinessCustomersStore = BusinessCustomersStore;
  AppStore = AppStore;
  selectedCustomer:Customers[]=[];
  selectCustomer=[];
  searchText=null
  emptyCustomer="no_customer"

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _organizationCustomerService:OrganizationCustomersService,
    private _organizationFileService:OrganizationfileService,
    private _eventEmitterService:EventEmitterService,
    private _helperService:HelperServiceService
  ) { }

  ngOnInit(): void {
    this.selectCustomer=JSON.parse(JSON.stringify(BusinessCustomersStore.selectedCustomerList));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    let params='';
    if(this.removeselected){
      params='exclude='+BusinessCustomersStore.selectedCustomerList;
    }
    if (newPage) BusinessCustomersStore.setCurrentPage(newPage);
    this._organizationCustomerService.getItems(false,(params?params:'')).subscribe(() => {
      setTimeout(() => {
        document.getElementById('selectall')['checked'] = false;
        this._utilityService.detectChanges(this._cdr)
      }
      , 250)
    });
  }

  // Returns Image Url by token
  createImageUrl(token){
    return this._organizationFileService.getThumbnailPreview('customer-logo',token);
  }

  selectAllCustomers(e){
    // if(e.target.checked){
    //   this.selectCustomer = BusinessCustomersStore.customerDetails;
    // }
    // else{
    //   this.selectCustomer = [];
    // }

    if (e.target.checked) {
      for(let i of BusinessCustomersStore.customerDetails){
        var pos = this.selectCustomer.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.selectCustomer.push(i);}          
      }
    } else {
      for(let i of BusinessCustomersStore.customerDetails){
        var pos = this.selectCustomer.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.selectCustomer.splice(pos,1);}    
      }
    }
  }

  customerPresent(id){
    const index = this.selectCustomer.findIndex(e => e.id == id);
     if (index != -1)
       return true;
     else
       return false;
  }

  customerSelected(customers){
    console.log(customers);
    console.log(this.selectCustomer);
    
    var pos = this.selectCustomer.findIndex(e=>e.id == customers.id);
    console.log(pos);
    
    if(pos != -1)
        this.selectCustomer.splice(pos,1);
    else
        this.selectCustomer.push(customers);
    
  }

    //getting button name by language
    getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    }

  save(close: boolean = false){
    AppStore.enableLoading();
    BusinessCustomersStore.saveSelected=true;
    this._organizationCustomerService.selectRequiredCustomer(this.selectCustomer);
    AppStore.disableLoading();
    let title = this.customerModalTitle?.component ? this.customerModalTitle?.component : 'item'
    if(this.selectCustomer.length > 0) this._utilityService.showSuccessMessage('customers_selected','Selected customers are mapped with the ' +title + ' successfully!')
    if(close) this.cancel();
  }

  cancel(){
    if(BusinessCustomersStore.saveSelected){
      this._eventEmitterService.dismissCustomerSelectModal();
    }
    else{
      this.selectCustomer=[];
      BusinessCustomersStore.saveSelected=false
      this._eventEmitterService.dismissCustomerSelectModal();
    }
  }

  clear(){
    this.searchText=''
    this.pageChange(1);
  }

  searchCustomer(e){
    let params='';
    if(this.removeselected){
      params='&exclude='+BusinessCustomersStore.selectedCustomerList;
    }
    this._organizationCustomerService.getItems(false,`q=${this.searchText}`+(params?params:'')).subscribe(res =>{
      this._utilityService.detectChanges(this._cdr)
    })
  }

}
