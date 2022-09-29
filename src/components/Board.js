import React from 'react'
import Square from './Square';

function Board(props){
    const renderSquare = (i) => {
      const winLine = props.winLine;
      return (
        <Square 
            key={i}
            value={props.squares[i]} 
            onClick={() => props.onClick(i)}
            highlight={winLine && winLine.includes(i)}
        />
      );
    }
  
      const boardSize = props.boardSize >= 5 ? props.boardSize : 5; // Minimum board size = 5
      let squares = [];
      for(let i = 0; i < boardSize; i++){
        let row = [];
        for(let j = 0; j < boardSize; j++){
          row.push(renderSquare(i * boardSize + j)); 
        }
        squares.push(<div key={i+1} className="board-row">{row}</div>);
      }

      return (
        <div>{squares}</div>
      );
  }

  export default Board;