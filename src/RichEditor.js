import React, {Component, createContext} from 'react';
import PropTypes from 'prop-types';
import mock from "./mock/mock";

// EDITOR
import {EditorState} from 'draft-js';

// PLUGIN MANAGER
import Editor, {composeDecorators} from 'draft-js-plugins-editor';

// EXPORTS
import {convertToHTML} from './export';

//IMPORTS
import {importFromHTML} from './import'

// Editor CSS
//import  './editorStyles.scss';

// PLUGINS

//Toolbar
import {CustomToolbar, CustomInlineToolbar, toolbarModulePlugins} from './toolbars'

//undo
import createUndoPlugin from 'draft-js-undo-plugin';

//Linkfy Plugin
import createLinkifyPlugin from 'draft-js-linkify-plugin';

// Emoji plugin
import createEmojiPlugin from 'draft-js-emoji-plugin';

// Images (and block tools)
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import ImageAdd from "./buttons/ImageAdd";

// Embedded & Video Plugin
import createEmbeddedPlugin from './lib/draft-js-embedded-plugin/src/createEmbeddedPlugin';
import MMFEmbeddedAdd from './buttons/EmbeddedAdd';
import VideoAdd from './buttons/VideoAdd';

// translation
import TransContext from "./utils/translation";

//undo
const undoPlugin = createUndoPlugin();
const {UndoButton, RedoButton} = undoPlugin;

//Linkfy Plugin
const linkifyPlugin = createLinkifyPlugin({
    target: "_blank",
    rel: "external",
});

// Emoji plugin
const emojiPlugin = createEmojiPlugin();
const {EmojiSuggestions, EmojiSelect} = emojiPlugin;

// Images (and block tools)
const alignmentPlugin = createAlignmentPlugin();
const {AlignmentTool} = alignmentPlugin;
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const decorator = composeDecorators(
    resizeablePlugin.decorator,
    alignmentPlugin.decorator,
    focusPlugin.decorator,
    blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({decorator});

// Video Plugin
const embeddedPlugin = createEmbeddedPlugin();


class MMFBlogEditor extends Component {


    constructor(props, context) {
        super(props, context);

        this.state = {
            editorState: this.props.body
                ? EditorState.createWithContent(importFromHTML(this.props.body))
                : EditorState.createEmpty(),
        };
    }

    onChange = (editorState) => {
        this.setState({
            editorState,
        });

        //export in HTML
        if (this.props.onChange !== undefined) this.props.onChange(convertToHTML(editorState.getCurrentContent()));
    };

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    }

    focus = () => {
        this.editor.focus();
    };

    getPlugins = () => {
        let plugins = [
            linkifyPlugin,
            ...toolbarModulePlugins
        ];
        if (this.props.enablePhotos) plugins.push(
            focusPlugin,
            alignmentPlugin,
            resizeablePlugin,
            imagePlugin,
            blockDndPlugin
        );
        if (this.props.enableYT || this.props.enableMMF) plugins.push(embeddedPlugin);
        if (this.props.enableEmoji) plugins.emojiPlugin = plugins.push(emojiPlugin);
        if (this.props.enableUndo) plugins.undoPlugin = plugins.push(undoPlugin);
        return plugins;
    };

    hasOptionEnabled = () => this.props.enablePhotos
        || this.props.enableYT
        || this.props.enableMMF
        || this.props.enableEmoji
        || this.props.enableUndo;


    render() {

        const editorClass = 'editor' + (this.props.useDefaultBorderStyle ? ' editor-default-style' : '');

        return (
            <TransContext.Provider value={this.props.translation}>
                <div className="rich-editor">
                    <div className={editorClass}>
                        <Editor
                            editorState={this.state.editorState}
                            onChange={this.onChange}
                            plugins={this.getPlugins()}
                            ref={(element) => {
                                this.editor = element;
                            }}
                        />
                        <div className={'static-toolbar'}>
                            <CustomToolbar/>
                        </div>
                        <div className={'inline-toolbar'}>
                            <CustomInlineToolbar/>
                        </div>
                    </div>
                    <AlignmentTool/>
                    {this.hasOptionEnabled() &&
                    <div className="options">
                        {this.props.enableUndo && <div className="undo-redo"><UndoButton/></div>}
                        {this.props.enableUndo && <div className="undo-redo"><RedoButton/></div>}
                        {this.props.enableEmoji && <EmojiSuggestions/>}
                        {this.props.enableEmoji && <EmojiSelect/>}
                        {this.props.enablePhotos &&
                        <ImageAdd
                            editorState={this.state.editorState}
                            onChange={this.onChange}
                            modifier={imagePlugin.addImage}
                        />}
                        {this.props.enableYT &&
                        <VideoAdd
                            editorState={this.state.editorState}
                            onChange={this.onChange}
                            modifier={embeddedPlugin.addVideoEmbedded}
                        />}
                        {this.props.enableMMF &&
                        <MMFEmbeddedAdd
                            editorState={this.state.editorState}
                            onChange={this.onChange}
                            modifier={embeddedPlugin.addMMFEmbedded}
                            apiSearchURL={this.props.apiSearchURL}
                        />}
                    </div>}
                </div>
            </TransContext.Provider>
        );
    }
}

MMFBlogEditor.propTypes = {
    onChange: PropTypes.func,
    body: PropTypes.string,
    apiSearchURL: PropTypes.string,
    useDefaultBorderStyle: PropTypes.bool,
    translation: PropTypes.object,

    enablePhotos: PropTypes.bool,
    enableYT: PropTypes.bool,
    enableMMF: PropTypes.bool,
    enableEmoji: PropTypes.bool,
    enableUndo: PropTypes.bool,
};

MMFBlogEditor.defaultProps = {
    useDefaultBorderStyle: false,
    translation: mock.translation,
    apiSearchURL: mock.apiSearchURL,
    body: null,

    enablePhotos: true,
    enableYT: true,
    enableMMF: true,
    enableEmoji: true,
    enableUndo: true
};

export default MMFBlogEditor;