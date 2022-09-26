import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    const className = 'square ' + (props.highlight ? 'highlight' : '');
    return (
      <button 
        className={className}
        onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      const winLine = this.props.winLine;
      return (
        <Square 
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            highlight={winLine && winLine.includes(i)}
        />
      );
    }
  
    render() {
      const boardSize = this.props.boardSize >= 5 ? this.props.boardSize : 5; // Minimum board size = 5
      let squares = [];
      for(let i = 0; i < boardSize; i++){
        let row = [];
        for(let j = 0; j < boardSize; j++){
          row.push(this.renderSquare(i * boardSize + j)); 
        }
        squares.push(<div key={i+1} className="board-row">{row}</div>);
      }

      return (
        <div>{squares}</div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          boardSize: 5,
          history: [{
            squares: Array(25).fill(null),
          }],
          stepNumber: 0,
          xIsNext: true,
          isAscendingSort: true
        };
      }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares).winner || calculateWinner(squares).isDraw || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({ 
            history: history.concat([{
              squares: squares,
              latestMoveSquare: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
          });
    }

    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerInfo = calculateWinner(current.squares);
        const winner = winnerInfo.winner;

        const moves = history.map((step, move) => {
          const latestMoveSquare = step.latestMoveSquare;
          const player = (move % 2) === 0 ? 'O' : 'X';
          const col = 1 + latestMoveSquare % 3;
          const row = 1 + Math.floor(latestMoveSquare / 3);
          const desc = move ?
          `Go to move #${move} ${player} at (${col}, ${row})` :
          'Go to game start';
          return (
            <li key={move}>
              <button 
              className={move === this.state.stepNumber? 'move-list-selected-item' : ''}
              onClick={() => this.jumpTo(move)}>{desc}
              </button>
            </li>
          );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
          if(winnerInfo.isDraw){
            status = "Draw";
          }else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
          }
        }

        const isAscendingSort = this.state.isAscendingSort;
        if(!isAscendingSort){
          moves.reverse();
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                boardSize={this.state.boardSize}
                onClick={(i) => this.handleClick(i)}
                winLine={winnerInfo.line}
            />
          </div>
          <div className="game-info">
            <div>
              <label>Enter board size: </label>
              <input value={this.state.boardSize} type="number" 
                    onChange={(e) => this.handleOnChangeBoardSize(e)}
              />
            </div>
            <div>{status}</div>
            <div>
              <label>History: </label>    
              <button onClick={() => this.handleSortToggle()}>
                {isAscendingSort ? 'Descending' : 'Ascending'}
              </button>
            </div>
            
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }

    handleSortToggle(){
      this.setState({
        isAscendingSort: !this.state.isAscendingSort
      })
    }

    handleOnChangeBoardSize = (event) =>{
      this.setState({
        boardSize: event.target.value,
      })
    }

  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner: squares[a],
          line: lines[i],
          isDraw: false,
        };
      }
    }
    let isDraw = true;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        isDraw = false;
        break;
      }
    }

    return {
      winner: null,
      line: null,
      isDraw: isDraw,
    };
  }