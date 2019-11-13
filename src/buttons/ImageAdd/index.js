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
            inputUrl: '',
            open: false,
        };
    }


    reset = () => {
        if (this.state.resetDZ) this.state.resetDZ();
        this.setState({
            inputUrl: '',
            open: false,
            resetDZ: () => undefined
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

    /**
     * @param {string|{APIStaticImageResponse}|Event} param
     */
    addImage = (param) => {
        let url = (()=>{
            if (typeof param === "string") return param;
            if (typeof param !== 'object') return null;
            if (param.hasOwnProperty('url')) return param.url;
            if (param instanceof Event) param.preventDefault();
            return this.state.inputUrl;
        })();
        if (!isURL(url)) return;
        const {editorState, onChange} = this.props;
        onChange(this.props.modifier(EditorState.moveFocusToEnd(editorState), url));
        this.reset();
    };

    changeUrl = (evt) => {
        this.setState({inputUrl: evt.target.value});
    };


    getDZUploadParams = ({file, meta}) => {

        const {url} = this.context.apis.staticImage;
        const {
            entityId,
            userName = "unknown-user",
        } = this.context.meta;


        const uniqueID = new Date().toLocaleDateString('en-GB').replace(/\D/g, '');
        const fileName = userName + "_" + uniqueID;

        const body = new FormData();
        body.append('image', file);
        body.append('name', fileName);
        body.append('sizes', JSON.stringify(['resize']));
        body.append('size_returned', 'resize');
        body.append('entity_type', 'post');
        if(entityId) body.append('entity_id', entityId);
        return {
            url,
            header: {
                'Content-Type': 'application/json'
            },
            body
        };
    };

    handleDZChangeStatus = ({xhr, meta, file, cancel, restart, remove}, status) => {
        if (meta.status === 'done') {
            const response = JSON.parse(xhr.responseText);
            if (response.hasOwnProperty('url')) {
                return {meta: {response}};
            } else {
                console.error('An error appen during the upload');
                cancel();
                remove();
            }
        }
    };


    handleDZSubmit = (files, allFiles) => {
        files.map(f => this.addImage(f.meta.response));
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
                        placeholder={this.context.translation["forms.richeditor.imgurlplaceholder"]}
                        className="addImageInput"
                        onChange={this.changeUrl}
                        value={this.state.inputUrl}
                    />
                    <button
                        className="addImageConfirmButton"
                        type="button"
                        onClick={this.addImage}
                    >
                        {this.context.translation["forms.richeditor.add"]}
                    </button>
                    <i className="hr">{this.context.translation["forms.richeditor.oruploadit"]}</i>
                    <Dropzone
                        multiple={false}
                        maxFiles={1}
                        accept="image/*"

                        getUploadParams={this.getDZUploadParams}
                        onChangeStatus={this.handleDZChangeStatus}
                        onSubmit={this.handleDZSubmit}

                        inputContent={this.context.translation["forms.richeditor.imgdragndrop"]}
                        inputWithFilesContent={null}
                        submitButtonContent={this.context.translation["forms.richeditor.add"]}
                    />
                </div>
            </div>
        );
    }
}
