import React from 'react';

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
import createLinkPlugin from "draft-js-anchor-plugin";

//Index
const toolbarPlugin = createStaticToolbarPlugin();
const {Toolbar: OriginalToolbar} = toolbarPlugin;
const inlineToolbarPlugin = createInlineToolbarPlugin();
const {InlineToolbar: OriginalInlineToolbar} = inlineToolbarPlugin;
const linkPlugin = createLinkPlugin({placeholder: "URL ..."});
const {LinkButton} = linkPlugin;

const getToolbarButtons = () => {
    return (externalProps) => (
        <>
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
            <LinkButton {...externalProps} />
        </>
    );
};

const Toolbar = () => (
    <OriginalToolbar>
        {getToolbarButtons()}
    </OriginalToolbar>
);
const InlineToolbar = () => (
    <OriginalInlineToolbar>
        {getToolbarButtons()}
    </OriginalInlineToolbar>
);

class ExportedToolbar extends React.Component {
    update = () => setTimeout(() => this.forceUpdate(), 50);
    render() {
        return (
            <div onClick={this.update}>
                <OriginalToolbar>
                    {
                        (externalProps) => (
                            <>
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
                            </>
                        )
                    }
                </OriginalToolbar>
            </div>
        )
    }
}

const toolbarModulePlugins = [
    linkPlugin,
    toolbarPlugin,
    inlineToolbarPlugin,
];

export {
    InlineToolbar,
    inlineToolbarPlugin,
    Toolbar,
    ExportedToolbar,
    toolbarPlugin,
    linkPlugin,
    toolbarModulePlugins
};