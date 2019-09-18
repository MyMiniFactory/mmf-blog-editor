import React, {Component} from 'react';

export default class ObjectSelector extends Component {


    constructor(props, context) {
        super(props, context);

        this.state = {
            input: ""
        }
    }

    onWriting = (e) => {
        const input = e.target.value;
        this.setState({input:e.target.value});
        this.fetchObjects();
    };

    fetchObjects = () => {
        const url = new URL(this.props.apiSearchURL);
        url.searchParams.append('q', this.state.input);

        fetch(url.toString(), {
            credentials:"same-origin",
            method:"GET",
        })
            .then(rep => rep.json())
            .then(obj => {
                console.log(obj);
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