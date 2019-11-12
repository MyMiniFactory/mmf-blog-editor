import React, {Component} from 'react';
import {EditorState} from 'draft-js';
import Dropzone from 'react-dropzone-uploader'
import ComponentContext from "../../utils/context";
import {isURL} from '../../utils/url'

export default class ImageAdd extends Component {

    static contextType = ComponentContext;

    constructor(props, context) {
        super(props, context);
        this.fileInput = React.createRef();

        this.state = {
            url: '',
            upload_url: '',
            open: false,
        };
    }


    reset = () => {
        if(this.state.resetDZ) this.state.resetDZ();

        this.setState({
            url: '',
            upload_url: '',
            open: false,
            resetDZ: () => {}
        });
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

    addImageByURL = (clickEvent) => {
        clickEvent.preventDefault();
        if(!isURL(this.state.url)) return;
        const {editorState, onChange} = this.props;
        onChange(this.props.modifier(EditorState.moveFocusToEnd(editorState), this.state.url));
        this.reset();
    };

    addImageByDropzone = (clickEvent) => {
        clickEvent.preventDefault();
        const {editorState, onChange} = this.props;
        onChange(this.props.modifier(EditorState.moveFocusToEnd(editorState), this.state.upload_url));
        this.reset();
    };

    changeUrl = (evt) => {
        this.setState({url: evt.target.value});
    };


    handleDZChangeStatus = ({ meta, file, remove }, status) => {
        console.log(status, meta, file);

        if(status === 'done') {
            const reader  = new FileReader();
            console.log('saveFileBlob');
            reader.addEventListener("load", () => {
                console.log('file decoded');
                this.setState({
                    upload_url:reader.result,
                    resetDZ: remove
                });
            }, false);
            if (file) {
                reader.readAsDataURL(file);
            }
        }
    };

    render() {


        // receives array of files that are done uploading when submit button is clicked
        const handleSubmit = (files, allFiles) => {
            console.log(files);
            console.log(allFiles);
        };


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
                        placeholder={this.context.translation["forms.richeditor.imgurlplaceholder"]}
                        className="addImageInput"
                        onChange={this.changeUrl}
                        value={this.state.url}
                    />
                    <button
                        className="addImageConfirmButton"
                        type="button"
                        onClick={this.addImageByURL}
                    >
                        {this.context.translation["forms.richeditor.add"]}
                    </button>
                    <i className="hr">{this.context.translation["forms.richeditor.oruploadit"]}</i>
                    <Dropzone
                        multiple={false}
                        maxFiles={1}
                        onChangeStatus={this.handleDZChangeStatus}
                        inputContent={this.context.translation["forms.richeditor.imgdragndrop"]}
                        inputWithFilesContent={null}
                        onSubmit={handleSubmit}
                        accept="image/*"
                        SubmitButtonComponent={() => (
                            <button
                                className={'img-dropzone-send-btn'}
                                onClick={this.addImageByDropzone}
                            >
                                {this.context["forms.richeditor.send"]}
                            </button>
                        )}
                    />
                </div>
            </div>
        );
    }
}
