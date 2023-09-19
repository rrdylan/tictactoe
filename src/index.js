    import * as React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    import App from './App';
    import reportWebVitals from './reportWebVitals';

    //---------------------------------------------------------------- Import MUI
    import Button from '@mui/material/Button';



    function Square(props) 
    {
        return (
            <button className={"square " + (props.isWin ? " square-win" : null)} onClick={props.onClick}>
            {props.value}
            </button>
        );
    }


    class Board extends React.Component {
        renderSquare(i) {
            return (
                <Square 
                    key={"square"+i} 
                    isWin={this.props.winningSquares.includes(i)}
                    value={this.props.squares[i]} 
                    onClick={() => this.props.onClick(i)} 
                />
            );
        }

        render(){
            let count = 0;
            return(
                <div>
                    {
                        [0,1,2].map((row)=>{
                            return (<div key={row} data-key={row} className="board-row">
                                {
                                    [0,1,2].map( (col) =>{
                                        return (this.renderSquare(count++));
                                    })
                                }
                            </div>)
                        })
                    }
                </div>
            );
        }
    }

    class Game extends React.Component {
        constructor(props) {
            super(props);
                        this.state = {
                            history: [{
                                squares: Array(9).fill(null),
                            }],
                            stepNumber: 0,
                            xIsNext: true,
                            pos: Array(9).fill(null),
                            order : "asc",
                        };
                    }
                    
                    handleClick(i) {
                        const history = this.state.history.slice(0, this.state.stepNumber + 1);
                        const current = history[history.length -1];
                        const squares = current.squares.slice();
                        const pos = this.state.pos.slice();
                        
                        if(calculateWinner(squares) || squares[i]) {
                            return;
                        }
                        
                        squares[i] = this.state.xIsNext ? 'X' : 'O';
                        pos[history.length] = i;
                        
                        this.setState({
                            history: history.concat([{
                                squares: squares,
                            }]),
                            stepNumber: history.length,
                            xIsNext: !this.state.xIsNext,
                            pos : pos,
                        });
                    }
                    
                    jumpTo(step) {
                        
                        this.setState({
                            stepNumber: step,
                            xIsNext: (step % 2) === 0,
                        });
                    }
                    
                    reverseHisto(m){
                        let list = document.getElementById("game-histo");
                        list.className = (list.className === "asc") ? "desc" : "asc";
                    }
                    
                    
                    render() {
                        const history = this.state.history;
                        const current = history[this.state.stepNumber];
                        const winner = calculateWinner(current.squares);
                        const pos = this.state.pos;
                        const moves = history.map((step, move) => {
                            
                            const desc = move ?
                            move + " - " + history[move].squares[pos[move]]+ " en " + 
                            ( pos[move]!=null ?
                                "[ " + Math.floor(pos[move]/3 +1) + ";" + (pos[move]%2+1)  + " ]" : 'vide' 
                                ) + "" 
                                : 'Restart';
                                
                                return (
                                    <li key={move}>
                                    <Button onClick={() => this.jumpTo(move)} className={move === this.state.stepNumber ? 'current' : 'history'}>{desc}</Button>
                                    </li>
                                    );
                                });
                                
                                let status;
                                
                                if(winner){
                                    status = winner.player + ' a gagné';
                                } else if(!current.squares.includes(null)){
                                    status = "Match nul !";
                                } else {
                                    status = 'Prochain joueur : ' + (this.state.xIsNext ? 'X' : 'O');
                                }
                                
                                return (
                                    <div className="game">
                                    
                                    <div className="game-board">
                                    <Board 
                                    winningSquares={winner ? winner.line : []}
                                    squares={current.squares} 
                                    onClick={(i) => this.handleClick(i)}  
                                    />
                                    
                                    </div>
                                    
                                    <div className="game-info">
                                    <div>{status}</div>
                                    
                                    <div className="info-StepNumber"> StepNumber :{this.state.stepNumber}</div>
                                    
                                    <div className="info-reverse">
                                    <Button onClick={()=> {this.reverseHisto()} }> Inverser Ordre </Button>
                                    </div>
                                    
                                    
                                    
                                    <ol id="game-histo" className={this.state.order}>{moves}</ol>
                                    </div>
                                    
                                    </div>
                                    );
                                }
                            }
                            
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
                                
                                for (let i = 0; i < lines.length; i++) 
                                {
                                    const [a, b, c] = lines[i];
                                    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) 
                                    {
                                        return { player: squares[a], line: lines[i] } ;
                                    }
                                }
                                return null;
                            }
                            
                            // =========================
    ReactDOM.render(
        <React.StrictMode>
            <Game />
        </React.StrictMode>,
        document.getElementById('root')
    );

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();