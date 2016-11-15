import {TypeDefinition} from './type-definition';
import {FieldDefinition} from './field-definition';

export class IdaiType {
    children: Array<IdaiType>;
    parentType: IdaiType = undefined;
    isAbstract: boolean;
    name: string;
    label: string;
    fields: any[];
    
    constructor (definition: TypeDefinition ) {
        this.name = definition['type'];
        this.label = definition['label'] || this.name;
        this.fields = definition['fields'] || [];
        this.isAbstract = definition['abstract'] || false;
    }

    addChildType(definition: TypeDefinition) {
        if (!this.children) this.children = [];
        var childType:IdaiType = new IdaiType(definition)
        childType.parentType = this;
        this.children.push(childType)
    }
    
    getFieldDefinitions(): FieldDefinition[] {
        if (!this.parentType) {
            return this.fields;
        } else {
            return this.parentType.getFieldDefinitions().concat(this.fields);
        }
    }
}