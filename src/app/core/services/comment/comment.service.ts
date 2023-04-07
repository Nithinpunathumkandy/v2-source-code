import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommentStore } from "src/app/stores/comment.store";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private _http: HttpClient) { }

  getItems(params?){

    // Checking if commentGetApi(KH) Listing Api is present and setting it as URL.
    let url = CommentStore.commentApi
    if(CommentStore.commentGetApi) url = CommentStore.commentGetApi
    return this._http.get<any>(url + (params ? params : '')).pipe(
          map((res: any) => {
            CommentStore.setComments(res.comments)
            return res;
          })
        );
  }

  save(item){
    return this._http.post(CommentStore.commentApi+'/comments',item).pipe(map(res=>{
      return res;
    }))
  }

  resolve(id){
    return this._http.put(CommentStore.commentApi+'/comments/'+id+'/resolve',null).pipe(map(res=>{
      return res;
    }))
  }

  archive(id){
    return this._http.put(CommentStore.commentApi+'/comments/'+id+'/archive',null).pipe(map(res=>{
      return res;
    }))
  }

  reopen(id){
    return this._http.put(CommentStore.commentApi+'/comments/'+id+'/reopen',null).pipe(map(res=>{
      return res;
    }))
  }

  delete(id){
    return this._http.delete(CommentStore.commentApi+'/comments/'+id).pipe(map(res=>{
      return res;
    }))
  }
}
