import {
    AtomicBlockUtils,
    EditorState
} from 'draft-js';

import * as types from '../constants';
import {
    getMMFInfos,
    getVideoInfos
} from '../utils/url'


function addEmbedded(editorState, link, infosGetter) {

    const urlType = types.EMBEDDED_TYPE;
    const profileData = infosGetter(link);
    const data = {alignment: "center", ...profileData};

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
        urlType,
        'IMMUTABLE',
        data
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        ' '
    );

    return EditorState.forceSelection(
        newEditorState,
        newEditorState.getCurrentContent().getSelectionAfter()
    );
}


export function addMMFEmbedded(editorState, link) {
    return addEmbedded(editorState, link, getMMFInfos);
}

export function addVideoEmbedded(editorState, link) {
    return addEmbedded(editorState, link, getVideoInfos);
}
