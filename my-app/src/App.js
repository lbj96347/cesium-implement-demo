import React , {useEffect , useRef} from 'react'
import './App.css';
import Move from './page/Move';
import Point from './page/point';

function App() {


  return (
      <div style={{width:'100%'}}>
        <Move />
        <Point />
      </div>
  );
}

export default App;
