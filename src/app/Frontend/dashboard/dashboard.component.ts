import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderHistoryServices } from 'src/app/shared/services/order.history.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  orderList: Array<any> = [];
  totalOrder: Array<any> = [];
  OrderStatus: any;
  Order_Status_Count: any;
  Order_Array: Array<any> = [];
  Order_Status_Count1: any;
  Order_Array1: Array<any> = [];
  OrderDelivered: Array<any> = [];
  order_data: Array<any> = [];
  order_array: Array<any> = [];
  p: number = 1;
  closeResult = '';
  singleData: any;
  singlestationerydata: any;
  singlepantryorderstatus: any;
  OrderList: Array<any> = [];
  userId: any;
  employData: any;
  employeName: any;

  constructor(private orderHistory: OrderHistoryServices, private modalService: NgbModal, private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.getOrderList();
  }

  private getOrderList(){
    this.orderHistory.getPantryOrderList().subscribe((data: any) => {
      // console.log(data);
      this.orderList = data?.PantryOrderList;
      
      this.orderList.forEach((order: any) => {
        if(this.totalOrder.length){
          if(!this.totalOrder.find(item => item.cart_Id == order.cart_Id)){
            this.totalOrder.push(order);
          }
        }else{
          this.totalOrder.push(order);
        }
      })
    
      this.OrderStatus = this.orderList;
      this.OrderStatus.forEach((x: any) => {
        if(x.Order_Delivery_Remark == "Delivered"){
          // this.Order_Status_Count1 = x.Order_Delivery_Remark;
          this.Order_Array1.push(x);
        }

      });
      this.Order_Array1.forEach((order: any) => {
        if(this.OrderDelivered.length){
          if(!this.OrderDelivered.find(item => item.cart_Id == order.cart_Id)){
            this.OrderDelivered.push(order);
          }
        }else{
          this.OrderDelivered.push(order);
        }
      });

      this.order_data = this.orderList;
      this.order_data.forEach((x: any) => {
        if(x.Order_Delivery_Remark == null){
          this.order_array.push(x);
        }
      });
      this.order_array.sort((a: any, b: any) => b.cart_Id - a.cart_Id);

      this.order_array.forEach((order: any) => {
        if(this.OrderList.length){
          if(!this.OrderList.find(item => item.cart_Id == order.cart_Id)){
            this.OrderList.push(order);
          }
        }
        else{
          this.OrderList.push(order);
        }
      })

    
    })
  }  

  view(orderView: any, item: any){
    this.modalService.open(orderView, {size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    // console.log(item);

    this.orderHistory.getPantryById(item).subscribe(data =>{
      this.singleData = data;
      this.singlestationerydata = this.singleData.PantryOrderList;
      // this.editForm.patchValue(this.singlestationerydata);
      // console.log(this.singlestationerydata);
      this.singlepantryorderstatus = this.singleData.PantryOrderList[0];
      this.userId = this.singlepantryorderstatus.UserId;

      this.orderHistory.getEmployData(this.userId).subscribe((item: any) => {
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
  

}
