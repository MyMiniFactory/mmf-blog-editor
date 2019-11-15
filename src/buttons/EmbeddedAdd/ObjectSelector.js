import React, {Component} from 'react';
import ComponentContext from "../../utils/context";
import ObjectPreview from "./ObjectPreview";
import PropTypes from "prop-types";

class ObjectSelector extends Component {

    static contextType = ComponentContext;

    constructor(props, context) {
        super(props, context);
        this.onSelect = this.props.onSelect ? this.props.onSelect : (obj) => {
        };

        this.state = {
            input: "",
            items: [],
            nb_requests: 0
        }
    }

    onWriting = (e) => {
        const input = e.target.value;
        this.setState({input}, () => {
            if (input.length > 2) {
                this.fetchObjects(input);
            } else if (input.length === 0) {
                this.setState({items: []});
            }
        });
    };

    fetchObjects = () => {

        const {url: apiURL , httpMethod} = this.context.apis.search;
        const url = new URL(apiURL);
        url.searchParams.append('q', this.state.input);
        url.searchParams.append('per_page', "10");

        const n_request = this.state.nb_requests + 1;
        this.setState({nb_requests: n_request}, () => {
            fetch(url.toString(), {
                credentials: "same-origin",
                method: httpMethod,
                headers: {
                    "Accept": "application/json"
                }
            })
                .then(rep => rep.json())
                .then(obj => {
                    console.log(obj);
                    if (n_request === this.state.nb_requests) {
                        this.setState({
                            items: obj.items
                        });
                    }
                });
        });
    };

    render() {
        return (
            <div className={"object-selector"}>
                <input
                    className={"object-selector-input"}
                    value={this.state.input}
                    type={'text'}
                    onChange={this.onWriting}
                    placeholder={this.props.placeholder}
                    />
                <div
                    className={"object-selector-container" + (this.state.items.length === 0 ? " object-selector-empty-container" : "")}>
                    {this.state.items.map(object =>
                        <div className={'object-selector-item'}>
                            <ObjectPreview
                                object={object}
                                onSelect={this.onSelect}
                            />
                        </div>
                    )}
                </div>
            </div>
        )
    }

}

ObjectPreview.propTypes = {
    onSelect: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};

export default ObjectSelector;