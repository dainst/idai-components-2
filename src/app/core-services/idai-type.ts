export class IdaiType {
    children: Array<IdaiType>;
    parentType: IdaiType = undefined;
    isAbstract: boolean;
    name: string;
    label: string;
    fields: any[];


    constructor (definition: {} ) {
        this.name = definition['type'];
        this.label = definition['label'] || this.name;
        this.fields = definition['fields'] || [];
        this.isAbstract = definition['abstract'] || false;
    }

    addChildType(type) {
        if (!this.children) this.children = [];
        var childType:IdaiType = new IdaiType(type)
        childType.parentType = this;
        this.children.push(childType)
    }
    
    getFields(): any[] {
        if (!this.parentType) {
            return this.fields;
        } else {
            console.log("Oh parent Fields included");
            return this.fields.concat(this.parentType.getFields());
        }
    }
}