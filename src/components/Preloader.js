import React from 'react';

class Preloader extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className='preloader'>
                <div>

                </div>
                <div>
                    <label>{this.props.msg}</label>
                </div>
            </div>
        )
    }
}

export default Preloader;