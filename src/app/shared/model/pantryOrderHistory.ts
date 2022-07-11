export class singlePantryOrderHistory {
    constructor (
        public Order_Id: number,
        public MeetingRoom_Id: any,
        public Item_Name: string,
        public Item_Qty: number,
        public Order_Remark: string,
        public Order_Status: number,
        public UserId: any,
    ) {}
}