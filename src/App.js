import React from 'react';
import Score from './components/Score';
import { fromEvent } from 'rxjs'
import { MdAccountCircle } from 'react-icons/md'
import './styles/App.scss';
import Controls from './components/Controls';
import Preloader from './components/Preloader';
import { connect } from 'react-redux';
import { gql } from 'apollo-boost';
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        menu: true,
        spaceInvaders: false,
        scores: false,
        controls: false,
        gameOver: false
      },
      hits:0,
      score: undefined,
      preloader: false,
      modeEndGame: undefined
    }
  }

  componentDidMount() {
    this.obsScore();
  }

  async storeScore() {
    const data = document.querySelector("span#data-game").dataset,
      score = data.score,
      modeEndGame = data.endgame,
      hits=data.hits,
      _this = this,
      preloader = modeEndGame !== 'reset' && parseInt(score) > 0 ? true : false

    this.setState({
      preloader,
      modeEndGame,
      score,hits
    }, function () {
      _this.toggleSections('GameOver');
    });

    if (modeEndGame !== 'reset' && parseInt(score) > 0) {
      /**Se Guarda el Score */

      /**
       * Al finalizar el guardado se ejecuta preloaders false
       * el settime out simula el proceo de store score
       */
      const query = await this.props.client
        .mutate({
          mutation: gql`
          mutation PublishScore(
            $score: Int!, 
            $message: String
          ) {
            publishScore(score: $score,message:$message) {
                id
                username
            }
          }
        `,
          variables: { score: parseInt(score), message: hits }
        })
      _this.setState({
        preloader: false
      })
    }
  }

  obsScore() {
    const tiggreGetScore = document.querySelector('#get-score');
    const actGetScore = fromEvent(tiggreGetScore, 'click');
    const _this = this;
    actGetScore.subscribe((e) => {
      _this.storeScore();
    })
  }

  toggleSections = (e) => {
    var sections = {
      menu: false,
      start: false,
      scores: false,
      controls: false,
      gameOver: false,
    },
      section = typeof (e) === 'object' ? e.target.textContent : e;

    // eslint-disable-next-line default-case
    switch (section) {
      case 'Menu':
        sections.menu = true;
        break;

      case 'Start':
        sections.start = true;
        break;

      case 'Scores':
        sections.scores = true;
        break;

      case 'Controls':
        sections.controls = true;
        break;

      case 'GameOver':
        sections.gameOver = true;
        break;
    }
    this.setState({ sections }, function () {
      if (section === 'Start') {
        document.querySelector('#start-game').click();
      }
    });
  }

  render() {
    return (
      <main className="container-c">
        <div>
          <header>
            {!this.state.sections.menu &&
              <button onClick={e => this.toggleSections(e)}>
                Menu
                    </button>
            }
            <label className='ttl'>Space Invaders</label>

            <label><MdAccountCircle />  UserName</label>
          </header>

          <section>
            {
              this.state.sections.menu &&
              <nav>
                <div>
                  <h3>
                    Menu
                        </h3>
                  <ul>
                    <li>
                      <button onClick={e => this.toggleSections(e)}>
                        Start
                            </button>
                    </li>
                    <li>
                      <button onClick={e => this.toggleSections(e)}>
                        Scores
                            </button>
                    </li>
                    <li>
                      <button onClick={e => this.toggleSections(e)}>
                        Controls
                            </button>
                    </li>
                  </ul>
                </div>
              </nav>
            }

            {
              this.state.sections.start &&
              <div className="game-container">
                <canvas id="game-canvas"></canvas>
              </div>
            }

            {
              this.state.sections.gameOver &&
              <div className='game-over'>
                <div>

                  <h2>Game Over</h2>
                  {
                    this.state.modeEndGame !== 'reset' &&
                    <><h5>Your score: {this.state.score}
                    {this.state.score>5000?<p style={{color:"transparent",textShadow:"0 0 0 red" }}>🚀</p>:<p style={{color:"transparent",textShadow:"0 0 0 green" }}>🚀</p>}
                    </h5>
                    <h5>Your hits percent: {this.state.hits}%
                    {this.state.hits>50?<p style={{color:"transparent",textShadow:"0 0 0 orange" }}>🚀</p>:null}
                    
                    </h5></>

                  }

                  {
                    this.state.preloader &&
                    <Preloader msg='Storing score' />
                  }
                </div>
              </div>
            }

            {
              this.state.sections.controls &&
              <div>
                <Controls />
              </div>
            }

            {
              this.state.sections.scores &&
              <Score />
            }
          </section>
        </div>

        <div id="background"></div>
        <div id="midground"></div>
        <div id="foreground"></div>
      </main>
    )
  }
}
function mapDispatchToProps(dispatch) {
  return {}
}
function mapStateToProps(state) { return { user: state.userId, client: state.client } }
export default connect(mapStateToProps, mapDispatchToProps)(App)