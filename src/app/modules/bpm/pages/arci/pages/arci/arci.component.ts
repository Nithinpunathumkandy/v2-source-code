import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Renderer2 } from '@angular/core';
import { ArciService } from '../../../../../../core/services/bpm/arci-matrix/arci.service'
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ArciStore } from 'src/app/stores/bpm/arci/arci.store'
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ProcessService } from 'src/app/core/services/bpm/process/process.service';
import { Router } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-arci',
  templateUrl: './arci.component.html',
  styleUrls: ['./arci.component.scss']
})
export class ArciComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('popup') popup: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;

  ArciStore = ArciStore
  AppStore = AppStore
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  activeIndex = null;
  accountableActiveIndex = null;
  responsibleActiveIndex = null;
  consultedActiveIndex = null;
  informedActiveIndex = null;
  hover = false;
  popupActive: boolean;
  arciEmptyList = "no_data_found";
  emptyMessage = "";
  page = 1;
  pageSize = 3;

  
  arciMatrixObject = {
    component: 'Master',
    type: null,
    values: null
  }

  deleteObject = {
    title: '',
    id: null,
    subtitle:'',
    type:"Delete"
  };

  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null

  }

  arciMatrixSubscriptionEvent: any = null;
  deleteEventSubscription: any;
  idleTimeoutSubscription: any;
  filterSubscription: Subscription = null;
  networkFailureSubscription:any;

  constructor(private _arciService: ArciService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _prcoessService: ProcessService,
    private _route: Router,
    private _renderer2: Renderer2,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService
  ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.ArciStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    })
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({title:"common_nodata_title",subtitle:'common_nodata_subtitle',buttonText: 'add_new_matrix'});

      // This will run whenever the store observable or computed which are used in this function changes.
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_PROCESS_ARCI', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_PROCESS_ARCI_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_PROCESS_ARCI', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'IMPORT_CONTROL', submenuItem: {type: 'import'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_PROCESS_ARCI')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(600,subMenuItems);

        
        if (SubMenuItemStore.clikedSubMenuItem) {
          switch (SubMenuItemStore.clikedSubMenuItem.type) {
            case "new_modal":
              setTimeout(() => {
                this.addArci();
              }, 1000);
              break;
            case "template":
              this._arciService.generateTemplate();
              break;
            case "export_to_excel":
              this._arciService.exportToExcel();
              break;
            case "search":
              // this.searchARCI(SubMenuItemStore.searchText);
              ArciStore.searchText = SubMenuItemStore.searchText;
              this.pageChange(1);
              break;
            case "refresh":
              SubMenuItemStore.searchText = '';
              ArciStore.searchText = '';
              this.ArciStore.loaded = false;
              this.pageChange(1);
              break;
            case "import":
              ImportItemStore.setTitle('import_arci_title');
              ImportItemStore.setImportFlag(true);
              break;
            default:
              break;
          }
  
          // Don't forget to unset clicked item immediately after using it
          SubMenuItemStore.unSetClickedSubMenuItem();
        }
        if(NoDataItemStore.clikedNoDataItem){
          this.addArci();
          NoDataItemStore.unSetClickedNoDataItem();
        }
        if(ImportItemStore.importClicked){
          ImportItemStore.importClicked = false;
          this._arciService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setTitle('');
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
            this._utilityService.detectChanges(this._cdr);
          },(error)=>{
            if(error.status == 422){
              ImportItemStore.processFormErrors(error.error.errors);
            }
            else if(error.status == 500 || error.status == 403){
              ImportItemStore.unsetFileDetails();
              ImportItemStore.setImportFlag(false);
              $('.modal-backdrop').remove();
            }
            this._utilityService.detectChanges(this._cdr);
          })
        }
      })
  
      this.arciMatrixSubscriptionEvent = this._eventEmitterService.arciMatrixModal.subscribe(res=>{
        this.closeFormModal();
      })
    
      this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.deleteARCI(item);
      })

      this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
        if(!status){
          if($(this.formModal.nativeElement).hasClass('show')){
            this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
            this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
          } 
        }
      })
      
    
      this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
        if(!status){
          if($(this.formModal.nativeElement).hasClass('show')){
            this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
            this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
          }     
        }
      })
    
      SubMenuItemStore.setNoUserTab(true);
      // SubMenuItemStore.setSubMenuItems([
      //   { type: 'search' },
      //   { type: 'new_modal' },
      //   { type: 'template' },
      //   { type: 'export_to_excel' },
      // ]);
      RightSidebarLayoutStore.filterPageTag = 'arci';
      this._rightSidebarFilterService.setFiltersForCurrentPage([
        'organization_ids',
        'division_ids',
        'section_ids',
        'sub_section_ids',
        'department_ids',
        'process_group_ids',
        'process_category_ids',
        'risk_rating_ids',
        'accountable_user_ids',
        'responsible_user_ids',
        'consulted_user_ids',
        'informed_user_ids',
        'status',
      ]);
  
    this.pageChange(1);

    setTimeout(() => {

      window.addEventListener('click',this.clickEvent,false)
      
    }, 1000);

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);


  }

  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, 
      border: false, 
      imageAlign: type,
      height: true,
      width: true
    }
    return noDataSource;
  }

  addArci(){
    this.arciMatrixObject.type = 'Add';
    this.arciMatrixObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  clickEvent = (event: any): void => {
    this.activeIndex = null;
    this.hover = false;
    this.popupActive = false;
    this._utilityService.detectChanges(this._cdr)
  }


  mouseOut(event) {
    this.activeIndex = null;
    this.responsibleActiveIndex = null;
    this.consultedActiveIndex = null;
    this.informedActiveIndex = null;
    this.hover = false;
    if (this.popup) {
      this._renderer2.setStyle(this.popup.nativeElement, 'display', 'none');
    }

  }

  mouseHover(event, index, type, indexMain) {
    this.popupActive = true;
    this.activeIndex = indexMain;
    switch (type) {
      case 'accountable':
        if (this.accountableActiveIndex >= 0 && this.accountableActiveIndex == index) {
        this.accountableActiveIndex = null;
        this.hover = false;
      }
      else {
        this.accountableActiveIndex = index;
        this.hover = true;
        if (this.popup) {
          this._renderer2.setStyle(this.popup.nativeElement, 'display', 'block');
        }
      }
        this.responsibleActiveIndex = null;
        this.consultedActiveIndex = null;
        this.informedActiveIndex = null;
        break;
      case 'responsible': if (this.responsibleActiveIndex >= 0 && this.consultedActiveIndex == index) {
        this.responsibleActiveIndex = null;
        this.hover = false;
      }
      else {
        this.responsibleActiveIndex = index;
        this.hover = true;
        if (this.popup) {
          this._renderer2.setStyle(this.popup.nativeElement, 'display', 'block');
        }
      }
        this.accountableActiveIndex = null;
        this.consultedActiveIndex = null;
        this.informedActiveIndex = null;
        break;
      case 'consulted': if (this.consultedActiveIndex >= 0 && this.consultedActiveIndex == index) {
        this.consultedActiveIndex = null;
        this.hover = false;
      }
      else {
        this.consultedActiveIndex = index;
        this.hover = true;
        if (this.popup) {
          this._renderer2.setStyle(this.popup.nativeElement, 'display', 'block');
        }
      }
        this.responsibleActiveIndex = null;
        this.accountableActiveIndex = null;
        this.informedActiveIndex = null;
        break;
      case 'informed': if (this.informedActiveIndex >= 0 && this.informedActiveIndex == index) {
        this.informedActiveIndex = null;
        this.hover = false;
      }
      else {
        this.informedActiveIndex = index;
        this.hover = true;
        if (this.popup) {
          this._renderer2.setStyle(this.popup.nativeElement, 'display', 'block');
        }
      }
        this.responsibleActiveIndex = null;
        this.consultedActiveIndex = null;
        this.accountableActiveIndex = null;
        break;
    }
  }

  createPreviewUrl(token) {
    return this._prcoessService.getThumbnailPreview(token);
  }
    // Returns default image url
    getDefaultImage(type){
      return this._imageService.getDefaultImageUrl(type);
    }
  
    gotoUserDetails(userDetails){
      this._route.navigateByUrl('/human-capital/users/'+userDetails.id);
    }
  

  pageChange(newPage: number = null) {
    if (newPage) ArciStore.setCurrentPage(newPage);
    this._arciService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // Sub-Menu Search 
   searchARCI(term) {
    this._arciService.getItems(true,`?q=${term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
   }
  
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.arciMatrixObject.type = null;
  }



  getARCI(items) {

    event.stopPropagation()
    
  
    this._arciService.getItemById(items.process_id).subscribe(res => {
        this.arciMatrixObject.values = {
          process_id: res.process_id,
          title:res.title,
          accountable_user: res.accountable_user ? this.getEditValue(res.accountable_user) : [],
          consulted_user: res.consulted_user ? this.getEditValue(res.consulted_user) : [],
          informed_user: res.informed_user ? this.getEditValue(res.informed_user) : [],
          responsible_user:res.responsible_user?this.getEditValue(res.responsible_user):[]        
        }

        this.arciMatrixObject.type = 'Edit';
        this.openFormModal();
        this._utilityService.detectChanges(this._cdr);
     
     
    })

  }

  gotoProcessDetails(processId) {
    if(!this.popupActive)
    this._router.navigateByUrl("/bpm/process/"+processId);
  }

  


   // Returns Values as Array
   getEditValue(field) {
      var returnValue = [];
      for(let i of field){
          returnValue.push(i);
          }
        return returnValue;
  }
  
   // Delte New Modal

   delete(id: number) {

     event.stopPropagation();
    this.deleteObject.id = id;
    this.deleteObject.type = 'are_you_sure';
    this.deleteObject.title='Delete ARCI?';
    this.deleteObject.subtitle='remove_process_arci_list_subtitle';
   
    $(this.deletePopup.nativeElement).modal('show');

  }

    /**
   * Delete Control
   * @param id -Control id
   */
  deleteARCI(status) {
  
    if (status && this.deleteObject.id) {
     
          this._arciService.delete(this.deleteObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearDeleteObject();
      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
    
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.title='';
    this.deleteObject.subtitle='';

  }

  cancel() {
    this.closeFormModal();
  }
  
  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

    /**
   * Returns Users  Count
   * @param item User Details
   */
  getUsersCount(users, type) {
    
    // var temp: any = JSON.parse(item.service_items_string);
    var temp:any
    switch (type) {
      case 'accountable':
          temp=JSON.parse(users.accountable_user_string)
        break;
      
        case 'responsible':
          temp=JSON.parse(users.responsible_user_string)
        break;
      
        case 'informed':
          temp=JSON.parse(users.informed_user_string)
        break;
      
        case 'consulted':
          temp=JSON.parse(users.consulted_user_string)
        break;
    
      default:
        break;
    }
    return temp.length;
  }

    // Sets view_more for service items
  viewUsers(type, usertype, user) {
    event.stopPropagation();
      if (type == 'more') {     
        switch (usertype) {

          case 'accountable':
            user.view_more_accountable_user = true;
            let tempAccountable: any = JSON.parse(user.accountable_user_string);
            user.accountable_user=tempAccountable
            break;
          
            case 'responsible':
              user.view_more_responsible_user = true;
              let tempResponsible: any = JSON.parse(user.responsible_user_string);
              user.responsible_user=tempResponsible
            break;

            case 'informed':
              user.view_more_informed_user = true;
              let tempInformed: any = JSON.parse(user.informed_user_string);
              user.informed_user=tempInformed
            break;
          
            case 'consulted':
              user.view_more_consulted_user = true;
              let tempConsulted: any = JSON.parse(user.consulted_user_string);
              user.consulted_user=tempConsulted
              break;
        
          default:
            break;
        }

      }
      else {
        switch (usertype) {
          case 'responsible':
            user.view_more_responsible_user = false;
            let tempResponsible: any = JSON.parse(user.responsible_user_string);
               user.responsible_user = tempResponsible.slice(0,9);
            break;
          
            case 'accountable':
               user.view_more_accountable_user = false;
               let tempAccountable: any = JSON.parse(user.accountable_user_string);
               user.accountable_user = tempAccountable.slice(0,2);
            break;
          
            case 'informed':
              user.view_more_informed_user = false;
              let tempInformed: any = JSON.parse(user.informed_user_string);
              user.informed_user = tempInformed.slice(0,9);
            break;
          
            case 'consulted':
              user.view_more_consulted_user = false;
              let tempConsulted: any = JSON.parse(user.consulted_user_string);
              user.consulted_user = tempConsulted.slice(0,9);
           break;
        
          default:
            break;
        }
      }
      this._utilityService.detectChanges(this._cdr);
    }
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    this.arciMatrixSubscriptionEvent.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    SubMenuItemStore.searchText = '';
    ArciStore.searchText = '';
  }

  setARCISort(type) {
    ArciStore.setCurrentPage(1);
    this._arciService.sortARCIList(type,SubMenuItemStore.searchText);
  }

  getPopupDetails(details){
    
    this.userDetailObject.id = details?.id;
    this.userDetailObject.first_name = details?.first_name;
    this.userDetailObject.last_name = details?.last_name;
    this.userDetailObject.designation = details?.designation;
    this.userDetailObject.image_token = details?.image?.token;
    this.userDetailObject.email = details?.email;
    this.userDetailObject.mobile = details?.mobile;
    this.userDetailObject.department = details?.department ? details?.department : null;
    this.userDetailObject.status_id = details?.status_id ? details?.status?.id : 1;

    return this.userDetailObject;
  }
}
