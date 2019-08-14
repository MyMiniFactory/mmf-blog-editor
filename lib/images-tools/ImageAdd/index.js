import React, {Component} from 'react';
import './styles.css';

export default class ImageAdd extends Component {
    // Start the popover closed
    state = {
        url: '',
        open: false,
    };

    addImage = () => {
        const {editorState, onChange} = this.props;
        onChange(this.props.modifier(editorState, this.state.url));
    };

    changeUrl = (evt) => {
        this.setState({url: evt.target.value});
    };

    render() {

        return (
            <div className="addImage">
                <input
                    type="text"
                    placeholder="Paste the image url …"
                    className="addImageInput"
                    onChange={this.changeUrl}
                    value={this.state.url}
                />
                <button
                    className="addImageConfirmButton"
                    type="button"
                    onClick={this.addImage}
                >
                    Add
                </button>
            </div>
        );
    }
}
