import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import BackspaceIcon from '@material-ui/icons/Backspace';

import './App.css';

const imageHeight = window.innerHeight*0.3;
const OperationFontSizeFactor = 2.9*window.innerHeight/1024.0;
const textFontSize = (OperationFontSizeFactor).toString() + 'rem';
console.log("textFontSize", textFontSize);

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex" style={{
        verticalAlign:'middle'
    }}>
      <CircularProgress variant="determinate" {...props}/>
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};


function TopWindow () {
  return (
    <div 
      style={{
        margin: 0,
        padding:0,
        backgroundImage: 'url(sam.jpg)',
        backgroundSize: "cover",
        height: imageHeight,
        color: "#f5f5f5"
      }}
    />
  );
}


function Key(props)
{
  return (
    <Button fullWidth='True' style={{fontSize: 'inherit'}}
            onClick={() => props.onClick()}
    >
      {props.value}
    </Button>
  );
}

class Keyboard extends React.Component {

  renderKey(i) {
    return <Key
             value={i}
    onClick= {() => this.props.onClick(i) }
/>;
  }
  
  render() {
    return (
      <Paper variant="outlined" style={{ fontSize: textFontSize}}>
        <ButtonGroup style={{ justifyContent:'center', display:'flex'}}>
          {this.renderKey(1)}
          {this.renderKey(2)}
          {this.renderKey(3)}
          {this.renderKey(4)}
          {this.renderKey(5)}
        </ButtonGroup>
        <ButtonGroup style={{ justifyContent:'center', display:'flex'}}>
          {this.renderKey(6)}
          {this.renderKey(7)}
          {this.renderKey(8)}
          {this.renderKey(9)}
          {this.renderKey(0)}
        </ButtonGroup>
        <ButtonGroup style={{ justifyContent:'space-around', display:'flex'}}>
          <IconButton color="primary" onClick={() => this.props.onBackspace()} style={{borderRadius: 0}}>
            <BackspaceIcon style={{fontSize: textFontSize}}/>
          </IconButton>
          <IconButton color="primary" onClick={() => this.props.onValidate()} style={{borderRadius: 0}}>
            <DoneIcon style={{fontSize: textFontSize}}/>
          </IconButton>
        </ButtonGroup>
      </Paper>      
    );
  }
}

function Status(props) {

  const iconSize = (OperationFontSizeFactor/1.5).toString() + 'rem';
  let errors = [];
  for (let i = 3; i > 0; i--) {
    const color = i > props.errors ? 'lightgrey' : 'black';
    errors.push(<ClearIcon style={{
      fontSize: iconSize,
      color: color,
      verticalAlign: 'middle'
    }}/>);
  }

  return (
    <Grid container justify="space-between" alignItems="center" style={{
      fontSize: iconSize
    }}>
      <Grid item>
      Level 1  
      </Grid>

      <Grid item>
        <CircularProgressWithLabel value={100} />
      </Grid>
      
      <Grid item>{errors}</Grid>
      </Grid>
  )
}

function RenderResult(props) {
  if (props.value.length === 0) {
    return (
      <div style={{color: 'lightgrey' ,textAlign: 'right', paddingLeft: '10px'}}>
        ?
      </div>      
    )
  }
  return (
    <div gutterBottom style={{textAlign: 'right', paddingLeft: '10px'}}>
      {props.value}
    </div>      
  )
  
}



function NewProgress(props) {
  let style = {
    height: '5px',
    width: '1px',
    marginLeft: '0%',
    border: '0'
  };

  const className= props.reset ? "progress-exit" : "progress-enter-active";
  return (
    <hr className={className}
      style={style}
    />
  )
}


function Operation(props) {

  // get max number of character to draw the line
  let maxCharacter = 0;
  if (props.value.operands[0] !== null) {
    const operand0 = props.value.operands[0].toString().length;
    maxCharacter = operand0 > maxCharacter ? operand0 : maxCharacter;
    const operand1 = props.value.operands[1].toString().length;
    maxCharacter = operand1 > maxCharacter ? operand1 : maxCharacter;
  }
  maxCharacter+=1;
  const lineSize = (0.65*maxCharacter*OperationFontSizeFactor).toString() +'rem';

  return (
    <Container style={{
      padding:0
    }}>

      <NewProgress reset={props.value.resetProgressTimer} style={{
        margin:0,
      }}/>
      
      <Container style={{
        marginLeft: '-30%',
        fontSize: textFontSize,
      }}>
        <div  style={{textAlign: 'right',
                      marginBottom: 5,
                     }}>
          {props.value.operands[0]}
        </div>
        <div  style={{textAlign: 'right',
                      marginBottom: 5,
                     }}>
          +  {props.value.operands[1]}
        </div>
        <hr style={{
          marginTop:0,
          marginBottom:0,
          color: 'black',
          backgroundColor: 'black',
          marginRight: '0%',
          width: lineSize,
          border: '2px solid black',
        }} />
        <RenderResult value={props.value.result}/>
        {/* {props.value.status} */}
      </Container>
      
    </Container>    
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
      resetProgressTimer: true,
      status: null,
      errors: null,
      operands: [null, null],
      timer:null
    }

    this.state = this.getNewOperation();
  }

  getNewOperation() {
    const a = getNumber10();
    const b = getNumber10();

    return { ...this.state, 
             result : "",
             resetProgressTimer: true,
             status: null,
             operands:[a, b],};
  }


  prepareNewOperation() {
    const newTimer = setTimeout(() => this.startNewOperation(), 100);
    let newState = {...this.state, resetProgressTimer: true, timer: newTimer};
    this.setState(newState);
  }

  startNewOperation() {
    const newTimer = setTimeout(() => this.evaluateEndOfTimer(), 3000);
    let newState = {...this.getNewOperation(), resetProgressTimer: false, timer: newTimer};
    this.setState(newState);
  }

  onNewOperation() {
    // clear previous timeout
    clearTimeout(this.state.timer);
    this.prepareNewOperation();

    // this.setState({...this.state, reset: false, timer: newTimer});
  }

  evaluateEndOfTimer() {
    if (!this.handleValidation(true)) {
      
    }
  }

  handleBackspace() {
    const newResult = this.state.result.slice(0, this.state.result.length -1);
    this.setState( {...this.state, result: newResult} );
  }
  handleNumber(i) {
    let newResult = this.state.result.slice();
    newResult += i;
    this.setState( {...this.state, result: newResult} );
    console.log(this.state);
  }
  
  handleValidation(checkEmptyResult) {

    if (!checkEmptyResult && this.state.result.length === 0) {
      return false;
    }

    let validate;
    if ( (this.state.operands[0] + this.state.operands[1]) === parseInt(this.state.result)  ) {
      this.setState( {...this.state, status: true, resetProgressTimer: true } );
      validate = true;
    } else {
      this.setState( {...this.state, status: false, resetProgressTimer: true, errors: this.state.errors +1} );
      validate = false;
    }

    this.onNewOperation();
    return validate;
  }
  
  handleKeyDown(event) {

    if (event.key === "Backspace") {
      this.handleBackspace();
      return;
    }

    if (event.key in [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
      this.handleNumber(event.key);
      return;
    }

    if (event.key === "Enter") {
      this.handleValidation();
      return;
    }
  }

  handleClick(i) {
    
    if (i in [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
      this.handleNumber(i);
      return;
    }
  }
  
  
  componentDidMount() {
    this.handleKeyFunction = this.handleKeyDown.bind(this);
    document.addEventListener("keydown", this.handleKeyFunction, false);
    document.addEventListener('touchmove', (e) => {e.preventDefault()}, { passive: false });
  }
  
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyFunction, false);
    
  }
  
  render() {
    
    return (
      <Container style={{
        padding:0,
        maring:0,
      }}>
        <TopWindow/>
        <Grid container
              direction="column"
              justify='space-evenly'
              style={{ height: window.innerHeight - imageHeight }}
        >
          <Grid item>
            <Status errors={this.state.errors}/>
            <Operation value={this.state}/>
          </Grid>
          <Grid item>
            <Keyboard
              value={this.state}
              onClick={(i) => this.handleClick(i) }
              onValidate={() => this.handleValidation() }
              onBackspace={() => this.handleBackspace() }
            />
          </Grid>

        </Grid>
      </Container>
    )
  }
}

function App() {
  return (
    <MainPage/>
  );
}

export default App;
