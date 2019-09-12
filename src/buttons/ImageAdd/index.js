import React, {Component} from 'react';
import {EditorState} from 'draft-js'

export default class ImageAdd extends Component {

    constructor(props, context) {
        super(props, context);
        this.fileInput = React.createRef();
    }

// Start the popover closed
    state = {
        url: '',
        open: false,
    };

    // When the popover is open and users click anywhere on the page,
    // the popover should close
    componentDidMount() {
        document.addEventListener('click', this.closePopover);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.closePopover);
    }

    // Note: make sure whenever a click happens within the popover it is not closed
    onPopoverClick = () => {
        this.preventNextClose = true;
    };

    openPopover = () => {
        if (!this.state.open) {
            this.preventNextClose = true;
            this.setState({
                open: true,
            });
        }
    };

    closePopover = () => {
        if (!this.preventNextClose && this.state.open) {
            this.setState({
                open: false,
            });
        }

        this.preventNextClose = false;
    };

    addImage = () => {
        const {editorState, onChange} = this.props;
        //onChange(this.props.modifier(editorState, this.state.url));
        onChange(this.props.modifier(EditorState.moveFocusToEnd(editorState), this.state.url));
        this.setState({
            url: '',
            open: false,
        });

    };

    changeUrl = (evt) => {
        this.setState({url: evt.target.value});
    };

    /**
     * Conversion en base64
     * @param e
     */
    onSelectFile = (e) => {
        e.preventDefault();
        console.log(this.fileInput.current.files[0]);

        const file = this.fileInput.current.files[0];
        const reader  = new FileReader();

        reader.addEventListener("load", () => {
            this.setState({url:reader.result});
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    render() {
        const popoverClassName = this.state.open ?
            "addImagePopover" :
            "addImageClosedPopover";
        const buttonClassName = this.state.open ?
            "addImagePressedButton" :
            "addImageButton";

        return (
            <div className="addImage">
                <button
                    className={buttonClassName}
                    onMouseUp={this.openPopover}
                    type="button"
                >
                    📷
                </button>
                <div
                    className={popoverClassName}
                    onClick={this.onPopoverClick}
                >
                    <input
                        type="text"
                        placeholder="Paste the image url …"
                        className="addImageInput"
                        onChange={this.changeUrl}
                        value={this.state.url}
                    />
                    <i className="hr">or upload it</i>
                    <input
                        type="file"
                        className="addImageFileInput"
                        ref={this.fileInput}
                        onChange={this.onSelectFile}
                    />
                    <button
                        className="addImageConfirmButton"
                        type="button"
                        onClick={this.addImage}
                    >
                        Add
                    </button>
                </div>
            </div>
        );
    }
}
