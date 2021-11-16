import './App.css';
import { useState, useCallback, useEffect } from "react";
import axios from 'axios';

function App() {
  const [text, setText] = useState<string>("");
  const [parsedData, setParsedData] = useState<string>(""); 
  const [title, setTitle] = useState<string>("");
  const [result, setResult] = useState<any[]>([]);

  const findIt = useCallback(
    async () => {
      setParsedData("");
      setResult([]);
      const { data } = await axios.request({
        method: 'GET',
        url: `https://cs.wikipedia.org/w/api.php?origin=%2A&format=json&action=query&prop=extracts&redirects=1&explaintext=&titles=${text}`,
      });
      if(!data.query) return;
      if(data.query?.length === 0) return;
      const firstKey = Object.keys(data.query.pages)[0];
      const { title, extract } = data.query.pages[firstKey];
      setTitle(title);
      setParsedData(extract.replace(/\([^()]*\)/g, ''));
    }, [text]
  );

  useEffect(
    () => {
      if(parsedData.length === 0) return;
      for(let i=0;i<3;i++) {
        setResult(prevResult => [...prevResult, parsedData.split('. ', i+1)[i] + '. ']);
      }
    }, [parsedData]
  )
  
  return (
    <div className="App">
      <p>Yo, dude najdi něco: </p>
      <input type="text" onKeyUp={ (e: any) => setText(e.target.value) } />
      <button onClick={ findIt }>LES GO</button>
      { setParsedData.length &&
        <div className="text-output">
          <p>{ title }</p>
          { result }
        </div>
      }
    </div>
  );
}

export default App;
