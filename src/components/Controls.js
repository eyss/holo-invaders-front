import React from 'react';
import { MdVideogameAsset, MdArrowBack, MdArrowForward } from 'react-icons/md'

class Controls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    
    componentDidMount() {

    }

    render() {
        return (
            <div className='controls'>
                <header>
                    <h3>
                        <MdVideogameAsset />
                        Controls
                    </h3>            
                </header>
                <section>
                    <div>
                        <div>
                            <div>
                                <MdArrowBack />
                            </div>
                            <label>Move Left</label>
                        </div>
                        <div>
                            <div>
                                <MdArrowForward />
                            </div>
                            <label>Move Right</label>
                        </div>
                    </div>

                    <div>
                        <div>
                            <div>
                                <label>X</label>
                            </div>
                            <label>Shoot</label>
                        </div>
                    </div>

                </section>
            </div> 
        )
    }
}

export default Controls;