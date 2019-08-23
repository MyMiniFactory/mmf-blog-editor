import React, {Component} from "react";
import RichEditor from './RichEditor'
import EditorExporter from "./export/exporter";

export default class Dev extends Component {

    constructor(props, context) {
        super(props, context);

        this.editor_exporter = new EditorExporter();
        this.editor_exporter.onUpdate = this.updateHandler;
    }

    state = {
        htmlContent: ''
    };

    updateHandler = () => {
        const html = this.editor_exporter.html;
        this.setState({
            htmlContent: html
        });
    };


    render() {

        return (
            <div>
                <RichEditor
                    exporter={this.editor_exporter}
                />
                <hr/>
                <h2>HTML</h2>
                <pre>{this.state.htmlContent}</pre>
                <hr/>
                <h3>Rendu</h3>
                <div dangerouslySetInnerHTML={{__html: this.state.htmlContent}}></div>
            </div>
        )
    }
}