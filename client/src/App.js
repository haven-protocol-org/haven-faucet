import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
state = {
    isFetching:false,
    serverStatus:"",
    errorMessage:"Test",
    address:""
  };


    // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/claim',{
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({address:this.state.address})});


    const body = await response.json();

    if (response.status !== 200) {
      this.setState({errorMessage: body.message});
    }
    return body;
  };


  handleChange(event) {
    this.setState({address: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.callBackendAPI();
    
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Haven Stagenet Faucet</h1>
        </header>
        <form onSubmit={(e) => this.handleSubmit(e)}>
        <label>
          Name:
          <input placeholder="your Haven Stagenet address" type="text" value={this.state.address} onChange={(e) => this.handleChange(e)} />
        </label>
        <input type="submit" value="Claim" />
        <div className="error">{this.state.errorMessage}</div>
      </form>
        
      </div>
    );
  }
}

export default App;