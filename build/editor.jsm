import React, { createContext, Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, RichUtils, AtomicBlockUtils } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import createStaticToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import { BoldButton, ItalicButton, UnderlineButton, HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton, UnorderedListButton, OrderedListButton, BlockquoteButton } from 'draft-js-buttons';
import createLinkPlugin from 'draft-js-anchor-plugin';
import createUndoPlugin from 'draft-js-undo-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import Dropzone from 'react-dropzone-uploader';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

var mock = {
  apiSearchURL: "http://localhost/dev.php/api/v2/search",
  translation: {
    "forms.richeditor.add": "#Add",
    "forms.richeditor.imgurlplaceholder": "#Paste the image url …",
    "forms.richeditor.oruploadit": "#or upload it",
    "forms.richeditor.orfindit": "#or find it",
    "forms.richeditor.imgdragndrop": "#Drag Files or Click to Browse",
    "forms.richeditor.youtubeurlplaceholder": "#Paste the video url …",
    "forms.richeditor.objecturlplaceholder": "#Paste the object url …"
  }
};

const ProfilesList = {
  'MMF': "mmf",
  'VIDEO': "video"
};
const commonStyle = {
  display: 'block',
  margin: '0px auto',
  overflow: 'hidden',
  border: 'none'
};
const mmfIframeProps = {
  "data-profile": ProfilesList.MMF,
  width: 242,
  height: 371,
  style: _objectSpread2({}, commonStyle),
  scrolling: "no",
  allowtransparency: "true"
};
const videoIframeProps = {
  "data-profile": ProfilesList.VIDEO,
  width: 560,
  height: 315,
  style: _objectSpread2({}, commonStyle),
  allowFullScreen: true,
  allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
};
function getIframeProperties(profile, htmlProperties = false) {
  let props;

  switch (profile) {
    case ProfilesList.MMF:
      props = mmfIframeProps;
      break;

    case ProfilesList.VIDEO:
      props = videoIframeProps;
      break;

    default:
      props = {};
      break;
  }

  if (htmlProperties === true) {
    let lowercaseProps = {};

    for (let p in props) {
      lowercaseProps[p.toLowerCase()] = props[p];
    }

    return lowercaseProps;
  }

  return props;
}

var options = {
  entityStyleFn: entity => {
    const entityType = entity.get('type').toLowerCase();

    if (entityType === 'draft-js-embedded-plugin-embedded') {
      const {
        profile,
        src
      } = entity.getData();
      const iframeProps = getIframeProperties(profile, true);

      const {
        style
      } = iframeProps,
            attributes = _objectWithoutProperties(iframeProps, ["style"]);

      attributes.src = src;
      return {
        element: 'iframe',
        style,
        attributes
      };
    }

    if (entityType === 'image') {
      const {
        src,
        width = 40,
        alignment = 'default'
      } = entity.getData();
      const style = {
        width: width + '%'
      };

      if (alignment === 'center') {
        style['display'] = 'block';
        style['margin-left'] = 'auto';
        style['margin-right'] = 'auto';
      } else {
        style['margin'] = 'initial';
      }

      const attributes = {
        src
      };
      return {
        element: 'img',
        style,
        attributes
      };
    }
  }
};

const toHTML = contentState => {
  return stateToHTML(contentState, options);
};

var options$1 = {
  customInlineFn: (element, {
    Style,
    Entity
  }) => {
    /*
    if (element.tagName === 'SPAN' && element.className === 'emphasis') {
        return Style('ITALIC');
    } else if (element.tagName === 'IMG') {
        return Entity('IMAGE', {src: element.getAttribute('src')});
    }
    */
    if (element.tagName === 'IFRAME') {
      let data = {};

      for (let a of element.attributes) {
        data[a.name] = a.value;
      }

      return Entity('IFRAME', data);
    }
  }
};

const HTMLtoState = html => {
  return stateFromHTML(html, options$1);
};

const TransContext = createContext({});

class ImageAdd extends Component {
  constructor(props, context) {
    super(props, context);

    _defineProperty(this, "reset", () => {
      if (this.state.resetDZ) this.state.resetDZ();
      this.setState({
        url: '',
        upload_url: '',
        open: false,
        resetDZ: () => {}
      });
    });

    _defineProperty(this, "onPopoverClick", () => {
      this.preventNextClose = true;
    });

    _defineProperty(this, "openPopover", () => {
      if (!this.state.open) {
        this.preventNextClose = true;
        this.setState({
          open: true
        });
      }
    });

    _defineProperty(this, "closePopover", () => {
      if (!this.preventNextClose && this.state.open) {
        this.setState({
          open: false
        });
      }

      this.preventNextClose = false;
    });

    _defineProperty(this, "addImageByURL", clickEvent => {
      clickEvent.preventDefault();
      const {
        editorState,
        onChange
      } = this.props;
      onChange(this.props.modifier(EditorState.moveFocusToEnd(editorState), this.state.url));
      this.reset();
    });

    _defineProperty(this, "addImageByDropzone", clickEvent => {
      clickEvent.preventDefault();
      const {
        editorState,
        onChange
      } = this.props;
      onChange(this.props.modifier(EditorState.moveFocusToEnd(editorState), this.state.upload_url));
      this.reset();
    });

    _defineProperty(this, "changeUrl", evt => {
      this.setState({
        url: evt.target.value
      });
    });

    _defineProperty(this, "handleDZChangeStatus", ({
      meta,
      file,
      remove
    }, status) => {
      console.log(status, meta, file);

      if (status === 'done') {
        const reader = new FileReader();
        console.log('saveFileBlob');
        reader.addEventListener("load", () => {
          console.log('file decoded');
          this.setState({
            upload_url: reader.result,
            resetDZ: remove
          });
        }, false);

        if (file) {
          reader.readAsDataURL(file);
        }
      }
    });

    this.fileInput = React.createRef();
    this.state = {
      url: '',
      upload_url: '',
      open: false
    };
  }

  // When the popover is open and users click anywhere on the page,
  // the popover should close
  componentDidMount() {
    document.addEventListener('click', this.closePopover);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closePopover);
  } // Note: make sure whenever a click happens within the popover it is not closed


  render() {
    // receives array of files that are done uploading when submit button is clicked
    const handleSubmit = (files, allFiles) => {
      console.log(files);
      console.log(allFiles);
    };

    const popoverClassName = this.state.open ? "addImagePopover" : "addImageClosedPopover";
    const buttonClassName = this.state.open ? "addImagePressedButton" : "addImageButton";
    return React.createElement("div", {
      className: "addImage"
    }, React.createElement("button", {
      className: buttonClassName,
      onMouseUp: this.openPopover,
      type: "button"
    }, "\uD83D\uDCF7"), React.createElement("div", {
      className: popoverClassName,
      onClick: this.onPopoverClick
    }, React.createElement("input", {
      type: "text",
      placeholder: this.context["forms.richeditor.imgurlplaceholder"],
      className: "addImageInput",
      onChange: this.changeUrl,
      value: this.state.url
    }), React.createElement("button", {
      className: "addImageConfirmButton",
      type: "button",
      onClick: this.addImageByURL
    }, this.context["forms.richeditor.add"]), React.createElement("i", {
      className: "hr"
    }, this.context["forms.richeditor.oruploadit"]), React.createElement(Dropzone, {
      multiple: false,
      maxFiles: 1,
      onChangeStatus: this.handleDZChangeStatus,
      inputContent: this.context["forms.richeditor.imgdragndrop"],
      SubmitButtonComponent: () => React.createElement("button", {
        onClick: this.addImageByDropzone
      }, this.context["forms.richeditor.send"]),
      inputWithFilesContent: null,
      onSubmit: handleSubmit,
      accept: "image/*"
    })));
  }

}

_defineProperty(ImageAdd, "contextType", TransContext);

const EMBEDDED_TYPE = 'draft-js-embedded-plugin-embedded';
const ATOMIC = 'atomic';

var types = /*#__PURE__*/Object.freeze({
  EMBEDDED_TYPE: EMBEDDED_TYPE,
  ATOMIC: ATOMIC
});

const YOUTUBEMATCH_URL = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
const VIMEOMATCH_URL = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/; // eslint-disable-line no-useless-escape

const MMFMATCH_URL = /(?:https?:\/\/)?(?:www\.)?(?:myminifactory\.com)?(?:\/object\/3d-print-)(.*)\/?/;
const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/';
const VIMEO_PREFIX = 'https://player.vimeo.com/video/';
const MMF_PREFIX = 'https://www.myminifactory.com/object/card/';
/**
 * @param link
 * @returns {boolean}
 */

function isYoutube(link) {
  return YOUTUBEMATCH_URL.test(link);
}
/**
 * @param link
 * @returns {boolean}
 */

function isVimeo(link) {
  return VIMEOMATCH_URL.test(link);
}
/**
 * @param link
 * @returns {boolean}
 */

function isMMF(link) {
  return MMFMATCH_URL.test(link);
}
/**
 * @param link
 * @returns {{id: string, profile: string, src: string, link: string}}
 */

function getVideoInfos(link) {
  if (isYoutube(link)) {
    return getYoutubeInfos(link);
  }

  if (isVimeo(link)) {
    return getVimeoInfos(link);
  }

  return undefined;
}
/**
 * @param link
 * @returns {{id: string, profile: string, src: string, link: string}}
 */

function getYoutubeInfos(link) {
  const id = link && link.match(YOUTUBEMATCH_URL)[1];
  return {
    profile: ProfilesList.VIDEO,
    id: id,
    src: `${YOUTUBE_PREFIX}${id}`,
    link
  };
}
/**
 * @param link
 * @returns {{id: string, profile: string, src: string, link: string}}
 */

function getVimeoInfos(link) {
  const id = link.match(VIMEOMATCH_URL)[3];
  return {
    profile: ProfilesList.VIDEO,
    id: id,
    src: `${VIMEO_PREFIX}${id}`,
    link
  };
}
/**
 * @param link
 * @returns {{id: string, profile: string, src: string, link: string}}
 */

function getMMFInfos(link) {
  if (isMMF(link)) {
    //TODO ping to see if it exists (not 404)
    const id = link.match(MMFMATCH_URL)[1];
    return {
      profile: ProfilesList.MMF,
      id: id,
      src: `${MMF_PREFIX}${id}`,
      link
    };
  }

  return undefined;
}

function addEmbedded(editorState, {
  link
}, infosGetter) {
  if (RichUtils.getCurrentBlockType(editorState) === ATOMIC) {
    return editorState;
  }

  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(EMBEDDED_TYPE, 'IMMUTABLE', infosGetter(link));
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  return AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
}

function addMMFEmbedded(editorState, {
  link
}) {
  return addEmbedded(editorState, {
    link
  }, getMMFInfos);
}
function addVideoEmbedded(editorState, {
  link
}) {
  return addEmbedded(editorState, {
    link
  }, getVideoInfos);
}

class ContextualEmbeddedComponent extends React.Component {
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    console.log({
      'this.props': this.props
    });
    console.log({
      'this.props.src': this.props.blockProps
    });
    const {
      src,
      profile
    } = this.props.blockProps;
    const iframeProps = getIframeProperties(profile);

    if (src) {
      return React.createElement("div", null, React.createElement("iframe", _extends({
        src: src
      }, iframeProps)));
    }

    return React.createElement("div", {
      className: "invalidEmbeddedSrc"
    }, "invalid source");
  }

}

const defaultTheme = {};

const embeddedPlugin = (config = {}) => {
  const theme = config.theme ? config.theme : defaultTheme;
  let Embedded = config.embeddedComponent || ContextualEmbeddedComponent;

  if (config.decorator) {
    Embedded = config.decorator(Embedded);
  }

  const ThemedEmbedded = props => React.createElement(Embedded, _extends({}, props, {
    theme: theme
  }));

  return {
    blockRendererFn: (block, {
      getEditorState
    }) => {
      if (block.getType() === ATOMIC) {
        const contentState = getEditorState().getCurrentContent();
        const entity = block.getEntityAt(0);
        if (!entity) return null;
        const type = contentState.getEntity(entity).getType();
        const {
          src,
          link,
          profile
        } = contentState.getEntity(entity).getData();

        if (type === EMBEDDED_TYPE) {
          return {
            component: ThemedEmbedded,
            editable: false,
            props: {
              src,
              link,
              profile
            }
          };
        }
      }

      return null;
    },
    addMMFEmbedded,
    addVideoEmbedded,
    types
  };
};

class EmbeddedAdd extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      url: '',
      open: false
    });

    _defineProperty(this, "onPopoverClick", () => {
      this.preventNextClose = true;
    });

    _defineProperty(this, "openPopover", () => {
      if (!this.state.open) {
        this.preventNextClose = true;
        this.setState({
          open: true
        });
      }
    });

    _defineProperty(this, "closePopover", () => {
      if (!this.preventNextClose && this.state.open) {
        this.setState({
          open: false
        });
      }

      this.preventNextClose = false;
    });

    _defineProperty(this, "addEmbedded", () => {
      const {
        editorState,
        onChange
      } = this.props;
      onChange(this.props.modifier(editorState, {
        link: this.state.url
      }));
    });

    _defineProperty(this, "changeUrl", evt => {
      this.setState({
        url: evt.target.value
      });
    });
  }

  // When the popover is open and users click anywhere on the page,
  // the popover should close
  componentDidMount() {
    document.addEventListener('click', this.closePopover);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closePopover);
  } // Note: make sure whenever a click happens within the popover it is not closed


  render() {
    const popoverClassName = this.state.open ? "addEmbeddedPopover" : "addEmbeddedClosedPopover";
    const buttonClassName = this.state.open ? "addEmbeddedPressedButton" : "addEmbeddedButton";
    return React.createElement("div", {
      className: "addEmbedded"
    }, React.createElement("button", {
      className: buttonClassName,
      onMouseUp: this.openPopover,
      type: "button"
    }, React.createElement("img", {
      src: "https://static.myminifactory.com/images/logo_mobile.png",
      alt: "Embedded MMF object",
      style: {
        height: '1pc'
      }
    })), React.createElement("div", {
      className: popoverClassName,
      onClick: this.onPopoverClick
    }, React.createElement("input", {
      type: "text",
      placeholder: this.context["forms.richeditor.objecturlplaceholder"],
      className: "addEmbeddedInput",
      onChange: this.changeUrl,
      value: this.state.url
    }), React.createElement("button", {
      className: "addEmbeddedConfirmButton",
      type: "button",
      onClick: this.addEmbedded
    }, this.context["forms.richeditor.add"])));
  }

}

_defineProperty(EmbeddedAdd, "contextType", TransContext);

class VideoAdd extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      url: '',
      open: false
    });

    _defineProperty(this, "onPopoverClick", () => {
      this.preventNextClose = true;
    });

    _defineProperty(this, "openPopover", () => {
      if (!this.state.open) {
        this.preventNextClose = true;
        this.setState({
          open: true
        });
      }
    });

    _defineProperty(this, "closePopover", () => {
      if (!this.preventNextClose && this.state.open) {
        this.setState({
          open: false
        });
      }

      this.preventNextClose = false;
    });

    _defineProperty(this, "addVideo", () => {
      const {
        editorState,
        onChange
      } = this.props;
      onChange(this.props.modifier(editorState, {
        link: this.state.url
      }));
    });

    _defineProperty(this, "changeUrl", evt => {
      this.setState({
        url: evt.target.value
      });
    });
  }

  // When the popover is open and users click anywhere on the page,
  // the popover should close
  componentDidMount() {
    document.addEventListener('click', this.closePopover);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closePopover);
  } // Note: make sure whenever a click happens within the popover it is not closed


  render() {
    const popoverClassName = this.state.open ? "addVideoPopover" : "addVideoClosedPopover";
    const buttonClassName = this.state.open ? "addVideoPressedButton" : "addVideoButton";
    return React.createElement("div", {
      className: "addVideo"
    }, React.createElement("button", {
      className: buttonClassName,
      onMouseUp: this.openPopover,
      type: "button"
    }, React.createElement("img", {
      src: "https://www.youtube.com/about/static/svgs/icons/brand-resources/YouTube_icon_full-color.svg"
    })), React.createElement("div", {
      className: popoverClassName,
      onClick: this.onPopoverClick
    }, React.createElement("input", {
      type: "text",
      placeholder: this.context["forms.richeditor.youtubeurlplaceholder"],
      className: "addVideoInput",
      onChange: this.changeUrl,
      value: this.state.url
    }), React.createElement("button", {
      className: "addVideoConfirmButton",
      type: "button",
      onClick: this.addVideo
    }, this.context["forms.richeditor.add"])));
  }

}

_defineProperty(VideoAdd, "contextType", TransContext);

const linkPlugin = createLinkPlugin({
  placeholder: "123123"
});
const toolbarPlugin = createStaticToolbarPlugin();
const {
  Toolbar
} = toolbarPlugin;
const inlineToolbarPlugin = createInlineToolbarPlugin();
const {
  InlineToolbar
} = inlineToolbarPlugin; //undo

const undoPlugin = createUndoPlugin();
const {
  UndoButton,
  RedoButton
} = undoPlugin; //Linkfy Plugin

const linkifyPlugin = createLinkifyPlugin({
  target: "_blank",
  rel: "external"
}); // Emoji plugin

const emojiPlugin = createEmojiPlugin();
const {
  EmojiSuggestions,
  EmojiSelect
} = emojiPlugin; // Images (and block tools)

const alignmentPlugin = createAlignmentPlugin();
const {
  AlignmentTool
} = alignmentPlugin;
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const decorator = composeDecorators(resizeablePlugin.decorator, alignmentPlugin.decorator, focusPlugin.decorator, blockDndPlugin.decorator);
const imagePlugin = createImagePlugin({
  decorator
}); // Video Plugin

const embeddedPlugin$1 = embeddedPlugin();
const plugins = [linkifyPlugin, emojiPlugin, toolbarPlugin, inlineToolbarPlugin, undoPlugin, linkPlugin, blockDndPlugin, focusPlugin, alignmentPlugin, resizeablePlugin, imagePlugin, embeddedPlugin$1];

class MMFBlogEditor extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      editorState: this.props.body ? EditorState.createWithContent(HTMLtoState(this.props.body)) : EditorState.createEmpty()
    });

    _defineProperty(this, "onChange", editorState => {
      this.setState({
        editorState
      }); //export in HTML

      if (this.props.onChange !== undefined) this.props.onChange(toHTML(editorState.getCurrentContent()));
    });

    _defineProperty(this, "focus", () => {
      this.editor.focus();
    });
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  getToolbarButtons() {
    return externalProps => React.createElement("div", null, React.createElement(BoldButton, externalProps), React.createElement(ItalicButton, externalProps), React.createElement(UnderlineButton, externalProps), React.createElement(Separator, externalProps), React.createElement(HeadlineOneButton, externalProps), React.createElement(HeadlineTwoButton, externalProps), React.createElement(HeadlineThreeButton, externalProps), React.createElement(Separator, externalProps), React.createElement(UnorderedListButton, externalProps), React.createElement(OrderedListButton, externalProps), React.createElement(BlockquoteButton, externalProps), React.createElement(Separator, externalProps), React.createElement(linkPlugin.LinkButton, externalProps));
  }

  render() {
    const editorClass = 'editor' + (this.props.useDefaultBorderStyle ? ' editor-default-style' : '');
    return React.createElement(TransContext.Provider, {
      value: this.props.translation
    }, React.createElement("div", {
      className: "rich-editor"
    }, React.createElement("div", {
      className: editorClass
    }, React.createElement(Editor, {
      editorState: this.state.editorState,
      onChange: this.onChange,
      plugins: plugins,
      ref: element => {
        this.editor = element;
      }
    }), React.createElement("div", {
      className: 'static-toolbar'
    }, React.createElement(Toolbar, null, this.getToolbarButtons())), React.createElement("div", {
      className: 'inline-toolbar'
    }, React.createElement(InlineToolbar, null, this.getToolbarButtons()))), React.createElement(AlignmentTool, null), React.createElement("div", {
      className: "options"
    }, React.createElement("div", {
      className: "undo-redo"
    }, React.createElement(UndoButton, null)), React.createElement("div", {
      className: "undo-redo"
    }, React.createElement(RedoButton, null)), React.createElement(EmojiSuggestions, null), React.createElement(EmojiSelect, null), React.createElement(ImageAdd, {
      editorState: this.state.editorState,
      onChange: this.onChange,
      modifier: imagePlugin.addImage
    }), React.createElement(VideoAdd, {
      editorState: this.state.editorState,
      onChange: this.onChange,
      modifier: embeddedPlugin$1.addVideoEmbedded
    }), React.createElement(EmbeddedAdd, {
      editorState: this.state.editorState,
      onChange: this.onChange,
      modifier: embeddedPlugin$1.addMMFEmbedded
    }))));
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
