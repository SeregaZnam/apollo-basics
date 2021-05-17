import './App.css';
import { useQuery } from '@apollo/client';
import ListTodos from './graphql/ListTodos.query.graphql'

function App() {
  const { loading, data: { todos } = {} } = useQuery(ListTodos);

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
