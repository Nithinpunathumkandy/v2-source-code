import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input ,ChangeDetectorRef} from '@angular/core';
import { CyberIncidentIaService } from 'src/app/core/services/cyber-incident/cyber-incident-ia/cyber-incident-ia.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { CyberIncidentIAStore } from 'src/app/stores/cyber-incident/cyber-incident-ia-store';
import { CyberIncidentStore } from 'src/app/stores/cyber-incident/cyber-incident-store';

@Component({
  selector: 'app-add-cyber-incident-ia-modal',
  templateUrl: './add-cyber-incident-ia-modal.component.html',
  styleUrls: ['./add-cyber-incident-ia-modal.component.scss']
})
export class AddCyberIncidentIaModalComponent implements OnInit {
  @Input('source') Source: any;
  AppStore=AppStore;
  allCategories=[];
  formErrors:any;
  CyberIncidentStore=CyberIncidentStore;
  CyberIncidentIAStore=CyberIncidentIAStore;
  constructor(
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cyberIncidentIaService:CyberIncidentIaService,
    private _utilityService:UtilityService,
    private _cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    if(this.Source.type=='Add')
    {
      this.getAllCategories();
    }
    else
    {
      this.processAllData()
    }
    
  }
  processAllData()
  {
    for(let i of CyberIncidentIAStore.imapctAnalysis?.data)
    {
      this.allCategories.push({category:{title:i.cyber_incident_impact_analysis_category_title,id:i.cyber_incident_impact_analysis_category_id},money:i.money?i.money:0,time:i.time?i.time:0,performance:i.performance?i.performance:0,error:{performance:'',money:'',time:''}});
      
    }
  }
  getAllCategories()
  {
    this._cyberIncidentIaService.getIACategories().subscribe(res=>{
      //this.allCategories=res.data;
      for(let i of res.data)
      {
        this.allCategories.push({category:i,money:0,time:0,performance:0,error:{performance:'',money:'',time:''}})
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  closeFormModal() {
    this._eventEmitterService.dismissCyberIncidentIAModal();
  }
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  numberOnly(evt): boolean {
    //console.log(evt.target.value);
  var charCode = (evt.which) ? evt.which : evt.keyCode
  if (charCode != 46 && charCode > 31 
    && (charCode < 48 || charCode > 57))
     return false;
  
  return true;
  
  }

  processData()
  {
    let item=[];
    for(let i of this.allCategories)
    {
      item.push({cyber_incident_impact_analysis_category_id:i.category.id,money:i.money?i.money:0,time:i.time?i.time:0,performance:i.performance?i.performance:0})
    }
    return item;
  }
  save(close: boolean = false)
  {
    let save;
    this.clearErrors();
    AppStore.enableLoading();
    save = this._cyberIncidentIaService.saveItem(CyberIncidentStore.incidentId,this.processData());
    save.subscribe((res: any) => {
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.closeFormModal();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.processFormErrors();
       // console.log( this.formErrors.impact_analysis_details)
      } else if(err.status == 500 || err.status == 403){
        this.closeFormModal();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });
  }
  clearErrors()
  {
    for(let i of this.allCategories)
    {
      i.error.performance='';
      i.error.money='';
      i.error.time='';

    }
  }
  processFormErrors(){
    var errors = this.formErrors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
          if(key.includes('impact_analysis_details')){
            let keyValueSplit = key.split('.');
            let errorPosition = keyValueSplit[1];
            let errorkey=keyValueSplit[2];
            if(errorkey=='performance')
            {
              this.allCategories[errorPosition].error.performance=errors[key][0]
            }
            else if(errorkey=='money')
            {
              this.allCategories[errorPosition].error.money=errors[key][0]
            }
            else{
              this.allCategories[errorPosition].error.time=errors[key][0]
            }
            

          }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

}
