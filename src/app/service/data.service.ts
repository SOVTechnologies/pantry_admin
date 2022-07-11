import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(private http: HttpClient) {}
  
    getStationeryList(): Observable<any> {
        return this.http.get(
            "http://ozoneapi.laymoek.com/api/v1/Stationery/GetStationeryList"
        );
      }


}