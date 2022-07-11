export interface Istationery{
    Stationery_Name: string;
    Stationery_Quantity: any;
    Stationery_Remark: string;
    Stationery_Description: string;
    Stationery_Status: any;
    UserId: any;
}

export class SingleStationeryData{
    constructor(
    public Stationery_id: number,
    public Stationery_Name: string,
    public Stationery_Quantity: any,
    public Stationery_Remark: string,
    public Stationery_Description: string,
    public Stationery_Status: boolean,
    ){
    }
  }