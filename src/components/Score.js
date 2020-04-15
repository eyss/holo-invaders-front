import React from 'react';
import { MdFormatListNumbered } from 'react-icons/md'
import Preloader from './Preloader';
import { connect } from 'react-redux';
import { gql } from 'apollo-boost';

class Score extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scores: [

            ],
            preloader: false,
        };

    }

    componentDidMount() {
        this.props.client.query({
            query: gql`
            {
                allScores {
                score
                message
                user{
                    username
                }
              }
            }
          `
        }).then(e => {
            this.setState({
                scores: e.data.allScores.map(value => {
                    return {
                        score: value.score,
                        hits:value.message,
                        name: value.user.username
                    }
                })
            })
        })
    }

    getScore = (e) => {
        var matchScore = e.target.value,
            _this = this;
        //matchScore puede tener dos valores
        //as = all score
        //ms = my score

        _this.setState({
            preloader: true
        }, async function () {
            var scores = 0;
            if (matchScore === "as") scores = await this.props.client.query({
                query: gql`
                {
                    allScores {
                        score
                        message
                        user{
                            username
                        }
                  }
                }
              `
            }).then(e => {
                return e.data.allScores.map(value => {
                    return {
                        score: value.score,
                        hits:value.message,
                        name: value.user.username
                    }
                })
            });
            else scores = await this.props.client.query({
                query: gql`
                {
                    myUser {
                        id
                        username
                        scores{
                            score
                            message
                        }
                    }
                }
              `
            }).then(e => {
                return e.data.myUser.scores.map(value => {
                    return {
                        score: value.score,
                        hits:value.message,
                        name: e.data.myUser.username
                    }
                })
            });

            _this.setState({
                preloader: false, scores
            });
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
                                <th>Hits %</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.scores.map((data, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{data.name}</td>
                                    <td>{data.score}{data.score>5000?<p style={{color:"transparent",textShadow:"0 0 0 red" }}> 🚀</p>:<p style={{color:"transparent",textShadow:"0 0 0 green" }}>🚀</p>}</td>
                                            <td>{data.hits}%{data.hits>50?<p style={{color:"transparent",textShadow:"0 0 0 orange" }}>🚀</p>:null}</td>

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
function mapDispatchToProps(dispatch) {
    return {}
}
function mapStateToProps(state) { return { client: state.client } }
export default connect(mapStateToProps, mapDispatchToProps)(Score)