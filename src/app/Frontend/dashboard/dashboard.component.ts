import { Component, OnInit } from '@angular/core';
import { OrderHistoryServices } from 'src/app/shared/services/order.history.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  orderList: any;
  totalOrderCount: any = 0;
  OrderStatus: any;
  Order_Status_Count: any;
  Order_Array: any = [];
  Order_Status_Count1: any;
  Order_Array1: any = [];
  Order_Process_Count: any = 0;
  Order_Completed_Count: any = 0;
  order_data: any;
  order_array: any = [];
  p: number = 1;

  constructor(private orderHistory: OrderHistoryServices) { }

  ngOnInit(): void {
    this.getOrderList();
  }

  private getOrderList(){
    this.orderHistory.getPantryOrderList().subscribe((data: any) => {
      // console.log(data);
      this.orderList = data;
      this.totalOrderCount = this.orderList.PantryOrderList.length;
    
      this.OrderStatus = this.orderList.PantryOrderList;
      this.OrderStatus.forEach((x: any) => {
        if(x.Order_Delivery_Remark == null){
          this.Order_Status_Count = x.Order_Delivery_Remark;
          this.Order_Array.push(this.Order_Status_Count)
          // console.log(this.Order_Array);
        }
        if(x.Order_Delivery_Remark == "Delivered"){
          this.Order_Status_Count1 = x.Order_Delivery_Remark;
          this.Order_Array1.push(this.Order_Status_Count1)
        }

      })

      this.Order_Process_Count = this.Order_Array.length;
      this.Order_Completed_Count = this.Order_Array1.length;

      this.order_data = this.orderList.PantryOrderList;
      this.order_data.forEach((x: any) => {
        if(x.Order_Delivery_Remark == null){
          this.order_array.push(x);
        }
      })

    
    })
  }  
  

}
