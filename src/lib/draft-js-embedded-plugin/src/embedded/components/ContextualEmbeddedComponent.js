import React from 'react';

import {getIframeProperties} from '../utils/iframe-profiles';
import clsx from "clsx";


class ContextualEmbeddedComponent extends React.Component {


  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {

      const {
          block,
          theme = {},
          ...otherProps
      } = this.props;
      // leveraging destructuring to omit certain properties from props
      const {
          blockProps, // eslint-disable-line no-unused-vars
          blockStyleFn, // eslint-disable-line no-unused-vars
          customStyleMap, // eslint-disable-line no-unused-vars
          customStyleFn, // eslint-disable-line no-unused-vars
          decorator, // eslint-disable-line no-unused-vars
          forceSelection, // eslint-disable-line no-unused-vars
          offsetKey, // eslint-disable-line no-unused-vars
          selection, // eslint-disable-line no-unused-vars
          tree, // eslint-disable-line no-unused-vars
          className = '',
          contentState,
          ...elementProps
      } = otherProps;

      const entity = block.getEntityAt(0);
      const {src, profile} = contentState.getEntity(entity).getData();

    const iframeProps = getIframeProperties(profile);

    if (src) {
      return (
          <div
              className={clsx(className, 'mmf-blog-iframe-wrapper')}
              {...elementProps}
          >
            <iframe
                className={'mmf-blog-iframe'}
                src={src}
                {...iframeProps}
            />
              <div className={'mmf-blog-iframe-mask'}/>
          </div>
      );
    }

    return (<div className="invalidEmbeddedSrc">invalid source</div>);
  }
}


export default ContextualEmbeddedComponent;
