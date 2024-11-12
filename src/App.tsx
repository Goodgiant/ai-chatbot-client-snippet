import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  useEffect(()=> {
    let timeout: any;
    
    if (error.length > 0) {
      timeout = setTimeout(()=> setError(""), 5000);
    }

    return ()=> clearTimeout(timeout);
  }, [error])
  const [chatHistory, setChatHistory] = useState<{role: string, parts: {text: string}[]}[]>([]);

  const getResponse = async () => {
    if (!value) {
      setError('Please Enter a Value');
    } else {
      try {
        const options = {
          method: 'POST',
          body: JSON.stringify({
            history: chatHistory,
            message: `in less than 5 words: ${value}`,
          }),
          ContentType: "application/json",
        };

        const response = await fetch(
          'http://localhost:8000/chatbot',
          options
        );

        const data = await response.json();

        console.log({response});

             
        setChatHistory(prev=> ([
          ...prev,
          {
              role: "user",
              parts: [{text: value}],
          },
          {
              role: "model",
              parts: data.candidates?.[0]?.content?.parts,
          }
        ]));
        setValue("");

        console.log({ data });
      } catch (err: any) {
        console.error(err);
      }
    }
  };

  return (
    <div className='container'>
      <div className='intro'>
        <label>
          Talk to our Nutrition expert
          <input
            onChange={({ target }) => setValue(target.value)}
            type="text"
            value={value}
            placeholder="Enter text..."
          />
          {error && <p className='error'>{error}</p>}
        </label>
        <button onClick={getResponse}>Submit</button>
      </div>
      <div className={'history'}>
      {
        chatHistory.map((item, i)=> {

          return (
            <div className='messageItem' key={i}>
              <h6>{item.role}</h6>
              <p className='messageText'>{item.parts[0].text}</p>
            </div>
          )
        })
      }
      </div>
    </div>
  );
}

export default App;