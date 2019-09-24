import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ObjectPreview extends Component {

    constructor(props, context) {
        super(props, context);
    }

    select = () => this.props.onSelect(this.props.object);

    getMainImage = () => {
        const main = this.props.object.images.find((i) => i.is_primary === true);
        return (main !== undefined) ? main : this.props.object.images[0];
    };

    render() {
        return (
            <div
                className={'object'}
                onClick={this.select}
            >
                {this.props.object.images.length &&
                <img
                    className={'object-thumb'}
                    src={this.getMainImage().tiny.url}
                    alt={'img'}
                />
                }
                <div className={'object-title'}>
                    {this.props.object.name}
                </div>
            </div>
        )
    }
}

ObjectPreview.propTypes = {
    object: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired
};


export default ObjectPreview;
