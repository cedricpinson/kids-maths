import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import BackspaceIcon from '@material-ui/icons/Backspace';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    alignContent: 'center',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },

}));


function TopWindow () {
  const imageWidth = window.screen.width > 414 ? window.screen.width : 414;
  const imageHeight = Math.round(imageWidth * 9.0 / 16);
  console.log('width=', imageWidth, 'height=', imageHeight);
  return (
    <div 
        style={{
          margin: 0,
          backgroundImage: 'url(sam.jpg)',
          backgroundSize: "cover",
          height: imageHeight,
          width: imageWidth,
          color: "#f5f5f5"
        }}
      />
  );
}


function Key(props)
{
    return (
      <Button fullWidth='True' style={{fontSize: "2.4em"}} 
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
      <Container>
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
              <BackspaceIcon style={{fontSize:'4rem'}}/>
            </IconButton>
            <IconButton color="primary" onClick={() => this.props.onValidate()} style={{borderRadius: 0}}>
              <DoneIcon style={{fontSize:'4rem'}}/>
            </IconButton>
          </ButtonGroup>
</Container>      
    );
  }
}

function Status(props) {
  return (
      <Paper>{props.value}</Paper>
  )
}

function Operation(props) {
  return (
    <Container style={{paddingTop: '50px'}}>
      <Typography variant="h2" component="h2" gutterBottom  style={{textAlign: 'center'}}>
      {props.value.operation}
      </Typography>      
      <Typography variant="h2" component="h2" gutterBottom style={{paddingLeft: '10px'}}>
      = {props.value.result}
      </Typography>      
      <h1>
      {props.value.status}
      </h1>
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
  handleValidation() {
      if ( (this.state.operands[0] + this.state.operands[1]) === parseInt(this.state.result)  ) {
        this.setState( {...this.state, status: "true" } );
      } else {
        this.setState( {...this.state, status: "false", errors: this.state.errors +1} );
      }

      setTimeout(() => this.setState(this.getNewOperation()), 1000);
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

    if (event.key === "Enter" && this.state.result.length > 0) {
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
  }
  
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyFunction, false);
    
  }
  
  render() {
    
    return (
      <Box >
        <TopWindow/>

        <Status value={this.state.errors}/>
        <Operation value={this.state}/>

        <Keyboard
      value={this.state}
      onClick={(i) => this.handleClick(i) }
      onValidate={() => this.handleValidation() }
      onBackspace={() => this.handleBackspace() }
        />
        </Box>
    )
  }
}

function App() {

  const classes = useStyles();

  return (
    <Container >
        <Grid container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.root}
        >
        
    <MainPage/>

        </Grid>
    </Container>

  );
}

export default App;
