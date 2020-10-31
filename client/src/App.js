import './App.css';
import React from 'react';

class App extends React.Component {
  // os dados do arquivo dados.json (que contém os nomes e idades já incluídos no formulário) 
  // são adicionados no elemento data  
  constructor(props) {
    super(props);
    this.state = { data: { "itens": [] }, click: false }
  };

  // pegar os dados quando a pagina é carregada
  componentDidMount(){
    this.loadDados();
  }

  loadDados = () => {
    this.callApi()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  };

  // função que pega os dados da api
  callApi = async () => {
    const response = await fetch('/api/dados');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  // função que envia os dados para a api
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

  // mostra os dados na tabela da página
  showData = () => {
    if (this.state !== null && this.state.click) {
      if (this.state.data.itens.length > 0) {
        return (
          <div>
            <table>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col" id="tddir">Idade</th>
              </tr>
              {this.state.data.itens.map(function (item) { return (<tr><td>{item.Nome.toString()}</td><td id="tddir">{item.Idade}</td></tr>) })}
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

  // verifica se o botão "mostrar dados" foi clicado e troca o estado da variavel clicks
  // o estado é util para atualizar os dados da tabela na página
  checkClicks = () => {
    if(this.state.click){
      this.setState({click: false});
    } else {
      this.setState({click: true});
      this.loadDados();
    }
  }

  // função para adicionar novo elemento em data
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

// classe para implementar o formulário que capta
// o nome e a idade
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = { Nome: '', Idade: null };
  }

  // função para verificar quando algo foi alterado
  // no formulário
  formChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  // função para tratar submissão
  formSubmitHandler = (event) => {
    event.preventDefault();
    if (this.state.Idade < 0) {
      alert("Idade Inválida! " + this.state.Idade);
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