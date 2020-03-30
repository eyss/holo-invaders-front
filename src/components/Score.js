import React from 'react';
import { MdFormatListNumbered } from 'react-icons/md'
import Preloader from './Preloader';

class Score extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scores: [
                {
                    name: 'Carlos',
                    score: 1000
                },
                {
                    name: 'Marcos',
                    score: 5020
                },
                {
                    name: 'Gabriel',
                    score: 5320
                },
                {
                    name: 'Maria',
                    score: 5933
                },
            ],
            preloader: false,
        };
    }
    
    componentDidMount() {

    }

    getScore = (e)=>{
        var matchScore = e.target.value,
            _this = this;
        //matchScore puede tener dos valores
        //as = all score
        //ms = my score

        _this.setState({
            preloader: true
        }, function(){
            setTimeout(()=>{
                _this.setState({
                    preloader: false
                });
            }, 2000)
        });
    }

    render() {
        return (
            <div className='scores-container'>
                <header>
                    <h3>
                        <MdFormatListNumbered />
                        Scores
                    </h3>
                    
                    <div>
                        <div>
                            {
                                this.state.preloader && 
                                <Preloader msg='Loading score' />
                            }
                        </div>

                        <div>
                            <select onChange={e => this.getScore(e)}>
                                <option value='as'>All Scores</option>
                                <option value='ms'>My Scores</option>
                            </select>
                        </div>
                    </div>
                    
                </header>
                <section>
                    <table className="ui very basic table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Score</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.scores.map((data, key) => {
                                return(
                                    <tr key = {key}>
                                        <td>{data.name}</td>
                                        <td>{data.score}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </section>
            </div>  
        )
    }
}

export default Score;