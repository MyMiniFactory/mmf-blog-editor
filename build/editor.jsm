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
import clsx from 'clsx';

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
  apiSearchURL: 'https://www.myminifactory.com/api/v2/search',
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

      switch (alignment) {
        case "center":
          style['display'] = 'block';
          style['margin-left'] = 'auto';
          style['margin-right'] = 'auto';
          break;

        case "left":
          style['float'] = 'left';
          break;

        case "right":
          style['float'] = 'right';
          break;

        default:
          style['margin'] = 'initial';
      }

      const attributes = {
        src,
        "data-alignment": alignment
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

const EMBEDDED_TYPE = 'draft-js-embedded-plugin-embedded';
const ATOMIC = 'atomic';

var types = /*#__PURE__*/Object.freeze({
  EMBEDDED_TYPE: EMBEDDED_TYPE,
  ATOMIC: ATOMIC
});

var options$1 = {
  customInlineFn: (element, {
    Style,
    Entity
  }) => {
    if (element.tagName === 'IFRAME') {
      return Entity(EMBEDDED_TYPE, {
        src: element.getAttribute('src'),
        profile: element.dataset.profile
      });
    } else if (element.tagName === 'IMG') {
      let width = (element.style.width || "40") + "%";
      width = width.replace(/%+/, '%');
      return Entity('IMAGE', {
        src: element.getAttribute('src'),
        alignment: element.dataset.alignment,
        width
      });
    }
  }
};

const HTMLtoState = html => {
  return stateFromHTML(html, options$1);
};

const toolbarPlugin = createStaticToolbarPlugin();
const {
  Toolbar: OriginalToolbar
} = toolbarPlugin;
const inlineToolbarPlugin = createInlineToolbarPlugin();
const {
  InlineToolbar: OriginalInlineToolbar
} = inlineToolbarPlugin;
const linkPlugin = createLinkPlugin({
  placeholder: "URL ..."
});
const {
  LinkButton
} = linkPlugin;

const getToolbarButtons = () => {
  return externalProps => React.createElement(React.Fragment, null, React.createElement(BoldButton, externalProps), React.createElement(ItalicButton, externalProps), React.createElement(UnderlineButton, externalProps), React.createElement(Separator, externalProps), React.createElement("div", {
    className: "header-buttons"
  }, React.createElement(HeadlineOneButton, externalProps), React.createElement(HeadlineTwoButton, externalProps), React.createElement(HeadlineThreeButton, externalProps)), React.createElement(Separator, externalProps), React.createElement(UnorderedListButton, externalProps), React.createElement(OrderedListButton, externalProps), React.createElement(BlockquoteButton, externalProps), React.createElement(Separator, externalProps), React.createElement(LinkButton, externalProps));
};

const Toolbar = () => React.createElement(OriginalToolbar, null, getToolbarButtons());

const InlineToolbar = () => React.createElement(OriginalInlineToolbar, null, getToolbarButtons());

class ExportedToolbar extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "update", () => setTimeout(() => this.forceUpdate(), 50));
  }

  render() {
    return React.createElement("div", {
      onClick: this.update
    }, React.createElement(OriginalToolbar, null, externalProps => React.createElement(React.Fragment, null, React.createElement(BoldButton, externalProps), React.createElement(ItalicButton, externalProps), React.createElement(UnderlineButton, externalProps), React.createElement(Separator, externalProps), React.createElement("div", {
      className: "header-buttons"
    }, React.createElement(HeadlineOneButton, externalProps), React.createElement(HeadlineTwoButton, externalProps), React.createElement(HeadlineThreeButton, externalProps)), React.createElement(Separator, externalProps), React.createElement(UnorderedListButton, externalProps), React.createElement(OrderedListButton, externalProps), React.createElement(BlockquoteButton, externalProps))));
  }

}

const toolbarModulePlugins = [linkPlugin, toolbarPlugin, inlineToolbarPlugin];

const TransContext = createContext({});

function isURL(string) {
  try {
    const url = new URL(string);
  } catch (e) {
    if (e instanceof TypeError) return false;else return string.length > 0;
  }

  return true;
}

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
      if (!isURL(this.state.url)) return;
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

class Image extends Component {
  render() {
    const _this$props = this.props,
          {
      block,
      className,
      theme = {}
    } = _this$props,
          otherProps = _objectWithoutProperties(_this$props, ["block", "className", "theme"]); // leveraging destructuring to omit certain properties from props


    const {
      blockProps,
      customStyleMap,
      // eslint-disable-line no-unused-vars
      customStyleFn,
      // eslint-disable-line no-unused-vars
      decorator,
      // eslint-disable-line no-unused-vars
      forceSelection,
      // eslint-disable-line no-unused-vars
      offsetKey,
      // eslint-disable-line no-unused-vars
      selection,
      // eslint-disable-line no-unused-vars
      tree,
      // eslint-disable-line no-unused-vars
      contentState,
      blockStyleFn
    } = otherProps,
          elementProps = _objectWithoutProperties(otherProps, ["blockProps", "customStyleMap", "customStyleFn", "decorator", "forceSelection", "offsetKey", "selection", "tree", "contentState", "blockStyleFn"]);

    const combinedClassName = clsx(theme.image, className);
    const {
      src,
      width = "40%"
    } = contentState.getEntity(block.getEntityAt(0)).getData();
    const intWidth = Number.parseInt(width);
    blockProps.resizeData.width = intWidth > 98 ? 98 : intWidth;
    return React.createElement("img", _extends({}, elementProps, {
      src: src,
      role: "presentation",
      className: combinedClassName,
      title: `Size: ${width}`
    }));
  }

}

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
    handleReturn: (event, editorState) => {
      const key = editorState.getSelection().getStartKey();
      const contentState = editorState.getCurrentContent();
      const block = contentState.getBlockForKey(key);

      if (block.getType() === ATOMIC) {
        const entity = block.getEntityAt(0);
        const type = contentState.getEntity(entity).getType();

        if (type === EMBEDDED_TYPE) {
          throw 'No return on iframe';
        }
      }
    },
    addMMFEmbedded,
    addVideoEmbedded,
    types
  };
};

class ObjectPreview extends Component {
  constructor(props, context) {
    super(props, context);

    _defineProperty(this, "select", () => this.props.onSelect(this.props.object));

    _defineProperty(this, "getMainImage", () => {
      const main = this.props.object.images.find(i => i.is_primary === true);
      return main !== undefined ? main : this.props.object.images[0];
    });
  }

  render() {
    return React.createElement("div", {
      className: 'object',
      onClick: this.select
    }, this.props.object.images.length && React.createElement("img", {
      className: 'object-thumb',
      src: this.getMainImage().tiny.url,
      alt: 'img'
    }), React.createElement("div", {
      className: 'object-title'
    }, this.props.object.name));
  }

}

ObjectPreview.propTypes = {
  object: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired
};

class ObjectSelector extends Component {
  constructor(props, context) {
    super(props, context);

    _defineProperty(this, "onWriting", e => {
      const input = e.target.value;
      this.setState({
        input
      }, () => {
        if (input.length > 2) {
          this.fetchObjects(input);
        } else if (input.length === 0) {
          this.setState({
            items: []
          });
        }
      });
    });

    _defineProperty(this, "fetchObjects", () => {
      const url = new URL(this.props.apiSearchURL);
      url.searchParams.append('q', this.state.input);
      url.searchParams.append('per_page', "10");
      const n_request = this.state.nb_requests + 1;
      this.setState({
        nb_requests: n_request
      }, () => {
        fetch(url.toString(), {
          credentials: "same-origin",
          method: "GET",
          headers: {
            "Accept": "application/json"
          }
        }).then(rep => rep.json()).then(obj => {
          console.log(obj);

          if (n_request === this.state.nb_requests) {
            this.setState({
              items: obj.items
            });
          }
        });
      });
    });

    this.onSelect = this.props.onSelect ? this.props.onSelect : obj => {};
    this.state = {
      input: "",
      items: [],
      nb_requests: 0
    };
  }

  render() {
    return React.createElement("div", {
      className: "object-selector"
    }, React.createElement("input", {
      value: this.state.input,
      onChange: this.onWriting,
      placeholder: this.props.placeholder
    }), React.createElement("div", {
      className: "object-selector-container" + (this.state.items.length === 0 ? " object-selector-empty-container" : "")
    }, this.state.items.map(object => React.createElement("div", {
      className: 'object-selector-item'
    }, React.createElement(ObjectPreview, {
      object: object,
      onSelect: this.onSelect
    })))));
  }

}

ObjectPreview.propTypes = {
  onSelect: PropTypes.func.isRequired,
  apiSearchURL: PropTypes.string,
  placeholder: PropTypes.string
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

    _defineProperty(this, "addEmbedded", link => {
      if (!isURL(link)) return;
      const {
        editorState,
        onChange: update
      } = this.props;
      update(this.props.modifier(editorState, {
        link
      }));
    });

    _defineProperty(this, "onAddPress", e => this.addEmbedded(this.state.url));

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
      onClick: this.onAddPress
    }, this.context["forms.richeditor.add"]), React.createElement("i", {
      className: 'hr'
    }, this.context["forms.richeditor.orfindit"]), React.createElement(ObjectSelector, {
      apiSearchURL: this.props.apiSearchURL,
      onSelect: obj => this.addEmbedded(obj.url),
      placeholder: this.context["forms.richeditor.objectfinderplaceholder"]
    })));
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
      if (!isURL(this.state.url)) return;
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
  decorator,
  imageComponent: Image
}); // Video Plugin

const embeddedPlugin$1 = embeddedPlugin();

class MMFBlogEditor extends Component {
  constructor(props, context) {
    super(props, context);

    _defineProperty(this, "onChange", editorState => {
      this.setState({
        editorState
      }); //export in HTML

      if (this.props.onChange !== undefined) this.props.onChange(toHTML(editorState.getCurrentContent()));
    });

    _defineProperty(this, "focus", () => {
      this.editor.focus();
    });

    _defineProperty(this, "getPlugins", () => {
      let plugins = [linkifyPlugin, ...toolbarModulePlugins];
      if (this.props.enablePhotos) plugins.push(focusPlugin, alignmentPlugin, resizeablePlugin, imagePlugin, blockDndPlugin);
      if (this.props.enableYT || this.props.enableMMF) plugins.push(embeddedPlugin$1);
      if (this.props.enableEmoji) plugins.emojiPlugin = plugins.push(emojiPlugin);
      if (this.props.enableUndo) plugins.undoPlugin = plugins.push(undoPlugin);
      return plugins;
    });

    _defineProperty(this, "hasOptionEnabled", () => this.props.enablePhotos || this.props.enableYT || this.props.enableMMF || this.props.enableEmoji || this.props.enableUndo);

    this.state = {
      editorState: this.props.body ? EditorState.createWithContent(HTMLtoState(this.props.body)) : EditorState.createEmpty(),
      focused: false
    };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    const editorClasses = 'editor' + (this.props.useDefaultBorderStyle ? ' editor-default-style' : '') + (this.state.focused ? ' editor-focused' : '');
    return React.createElement(TransContext.Provider, {
      value: this.props.translation
    }, React.createElement("div", {
      className: "rich-editor"
    }, React.createElement(AlignmentTool, null), React.createElement("div", {
      className: "editor-interface"
    }, React.createElement("div", {
      className: editorClasses
    }, React.createElement(Editor, {
      editorState: this.state.editorState,
      onChange: this.onChange,
      plugins: this.getPlugins(),
      ref: element => {
        this.editor = element;
      },
      onFocus: () => this.setState({
        focused: true
      }),
      onBlur: () => this.setState({
        focused: false
      })
    }), this.props.enableStaticToolbar && React.createElement("div", {
      className: 'static-toolbar'
    }, React.createElement(Toolbar, null)), this.props.enableInlineToolbar && React.createElement("div", {
      className: 'inline-toolbar'
    }, React.createElement(InlineToolbar, null))), this.hasOptionEnabled() && React.createElement("div", {
      className: "options"
    }, this.props.enableUndo && React.createElement("div", {
      className: "undo-redo"
    }, React.createElement(UndoButton, null)), this.props.enableUndo && React.createElement("div", {
      className: "undo-redo"
    }, React.createElement(RedoButton, null)), this.props.enableEmoji && React.createElement(EmojiSuggestions, null), this.props.enableEmoji && React.createElement(EmojiSelect, null), this.props.enablePhotos && React.createElement(ImageAdd, {
      editorState: this.state.editorState,
      onChange: this.onChange,
      modifier: imagePlugin.addImage
    }), this.props.enableYT && React.createElement(VideoAdd, {
      editorState: this.state.editorState,
      onChange: this.onChange,
      modifier: embeddedPlugin$1.addVideoEmbedded
    }), this.props.enableMMF && React.createElement(EmbeddedAdd, {
      editorState: this.state.editorState,
      onChange: this.onChange,
      modifier: embeddedPlugin$1.addMMFEmbedded,
      apiSearchURL: this.props.apiSearchURL
    })))));
  }

}

MMFBlogEditor.propTypes = {
  onChange: PropTypes.func,
  body: PropTypes.string,
  apiSearchURL: PropTypes.string,
  useDefaultBorderStyle: PropTypes.bool,
  translation: PropTypes.object,
  enableStaticToolbar: PropTypes.bool,
  enableInlineToolbar: PropTypes.bool,
  enablePhotos: PropTypes.bool,
  enableYT: PropTypes.bool,
  enableMMF: PropTypes.bool,
  enableEmoji: PropTypes.bool,
  enableUndo: PropTypes.bool
};
MMFBlogEditor.defaultProps = {
  useDefaultBorderStyle: false,
  translation: mock.translation,
  apiSearchURL: mock.apiSearchURL,
  body: null,
  enableStaticToolbar: true,
  enableInlineToolbar: true,
  enablePhotos: true,
  enableYT: true,
  enableMMF: true,
  enableEmoji: true,
  enableUndo: true
};

export default MMFBlogEditor;
export { ExportedToolbar as Toolbar };
