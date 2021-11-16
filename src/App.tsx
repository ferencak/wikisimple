import { useState, useCallback, useEffect } from "react";
import axios from 'axios';

import './App.css';

const App = () => {
  const [text, setText] = useState<string>("");
  const [parsedData, setParsedData] = useState<string>(""); 
  const [title, setTitle] = useState<string>("");
  const [result, setResult] = useState<any[]>([null]);

  const findIt = useCallback(
    async () => {
      setParsedData("");
      setResult([]);
      const { data } = await axios.get(`https://cs.wikipedia.org/w/api.php?origin=%2A&format=json&action=query&prop=extracts&redirects=1&explaintext=&titles=${text}`);
      if(!data.query) return;
      const { title, extract } = data.query.pages[Object.keys(data.query.pages)[0]];
      if(!extract) return;
      setTitle(title);
      setParsedData(extract.replace(/\([^()]*\)/g, ''));
    }, [text]
  );

  useEffect(
    () => {
      if(!parsedData) return;
      let parsedSentence = parsedData.split('==', 1)[0];
      setResult(prevResult => [...prevResult, parsedSentence]);
    }, [parsedData]
  );
  
  return (
    <div className="App">
      <p>Yo, dude najdi něco: </p>
      <input type="text" onKeyUp={ (e: any) => setText(e.target.value) } />
      <button onClick={ findIt }>LES GO</button>
      { result.length > 0 ?
        <div className="text-output">
          <p>{ title }</p>
          { result }
        </div>
        : 
        <p>Nic jsem nenašel...</p>
      }
    </div>
  );
}

export default App;
