import logo from './logo.svg';
import './App.css';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client/core';

function App() {
  const { loading, data: { todos } = {} } = useQuery(gql`
    
  `);

  if (loading) {
    return <div>Loading...</div>;
  }

  const addTodo = () => {}

  return (
    <div className="App">
      <ul>
        {todos.map((t) => (
          <li>
            {t.task}
            {t.complete}
          </li>
        ))}
      </ul>
      <hr />
      <input type="text" onChange={updateText} />

      <button onClick={addTodo}>Add todo</button>
    </div>
  );
}

export default App;
