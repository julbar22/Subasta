import React from 'react';
import './App.css';
import ListaContratos from "./ListaContratos";
import ReadSubasta from "./components/ReadSubasta";
import SubastaForm from "./components/SubastaForm"

class App extends React.Component {
  state = { loading: true, drizzleState: null, subastas: [], conContrato: false };
  contractoAsignado = null;
  visualizacionContrato = false;
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
    alert("aqui no llega")
    console.log(contrato)
    this.setState({ conContrato: true })
  }


  render() {
    const { drizzle } = this.props
    if (this.state.loading) return "Loading Drizzle...";
    return (
      <div className="App">
        <header>
          <h1>Subastas en Linea</h1>
        </header>
        <div className="content">
          <div className="left">
            <SubastaForm drizzle={drizzle} drizzleState={this.state.drizzleState} />
          </div>
          <div className="right">
            <ReadSubasta drizzle={drizzle} drizzleState={this.state.drizzleState} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
