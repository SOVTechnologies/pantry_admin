import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PantryService } from '../../shared/services/pantry.service';
import { singlePantryList } from '../../shared/model/pantry'
import { NgToastService } from "ng-angular-popup";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from "rxjs/operators";
import { DatePipe } from '@angular/common';


// interface PantryStatus {
//   value: string;
//   viewValue: string;
// }

@Component({
  selector: 'app-pantry',
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.scss']
})
export class PantryComponent implements OnInit {

  pantryForm!: FormGroup;
  editForm!: FormGroup;
  listData: any;

  inputnumber: number = 0;  
  closeResult = '';

  pantryItemList: any;
  singlePantryData: any;
  pantryData: any;
  Msg: any;
  success: any;
  searchFilter: any;
  quantity: number = 0;
  quantity1: number = 0;
  p: number = 1;
  pantryMasterData: any;
  singlePantryMasterData: any;
  location: any;
  location_id: any;
  location_name: any;
  public submitted: boolean = false;


  constructor(private fb: FormBuilder, public modalService: NgbModal , private pantryService : PantryService, private toast: NgToastService, private http: HttpClient, private datepipe: DatePipe) { }

  private _refreshStationeryList$ = new Subject<void>();

    get refreshStationeryList$(){
      return this._refreshStationeryList$;
    }

  ngOnInit():void {

    this.pantryForm = this.fb.group({
      "Pantry_Id" : [''],
      "Item_Name" : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern("[A-Za-z\\s-]+$")]],
      "Item_Quantity": ['', [Validators.required, Validators.min(1), Validators.pattern("[0-9\\s-]+$")]],
      "Location_Id": [''],
      "Item_Description" : ['', [Validators.required, Validators.maxLength(255)]],
      // "Item_Status": [''],
      // "UserId" : ['']
  
    });

    this.editForm = this.fb.group({
      "Pantry_Id" : [''],
      "Item_Name" : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern("[A-Za-z\\s-]+$")]],
      "Item_Quantity": ['', [Validators.required, Validators.min(1), Validators.pattern("[0-9\\s-]+$")]],
      "Location_Id": [''],
      "Item_Description" : ['', [Validators.required, Validators.maxLength(255)]],
      // "Item_Status": [],
      // "UserId" : []
    });

    let date = new Date();
    let DATE = this.datepipe.transform(date, 'MM/dd/yyyy hh:mm:ss');
    console.log(DATE);

    this.pantryService.refreshStationeryList$.subscribe(()=>{
      this.getData();
    });

    this.refreshStationeryList$.subscribe(() => {
      this.getData();
    })

    this.getData();
    this.getPantryMasterList();

  }

  private getData () {
    this.pantryService.pantryItemList().subscribe((data) => {
      this.pantryItemList = data;
    });
  }

  plus(){
    this.quantity = ++this.quantity;
  }
  minus(){
    if(this.quantity != 0){
      this.quantity = --this.quantity;
    }
  }

  plus1(){
    this.quantity1 = ++this.quantity1;
  }
  minus1(){
    if(this.quantity1 != 0){
      this.quantity1 = --this.quantity1;
    }
  }

  private getPantryMasterList(){
    this.pantryService.getPantryMasterData().subscribe((data: any) => {
      this.pantryMasterData = data;
    })
  }

  selectPantry(e: any){
    e.preventDefault();
    this.pantryService.getPantryMasterDataById(e.target.value).subscribe((data: any) => {
      this.singlePantryMasterData = data;
      // console.log(this.pantryMasterData);
      this.location = this.singlePantryMasterData?.PantryList[0].Location;
      this.location_id = this.singlePantryMasterData?.PantryList[0].Location_Id;
    })
  }


  save(data:any){
    this.submitted = true;
    if(this.pantryForm.invalid){return;}
    // console.log(data);
    let userId = window.sessionStorage.getItem('userName');
    let date = new Date();
    let DATE = this.datepipe.transform(date, 'MM/dd/yyyy hh:mm:ss');
    const formData: any = new FormData();
    formData.append('Item_Name', this.pantryForm.get('Item_Name')?.value);
    formData.append('Item_Description', this.pantryForm.get('Item_Description')?.value);
    formData.append('Item_Quantity', this.pantryForm.get('Item_Quantity')?.value);
    formData.append('Pantry_Id', this.pantryForm.get('Pantry_Id')?.value);
    formData.append('Location_Id', this.pantryForm.get('Location_Id')?.value);
    formData.append('Item_Status', 1);
    formData.append('EntryDate', DATE);
    formData.append('UserId', userId);

    this.pantryService.pantryItemRegister(formData).subscribe((data: any) => {
      if(data.response.Status == 'Failed'){
        this.Msg = data.response.Msg;
      } else {
        // this.success = data.response.Msg;
        this.toast.warning({detail: "Message", summary: 'Pantry Item Added Successfully.', duration: 5000, position: 'br'})
        this.modalService.dismissAll("submit");
        this.pantryForm.reset({
          'Item_Name': '',
          'Item_Description': '',
          'Pantry_Id': '',
          'Location_Id': '',
          'Item_Quantity': 0
        });
      }
    })

  }


  open(content: any) {
    this.modalService.open(content, {size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    // this.modalService.open(content, {size: 'xl'},);
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


  openEdit(contentEdit : any , item : singlePantryList) {

    this.modalService.open(contentEdit, {size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    // console.log(item);
    this.pantryService.pantryItemListByID(item).subscribe(data => {

      // console.log(data);
      this.pantryData = data;
      this.singlePantryData = this.pantryData.PantryItemList[0];
      this.location_name = this.singlePantryData.Location;
      this.editForm.patchValue(this.singlePantryData);
      this.editForm.get('Item_Quantity')?.setValue(0);
      // console.log(this.singlePantryData);

    })

  }


  update(data:any) {
    this.submitted = true;
    if(this.editForm.invalid){return;}
    console.log(data);

    let Item_ID = this.singlePantryData.Item_Id;
    let userId = window.sessionStorage.getItem('userName');
    let date = new Date();
    let DATE = this.datepipe.transform(date, 'MM/dd/yyyy hh:mm:ss');

    const formData: any = new FormData();
    formData.append('Item_Id', Item_ID);
    formData.append('Item_Name', this.editForm.get('Item_Name')?.value);
    formData.append('Item_Quantity', this.editForm.get('Item_Quantity')?.value);
    formData.append('Item_Description', this.editForm.get('Item_Description')?.value);
    formData.append('Pantry_Id', this.editForm.get('Pantry_Id')?.value);
    formData.append('Location_Id', this.editForm.get('Location_Id')?.value);
    formData.append('EntryDate', DATE);
    formData.append('UserId', userId);

    this.pantryService.pantryItemRegister(formData).subscribe((data) => {
      if(data.response.Status == 'Failed'){
        this.Msg = data.response.Msg;
      } else {
        // this.success = data.response.Msg;
        this.toast.warning({detail: "Message", summary: 'Pantry Item Update Successfully.', duration: 5000, position: "br"})
        this.modalService.dismissAll("submit");
        // this.editForm.reset();
      }
    })

  }


  remove(contentDelete: any ,id: any, location_id: any, pantry_id: any, user_id: any) {

    this.modalService.open(contentDelete, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if(result === 'yes'){
        this.deletePantry(id, location_id, pantry_id, user_id);
      }
      console.log(id);
      console.log(location_id);
      console.log(pantry_id);
      console.log(user_id);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  deletePantry(id: any, location_id: any, pantry_id: any, user_id: any){
    let Item_Id = id;
    let Location_Id = location_id;
    let Pantry_Id = pantry_id;
    let UserId = user_id;
    let date = new Date();
    let DATE = this.datepipe.transform(date, 'MM/dd/yyyy hh:mm:ss');

    const params: any = new HttpParams().append('Item_Id', Item_Id).append('UserId', UserId).append('Pantry_Id', Pantry_Id).append('Location_Id', Location_Id);

    this.http.post(`http://ozoneapi.laymoek.com/api/v1/Pantry/Item/DelPantryItem?Item_Id=${Item_Id}&UserId=${UserId}&Pantry_Id=${Pantry_Id}&Location_Id=${Location_Id}&EntryDate=${DATE}`, {params: params}).pipe(
      tap(() => {
        this._refreshStationeryList$.next();
      })
    ).subscribe((item) => {
      console.log(item);
      this.toast.warning({detail: 'Message', summary: 'Pantry Item Delete Successfully.', duration: 5000, position: 'br'});
    })

    // this.http.post(`https://ozoneapi.icicidev.com/api/v1/Pantry/Item/DelPantryItem?Item_Id=${Item_Id}&UserId=${UserId}&Pantry_Id=${Pantry_Id}&Location_Id=${Location_Id}`, {params: params}).pipe(
    //   tap(() => {
    //     this._refreshStationeryList$.next();
    //   })
    // ).subscribe((item) => {
    //   console.log(item);
    //   this.toast.warning({detail: 'Message', summary: 'Pantry Item Delete Successfully.', duration: 5000, position: 'br'});
    // })
  }

}
