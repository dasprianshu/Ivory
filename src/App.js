import './style/App.css';
import Player from './components/Player';
import Navigation from './components/Navigation';

function App() {
	var sidebar_width = window.innerWidth/6;
  return (
    <div className="App">
		<div className='App-container'>
			<Navigation/>
        </div>
    </div>
  );
}

export default App;
