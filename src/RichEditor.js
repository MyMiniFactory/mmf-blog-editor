import React, {Component} from 'react';

// EDITOR
import {EditorState} from 'draft-js';

// PLUGIN MANAGER
import Editor, {composeDecorators}  from 'draft-js-plugins-editor';

// EXPORTS
import {convertToHTML, convertToMarkdown, EditorExporter} from './export';

// Editor CSS
import './editorStyles.css';

// PLUGINS

//Toolbar
import createToolbarPlugin, {Separator} from 'draft-js-static-toolbar-plugin';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';
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

//undo
import createUndoPlugin from 'draft-js-undo-plugin';
import 'draft-js-undo-plugin/lib/plugin.css';

//Linkfy Plugin
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import 'draft-js-linkify-plugin/lib/plugin.css';

// Emoji plugin
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css';

// Images (and block tools)
import createImagePlugin from 'draft-js-image-plugin';
import 'draft-js-image-plugin/lib/plugin.css';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import 'draft-js-alignment-plugin/lib/plugin.css';
import createFocusPlugin from 'draft-js-focus-plugin';
import 'draft-js-focus-plugin/lib/plugin.css';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createDragNDropUploadPlugin from 'draft-js-drag-n-drop-upload-plugin-sahajr';
import mockUpload from './images-tools/mockUpload';
import ImageAdd from "./buttons/ImageAdd";

// Video Plugin
import createEmbeddedPlugin from './lib/draft-js-embedded-plugin/src/createEmbeddedPlugin';
import './lib/draft-js-embedded-plugin/src/plugin.css';
import MMFEmbeddedAdd from './buttons/EmbeddedAdd'
import VideoAdd from './buttons/VideoAdd'

//Toolbar
const linkPlugin = createLinkPlugin();
const ToolbarPlugin = createToolbarPlugin();
const {Toolbar} = ToolbarPlugin;

//undo
const undoPlugin = createUndoPlugin();
const { UndoButton, RedoButton } = undoPlugin;

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
        editorState: EditorState.createEmpty(),
    };

    onChange = (editorState) => {
        this.setState({
            editorState,
        });

        //Export to father component
        if (this.props.exporter !== undefined && this.props.exporter instanceof EditorExporter) {
            this.props.exporter.update(editorState.getCurrentContent());
        }

        if (this.props.onChange !== undefined) this.props.onChange(convertToHTML(editorState.getCurrentContent()));
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
                    <UndoButton />
                    <RedoButton />
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