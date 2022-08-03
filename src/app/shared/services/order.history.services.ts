import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import {tap} from 'rxjs/operators';
@Injectable({providedIn: 'root'})

export class OrderHistoryServices{

    private api_url = "http://ozoneapi.laymoek.com";
    // private api_url = "https://ozoneapi.icicidev.com";
    // "http://ozoneapi.laymoek.com"; 
    // "https://ozoneapi.icicidev.com";
    
    // private STATIONERY_REGISTER_ENDPOINT = "http://ozoneapi.laymoek.com/api/v1/Stationery/AddStationery";
    // private STATIONERY_ORDER_LIST_ENDPOINT = "http://ozoneapi.laymoek.com/api/v1/Stationery/Order/GetStationeryOrderLists";
    private PANTRY_ORDER_LIST_ENDPOINT = this.api_url+"/api/v1/Pantry/Item/Order/GetPantryOrderList";
    private PANTRY_ORDER_LIST_BY_ID = this.api_url+"/api/v1/Pantry/Item/Order/GetPantryOrderByCartId?Cart_Id=";
    private DELIVERED_ORDER_LIST = this.api_url+"/api/v1/Pantry/Item/Order/PantryOrderDelivered";

    private _refreshStationeryList$ = new Subject<void>();

    get refreshStationeryList$(){
      return this._refreshStationeryList$;
    }

    // public headers: HttpHeaders;
    constructor(private http: HttpClient){
        // this.headers = new HttpHeaders({
        //     'Access-Control-Allow-Origin': '*'
        // });
    }

    // public stationeryRegister(data: Istationery):Observable<any>{

    //   let body = "Stationery_Name="+ data.Stationery_Name + "Stationery_Quantity&=" + data.Stationery_Quantity + "Stationery_Remark&=" + data.Stationery_Remark;
    //   console.log(body);
    //     return this.http.post<any>(this.STATIONERY_REGISTER_ENDPOINT, body, {headers: this.headers})
    //     .pipe(map((data:any) => console.log(data)));
    // }

    // public getOrderList(){
    //     return this.http.get(this.STATIONERY_ORDER_LIST_ENDPOINT);
    // }

    public getPantryOrderList(): Observable<any> {
        return this.http.get(this.PANTRY_ORDER_LIST_ENDPOINT);
    }

    public getPantryById(id:any) {
        return this.http.get(this.PANTRY_ORDER_LIST_BY_ID+id);
    }
    public deliveredOrder(data:any): Observable<any>{
        return this.http.post<any>(this.DELIVERED_ORDER_LIST , data)
        .pipe(
            tap(() => {
                this._refreshStationeryList$.next()
            })
        );
    }
}