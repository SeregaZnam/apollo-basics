import './App.css';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import ListTodos from './graphql/ListTodos.query.graphql';
import AddTodoMutation from './graphql/AddTodo.mutation.graphql';

function App() {
  const { loading, data: { todos } = {} } = useQuery(ListTodos);
  const [addTodo] = useMutation(AddTodoMutation);

  const [newTodoText, setNewTodoText] = useState('');

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            {t.task}
            {t.complete}
          </li>
        ))}
      </ul>
      <hr />
      <input type="text" value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)} />

      <button
        onClick={() =>
          addTodo({
            variables: {
              text: newTodoText
            }
          })
        }
      >
        Add todo
      </button>
    </div>
  );
}

export default App;
