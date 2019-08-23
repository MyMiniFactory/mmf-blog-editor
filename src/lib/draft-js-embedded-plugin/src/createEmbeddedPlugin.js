import React from 'react';
import {addMMFEmbedded, addVideoEmbedded} from './embedded/modifiers/addEmbedded';
import ContextualEmbeddedComponent from './embedded/components/ContextualEmbeddedComponent';
import * as types from './embedded/constants';
import embeddedStyles from './plugin.css';

const defaultTheme = embeddedStyles;

const embeddedPlugin = (config = {}) => {
  const theme = config.theme ? config.theme : defaultTheme;
  let Embedded = config.embeddedComponent || ContextualEmbeddedComponent;
  if (config.decorator) {
    Embedded = config.decorator(Embedded);
  }
  const ThemedEmbedded = (props) =>
    <Embedded {...props} theme={theme} />;
  return {
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === types.ATOMIC) {
        const contentState = getEditorState().getCurrentContent();
        const entity = contentState.getEntity(block.getEntityAt(0));
        const type = entity.getType();
        const { src, link, profile } = entity.getData();
        if (type === types.EMBEDDED_TYPE) {
          return {
            component: ThemedEmbedded,
            editable: false,
            props: {
              src,
              link,
              profile
            },
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
