import React, {Component} from 'react';
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
import {Toolbar, InlineToolbar, ExportedToolbar, toolbarModulePlugins} from './toolbars'

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
import SizedImage from "./lib/draft-js-img-component/SizedImage";

// Embedded & Video Plugin
import createEmbeddedPlugin from './lib/embedded-plugin/src/createEmbeddedPlugin';
import MMFEmbeddedAdd from './buttons/EmbeddedAdd';
import VideoAdd from './buttons/VideoAdd';

// component context
import ComponentContext, {createContextValue} from "./utils/context";
const propsKeyToSaveInContext = [
    'translation',
    'apis',
    'meta',
];

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

// Decorators plugins
const alignmentPlugin = createAlignmentPlugin();
const {AlignmentTool} = alignmentPlugin;
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();

const imgDecorator = composeDecorators(
    resizeablePlugin.decorator,
    alignmentPlugin.decorator,
    focusPlugin.decorator,
    blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({decorator: imgDecorator, imageComponent: SizedImage});

// Embedded Plugin
const embedDecorator = composeDecorators(
    //resizeablePlugin.decorator,
    alignmentPlugin.decorator,
    focusPlugin.decorator,
    blockDndPlugin.decorator
);
const embeddedPlugin = createEmbeddedPlugin({decorator: embedDecorator});


class MMFBlogEditor extends Component {


    constructor(props, context) {
        super(props, context);

        this.state = {
            editorState: this.props.body
                ? EditorState.createWithContent(importFromHTML(this.props.body))
                : EditorState.createEmpty(),
            focused: false
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

        const editorClasses = 'editor'
            + (this.props.useDefaultBorderStyle ? ' editor-default-style' : '')
            + (this.state.focused ? ' editor-focused' : '');

        return (
            <ComponentContext.Provider value={createContextValue(this.props, propsKeyToSaveInContext)}>
                <div className="rich-editor">
                    <AlignmentTool/>
                    <div className="editor-interface">
                        <div className={editorClasses}>
                            <Editor
                                editorState={this.state.editorState}
                                onChange={this.onChange}
                                plugins={this.getPlugins()}
                                ref={(element) => {
                                    this.editor = element;
                                }}
                                onFocus={() => this.setState({focused: true})}
                                onBlur={() => this.setState({focused: false})}
                            />
                            {this.props.enableStaticToolbar &&
                            <div className={'static-toolbar'}><Toolbar/></div>}
                            {this.props.enableInlineToolbar &&
                            <div className={'inline-toolbar'}><InlineToolbar/></div>}
                        </div>
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
                            />}
                        </div>}
                    </div>
                </div>
            </ComponentContext.Provider>
        );
    }
}

MMFBlogEditor.propTypes = {
    onChange: PropTypes.func,
    body: PropTypes.string,
    useDefaultBorderStyle: PropTypes.bool,
    apis: PropTypes.object,
    translation: PropTypes.object,
    meta: PropTypes.object,

    enableStaticToolbar: PropTypes.bool,
    enableInlineToolbar: PropTypes.bool,
    enablePhotos: PropTypes.bool,
    enableYT: PropTypes.bool,
    enableMMF: PropTypes.bool,
    enableEmoji: PropTypes.bool,
    enableUndo: PropTypes.bool,
};

MMFBlogEditor.defaultProps = {
    useDefaultBorderStyle: false,
    translation: mock.translation,
    apis: mock.apis,
    body: null,
    meta: mock.meta,

    enableStaticToolbar: true,
    enableInlineToolbar: true,
    enablePhotos: true,
    enableYT: true,
    enableMMF: true,
    enableEmoji: true,
    enableUndo: true
};

export {MMFBlogEditor as default, ExportedToolbar};
