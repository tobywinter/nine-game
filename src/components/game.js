import React from 'react';
import _ from 'lodash';
import './game.css';
import Stars from './star';
import Button from './button';
import Answer from './answer';

var isSolutionPossible = (arr, n) => {
    if (arr.indexOf(n) >= 0)  { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
      arr.pop();
    return isSolutionPossible(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++) {
      var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
        if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum ) { return true; }
  }
  return false; 
};

const Numbers = (props) => {  
  const numberClassName = (number) => {
    if(props.selectedNumbers.indexOf(number) >= 0) {
      return 'selected';
  } 
  if(props.usedNumbers.includes(number)) {
      return 'used';
  }
}
return (
  <div className="card text-center">
    <div>
        {Numbers.list.map((number, i) => 
          <span key={i} className={numberClassName(number)}
        onClick={() => props.selectNumber(number)}>{number}</span>
      )}
    </div>
  </div>
)
}

const DoneFrame = (props) => {
  return (
    <div className="text-center"> 
      <h2>{props.doneStatus}</h2>
    <button className="btn btn-secondary" onClick={props.resetGame }>Play Again</button>
  </div>
)
}

Numbers.list = _.range(1, 10)

export default class Game extends React.Component {
  static randomNumber = () => Math.ceil(Math.random()*9);
static initialState = () => ({
    selectedNumbers: [],
    randomNumberOfStars: Game.randomNumber(),
  answerIsCorrect: null,
  usedNumbers: [],
  redraws: 5,
  doneStatus: null,
})
  state = Game.initialState();
resetGame = () => {
    this.setState(Game.initialState());
}
selectNumber = (clickedNumber) => {
    if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) { return; }
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
  }));
};
unselectNumber = (clickedNumber) => {
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers
                                                        .filter(number => number !== clickedNumber)
  }))
}
checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect: prevState.randomNumberOfStars === 
        prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
  }));
}
acceptAnswer = () => {
    this.setState(prevState => ({
        usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
    answerIsCorrect: null,  
    randomNumberOfStars: Game.randomNumber(),
  }), this.updateDoneStatus);
}
  redraw = () => {
    if (this.state.redraws === 0) { return; }
    this.setState(prevState => ({
      randomNumberOfStars: Game.randomNumber(),
      selectedNumbers: [],
    answerIsCorrect: null,
    redraws: prevState.redraws - 1,
  }), this.updateDoneStatus)
}
possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
    const possibleNumbers = _.range(1, 10).filter(
      number => usedNumbers.indexOf(number) === -1
  );
  return isSolutionPossible(possibleNumbers, randomNumberOfStars);
};
updateDoneStatus = () => {
    this.setState(prevState => {
      if(prevState.usedNumbers.length === 9) {
        return { doneStatus: 'Done, Nice!' };
    }
    if (prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
        return {doneStatus: 'Game Over!'}
    }
  })
}
  render() {
    const { 
      selectedNumbers, 
      randomNumberOfStars, 
    answerIsCorrect, 
    usedNumbers, 
    redraws, 
    doneStatus } = this.state;
    return (
      <div className="container">
        <h3>Play Nine</h3>
      <div className="row">
      <Stars numberOfStars={randomNumberOfStars}/>
      <Button selectedNumbers={selectedNumbers}
                      checkAnswer={this.checkAnswer}
              answerIsCorrect={answerIsCorrect}
              redraw={this.redraw}
              redraws={redraws}
              acceptAnswer={this.acceptAnswer}
              />
      <Answer selectedNumbers={selectedNumbers}
                      unselectNumber={this.unselectNumber}/>
              </div>
      <br />
      {doneStatus ? 
          <DoneFrame resetGame={this.resetGame} doneStatus={doneStatus}/> : 
        <Numbers selectedNumbers={selectedNumbers} 
                       selectNumber={this.selectNumber}
               usedNumbers={usedNumbers}/>
        }
      <br />
      
     </div>
    )
  }
}