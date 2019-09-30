# MMF Blog Editor (WYSIWYG)

- Titles, link, Bold/Italic, code
- Media: Image upload and resize, embedded video (Or by recognizing youtube links etc...)
- Embeddable MyMiniFactory object

## How it works

### Basic config
```js

import React, {Component} from "react";
import RichEditor from 'mmf-blog-editor';

export default class EditorEnvironment extends Component {
    render() {
        return (
            <div>
                <RichEditor/>
            </div>
        )
    }
}

```

## Customization
### Props
- enablePhotos (bool)
- enableYT (bool)
- enableMMF (bool)
- enableEmoji (bool)
- enableUndo (bool)