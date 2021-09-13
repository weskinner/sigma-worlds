import './App.css';
import Landing from "./Landing"
import Demo from "./Demo"
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import EarthWorlds from './EarthWorld';
import EarthWorldsSale from './EarthWorldsSale';
import Sales from './Sales';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/demo">
          <Demo></Demo>
        </Route>
        <Route path="/earth-worlds">
          <EarthWorlds></EarthWorlds>
        </Route>
        <Route path="/earth-worlds-sale">
          <EarthWorldsSale></EarthWorldsSale>
        </Route>
        <Route path="/sales">
          <Sales></Sales>
        </Route>
        <Route path="/">
          <Landing></Landing>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
