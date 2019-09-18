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
import createStaticToolbarPlugin, {Separator} from 'draft-js-static-toolbar-plugin';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
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

// Video Plugin
import createEmbeddedPlugin from './lib/draft-js-embedded-plugin/src/createEmbeddedPlugin';
import MMFEmbeddedAdd from './buttons/EmbeddedAdd';
import VideoAdd from './buttons/VideoAdd';

// translation
import TransContext from "./utils/translation";

//Toolbar
const linkPlugin = createLinkPlugin({placeholder:"123123"});
const toolbarPlugin = createStaticToolbarPlugin();
const {Toolbar} = toolbarPlugin;
const inlineToolbarPlugin = createInlineToolbarPlugin();
const {InlineToolbar} = inlineToolbarPlugin;

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


const plugins = [
    linkifyPlugin,
    emojiPlugin,
    toolbarPlugin,
    inlineToolbarPlugin,
    undoPlugin,
    linkPlugin,
    blockDndPlugin,
    focusPlugin,
    alignmentPlugin,
    resizeablePlugin,
    imagePlugin,
    embeddedPlugin
];


class MMFBlogEditor extends Component {

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

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    }

    focus = () => {
        this.editor.focus();
    };


    getToolbarButtons() {
        return (externalProps) => (
            <div>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <Separator {...externalProps} />
                <div className={"header-buttons"}>
                <HeadlineOneButton {...externalProps} />
                <HeadlineTwoButton {...externalProps} />
                <HeadlineThreeButton {...externalProps} />
                </div>
                <Separator {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <Separator {...externalProps} />
                <linkPlugin.LinkButton {...externalProps} />
            </div>
        )
    }


    render() {

        const editorClass = 'editor' + (this.props.useDefaultBorderStyle ? ' editor-default-style' : '');

        return (
        <TransContext.Provider value={this.props.translation}>
            <div className="rich-editor">
                <div className={editorClass}>
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        plugins={plugins}
                        ref={(element) => {
                            this.editor = element;
                        }}
                    />
                    <div className={'static-toolbar'}>
                        <Toolbar>
                            {this.getToolbarButtons()}
                        </Toolbar>
                    </div>
                    <div className={'inline-toolbar'}>
                        <InlineToolbar>
                            {this.getToolbarButtons()}
                        </InlineToolbar>
                    </div>
                </div>
                <AlignmentTool/>
                <div className="options">
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
                        apiSearchURL={this.props.apiSearchURL}
                    />
                </div>
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
    translation: PropTypes.object
};

MMFBlogEditor.defaultProps = {
    translation: mock.translation
};

export default MMFBlogEditor;