import React, {Component} from 'react';
import ComponentContext from "../../utils/context";
import {isURL} from "../../utils/url";

export default class VideoAdd extends Component {

    static contextType = ComponentContext;

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

    addVideo = () => {
        const {editorState, onChange} = this.props;
        if(!isURL(this.state.url)) return;
        onChange(this.props.modifier(editorState, this.state.url));
    };

    changeUrl = (evt) => {
        this.setState({url: evt.target.value});
    };

    render() {
        const popoverClassName = this.state.open ?
            "addVideoPopover" :
            "addVideoClosedPopover";
        const buttonClassName = this.state.open ?
            "addVideoPressedButton" :
            "addVideoButton";

        return (
            <div className="addVideo">
                <button
                    className={buttonClassName}
                    onMouseUp={this.openPopover}
                    type="button"
                >
                    <img src="https://www.youtube.com/about/static/svgs/icons/brand-resources/YouTube_icon_full-color.svg"/>
                </button>
                <div
                    className={popoverClassName}
                    onClick={this.onPopoverClick}
                >
                    <input
                        type="text"
                        placeholder={this.context.translation["forms.richeditor.youtubeurlplaceholder"]}
                        className="addVideoInput"
                        onChange={this.changeUrl}
                        value={this.state.url}
                    />
                    <button
                        className="addVideoConfirmButton"
                        type="button"
                        onClick={this.addVideo}
                    >
                        {this.context.translation["forms.richeditor.add"]}
                    </button>
                </div>
            </div>
        );
    }
}
