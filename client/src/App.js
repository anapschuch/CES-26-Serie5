import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: { "itens": [] }, click: false }
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  };

  callApi = async () => {
    const response = await fetch('/api/dados');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  sendApi = () => {
    fetch('api/enviar', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.data)
    })
  };

  showData = () => {
    if (this.state !== null && this.state.click) {
      if (this.state.data.itens.length > 0) {
        return (
          <div>
            <table>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Idade</th>
              </tr>
              {this.state.data.itens.map(function (item) { return (<tr><td>{item.Nome.toString()}</td><td>{item.Idade}</td></tr>) })}
            </table>
          </div>
        )
      } else {
        return (null)
      }
    }
    else {
      return (null)
    }
  };

  checkClicks = () => {
    if(this.state.click){
      this.setState({click: false});
    } else {
      this.setState({click: true});
    }
  }

  addNewElement = (item) => {
    let novoEstado = { "Nome": item.Nome, "Idade": item.Idade };
    this.setState(state => {
      return { data: { "itens": [...state.data.itens, novoEstado] } }
    }, this.sendApi)
  };

  render() {
    return (
      <div id="myApp">
        <Form addData={this.addNewElement} />
        <button id="data" onClick={this.checkClicks}> Mostrar Dados</button>
        <p>{this.showData()}</p>
      </div>
    )
  };
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = { Nome: '', Idade: null };
  }

  formChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  formSubmitHandler = (event) => {
    event.preventDefault();
    if (!Number(this.state.Idade) || this.state.Idade < 0) {
      alert("Idade Inválida!" + this.state.Idade);
    } else {
      alert(this.state.Nome + " " + this.state.Idade + " inserido com sucesso!");
      this.props.addData(this.state);
    }
  };

  render() {
    return (
      <div>
        <form id="formDados" onSubmit={this.formSubmitHandler}>
          <h3>Olá! Insira seus dados!</h3>
          <p>Nome:</p>
          <input type='text' name='Nome' onChange={this.formChangeHandler} />
          <p>Idade:</p>
          <input type='number' name='Idade' onChange={this.formChangeHandler} />
          <button type="submit">Enviar</button>
        </form>
      </div>
    )
  };
}
export default App;