import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable , Subject } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({ providedIn: 'root' })


export class PantryService {

  // private api_url = "http://ozoneapi.laymoek.com";
  private api_url = "https://ozoneapi.icicidev.com";
    // "http://ozoneapi.laymoek.com"; 
    // "https://ozoneapi.icicidev.com";

  private PANTRY_ITEM_REGISTER_ENDPOINT = this.api_url+"/api/v1/Pantry/Item/AddPantryItem";
  private PANTRY_ITEM_LIST_ENDPOINT = this.api_url+"/api/v1/Pantry/Item/GetPantryItemList";
  private SINGLE_PANTRY_ITEM_LIST_ENDPOINT = this.api_url+"/api/v1/Pantry/Item/GetPantryItemByItemId?Pantry_Item_Id=";
  private UPDATE_ITEM_LIST_ENDPOINT = this.api_url+"/api/v1/Pantry/Item/UpdPantryItem";
  private DELETE_ITEM_LIST_ENDPOINT = this.api_url+"/api/v1/Pantry/Item/DelPantryItem?Item_Id=&UserId=&Pantry_Id=&Location_Id=";

  private GET_PANTRY_MASTER_LIST_ENDPOINT = this.api_url+"/api/v1/Pantry/GetPantryLists";
  private GET_PANTRY_MASTER_LIST_BY_ID_ENDPOINT = this.api_url+"/api/v1/Pantry/GetPantryById?PantryId=";

  private _refreshStationeryList$ = new Subject<void>();

    get refreshStationeryList$(){
      return this._refreshStationeryList$;
    }

  constructor(private http: HttpClient) { 
    // this.headers = new HttpHeaders( { Access-Control-Allow-Origin: * } );
  }


  public pantryItemRegister(data: any): Observable<any> {
    return this.http.post<any>(this.PANTRY_ITEM_REGISTER_ENDPOINT, data)
    .pipe(
      tap(() => {
      this._refreshStationeryList$.next()
      })
    );
  }


  public pantryItemList() {
    return this.http.get<any>(this.PANTRY_ITEM_LIST_ENDPOINT);
  }


  public pantryItemListByID(id: any) {
    return this.http.get(this.SINGLE_PANTRY_ITEM_LIST_ENDPOINT+id);
  }


  public updateItemPantry(data: any) {
    return this.http.post<any>(this.UPDATE_ITEM_LIST_ENDPOINT, data)
    .pipe(
      tap(() => {
      this._refreshStationeryList$.next()
      })
    );
  }


  public deleteItemPantry(data: any) {
    return this.http.post(this.DELETE_ITEM_LIST_ENDPOINT, {params: data})
    .pipe(
      tap(() => {
      this._refreshStationeryList$.next()
      })
    );
  }

  public getPantryMasterData(): Observable<any> {
    return this.http.get(this.GET_PANTRY_MASTER_LIST_ENDPOINT);
  }

  public getPantryMasterDataById(id: any): Observable<any>{
    return this.http.get(this.GET_PANTRY_MASTER_LIST_BY_ID_ENDPOINT+id);
  }

}
