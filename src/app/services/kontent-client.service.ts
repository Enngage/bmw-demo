import { Injectable } from '@angular/core';
import { IDeliveryClient, DeliveryClient} from '@kentico/kontent-delivery';

@Injectable({
    providedIn: 'root'
})
export class KontentClientService {


    public readonly deliveryClient: IDeliveryClient;

    constructor(){
        this.deliveryClient = new DeliveryClient({
            projectId: '2542ce4a-3be3-01e8-fdf0-ce1b87b58f11'
        });
    }

}
