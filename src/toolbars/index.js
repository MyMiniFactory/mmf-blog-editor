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
const {Toolbar} = toolbarPlugin;
const inlineToolbarPlugin = createInlineToolbarPlugin();
const {InlineToolbar} = inlineToolbarPlugin;
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
          {/*<Separator {...externalProps} />*/}
          {/*<LinkButton {...externalProps} />*/}
      </>
  );
};

const CustomToolbar = () => (
    <Toolbar>
        {getToolbarButtons()}
    </Toolbar>
);
const CustomInlineToolbar = () => (
    <InlineToolbar>
        {getToolbarButtons()}
    </InlineToolbar>
);

const toolbarModulePlugins = [
    linkPlugin,
    toolbarPlugin,
    inlineToolbarPlugin,
];

export {
    CustomInlineToolbar,
    inlineToolbarPlugin,
    CustomToolbar,
    toolbarPlugin,
    linkPlugin,
    toolbarModulePlugins
};