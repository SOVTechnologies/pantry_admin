import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MeetingRoomService } from '../../shared/services/meeting.room.service';
import { singleMeetingRoomList } from '../../shared/model/meetingRoom';
import { NgToastService } from "ng-angular-popup";


@Component({
  selector: 'app-meeting-room',
  templateUrl: './meeting-room.component.html',
  styleUrls: ['./meeting-room.component.scss']
})
export class MeetingRoomComponent implements OnInit {

  meetingForm!: FormGroup;
  editmeetingForm! : FormGroup;
  
  closeResult = '';
  meetingList: any;
  meetingListData: any;
  singleMeetingData : any;
  Msg: any;
  success: any;
  meetingListFloors: any;
  sitting: number = 0;
  floor: number = 0;
  floor1: number = 0;
  sitting1: number = 0;
  searchFilter: any;
  public submitted: boolean = false;
  p: number = 1;

  constructor(private fb: FormBuilder, public modalService: NgbModal , private meetingRoomService: MeetingRoomService, private toast: NgToastService) {}

  ngOnInit() {

    this.meetingForm = this.fb.group({
      Meeting_Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern("[A-Za-z\\s-]+$")]],
      Location_Id: ['', [Validators.required]],
      Meeting_Size: ['', [Validators.required, Validators.min(1), Validators.pattern("[0-9\\s-]+$")]],
      Meeting_Floor: ['', [Validators.required, Validators.min(1), Validators.pattern("[0-9\\s-]+$")]],
      Meeting_Description: ['', [Validators.required]]
    });

    this.editmeetingForm = this.fb.group ({
      Meeting_Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern("[A-Za-z\\s-]+$")]],
      Location_Id: ['', [Validators.required]],
      Meeting_Size: ['', [Validators.required, Validators.min(1), Validators.pattern("[0-9\\s-]+$")]],
      Meeting_Floor: ['', [Validators.required, Validators.min(1), Validators.pattern("[0-9\\s-]+$")]],
      Meeting_Description: ['', [Validators.required]]
    })

    this.meetingRoomService.refreshStationeryList$.subscribe(()=>{
      this.getData();
    })

    this.getData();
    this.getMeetingFloors()

  }

  private getData () {
      this.meetingRoomService.meetingList().subscribe((data) => {
      this.meetingList = data;
    });
  }

  private getMeetingFloors(){
    this.meetingRoomService.pantryListMeeting().subscribe((data) => {
      this.meetingListFloors = data;
      // console.log(this.meetingListFloors);
    })
  }
  

  plus(){
    this.sitting = ++this.sitting;
  }
  minus(){
    if(this.sitting != 0){
      this.sitting = --this.sitting;
    }
  }

  plus1(){
    this.sitting1 = ++this.sitting1;
  }
  minus1(){
    if(this.sitting1 != 0){
      this.sitting1 = --this.sitting1;
    }
  }

  plus2(){
    this.floor = ++this.floor;
  }
  minus2(){
    if(this.floor != 0){
      this.floor = --this.floor;
    }
  }

  plus3(){
    this.floor1 = ++this.floor1;
  }
  minus3(){
    if(this.floor1 != 0){
      this.floor1 = --this.floor1;
    }
  }



  open(content: any) {
    this.modalService.open(content, {size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    // this.modalService.open(content, {size: 'xl'},);
  }


  openEdit(contentEdit: any, item: singleMeetingRoomList){

    this.modalService.open(contentEdit, {size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    // console.log(item);
    this.meetingRoomService.meetingLsitByID(item).subscribe(data => {

      // console.log(data);
      this.meetingListData = data;
      this.singleMeetingData = this.meetingListData.MeetingRoomList[0];
      this.editmeetingForm.patchValue(this.singleMeetingData);
      // console.log(this.singleMeetingData);

    })

  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  save(data:any) {
    this.submitted = true;
    if(this.meetingForm.invalid){return;}
    // console.log(data);

    const formData :any = new FormData();
    formData.append('Meeting_Name', this.meetingForm.get('Meeting_Name')?.value);
    formData.append('Meeting_Size' , this.meetingForm.get('Meeting_Size')?.value);
    formData.append('Meeting_Floor' , this.meetingForm.get('Meeting_Floor')?.value);
    formData.append('Location_Id', 3);
    formData.append('Meeting_Description' , this.meetingForm.get('Meeting_Description')?.value);
    formData.append('UserId' , 1);

    this.meetingRoomService.meetingRegister(formData).subscribe((data) => {

      if(data.response.Status == 'Failed'){
        this.Msg = data.response.Msg;
      } else {
        this.success = data.response.Msg;
        this.toast.warning({detail: "Message", summary: data.response.Msg, duration: 5000, position: "br"});
        this.modalService.dismissAll("submit");
        this.meetingForm.reset();
      }

    });

  }


  update(data: any) {
    this.submitted = true;
    if(this.editmeetingForm.invalid){return;}
    // console.log(data);
    let Meeting_ID = this.singleMeetingData.Meeting_Id;

    const formData: any = new FormData();

    formData.append('Meeting_Id', Meeting_ID);
    formData.append('Meeting_Floor', this.editmeetingForm.get('Meeting_Floor')?.value);
    formData.append('Meeting_Name', this.editmeetingForm.get('Meeting_Name')?.value);
    formData.append('Meeting_Size', this.editmeetingForm.get('Meeting_Size')?.value);
    formData.append('Location_Id', 3);
    formData.append('Meeting_Description', this.editmeetingForm.get('Meeting_Description')?.value);
    formData.append('UserId', 1);

    this.meetingRoomService.updateMeeting(formData).subscribe((data) => {

      if(data.response.Status == 'Failed'){
        this.Msg = data.response.Msg;
      } else {
        this.success = data.response.Msg;
        this.toast.warning({detail: "Message", summary: data.response.Msg, duration: 5000, position: "br"});
        this.modalService.dismissAll("submit");
        this.meetingForm.reset();
      }

    });
  }


  remove(element: any, Location_Id: any) {

    let Meeting_Id = element;
    let location_id = Location_Id;

    const formData: any = new FormData();

    formData.append('Meeting_Id', Meeting_Id);
    formData.append('Meeting_Id', location_id);
    formData.append('UserId', 1);

    this.meetingRoomService.deleteMeeting(formData).subscribe((data) =>{

        // console.log('data', data);

        let item = data;

        console.log(item);
        this.toast.warning({detail: 'Message', summary: item.response.Msg, duration: 5000, position: 'br'});

      }

      )

  }

}