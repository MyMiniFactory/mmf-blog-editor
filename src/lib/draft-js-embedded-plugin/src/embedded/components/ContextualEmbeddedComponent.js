import React from 'react';

//iframe profiles & properties
import {getIframeProperties} from '../utils/iframe-profiles';


class ContextualEmbeddedComponent extends React.Component {


  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {

    console.log({'this.props':this.props});
    console.log({'this.props.src':this.props.blockProps});

    const { src, profile } = this.props.blockProps;
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
  }
}


export default ContextualEmbeddedComponent;
