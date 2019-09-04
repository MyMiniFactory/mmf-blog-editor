import React from 'react';

//iframe profiles & properties
import {getIframeProperties} from '../utils/iframe-profiles'

const ContextualEmbeddedComponent = ({
  blockProps,
  className = '',
  style,
  theme,
}) => {
  const { src, profile } = blockProps;
  const iframeProps = getIframeProperties(profile);
  if (src) {
    return (
        <div>
          <iframe
            src={src}
            {...iframeProps}
          />
      </div>
    );
  }

  return (<div className="invalidEmbeddedSrc">invalid source</div>);
};

export default ContextualEmbeddedComponent;
