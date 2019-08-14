import React, {Component} from 'react';
import {EditorState} from 'draft-js';
import Editor, {composeDecorators}  from 'draft-js-plugins-editor';

//Plugins

//Toolbar
import createInlineToolbarPlugin, {Separator} from 'draft-js-inline-toolbar-plugin';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
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
import 'draft-js-anchor-plugin/lib/plugin.css';
const linkPlugin = createLinkPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();
const {InlineToolbar} = inlineToolbarPlugin;



//Linkfy Plugin
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import 'draft-js-linkify-plugin/lib/plugin.css';
const linkifyPlugin = createLinkifyPlugin({
    target: "_blank",
    rel: "external",
});


// Emoji plugin
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css';
const emojiPlugin = createEmojiPlugin();
const {EmojiSuggestions, EmojiSelect} = emojiPlugin;






// Images (and block tools)

import createImagePlugin from 'draft-js-image-plugin';
import 'draft-js-image-plugin/lib/plugin.css';

import createAlignmentPlugin from 'draft-js-alignment-plugin';
import 'draft-js-alignment-plugin/lib/plugin.css';
const alignmentPlugin = createAlignmentPlugin();
const {AlignmentTool} = alignmentPlugin;

import createFocusPlugin from 'draft-js-focus-plugin';
import 'draft-js-focus-plugin/lib/plugin.css';
const focusPlugin = createFocusPlugin();


import createResizeablePlugin from 'draft-js-resizeable-plugin';
const resizeablePlugin = createResizeablePlugin();

import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
const blockDndPlugin = createBlockDndPlugin();

const decorator = composeDecorators(
    resizeablePlugin.decorator,
    alignmentPlugin.decorator,
    focusPlugin.decorator,
    blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({decorator});

import createDragNDropUploadPlugin from 'draft-js-drag-n-drop-upload-plugin-sahajr';
import mockUpload from './lib/images-tools/mockUpload';
import ImageAdd from "./lib/images-tools/ImageAdd";
const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
    handleUpload: mockUpload,
    addImage: imagePlugin.addImage,
});





// Editor CSS
import './index.css';


const plugins = [
    linkifyPlugin,
    emojiPlugin,
    inlineToolbarPlugin,
    linkPlugin,
    dragNDropFileUploadPlugin,
    blockDndPlugin,
    focusPlugin,
    alignmentPlugin,
    resizeablePlugin,
    imagePlugin
];






export default class MMFBlogEditor extends Component {

    state = {
        editorState: EditorState.createEmpty(),
    };

    onChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    focus = () => {
        this.editor.focus();
    };

    render() {
        return (
            <div>
                <div className="editor">
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        plugins={plugins}
                        ref={(element) => {
                            this.editor = element;
                        }}
                    />
                    <InlineToolbar>
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
                    </InlineToolbar>
                </div>
                <AlignmentTool/>
                <div className="options">
                    <EmojiSuggestions/>
                    <EmojiSelect/>
                    <ImageAdd
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        modifier={imagePlugin.addImage}
                    />
                </div>
            </div>
        );
    }
}