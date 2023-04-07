import { isPlatformBrowser } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, Inject, NgZone, PLATFORM_ID, } from '@angular/core';
import { CustomersStore } from 'src/app/stores/customer-engagement/customers/customers-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { IReactionDisposer, autorun } from "mobx";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomersService } from 'src/app/core/services/customer-satisfaction/customers/customers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
declare var $:any
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { Customers } from 'src/app/core/models/customer-satisfaction/customers/customers';

@Component({
  selector: 'app-customers-details',
  templateUrl: './customers-details.component.html',
  styleUrls: ['./customers-details.component.scss']
})
export class CustomersDetailsComponent implements OnInit {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild ('formModal',{static:true}) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  customerComplaintsPieChart="pie";
  customerFeedbacksPieChart="pie";
  showComplaintsPieNoDataMap: boolean = false;
  showFeedbacksPieNoDataMap: boolean = false;


  CustomersStore = CustomersStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  modalEventSubscription:any;
  popupControlEventSubscription: any;
  reactionDisposer: IReactionDisposer;
  contactEmptyMessage = "no_contact_person_added";
  customersObject = {
    type:null,
    values: null,
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  AppStore = AppStore;

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _activatedRouter: ActivatedRoute,
    private _utilityService: UtilityService,
    private _customersService: CustomersService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _organizationFileService: OrganizationfileService,
    private _imageService:ImageServiceService,
    private _router: Router
  ) { 

  }
  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  

  /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof CustomersDetailsComponent
   */
   ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    let id: number;
    this._activatedRouter.params.subscribe(params => {
      id = +params['id']; 
      // CustomersStore.customersId = id;
      CustomersStore.selectedCustomerId = id;
      this._customersService.saveCustomerId(id);
     this.getCustomers(id);
     
    });
  

  BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'UPDATE_CUSTOMER', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_CUSTOMER', submenuItem: { type: 'delete' } },
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ]
      this._helperService.checkSubMenuItemPermissions(600,subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editCustomers(CustomersStore.selectedCustomerId);
            break;
          case "delete":
            this.delete(CustomersStore.selectedCustomerId);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.modalEventSubscription = this._eventEmitterService.customers.subscribe((res:any) => {
      this.closeFormModal();
      if(res) this._router.navigateByUrl('/customer-engagement/customer/' + res?.id); //navigate|customers
    });

    this.getCustomerComplaints(id);
    this.getCustomerFeedbacks(id);
  }
  getCustomerComplaints(id){
    this._customersService.getCustomerComplaints(id).subscribe(res=>{
      if (res.total_complaint > 0) {
        setTimeout(() => {
          this.createPieChartForCustomerComplaints();
        }, 1000);
      }
      else
      this.showComplaintsPieNoDataMap = true

      this._utilityService.detectChanges(this._cdr);
    })
  }
  getCustomerFeedbacks(id){
    this._customersService.getCustomerFeedbacks(id).subscribe(res=>{
      if (res.total_feedback > 0) {
        setTimeout(() => {
          this.createPieChartForCustomerFeedbacks();
        }, 1000);
      }
      else
      this.showFeedbacksPieNoDataMap=true;

      this._utilityService.detectChanges(this._cdr);
    })
  }

  createPieChartForCustomerComplaints() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(CustomersStore.CustomerComplaints,'count')){
      this.showComplaintsPieNoDataMap=true;
      return
    }else{
      this.showComplaintsPieNoDataMap=false;
    }
    let chart = am4core.create("chartdivcustomercomplaints", am4charts.PieChart);
    
    chart.data = CustomersStore.CustomerComplaints;
    chart.legend = new am4charts.Legend();
    // chart.legend.labels.template.disabled = true;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "";
   
    this._utilityService.detectChanges(this._cdr);
  }

  createPieChartForCustomerFeedbacks() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(CustomersStore.CustomerFeedbacks,'count')){
      this.showFeedbacksPieNoDataMap=true;
      return
    }else{
      this.showFeedbacksPieNoDataMap=false;
    }
    let chart = am4core.create("chartdivcustomerfeedbacks", am4charts.PieChart);
    
    chart.data = CustomersStore.CustomerFeedbacks;
    chart.legend = new am4charts.Legend();
    // chart.legend.labels.template.disabled = true;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "";
   
    this._utilityService.detectChanges(this._cdr);
  }

  editCustomers(id) {
    event.stopPropagation()
    this._customersService.setFileDetails(null,'','logo');
    this._customersService.getItem(id).subscribe(res => {
      let Customer = res;
      if(Customer.hasOwnProperty('image_token') && Customer.image_token){
        var previewUrl = this._organizationFileService.getThumbnailPreview('customer-logo',Customer.image_token);
        var logoDetails = {
                          name: Customer['image_title'], 
                          ext: Customer['image_ext'],
                          size: Customer['image_size'],
                          url: Customer['image_url'],
                          token: Customer['image_token'],
                          preview: previewUrl,
                          thumbnail_url: Customer['image_url']
                      };
        // this._organizationCustomerService.setFileDetails(logoDetails,previewUrl,'logo');
        this._customersService.setFileDetails(logoDetails,previewUrl,'logo');
      } 
    //set form value
    this.customersObject.values = {
      id : Customer.id,
      title: Customer.title,
      contact_person_number: Customer.contact_person_number,
      contact_person: Customer.contact_person,
      email: Customer.email,
      website: Customer.website,
      contact_person_role: Customer.contact_person_role,
      mobile: Customer.mobile,
      contact_person_email: Customer.contact_person_email,
      address: Customer.address,
      image_ext: Customer.image_ext,
      image_size: Customer.image_size,
      image_title: Customer.image_title,
      image_token: Customer.image_token,
      image_url: Customer.image_url
    }
    this.customersObject.type = 'Edit';
    this.openFormModal();
  })
  }

  deleteCustomer(status: boolean) {
		if (status && this.popupObject.id) {
			this._customersService.delete(this.popupObject.id).subscribe(
				(resp) => {
          this._router.navigateByUrl('/customer-engagement/customer');
					setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
				}, 500);
        this.clearPopupObject();
				});
		} 
    else {
			this.clearPopupObject();
		}
		setTimeout(() => {
			$(this.confirmationPopUp.nativeElement).modal('hide');
      }, 250);
	}

  delete(id: number) {
		event.stopPropagation();
		this.popupObject.type = 'are_you_sure';
		this.popupObject.id = id;
		this.popupObject.title = "are_you_sure";
		this.popupObject.subtitle = "customer_details_delete_subtitle";
		$(this.confirmationPopUp.nativeElement).modal("show");
	}

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'are_you_sure':
        this.deleteCustomer(status);
        break;
    }
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  closeConfirmationPopUp() {
		$(this.confirmationPopUp.nativeElement).modal("hide");
		this._utilityService.detectChanges(this._cdr);
	}

  // Returns Image Url by token
  createImageUrl(token){
    return this._organizationFileService.getThumbnailPreview('customer-logo',token);
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
    
  openFormModal() {
    // $(this.formModal.nativeElement).modal('show');
    this._renderer2.addClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
}

  closeFormModal() {
    // $(this.formModal.nativeElement).modal('hide');
    this._renderer2.removeClass(this.formModal.nativeElement, 'show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 9999);
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this.customersObject.type = null;
    this.getCustomers(CustomersStore.selectedCustomerId);
    this._utilityService.detectChanges(this._cdr);
  } 

  checkDataIsPresent(dataArray:any[],field){
    if(dataArray.length > 0){
      let dataNotPresent = 0;
      for(let i of dataArray){
        if(i[field] == 0) dataNotPresent++;
      }
      if(dataNotPresent == dataArray.length) return false;
      else return true;
    }
    else{
      return false;
    }
  }
  
  

    getCustomers(id){
      this._customersService.getItem(id).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }
    
     /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof CustomersDetailsComponent
   */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.modalEventSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    CustomersStore?.unsetIndivitualCustomers();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

   
  

}
