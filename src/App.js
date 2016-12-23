//使用ES6的语法
import React from 'react';
import './App.css';


//Square组件接受标签名为onClick和value的消息，onClick值是函数，使用方法是<Square onClick= {func} />
function Square(props){
  //因为class是react的保留字，只能用"className"替代元素的"class"属性
  return (<button className="square" onClick={props.onClick}>
    {
      //value的值为'X'或'O'
      props.value
    }
  </button>);
}

class Board extends React.Component {
  constructor()
  {
    super();
    //将所有的子元素的state存储到他们的父元素state的一个数组里面，然后在渲染子元素的时候将数组里面每个元素的值作为props传递给子元素。
    this.state = {
      //创建一个空数组
      squares: Array(9).fill(null),
      //xIsNext用来表示下一步是X走还是O走
      xIsNext: true
    };
  }

  /**
   * 当鼠标点击的时候就会调用这个方法
   * @param i 点击的方块在this.state.array中的下标
   */
  handleClick(i)
  {
    //Array.slice方法相当于String.substring方法一样。在这里是用来复制this.state.squares数组
    const squareCp = this.state.squares.slice();
    //如果squareCp的赢家不为null，说明已经有一方赢了；如果squareCp[i]不为null，说明这个方形已经被填充满了，就不需要继续执行
    if (calculateWinner(squareCp) || squareCp[i])
      return;

    //将改变暂存到squareCp这个数组里面
    if (this.state.xIsNext)
    {
      squareCp[i] = 'X';
      this.setState({xIsNext: false});
    }
    else
    {
      squareCp[i] = 'O';
      this.setState({xIsNext: true});
    }
    //将squareCp覆盖原数组this.state.squares
    this.setState({squares: squareCp});
  }

  /**
   * 会在整个棋盘重新渲染的时候调用
   * @param i
   * @returns {XML}
   */
  renderSquare(i)
  {
    return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)}/>;
  }

  render()
  {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner)
    {
      status = 'winner: ' + winner;
    } else
    {
      status = 'next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
      </div>
      <div className="board-row">
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
      </div>
      <div className="board-row">
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
      </div>
    </div>
  }
}
class Game extends React.Component {
  constructor()
  {
    super();
    this.state = {
      history: [{squares: Array(9).fill(null)}],
      xIsNext: true
    };
  }

  render()
  {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{}</div>
          <ol>{}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares)
{
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
  for (let i = 0; i < lines.length; i++)
  {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
    {
      return squares[a];
    }
  }
  return null;
}

export default Game;
