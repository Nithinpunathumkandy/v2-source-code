import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NeedsExpectaion,NeedsExpectaionPaginationResponse,NeedExpectationDetails,NeedExpectationResponse } from 'src/app/core/models/bpm/process/need-expectation'
import { ProcessStore } from '../../../../../stores/bpm/process/processes.store'
import { UtilityService } from 'src/app/shared/services/utility.service';
import {NeedExpectationStore} from 'src/app/stores/bpm/process/need-exp.store'

@Injectable({
  providedIn: 'root'
})
export class NeedExpectationService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  getAllItems(params?:string,stakeHolderId?:number): Observable<NeedExpectationResponse[]> {
    return this._http.get<NeedExpectationResponse[]>('/processes/' +ProcessStore.process_id +'/stakeholders'+ (params ? params : '')).pipe(
      map((res: NeedExpectationResponse[]) => {  
        res.forEach((element,index)=> {
          element['is_accordion_active']=false;
       
          if (stakeHolderId && element.id == stakeHolderId) {
          this.getItemById(stakeHolderId).subscribe(res=>{
            
          });
          element['is_accordion_active'] = true;
        }
        });
      NeedExpectationStore.setNeedExpectation(res);
        return res;
      })
    );
  }

  getItemById(stakeHolderId:number):Observable<NeedExpectationDetails[]>{
    return this._http.get<NeedExpectationDetails[]>('/processes/' + ProcessStore.process_id + '/stakeholders/' + stakeHolderId).pipe(map((res: NeedExpectationDetails[]) => {
      res['is_accordion_active'] = true;
      NeedExpectationStore.setNeedExpDetails(res)
      return res;
    }))
  }

    // Post Request - save new item
    saveItem(processId, item: NeedsExpectaion) {
      return this._http.post('/processes/' +processId +'/stakeholders', item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'new_stakeholder_created');
          // this.getAllItems(null,res['id']).subscribe();
          this.getAllItems().subscribe()
          return res;
        })
      );
    }
  
    delete(processId,id: number) {
      return this._http.delete('/processes/' +processId +'/stakeholders/'+ id).pipe(
        map((res) => {
          this._utilityService.showSuccessMessage(
            'success',
            'stakeholder_deleted'
          );
          this.getAllItems().subscribe();
          return res;
        })
      );
    }
  
  updateItem(processId, id, item: NeedsExpectaion): Observable<any> {
      return this._http.put('/processes/' +processId +'/stakeholders/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'stakeholder_updated');
          this.getAllItems(null,id).subscribe();
          return res;
        })
      );
    }

  
    setStakeHolderType(sType){
      NeedExpectationStore.setStakeHolderType(sType);
    }
  
    getStakeHolderType(){
      return NeedExpectationStore.getSelectedStakeholderType();
    }

  
    addNeedsandExpectations(needs,stakeholder,edit = false){
      return NeedExpectationStore.newNeedsExpectations(needs,stakeholder,edit);
    }
  
    showOrHideNeedsExpectations(pos){
      NeedExpectationStore.showhideNeedsExpectations(pos);
  }
  
  singleNeedsDelete(processId:number,needsId:number) {
    
    return this._http.delete('/processes/' +processId +'/process-need-and-expectations/'+ needsId).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          'success',
          'need_and_expecation_deleted'
        );
        this.getAllItems().subscribe();
        return res;
      })
    );

    }
  
 
  

}
