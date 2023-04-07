import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { AuditProgramService } from 'src/app/core/services/internal-audit/audit-program/audit-program.service';
import { AvailableAuditorsService } from 'src/app/core/services/internal-audit/available-auditors/available-auditors.service';
import { KhFileServiceService } from 'src/app/core/services/knowledge-hub/templates/kh-file-service.service';
import { CompetencyService } from 'src/app/core/services/masters/human-capital/competency/competency.service';
import { AuditCategoriesService } from 'src/app/core/services/masters/internal-audit/audit-categories/audit-categories.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';;
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { AuditProgramMasterStore } from 'src/app/stores/internal-audit/audit-program/audit-program-store';
import { AvailableAuditorsStore } from 'src/app/stores/internal-audit/available-auditors/available-auditors-store';
import { CompetencyMasterStore } from 'src/app/stores/masters/human-capital/competency-master.store';
import { AuditCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-categories-store';
import { AuditableItemMasterStore } from 'src/app/stores/internal-audit/auditable-item/auditable-item-store';
import { AuditableItemService } from 'src/app/core/services/internal-audit/auditable-item/auditable-item.service';

@Component({
  selector: 'app-auditor-choose-modal',
  templateUrl: './auditor-choose-modal.component.html',
  styleUrls: ['./auditor-choose-modal.component.scss']
})
export class AuditorChooseModalComponent implements OnInit, OnDestroy {
  @Input('source') AuditorDetails: any;

  AvailableAuditorsStore = AvailableAuditorsStore; 
  AuditProgramMasterStore = AuditProgramMasterStore;
  CompetencyMasterStore = CompetencyMasterStore;
  AuditCategoryStore = AuditCategoryMasterStore;
  AuditableItemMasterStore = AuditableItemMasterStore;
  selectedIndex = null;
  formErrors: any;
  AppStore= AppStore;
  usersArray = [];

  form: FormGroup;
  searchTerm;
  UsersStore = UsersStore;
  allMarked: boolean = false;
  competency_id = [];
  audit_categories_id = [];
  userId;
  auditorsEmptyList = "No Auditors To Show";
  allAuditableItems: boolean = false;
  auditableItemArray = [];
  auditableItemEmptyList = "Looks like we don't have any items added here!";
  constructor(private _cdr: ChangeDetectorRef, 
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _auditprogramService: AuditProgramService,
    private _helperService:HelperServiceService,
    private _competencyService: CompetencyService,
    private _auditCategoryService: AuditCategoriesService,
    private _availableAuditorsService: AvailableAuditorsService,
    private _auditableItemService: AuditableItemService,
    private _khFileService: KhFileServiceService,
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private _utilityService: UtilityService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      audit_program_id:[''],
      user_id: ['',[Validators.required]],
      auditable_item_ids:['']
    })
    // page change event
    this.pageChange();
    this.auditableItems(1);
    this.resetForm();
    this.getCompetency();
    this.getAuditCategory();
    
    if(this.AuditorDetails){
      setTimeout(() => {
        this.checkAuditableItemUpdation()
      }, 500);
    }
  }

  checkAuditableItemUpdation(){
    if(this.AuditorDetails.value){
      let auditableItems = this.AuditorDetails.value.auditable_items;
      this.auditableItemArray = auditableItems;
      auditableItems.forEach(element => {
        for (let i = 0; i < AuditableItemMasterStore.allItems.length; i++) {
          const audit = AuditableItemMasterStore.allItems[i];
          
          if(audit.id == element.id){
            audit['is_enabled'] = true;
          }
        }
      });
      
      this.form.setValue({
        audit_program_id:this.AuditorDetails.value.id,
        user_id:this.AuditorDetails.value.user_id?this.AuditorDetails.value.user_id:'',
        auditable_item_ids:this.processingDataForSave()
      })
      this._utilityService.detectChanges(this._cdr);
    }
  }
  

  auditableItems(newPage: number = null) {
    if (newPage) AuditableItemMasterStore.setCurrentPage(newPage);
    AuditableItemMasterStore.loaded = false;
    let params = `&audit_program_ids=${AuditProgramMasterStore.auditProgramId}`;
    this._auditableItemService.getItems(false,params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchAuditableItems(){
    let params = `&audit_program_ids=${AuditProgramMasterStore.auditProgramId}`;
    if (this.searchTerm) {
      this._auditableItemService.getItems(false,params+`&q=${this.searchTerm}`).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.auditableItems();
    }
  }

  // for checking all checkox
  checkAll(event) {
    if (event.target.checked) {
      AuditableItemMasterStore.allItems.forEach(element => {
        element['is_enabled'] = true;
      });
      this.allAuditableItems = true;
    } else {
      this.allAuditableItems = false;
      AuditableItemMasterStore.allItems.forEach(element => {
        element['is_enabled'] = false;
      });
    }

    this.getSelectedAuditableItem();

  }

  // Auditable Item selecting function
  selectAuditableItemPresent(event, auditableItem, index) {
    var itemCount = 0;
    if (event.target.checked) {
      AuditableItemMasterStore.allItems[index]['is_enabled'] = true;
      AuditableItemMasterStore.allItems.forEach(element => {
        if (element['is_enabled'] == false || !element.hasOwnProperty('is_enabled')) {
          itemCount++;
        }
      });
      if (itemCount == 0) {
        this.allAuditableItems = true;
      } else {
        this.allAuditableItems = false;
      }
    } else {

      AuditableItemMasterStore.allItems[index]['is_enabled'] = false;
      this.allAuditableItems = false;
    }

    this.getSelectedAuditableItem();
  }

  getSelectedAuditableItem() {
    if (AuditableItemMasterStore.allItems.length > 0) {
      for (let i of AuditableItemMasterStore.allItems) {
        var pos = this.auditableItemArray.findIndex(e => e.id == i.id);
        if (i['is_enabled'] == true && pos == -1) {
          this.auditableItemArray.push(i);
        } else if (i['is_enabled'] == false && pos != -1) {
          this.auditableItemArray.splice(pos, 1);
        }
      }
    }
  }

  userChange(){
      this.allAuditableItems = false;
      AuditableItemMasterStore.allItems.forEach(element => {
        element['is_enabled'] = false;
      });
      this.auditableItemArray = [];
  }

  getUsers() {
    
    this._userService
    .getAllItems()
    .subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchUsers(e) {
    this._userService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  pageChange(){
    this._availableAuditorsService.getAllItems(AuditProgramMasterStore.auditProgramId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  getCompetency(){
    this._competencyService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }


  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  searchCompetency(e){
    this._competencyService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAuditCategory(){
    this._auditCategoryService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchAuditCategories(e){
    this._auditCategoryService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  sortAuditors(){

    var params = '';
    if (this.competency_id) params = `&competency_ids=${this.competency_id}`;
    if (this.audit_categories_id) {
      if (params)
        params = params + `&audit_category_ids=${this.audit_categories_id}`;
      else
        params = `&audit_category_ids=${this.audit_categories_id}`;
    }
    this._availableAuditorsService.getAllItems(AuditProgramMasterStore.auditProgramId, params).subscribe(res => {
      if(res.length==0){
        this.auditorsEmptyList = "Your search did not match any auditor profiles. Please make sure the auditor name spelt correctly and try again";
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // searchUers(event){
  //  this.searchTerm = event.term;
  //   if (this.searchTerm) {
  //     this._availableAuditorsService.getAllItems(AuditProgramMasterStore.auditProgramId,`&q=${this.searchTerm}`).subscribe(res => {
  //       if(res.length==0){
  //         this.auditorsEmptyList = "Your search did not match any auditor profiles. Please make sure the auditor name spelt correctly and try again";
  //       }
  //       this._utilityService.detectChanges(this._cdr);
  //     });
  //   } else {
  //     this.pageChange();
  //   }
  // }

  clearSearchBar(){
    this.searchTerm = '';
    this.auditableItems(1)
  }

  
  includeAllAsAudors(e){
    if (e.target.checked) {
    this._auditprogramService.addAllAuditors(AuditProgramMasterStore.auditProgramId,'').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);

      this.cancel();
    })
    }
  }

  processingDataForSave(){
    var userArray = [];
    this.auditableItemArray.forEach(res=>{
      userArray.push(res.id)
    })
    return userArray;
  }

   // save function
   save(close: boolean = false){
     let saveData = {
      "user_id": this.form.value.user_id ? this.form.value.user_id.id : '',
      "auditable_item_ids": this.processingDataForSave(),
     }
    this.formErrors = null;
      let save;
      AppStore.enableLoading();
      if(this.form.value.user_id){
        save = this._auditprogramService.saveAuditors(AuditProgramMasterStore.auditProgramId,saveData);
      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.cancel();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
  }

  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
  }

  createImagePreview(type,token){
    return this._khFileService.getThumbnailPreview(type,token);
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  closeFormModal(){
    this._eventEmitterService.dismissChooseAuditorsModal();
    this.usersArray = [];
    // this.pageChange();
  }

  ngOnDestroy(){
    this.usersArray = [];
    AuditableItemMasterStore.loaded = false;
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
}

