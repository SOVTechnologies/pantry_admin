import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable , Subject} from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({ providedIn: 'root' })

export class MeetingRoomService {

  // private api_url = "http://ozoneapi.laymoek.com";
  private api_url = "https://ozoneapi.icicidev.com";
    // "http://ozoneapi.laymoek.com"; 
    // "https://ozoneapi.icicidev.com";

  private MEETING_LIST_ENDPOINT = this.api_url+"/api/v1/MeetingRoom/GetMeetingList";
  private MEETING_LIST_BY_ID_ENDPOINT = this.api_url+"/api/v1/MeetingRoom/GetMeetingById?MeetingId=";
  private MEETING_REGISTER_ENDPOINT = this.api_url+"/api/v1/MeetingRoom/AddMeetingRoom";
  private UPDATE_MEETING_ENDPOINT = this.api_url+"/api/v1/MeetingRoom/UpdateMeeting";
  private DELETE_MEETING_ENDPOINT = this.api_url+"/api/v1/MeetingRoom/DelMeeting";
  private PANTRY_LIST_ENDPOINT = this.api_url+"/api/v1/Pantry/GetPantryLists";
  
  private _refreshStationeryList$ = new Subject<void>();

    get refreshStationeryList$(){
      return this._refreshStationeryList$;
    }

  constructor(private http: HttpClient) { }

  public meetingList():Observable<any>{
    return this.http.get(this.MEETING_LIST_ENDPOINT);
  }


  public meetingLsitByID(id:any): Observable<any> {
    return this.http.get(this.MEETING_LIST_BY_ID_ENDPOINT+id);
  }


  public meetingRegister(data:any): Observable<any> {
    return this.http.post(this.MEETING_REGISTER_ENDPOINT , data)
    .pipe(
      tap(() => {
      this._refreshStationeryList$.next()
      })
    );
  }


  public updateMeeting(data:any): Observable<any> {
    return this.http.post<any>(this.UPDATE_MEETING_ENDPOINT , data)
    .pipe(
      tap(() => {
      this._refreshStationeryList$.next()
      })
    );
  }


  public deleteMeeting(data:any): Observable<any> {
    return this.http.post(this.DELETE_MEETING_ENDPOINT , data)
    .pipe(
      tap(() => {
      this._refreshStationeryList$.next()
      })
    );
  }

  public pantryListMeeting() {
    return this.http.get<any>(this.PANTRY_LIST_ENDPOINT);
  }

}
