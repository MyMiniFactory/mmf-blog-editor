import React from 'react';
import {addMMFEmbedded, addVideoEmbedded} from './embedded/modifiers/addEmbedded';
import ContextualEmbeddedComponent from './embedded/components/ContextualEmbeddedComponent';
import * as types from './embedded/constants';

const defaultTheme = {};

const embeddedPlugin = (config = {}) => {
    const theme = config.theme ? config.theme : defaultTheme;
    let Embedded = config.embeddedComponent || ContextualEmbeddedComponent;
    if (config.decorator) {
        Embedded = config.decorator(Embedded);
    }
    const ThemedEmbedded = (props) => <Embedded {...props} theme={theme}/>;

    return {
        blockRendererFn: (block, {getEditorState}) => {
            if (block.getType() === types.ATOMIC) {
                const contentState = getEditorState().getCurrentContent();
                const entity = block.getEntityAt(0);
                if (!entity) return null;
                const type = contentState.getEntity(entity).getType();
                if (type === types.EMBEDDED_TYPE) {
                    return {
                        component: ThemedEmbedded,
                        editable: false
                    };
                }
            }

            return null;
        },
        addMMFEmbedded,
        addVideoEmbedded,
        types,
    };
};

export default embeddedPlugin;
