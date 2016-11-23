import {TypeDefinition} from './type-definition';
import {FieldDefinition} from './field-definition';

export class IdaiType {
    children: Array<IdaiType>;
    parentType: IdaiType = undefined;
    isAbstract: boolean;
    name: string;
    label: string;
    private fields: FieldDefinition[];
    
    constructor (definition: TypeDefinition) {
        this.name = definition['type'];
        this.label = definition['label'] || this.name;
        this.fields = definition['fields'] || [];
        this.isAbstract = definition['abstract'] || false;


    }

    private setParentType(parent: IdaiType) {
        this.parentType = parent;
        this.fields = this.parentType.getFieldDefinitions().concat(this.fields);
    }

    public addChildType(definition: TypeDefinition) {
        if (!this.children) this.children = [];
        var childType:IdaiType = new IdaiType(definition)
        childType.setParentType(this);
        this.children.push(childType)
    }

    // public insertFieldAtIndex(field: FieldDefinition, index: number) {
    //     this.fields.splice(index, 0, field);
    // }

    // public moveField(fromIndex: number, toIndex: number) {
    //     this.fields.splice(mandatoryField.index, 0, type.fields.splice(mandatoryFieldFoundAt, 1)[0]);
    //
    // }


    public getFieldDefinitions(): FieldDefinition[] {
        return this.fields;
    }
}