import { useState } from 'react';
import '../style/Player.css'
import PlayerControls from './PlayerControls';

function Player() {
    const [inputValue, setInputValue] = useState('0');

    const rangeHandler = (event) => {
        setInputValue(event.target.value);
    };

    return ( 
        <div className="player">
            <div className="player__progress">
                <input type="range" min={0} max="100" value={inputValue} className="range" onChange={rangeHandler}/>
            </div>
            <PlayerControls/>
        </div>
     );
}

export default Player;