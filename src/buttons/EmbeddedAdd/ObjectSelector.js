import React, {Component} from 'react';

export default class ObjectSelector extends Component {


    constructor(props, context) {
        super(props, context);

        this.state = {
            input: "",
            items: []
        }
    }

    onWriting = (e) => {
        const input = e.target.value;
        this.fetchObjects(input);
        this.setState({input: input});
    };

    fetchObjects = (input) => {
        const url = new URL(this.props.apiSearchURL);
        url.searchParams.append('q', input);

        fetch(url.toString(), {
            credentials: "same-origin",
            method: "GET",
        })
            .then(rep => rep.json())
            .then(obj => {
                console.log(obj);
                this.setState({
                    items: obj.items
                });
            });
    };

    render() {
        return (
            <div>
                <input value={this.state.input} onChange={this.onWriting}/>
            </div>
        )
    }

}