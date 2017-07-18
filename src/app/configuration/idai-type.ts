import {TypeDefinition} from './type-definition';
import {FieldDefinition} from './field-definition';

/**
 * @author F.Z.
 */
export class IdaiType {
    children: Array<IdaiType>;
    parentType: IdaiType = undefined;
    isAbstract: boolean;
    name: string;
    label: string;
    color: string;
    private fields: FieldDefinition[];
    
    constructor (definition: TypeDefinition) {
        this.name = definition.type;
        this.label = definition.label || this.name;
        this.fields = definition.fields || [];
        this.isAbstract = definition.abstract || false;
        this.color = definition.color;
    }

    private setParentType(parent: IdaiType) {
        this.parentType = parent;
        this.fields = this.parentType.getFieldDefinitions().concat(this.fields);
    }

    public addChildType(child: IdaiType) {
        if (!this.children) this.children = [];
        child.setParentType(this);
        this.children.push(child)
    }

    public getFieldDefinitions(): FieldDefinition[] {
        return this.fields;
    }
}