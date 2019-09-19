import {
    AtomicBlockUtils,
    RichUtils,
} from 'draft-js';

import * as types from '../constants';
import {
    //getInfos,
    getMMFInfos,
    getVideoInfos
} from '../utils/url'


function addEmbedded(editorState, {link}, infosGetter) {
    if (RichUtils.getCurrentBlockType(editorState) === types.ATOMIC) {
        return editorState;
    }
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
        types.EMBEDDED_TYPE,
        'IMMUTABLE',
        infosGetter(link)
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    return AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
}


export function addMMFEmbedded(editorState, {link}) {
    return addEmbedded(editorState, {link}, getMMFInfos);
}

export function addVideoEmbedded(editorState, {link}) {
  return addEmbedded(editorState, {link}, getVideoInfos);
}
