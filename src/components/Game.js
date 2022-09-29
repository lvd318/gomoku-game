import React, { useState } from "react";
import Board from "./Board";

    function Game(){
        // constructor(props) {
        //     super(props);
        //     this.state = {
        //       boardSize: 5,
        //       history: [{
        //         squares: Array(25).fill(null),
        //       }],
        //       stepNumber: 0,
        //       xIsNext: true,
        //       isAscendingSort: true
        //     };
        //   }
        const [boardSize, setBoardSize] = useState(5);
        const [history, setHistory] = useState([{
            squares: Array(25).fill(null),
        }]);
        const [stepNumber, setStepNumber] = useState(0);
        const [xIsNext, setXIsNext] = useState(true);
        const [isAscendingSort, setIsAscendingSort] = useState(true);

        const handleClick = (i) => {
            const NowHistory = history.slice(0, stepNumber + 1);
            const current = NowHistory[NowHistory.length - 1];
            const squares = current.squares.slice();
            if(calculateWinner(squares).winner || squares[i]) {
                return;
            }
            squares[i] = xIsNext ? 'X' : 'O';
            // this.setState({ 
            //     history: history.concat([{
            //       squares: squares,
            //       latestMoveSquare: i,
            //     }]),
            //     stepNumber: history.length,
            //     xIsNext: !xIsNext,
            //   });
            setHistory(history.concat([{
                squares: squares,
                latestMoveSquare: i,
            }]));
            setStepNumber(history.length);
            setXIsNext(!xIsNext);
        };

        const jumpTo = (step) => {
        //   this.setState({
        //     stepNumber: step,
        //     xIsNext: (step % 2) === 0,
        //   });
            setStepNumber(step);
            setXIsNext((step % 2) === 0);
        }

        const handleSortToggle = () => {
            // this.setState({
            // isAscendingSort: !isAscendingSort
            // })
            setIsAscendingSort(!isAscendingSort);
        }
    
        const handleOnChangeBoardSize = (event) =>{
            const n = event.target.value;
            // this.setState({
            // boardSize: event.target.value,
            // history: [{
            //     squares: Array(n*n).fill(null),
            // }],
            // stepNumber: 0,
            // })
            setBoardSize(event.target.value);
            setHistory([{
                squares: Array(n*n).fill(null)
            }]);
            setStepNumber(0);
        }

        const current = history[stepNumber];
        const winnerInfo = calculateWinner(current.squares);
        const winner = winnerInfo.winner;

        const moves = history.map((step, move) => {
            const latestMoveSquare = step.latestMoveSquare;
            const player = (move % 2) === 0 ? 'O' : 'X';
            const col = 1 + latestMoveSquare % boardSize;
            const row = 1 + Math.floor(latestMoveSquare / boardSize);
            const desc = move ?
            `Go to move #${move} ${player} at (${col}, ${row})` :
            'Go to game start';
            return (
            <li key={move}>
                <button 
                className={move === stepNumber? 'move-list-selected-item' : ''}
                onClick={() => jumpTo(move)}>{desc}
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
            status = 'Next player: ' + (xIsNext ? 'X' : 'O');
            }
        }

        if(!isAscendingSort){
            moves.reverse();
        }

        return (
        <div className="game">
            <div className="game-board">
            <Board 
                squares={current.squares}
                boardSize={boardSize}
                onClick={(i) => handleClick(i)}
                winLine={winnerInfo.line}
            />
            </div>
            <div className="game-info">
            <div>
                <label>Enter board size: </label>
                <input value={boardSize} type="number" 
                    onChange={(e) => handleOnChangeBoardSize(e)}
                />
            </div>
            <div>{status}</div>
            <div>
                <label>History: </label>    
                <button onClick={() => handleSortToggle()}>
                {isAscendingSort ? 'Descending' : 'Ascending'}
                </button>
            </div>
            
            <ol>{moves}</ol>
            </div>
        </div>
        );
    }

  function calculateWinner(squares) {
    let size = Math.sqrt(squares.length);
    let nWin = 5;
    let lineWin = [];
    let count = 0;

    for(let index = 0; index < squares.length; index++){
      let row = Math.ceil((index + 1) / size) - 1;
      let col = ((index + 1) % size || size ) - 1;
      
      if(squares[index]){
        //vertical
        for(let i = Math.max(0, row - nWin + 1); i < Math.min(size, row + nWin); i++){
          if(squares[i * size + col] === squares[index]){
              lineWin.push(i * size + col);
              count += 1;
          }else{
            lineWin = [];
            count = 0;
          }
          if(count === nWin){
            return {
              winner: squares[index],
              line: lineWin,
              isDraw: false,
            }
          }
        }
        //horizontal
        for(let i = Math.max(0, col - nWin + 1); i < Math.min(size, col + nWin); i++){
          if(squares[row * size + i] === squares[index]){
              lineWin.push(row * size + i);
              count += 1;
          }else{
            lineWin = [];
            count = 0;
          }
          if(count === nWin){
            return {
              winner: squares[index],
              line: lineWin,
              isDraw: false,
            }
          }
        }

        // diagonal \
        for(let i = Math.max(-row, -col, 1 - nWin); i < Math.min(size - row, size -col, nWin); i++){
          if(squares[(row+i) * size + col + i] === squares[index]){
              lineWin.push((row+i) * size + col + i);
              count += 1;
          }else{
            lineWin = []
            count = 0;
          }
          if(count === nWin){
            return {
              winner: squares[index],
              line: lineWin,
              isDraw: false,
            }
          }
        }
        // diagonal /
        for(let i = Math.max(-row, col - size + 1, 1 - nWin); i < Math.min(size - row, col + 1, nWin); i++){
          if(squares[(row+i) * size + col - i] === squares[index]){
              lineWin.push((row+i) * size + col - i);
              count += 1;
          }else{
            lineWin = [];
            count = 0;
          }
          if(count === nWin){
            return {
              winner: squares[index],
              line: lineWin,
              isDraw: false,
            }
          }
        }

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

  export default Game;