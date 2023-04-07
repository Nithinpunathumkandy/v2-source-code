import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { map } from 'rxjs/operators';
import {CompetencyMatrix} from 'src/app/core/models/human-capital/competency-matrix/competency-matrix';
import { CompetencyMatrixStore } from 'src/app/stores/human-capital/competency-matrix/competency-matrix.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TrainingMatrixDetailsStore } from 'src/app/stores/human-capital/competency-matrix/training-matrix-details/training-matrix-details-store';
import { TrainingMatrixDetails } from 'src/app/core/models/human-capital/competency-matrix/training-matrix-details/training-matrix-details';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class CompetencyMatrixService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getCompetencyMatrix(id): Observable<CompetencyMatrix> {
    
      return this._http.get<CompetencyMatrix>('/designation/'+id+'/competency-matrices').pipe(
        map((res: CompetencyMatrix) => {
          let noOfUsers = res.user_score.length;
          if(noOfUsers > 0 && noOfUsers < 8){
            let pendingUsers = 8 - noOfUsers;
            for(let i = 0; i< pendingUsers; i++){
              let userEmptyObject = {
                designation: '',
                first_name: '',
                image_token: null,
                last_name: '',
                user_id: null
              }
              let competencyEmptyObject = {
                competency_average_percentage: '',
                competency_group_id: null,
                competency_group_title: '',
                competency_id: null,
                competency_score: null,
                competency_title: '',
                id: null,
                required: null,
                score: null,
                trainings: false
              }
              let userObject = [...[userEmptyObject],...[competencyEmptyObject]]
              res.user_score.push(userObject)
            }
          }
          CompetencyMatrixStore.setCompetencyMatrix(res);
          return res;
        })
      );
    }

    getTrainingMatrixDetails(id,competency_id): Observable<TrainingMatrixDetails> {
    
      return this._http.get<TrainingMatrixDetails>('/users/'+id+'/training-competency/'+competency_id).pipe(
        map((res: TrainingMatrixDetails) => {
  
          TrainingMatrixDetailsStore.setTrainingMatrixDetails(res);
          return res;
        })
      );
    }  

    onAdd(data){
      return this._http.post('/users/trainings/add',data).pipe(
        map((res) => {
          this._utilityService.showSuccessMessage('success','create_success');
          return res;
        })
      );
    }
}
