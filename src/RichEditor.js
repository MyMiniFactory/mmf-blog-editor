import React, {Component} from 'react';

// EDITOR
import {EditorState} from 'draft-js';

// PLUGIN MANAGER
import Editor, {composeDecorators} from 'draft-js-plugins-editor';

// EXPORTS
import {convertToHTML} from './export';

//IMPORTS
import {importFromHTML} from './import'

// Editor CSS
import editorStyles from './editorStyles.scss';

// PLUGINS

//Toolbar
import createToolbarPlugin, {Separator} from 'draft-js-static-toolbar-plugin';
import toolbarPluginStyles from 'draft-js-static-toolbar-plugin/lib/plugin.css';
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton
} from 'draft-js-buttons';
import createLinkPlugin from 'draft-js-anchor-plugin';
import anchorStyles from 'draft-js-anchor-plugin/lib/plugin.css';

//undo
import createUndoPlugin from 'draft-js-undo-plugin';
import undoPluginStyles from 'draft-js-undo-plugin/lib/plugin.css';

//Linkfy Plugin
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import linkifyPluginStyles from 'draft-js-linkify-plugin/lib/plugin.css';

// Emoji plugin
import createEmojiPlugin from 'draft-js-emoji-plugin';
import emojiPluginStyles from 'draft-js-emoji-plugin/lib/plugin.css';

// Images (and block tools)
import createImagePlugin from 'draft-js-image-plugin';
import imagePluginStyles from 'draft-js-image-plugin/lib/plugin.css';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import alignmentPluginStyles from 'draft-js-alignment-plugin/lib/plugin.css';
import createFocusPlugin from 'draft-js-focus-plugin';
import focusPluginStyles from 'draft-js-focus-plugin/lib/plugin.css';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createDragNDropUploadPlugin from 'draft-js-drag-n-drop-upload-plugin-sahajr';
import mockUpload from './images-tools/mockUpload';
import ImageAdd from "./buttons/ImageAdd";

// Video Plugin
import createEmbeddedPlugin from './lib/draft-js-embedded-plugin/src/createEmbeddedPlugin';
import embeddedPluginStyles from './lib/draft-js-embedded-plugin/src/plugin.css';
import MMFEmbeddedAdd from './buttons/EmbeddedAdd';
import VideoAdd from './buttons/VideoAdd';

import customButtonsStyles from './buttons/optionsStyles.scss';

//Toolbar
const linkPlugin = createLinkPlugin();
const ToolbarPlugin = createToolbarPlugin();
const {Toolbar} = ToolbarPlugin;

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
//TODO replace base64 upload with real upload and storage system
const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
    handleUpload: mockUpload,
    addImage: imagePlugin.addImage,
});

// Video Plugin
const embeddedPlugin = createEmbeddedPlugin();


const plugins = [
    linkifyPlugin,
    emojiPlugin,
    ToolbarPlugin,
    undoPlugin,
    linkPlugin,
    dragNDropFileUploadPlugin,
    blockDndPlugin,
    focusPlugin,
    alignmentPlugin,
    resizeablePlugin,
    imagePlugin,
    embeddedPlugin
];


export default class MMFBlogEditor extends Component {

    state = {
        editorState: this.props.body
            ? EditorState.createWithContent(importFromHTML(this.props.body))
            : EditorState.createEmpty(),
    };

    onChange = (editorState) => {
        this.setState({
            editorState,
        });

        //export in HTML
        if (this.props.onChange !== undefined) this.props.onChange(convertToHTML(editorState.getCurrentContent()));
    };

    focus = () => {
        this.editor.focus();
    };


    render() {

        const editorClass = 'editor' + (this.props.useDefaultBorderStyle ? ' editor-default-style' : '');

        return (
            <div className="rich-editor">
                <style type="text/css">{toolbarPluginStyles}</style>
                <style type="text/css">{anchorStyles}</style>
                <style type="text/css">{undoPluginStyles}</style>
                <style type="text/css">{linkifyPluginStyles}</style>
                <style type="text/css">{emojiPluginStyles}</style>
                <style type="text/css">{imagePluginStyles}</style>
                <style type="text/css">{alignmentPluginStyles}</style>
                <style type="text/css">{focusPluginStyles}</style>
                <style type="text/css">{embeddedPluginStyles}</style>
                <style type="text/css">{editorStyles}</style>
                <div className={editorClass}>
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        plugins={plugins}
                        ref={(element) => {
                            this.editor = element;
                        }}
                    />
                    <Toolbar>
                        {
                            // may be use React.Fragment instead of div to improve perfomance after React 16
                            (externalProps) => (
                                <div>
                                    <BoldButton {...externalProps} />
                                    <ItalicButton {...externalProps} />
                                    <UnderlineButton {...externalProps} />
                                    <Separator {...externalProps} />
                                    <HeadlineOneButton {...externalProps} />
                                    <HeadlineTwoButton {...externalProps} />
                                    <HeadlineThreeButton {...externalProps} />
                                    <Separator {...externalProps} />
                                    <UnorderedListButton {...externalProps} />
                                    <OrderedListButton {...externalProps} />
                                    <BlockquoteButton {...externalProps} />
                                    <Separator {...externalProps} />
                                    <linkPlugin.LinkButton {...externalProps} />
                                </div>
                            )
                        }
                    </Toolbar>
                </div>
                <AlignmentTool/>
                <div className="options">
                    <style type="text/css">{customButtonsStyles}</style>
                    <div className="undo-redo"><UndoButton/></div>
                    <div className="undo-redo"><RedoButton/></div>
                    <EmojiSuggestions/>
                    <EmojiSelect/>
                    <ImageAdd
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        modifier={imagePlugin.addImage}
                    />
                    <VideoAdd
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        modifier={embeddedPlugin.addVideoEmbedded}
                    />
                    <MMFEmbeddedAdd
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        modifier={embeddedPlugin.addMMFEmbedded}
                    />
                </div>
            </div>
        );
    }
}