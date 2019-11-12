import React, {Component} from 'react';
import ObjectSelector from "./ObjectSelector";

import ComponentContext from "../../utils/context";
import {isURL} from "../../utils/url";

export default class EmbeddedAdd extends Component {

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

    addEmbedded = (link) => {
        if(!isURL(link)) return;
        const {editorState, onChange: update} = this.props;
        update(this.props.modifier(editorState, link));
    };

    onAddPress = (e) => this.addEmbedded(this.state.url);

    changeUrl = (evt) => {
        this.setState({url: evt.target.value});
    };

    render() {
        const popoverClassName = this.state.open ?
            "addEmbeddedPopover" :
            "addEmbeddedClosedPopover";
        const buttonClassName = this.state.open ?
            "addEmbeddedPressedButton" :
            "addEmbeddedButton";

        return (
            <div className="addEmbedded">
                <button
                    className={buttonClassName}
                    onMouseUp={this.openPopover}
                    type="button"
                >
                    <img src="https://static.myminifactory.com/images/logo_mobile.png" alt="Embedded MMF object"
                         style={{height: '1pc'}}/>
                </button>
                <div
                    className={popoverClassName}
                    onClick={this.onPopoverClick}
                >
                    <input
                        type="text"
                        placeholder={this.context.translation["forms.richeditor.objecturlplaceholder"]}
                        className="addEmbeddedInput"
                        onChange={this.changeUrl}
                        value={this.state.url}
                    />
                    <button
                        className="addEmbeddedConfirmButton"
                        type="button"
                        onClick={this.onAddPress}
                    >
                        {this.context.translation["forms.richeditor.add"]}
                    </button>
                    <i className={'hr'}>{this.context.translation["forms.richeditor.orfindit"]}</i>
                    <ObjectSelector
                        onSelect={(obj => this.addEmbedded(obj.url))}
                        placeholder={this.context.translation["forms.richeditor.objectfinderplaceholder"]}
                    />
                </div>
            </div>
        );
    }
}
