import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentChecklistService } from 'src/app/core/services/knowledge-hub/documents/document-checklist.service';
import { AuditCheckListService } from 'src/app/core/services/masters/internal-audit/audit-check-list/audit-check-list.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { ContentStore } from 'src/app/stores/knowledge-hub/templates/templateContent.store';
import { AuditCheckListMasterStore } from 'src/app/stores/masters/internal-audit/audit-check-list-store';
import { HttpErrorResponse} from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-add-checklist-component',
  templateUrl: './add-checklist-component.component.html',
  styleUrls: ['./add-checklist-component.component.scss']
})
export class AddChecklistComponentComponent implements OnInit {

  @ViewChild('checklistNewPopup', { static: true }) checklistNewPopup: ElementRef;
  @Input('source') CommonChecklistSource: any;
  AuditCheckListStore = AuditCheckListMasterStore;
  checkListArray = [];
  AppStore = AppStore;
  searchTerm;
  newChecklistAddEvent: any;
  form: FormGroup;

  allChecklists: boolean = false;
  checklistEmptyList = "No Checklists To Show";
  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService:HelperServiceService,
    private _auditCheckListService: AuditCheckListService,
    private _documentService: DocumentChecklistService,
    private _documentCheckListService:DocumentChecklistService
  ) { }

    ngOnInit(): void {

      // calling checklist api
      this.pageChange(1);

      if (this.CommonChecklistSource.data && this.CommonChecklistSource.data.length > 0) {
        this.checkListArray = JSON.parse(JSON.stringify(this.CommonChecklistSource.data))
      }
       
  
      this.newChecklistAddEvent = this._eventEmitterService.newChecklistAddModal.subscribe(res => {
        this.closeChild();
      })
    }
  
    pageChange(newPage: number = null) {
      if (newPage) AuditCheckListMasterStore.setCurrentPage(newPage);
      this._auditCheckListService.getItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
        if (AuditCheckListMasterStore.loaded) {
          if (this.checkListArray.length > 0) {
            AuditCheckListMasterStore.allItems.forEach(element => {
              this.checkListArray.forEach(item => {
                if (element.id == item.id) {
                  element['is_enabled'] = true;
                }
              });
            });
          } else {
            this.checkListArray = [];
          }
          this._utilityService.detectChanges(this._cdr);
        }
      });
    }
  

  searchInCheckList(e) {
    AuditCheckListMasterStore.setCurrentPage(1);
    let searchText = e.target.value;
    if (searchText) {
      this._auditCheckListService.getItems(false, `&q=${searchText}`).subscribe(res => {
        if (res.data.length == 0) {
          this.checklistEmptyList = "Your search did not match any objectives. Please make sure you typed the objective name correctly, and then try again.";
        }
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.pageChange();
    }
  }
  
  
    clearSearchBar() {
      this.searchTerm = null;
      this.pageChange();
    }
  
    checkIfPresent(id){
      var pos =  this.checkListArray.findIndex(e=>e.id==id);
      if(pos == -1)
        return false;
      else
        return true;
    }
  
  
  
    selectCheckList(event, checklists, index) {
      
      var pos =  this.checkListArray.findIndex(e=>e.id==checklists.id);
    if(pos == -1)
      this.checkListArray.push(checklists);
    else
      this.checkListArray.splice(pos,1);
    this._utilityService.detectChanges(this._cdr);
    }
  
    checkAll(event) {
      if (event.target.checked) {
        AuditCheckListMasterStore.allItems.forEach(element => {
          element['is_enabled'] = true;
        });
        this.allChecklists = true;
      } else {
        this.allChecklists = false;
        AuditCheckListMasterStore.allItems.forEach(element => {
          element['is_enabled'] = false;
        });
      }
      this.getSelectedChecklists();
  
    }
  
  
    addNewCheckList() {
  
      setTimeout(() => {
        $(this.checklistNewPopup.nativeElement).modal('show');
        this._renderer2.setStyle(this.checklistNewPopup.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
      }, 500);
    }
  
    closeChild() {
      $(this.checklistNewPopup.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);// refresh the data
    }
  
    getSelectedChecklists() {
      if (AuditCheckListMasterStore.allItems.length > 0) {
        for (let i of AuditCheckListMasterStore.allItems) {
          var pos = this.checkListArray.findIndex(e => e.id == i.id);
          if (i['is_enabled'] == true && pos == -1) {
            this.checkListArray.push(i);
          }
          else if (i['is_enabled'] == false && pos != -1) {
            this.checkListArray.splice(pos, 1);
          }
        }
      }
    }
  
    
  
    save(close: boolean = false) {
  
     
      this._documentService.selectRequiredCheckList(this.checkListArray);

      let save;
      AppStore.enableLoading();  

        save=this._documentCheckListService.saveItem(this.setFormData())

            save.subscribe(
              (res: any) => {
                AppStore.disableLoading();
                setTimeout(() => {
                  this._utilityService.detectChanges(this._cdr);
                }, 500);
                if (close) this.cancel();
              },
              (err: HttpErrorResponse) => {
                AppStore.disableLoading();
                  this._utilityService.showErrorMessage(
                    "Error!",
                    "Something went wrong. Please try again."
                  );       
               this._utilityService.detectChanges(this._cdr);
              }
            );
    }
  
    setFormData() {
    var data:any={}

      data.checklist_ids = this._helperService.getArrayProcessed(this.checkListArray,'id');
      data.document_version_id=DocumentsStore.documentVersionId
      data.content_id = this.CommonChecklistSource.content_id

      return data

    
    }
  
    cancel() {
      this._eventEmitterService.dismissAddCheckListModal();
      this.checkListArray = [];
    }
  
    ngOnDestroy() {
  
      this.newChecklistAddEvent.unsubscribe();
      ContentStore.unSelectChecklist();
    }
  
    getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    }


}
