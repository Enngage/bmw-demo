import { Injectable } from '@angular/core';
import { IDeliveryClient, DeliveryClient} from '@kentico/kontent-delivery';
import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { Author } from '../data/author';
import { Chapter } from '../data/chapter';
import { CourseNew } from '../data/course_new';
import { CustomerPersona } from '../data/customer_persona';
import { Module01a2a1b } from '../data/module_01a2a1b';
import { Training } from '../data/training';

@Injectable({
    providedIn: 'root'
})
export class KontentClientService {


    public readonly deliveryClient: IDeliveryClient;

    constructor(){
        this.deliveryClient = new DeliveryClient({
            projectId: '2542ce4a-3be3-01e8-fdf0-ce1b87b58f11',
            typeResolvers: [
                {
                    type: 'author',
                    resolve: (data) => new Author()
                },
                {
                    type: 'chapter',
                    resolve: (data) => new Chapter()
                },
                {
                    type: 'course_new',
                    resolve: (data) => new CourseNew()
                },
                {
                    type: 'customer_persona',
                    resolve: (data) => new CustomerPersona()
                },
                {
                    type: 'module_01a2a1b',
                    resolve: (data) => new Module01a2a1b()
                },
                {
                    type: 'training',
                    resolve: (data) => new Training()
                },
            ]
        });
    }

}
