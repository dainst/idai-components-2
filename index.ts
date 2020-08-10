// Model
export {Document} from './src/model/core/document';
export {DocumentId, RevisionId, toResourceId} from './src/model/core/document';
export {NewDocument} from './src/model/core/new-document';
export {Resource} from './src/model/core/resource';
export {NewResource} from './src/model/core/new-resource';
export {Relations} from './src/model/core/relations';
export {relationsEquivalent} from './src/model/core/relations';
export {Action} from './src/model/core/action';

export {FieldDocument} from './src/model/field-document';
export {FieldResource} from './src/model/field-resource';
export {FieldRelations} from './src/model/field-relations';
export {FieldGeometry} from './src/model/field-geometry';

export {FeatureDocument} from './src/model/feature-document';
export {FeatureResource} from './src/model/feature-resource';
export {FeatureRelations} from './src/model/feature-relations';
export {Dating, DatingElement, DatingType} from './src/model/dating';
export {Dimension} from './src/model/dimension';
export {Literature} from './src/model/literature';
export {OptionalRange} from './src/model/optional-range';

export {ImageDocument} from './src/model/image-document';
export {ImageResource} from './src/model/image-resource';
export {ImageRelations} from './src/model/image-relations';
export {ImageGeoreference} from './src/model/image-georeference'
export {NewImageDocument} from './src/model/new-image-document';
export {NewImageResource} from './src/model/new-image-resource';