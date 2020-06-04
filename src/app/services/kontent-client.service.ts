import { Injectable } from '@angular/core';
import { IDeliveryClient, DeliveryClient} from '@kentico/kontent-delivery';
import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { Author } from '../data/author';
import { Chapter } from '../data/chapter';
import { CourseNew } from '../data/course_new';
import { CustomerPersona } from '../data/customer_persona';
import { Module } from '../data/module_01a2a1b';
import { Training } from '../data/training';

@Injectable({
    providedIn: 'root'
})
export class KontentClientService {

    private readonly projectId: string = '2542ce4a-3be3-01e8-fdf0-ce1b87b58f11';
    private readonly previewApiKey: string = 'ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAianRpIjogIjUyNWNmZjdmYTE2YzQ4OGM5NGMyODM2MTFkNTVkNzFlIiwNCiAgImlhdCI6ICIxNTkwOTk5NjQxIiwNCiAgImV4cCI6ICIxOTM2NTk5NjQxIiwNCiAgInByb2plY3RfaWQiOiAiMjU0MmNlNGEzYmUzMDFlOGZkZjBjZTFiODdiNThmMTEiLA0KICAidmVyIjogIjEuMC4wIiwNCiAgImF1ZCI6ICJwcmV2aWV3LmRlbGl2ZXIua2VudGljb2Nsb3VkLmNvbSINCn0.PqIOrYszVxuqej6OlhUFlJ77m9OBh36VFPsDhKtATgo';

    public readonly deliveryClient: IDeliveryClient;

    constructor(){
        this.deliveryClient = new DeliveryClient({
            projectId: this.projectId,
            previewApiKey: this.previewApiKey,
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
                    resolve: (data) => new Module()
                },
                {
                    type: 'training',
                    resolve: (data) => new Training()
                },
            ]
        });
    }

}
