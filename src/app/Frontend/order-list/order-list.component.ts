import { Component, OnInit } from '@angular/core';
import { OrderHistoryServices } from '../../shared/services/order.history.services'
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { singlePantryOrderHistory } from '../../shared/model/pantryOrderHistory'
import { FormGroup , FormBuilder } from '@angular/forms';
import { NgToastService } from "ng-angular-popup";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  editForm! : FormGroup;
  editOrderForm!: FormGroup;
  orderList : any;
  closeResult = '';
  singleData: any;
  singlestationerydata: any;
  singlepantryorderstatus: any;
  inputnumber: number = 0;
  searchFilter: any;
  p: number = 1;
  pantryOrderList: Array<any> = [];
  delivered: boolean = false;
  process: boolean = false;
  cancel: boolean = false;
  orderStatus: any;
  userId: any;
  employData: any;
  employeName: any;
  isSelected: boolean = true;

  constructor(private fb: FormBuilder ,private orderHistoryService: OrderHistoryServices ,  public modalService: NgbModal, private toast: NgToastService, private datepipe: DatePipe) { }

  ngOnInit() {
    this.editOrderForm = this.fb.group({
      Order_Delivery_Remark: ['']
    });

    this.orderHistoryService.refreshStationeryList$.subscribe(
      () => {
        this.getOrderList();
        window.location.reload();
        }
    )
    this.getOrderList();

  }

  private getOrderList(){
    this.orderHistoryService.getPantryOrderList().subscribe((data: any) => {
      // console.log(data);
      this.orderList = data;
      this.orderList?.PantryOrderList.sort((a: any, b: any) => b.cart_Id - a.cart_Id);
      
      this.orderList?.PantryOrderList.forEach((order: any) => {
        if(this.pantryOrderList.length){
          if(!this.pantryOrderList.find(item => item.cart_Id == order.cart_Id)){
            this.pantryOrderList.push(order);
          }
        }
        else{
          this.pantryOrderList.push(order);
        }
      });
      // console.log(this.pantryOrderList);

    });
  }

  Space(event: any){
    if(event.target.selectionStart === 0 && event.code === "Space"){
      event.preventDefault();
    }
  }


  plus(){
    this.inputnumber = this.inputnumber + 1;
  }
  minus(){
    if(this.inputnumber != 0){
      this.inputnumber = this.inputnumber - 1;
    }
  }


  edit(orderEdit: any, item: singlePantryOrderHistory){
    this.modalService.open(orderEdit, {size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    console.log(item);

    this.orderHistoryService.getPantryById(item).subscribe(data =>{
      this.singleData = data;
      this.singlestationerydata = this.singleData.PantryOrderList;
      // this.editForm.patchValue(this.singlestationerydata);
      // console.log(this.singlestationerydata);
      this.singlepantryorderstatus = this.singleData.PantryOrderList[0];
      this.orderStatus = this.singlepantryorderstatus.Order_Delivery_Remark;
      this.userId = this.singlepantryorderstatus.UserId;

      this.orderHistoryService.getEmployData(this.userId).subscribe((item: any) => {
        this.employData = item?.EmployeesList;
        this.employeName = this.employData[0].Name;
      })


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
  
  // getId(e: any){
  //   const targetIndex = e.target;
  //   const res = targetIndex.options[targetIndex.selectedIndex].dataset.Order_Id;
  //   console.log(res);
  // }

  statusSelect(event: any){
    if(event.target.value == 'Delivered'){
      this.delivered = true;
    }
    else if(event.target.value == 'Process'){
      this.process = true;
    }
    else if(event.target.value == 'Cancel'){
      this.cancel = true;
    }
  }


  update(data: any) {

    // console.log(data);
    if(this.process == true){
      let Cart_Id = this.singlepantryorderstatus.cart_Id;
      let userId = this.singlepantryorderstatus.UserId;
      let date = new Date();
      let DATE = this.datepipe.transform(date, 'MM/dd/yyyy hh:mm:ss');

      const formData: any = new FormData();
      formData.append('Cart_Id', Cart_Id);
      formData.append('Order_Delivery_Remark', this.editOrderForm.get('Order_Delivery_Remark')?.value);
      formData.append('UserId', userId);
      formData.append('EntryDate', DATE);
      
      this.orderHistoryService.deliveredOrder(formData).subscribe((data: any) => { 
        // console.log(data)
          this.toast.warning({detail: "Message", summary: 'Order is in under process.', duration: 5000, position: "br"});

          this.modalService.dismissAll("submit");
          this.editForm.reset({
            'Order_Delivery_Remark': '',
          });
        }

      )
    }
    if(this.delivered == true){
      let Cart_Id = this.singlepantryorderstatus.cart_Id;
      let userId = this.singlepantryorderstatus.UserId;
      let date = new Date();
      let DATE = this.datepipe.transform(date, 'MM/dd/yyyy hh:mm:ss');

      const formData: any = new FormData();
      formData.append('Cart_Id', Cart_Id);
      formData.append('Order_Delivery_Remark', this.editOrderForm.get('Order_Delivery_Remark')?.value);
      formData.append('UserId', userId);
      formData.append('EntryDate', DATE);
      
      this.orderHistoryService.deliveredOrder(formData).subscribe((data: any) => { 
        // console.log(data)
          this.toast.warning({detail: "Message", summary: 'Order is delivered successfully.', duration: 5000, position: "br"});

          this.modalService.dismissAll("submit");
          this.editForm.reset({
            'Order_Delivery_Remark': '',
          });
        }

      )
    }
    if(this.cancel == true){
      let Cart_Id = this.singlepantryorderstatus.cart_Id;
      let userId = this.singlepantryorderstatus.UserId;
      let date = new Date();
      let DATE = this.datepipe.transform(date, 'MM/dd/yyyy hh:mm:ss');

      const formData: any = new FormData();
      formData.append('Cart_Id', Cart_Id);
      formData.append('Order_Delivery_Remark', this.editOrderForm.get('Order_Delivery_Remark')?.value);
      formData.append('UserId', userId);
      formData.append('EntryDate', DATE);
      
      this.orderHistoryService.cancelOrerStatus(formData).subscribe((data: any) => { 
        // console.log(data)
          this.toast.warning({detail: "Message", summary: 'Order is canceled.', duration: 5000, position: "br"});

          this.modalService.dismissAll("submit");
          this.editForm.reset({
            'Order_Delivery_Remark': '',
          });
        }

      )
    }
  }

  view(orderView: any, item: any){
    this.modalService.open(orderView, {size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    console.log(item);

    this.orderHistoryService.getPantryById(item).subscribe(data =>{
      this.singleData = data;
      this.singlestationerydata = this.singleData.PantryOrderList;
      // this.editForm.patchValue(this.singlestationerydata);
      // console.log(this.singlestationerydata);
      this.singlepantryorderstatus = this.singleData.PantryOrderList[0];
      this.userId = this.singlepantryorderstatus.UserId;
      this.orderStatus = this.singlepantryorderstatus.Order_Delivery_Remark;

      this.orderHistoryService.getEmployData(this.userId).subscribe((item: any) => {
        this.employData = item?.EmployeesList;
        this.employeName = this.employData[0].Name;
      })
    })
    
  }

}
