export interface Resource {
    id?: string;
    type: string;
    relations: any;
    [propName: string]: any;
}