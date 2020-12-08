import React from 'react';
import './App.css';
import ListaContratos from "./ListaContratos";
import ReadSubasta from "./components/ReadSubasta";
import SubastaForm from "./components/SubastaForm";
import Manager from "./components/Manager"

class App extends React.Component {
  state = { loading: true, drizzleState: null, contrato: false };
  contractoAsignado = null;
  visualizacionContrato = false;
  nameContract = "";
  componentDidMount() {
    const { drizzle } = this.props;

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        //const chainId = drizzle.web3.eth;
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getTxStatus = () => {
    const { drizzle } = this.props;
    return drizzle.contracts;
  };

  getContract = (contrato) => {
    this.setState({ conContrato: true })
  }

  changeViewSubasta(subasta, flag) {
    if (subasta)
      this.nameContract = subasta.name;
    this.setState({ contrato: flag });
  }


  render() {
    const { drizzle } = this.props
    if (this.state.loading) return "Loading Drizzle...";
    if (!this.state.contrato)
      return (
        <div className="App">
          <header>
            <h1>Subastas en Linea</h1>
          </header>
          <div >
            <Manager drizzle={drizzle} drizzleState={this.state.drizzleState} changeViewSubasta={this.changeViewSubasta.bind(this)} />
          </div>
        </div>
      );
    else
      return (
        <div className="App">
          <header>
            <h1>Subastas en Linea</h1>
          </header>
          <div >
            <div>
              <input type="button" value="volver" className="ok-button" onClick={() => this.changeViewSubasta(null, false)} />
            </div>
            <ReadSubasta drizzle={drizzle} drizzleState={this.state.drizzleState} nameContract={this.nameContract} />
          </div>
        </div>
      );
  }
}

export default App;
