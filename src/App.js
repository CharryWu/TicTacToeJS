//使用ES6的语法
import React from 'react';
import './App.css';


//Square组件接受标签名为onClick和value的消息，onClick值是函数，使用方法是<Square onClick= {func} />
function Square(props)
{
  //因为class是react的保留字，只能用"className"替代元素的"class"属性
  return (<button className={props.isHighlight?'square':'square square-highlight'} onClick={props.onClick}>
    {
      //value的值为'X'或'O'
      props.value
    }
  </button>);
}

class Board extends React.Component {

  /**
   * 会在整个棋盘重新渲染的时候调用来渲染每个Board里面的Square元素
   * this.props.sqaures是一个储存在Game元素里面的数组，而this.props.onClick就是Game元素里面handleClick(i)方法
   * @param i Square元素的下标
   * @returns {XML}
   */
  renderSquare(i)
  {
    return <Square isHighlight={(() =>
    {
      var arr = this.props.winSqIndexArr;
      if (arr)
      {
        for (var j = 0; i < arr.length; j++)
        {
          if (arr[j] == i)
          {
            return true;
          }
        }
      }
      return false;
    })()} value={this.props.squares[i]} key={"sq-" + i} onClick={() => this.props.onClick(i)}/>;
  }

  //both render and createRowContent都是从数组里面创建JSX元素。
  render()
  {
    var tableContent = new Array();
    for (var i = 0; i < 3; i++)
    {
      tableContent.push(this.createRowContent(i));
    }
    return (<div>{tableContent}</div>)
  }

  createRowContent(rowNum)
  {
    var rowContent = new Array();
    for (var i = rowNum * 3; i < rowNum * 3 + 3; i++)
    {
      rowContent.push(this.renderSquare(i));
    }
    return (<div className="board-row" key={rowNum}>{rowContent}</div>)
  }
}

function HistoryLog(props)
{
  //只有当前的一步的对应的history才会加粗
  return (
    <li key={props.move}>
      <a href="#" onClick={props.onClick} key={'link' + props.move}>
        {props.currentMove != props.move ? props.desc : (<b>{props.desc}</b>)}</a>
    </li>);
}

class Game extends React.Component {

  /**
   * 比较两个相邻steps之间的差异来得知他们之间更新的那一个step新增的棋子的位置。
   * @param currentSqArr 当前的squares数组
   * @param previousSqArr 之前的squares数组
   * @returns {string} 一个字符串，以整数对标示移动的棋子的位置
   */
  getMoveLocBetweenSteps(currentSqArr, previousSqArr)
  {
    for (var i = 0; i < currentSqArr.length; i++)
    {
      //在下标为i这个位置上，如果当前squares数组里面存在一个之前数组没有的元素，那么我们就可以
      if (currentSqArr[i] && !previousSqArr[i])
      {
        //Math.floor向下取整
        return Math.floor(i / 3 + 1) + ',' + (i % 3 + 1);
      }
    }
  }

  constructor()
  {
    super();
    this.state = {
      history: [{squares: Array(9).fill(null)}],
      xIsNext: true,
      ascendOrder: true,
      stepNumber: 0,
    };
  }

  render()
  {
    //在每次渲染之前，this.state.stepNumber已经在上次渲染末尾就更新了，如果没有点击侧边history的话，stepNumber就是现在这次move在history里面
    //的下标。
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this.highLightWinningSquare.bind(this));
    var moves;
    //在每次渲染的时候创建一个新的moves数组，保存着开局以来所有的操作。moves数组里面是JSX元素，所以能直接将moves元素append到game-info里面
    //迭代history数组，根据history中的每个元素step(下标值为move)创建JSX元素，将所有元素保存到一个moves数组里面
    if (this.state.ascendOrder)
    {
      moves = history.map((step, move) =>
      {
        //如果move==0那么desc = 'Game start'，如果不为零，那么desc='move #...'
        //不会有超出访问数组下标的问题，因为如果move==0的话就不会方位history[move-1]了，而只会返回'move #'+move
        const desc = move ? 'move #' + move + ': ' + this.getMoveLocBetweenSteps(step.squares, history[move - 1].squares) : 'Game start';
        //侧边栏的历史记录，onClick绑定的是一个跳到对应步骤的函数。
        return <HistoryLog currentMove={this.state.stepNumber} key={move} onClick={() => this.jumpTo(move)} move={move}
                           desc={desc}/>
      });
    } else
    {
      var tempArr = history.slice();
      moves = tempArr.reverse().map((step, move) =>
      {
        //tempArr.length-1是最后一个元素的下标
        const actualIndex = tempArr.length - 1 - move;
        console.log('move: ' + move + ', actual index: ' + actualIndex);
        //如果move==0那么desc = 'Game start'，如果不为零，那么desc='move #...'
        const desc = actualIndex ? 'move #' + actualIndex + ': ' +
          this.getMoveLocBetweenSteps(step.squares, tempArr[move + 1].squares) : 'Game start';
        //侧边栏的历史记录，onClick绑定的是一个跳到对应步骤的函数。
        return <HistoryLog currentMove={this.state.stepNumber} key={actualIndex}
                           onClick={() => this.jumpTo(actualIndex)} move={actualIndex}
                           desc={desc}/>
      });
    }

    let status;
    if (winner)
    {
      status = 'Winner: ' + winner;
    } else
    {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winSqIndexArr={this.state.winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <a href="#" className="game-toggle-button" onClick={() => this.toggleSort()}>toggleSort</a>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  toggleSort()
  {
    console.log(this.state.ascendOrder);
    this.setState({ascendOrder: !this.state.ascendOrder});
  }

  /**
   * jumpTo绑定到侧边栏历史记录的a元素上面，不改变view，只改变model的数据
   * @param step 需要跳到的那一个步骤
   */
  jumpTo(step)
  {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  /**
   * handleClick通过props传递，绑定到每个Square元素的onClick事件上。
   * 当鼠标点击的时候Square元素就会调用这个方法，来修改Game元素里面的this.state.history.squares内容
   * @param i 点击的方块在this.state.array中的下标
   */
  handleClick(i)
  {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    //如果squareCp的赢家不为null，说明已经有一方赢了；如果squareCp[i]不为null，说明这个方形已经被填充满了，就不需要继续执行
    if (calculateWinner(squares) || squares[i]) return;

    //修改xIsNext flag变量
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    //变换当前Game元素的state，将新的history压入栈里面。
    this.setState({
      xIsNext: !this.state.xIsNext,
      //这里不用Array.push方法因为Array.push返回的是修改之后的数组长度，而concat返回的是修改过后的数组
      history: history.concat([{squares: squares}]),
      //如果现在的stepNumber指向的是上次click时history数组的最后一项，那么就改成这次的history最后一项，效果等效于循环里面的stepNumber++
      stepNumber: history.length
    });
  }

  highLightWinningSquare(index1, index2, index3)
  {
    this.setState({winningSquares: [index1, index2, index3]});
  }
}

/**
 * calculateWinner函数不属于任何元素，只是一个helper method
 * @param squares
 * @returns {*}
 */
function calculateWinner(squares, callBackWhenWin)
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
      callBackWhenWin(a, b, c);
      return squares[a];
    }
  }
  return null;
}

export default Game;
