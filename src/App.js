import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function Key(props)
{
    return (
      <button className="square"
        onClick={() => props.onClick()}
        >
        {props.value}
      </button>
    );
}

class Keyboard extends React.Component {

  renderKey(i) {
    return <Key 
             value={i}
             onClick= {() => this.handleClick(i) }
             />;
  }
  
  render() {
    const status = '';
    
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderKey(1)}
          {this.renderKey(2)}
          {this.renderKey(3)}
          {this.renderKey(4)}
          {this.renderKey(5)}
          {this.renderKey('<')}
        </div>
        <div className="board-row">
          {this.renderKey(6)}
          {this.renderKey(7)}
          {this.renderKey(8)}
          {this.renderKey(9)}
          {this.renderKey(0)}
          {this.renderKey('v')}
        </div>
        <div className="board-row">
        </div>
      </div>
    );
  }
}


function Header() {
  return (
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
      Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
    className="App-link"
    href="https://reactjs.org"
    target="_blank"
    rel="noopener noreferrer"
      >
      Learn React
    </a>
      </header>
      
  )   
}

function Status(props) {
  return (
      <div>{props.value}</div>
  )
}

function Operation(props) {
  return (
    <div>
      <h1 className="math-operation">
      {props.value.operation}
      </h1>      
      <h1 className="math-result">
      {props.value.result}
      </h1>
      <h1 className="math-result">
      {props.value.status}
      </h1>
    </div>
  )   
}

function getNumber10() {
    return Math.floor((Math.random() * 10) + 1);
}

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      operation: null,
      status: null,
      errors: null,
      operands: [null, null],
    }

    this.state = this.getNewOperation();
  }

  getNewOperation() {
    const a = getNumber10();
    const b = getNumber10();

    return { ...this.state, 
             operation: a.toString() + " + " + b.toString(),
             result : "",
             status: null,
             operands:[a, b],};
  }
  
  onNewOperation() {
    this.setState(this.getNewOperation());
  }

  handleKeyDown(event) {

    if (event.key === "Backspace") {
      const newResult = this.state.result.slice(0, this.state.result.length -1);
      this.setState( {...this.state, result: newResult} );
      console.log(this.state);
      return;
    }

    if (event.key in [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
      let newResult = this.state.result.slice();
      newResult += event.key;
      this.setState( {...this.state, result: newResult} );
      console.log(this.state);
      return;
    }

    if (event.key === "Enter") {
      if ( (this.state.operands[0] + this.state.operands[1]) === parseInt(this.state.result)  ) {
        this.setState( {...this.state, status: "true" } );
      } else {
        this.setState( {...this.state, status: "false", errors: this.state.errors +1} );
      }

      setTimeout(() => this.setState(this.getNewOperation()), 1000);
      return;
    }
  }
  
  componentDidMount() {
    this.handleKeyFunction = this.handleKeyDown.bind(this);
    document.addEventListener("keydown", this.handleKeyFunction, false);
  }
  
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyFunction, false);
    
  }
  
  
  render() {
    return (
    <div className="App">
        <Header/>
        <Status value={this.state.errors}/>
        <Operation value={this.state}/>
        <Keyboard/>
    </div>
    )
  }
  
}

function App() {
  return (
    <MainPage/>
  );
}

export default App;
