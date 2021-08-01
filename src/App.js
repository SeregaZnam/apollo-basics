import './App.css';
import { useState } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import ListTodosQuery from './graphql/ListTodos.query.graphql';
import AddTodoMutation from './graphql/AddTodo.mutation.graphql';
import EditTodoMutation from './graphql/EditTodo.mutation.graphql';
import RemoveTodoMutation from './graphql/RemoveTodo.mutation.graphql';
import NewTodoSubscription from './graphql/NewTodo.subscription.graphql';
import produce from 'immer';

function App() {
  const { loading, data: { todos } = {} } = useQuery(ListTodosQuery);

  useSubscription(NewTodoSubscription, {
    onSubscriptionData(data) {
      console.log('data', data);
    },
  });

  const [removeTodo] = useMutation(RemoveTodoMutation, {
    optimisticResponse: (vars) => ({
      removeTodo: [vars.id],
    }),
    update(cache, result) {
      console.log(cache, result);
    },
    onError(error) {
      console.log(error);
    },
  });
  const [addTodo] = useMutation(AddTodoMutation, {
    update(cache, result) {
      const listTodosQueryResults = cache.readQuery({ query: ListTodosQuery });

      const newListTodosQueryResults = produce(listTodosQueryResults, (draft) => {
        draft.todos.push(result.data.newTodo.node);
      });

      cache.writeQuery({
        query: ListTodosQuery,
        data: newListTodosQueryResults,
      });
    },
  });
  const [editTodo] = useMutation(EditTodoMutation);

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
            <button
              onClick={() => {
                const text = `[MODIFIED ${Math.random()} ${t.task}]`;

                const optimisticResponse = {
                  editTodo: {
                    __typename: 'TodoResponse',
                    node: {
                      __typename: 'Todo',
                      id: t.id,
                      task: `OPTIMISTIC ${t.task}`,
                    },
                  },
                };

                console.log(optimisticResponse);
                editTodo({
                  variables: {
                    id: t.id,
                    text,
                  },
                  optimisticResponse,
                  update(cache, result) {
                    console.log(JSON.stringify(result));
                  },
                });
              }}
            >
              Add modified
            </button>
            <button
              onClick={() => {
                removeTodo({
                  variables: {
                    id: t.id,
                  },
                });
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <input type="text" value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)} />

      <button
        onClick={() =>
          addTodo({
            variables: {
              text: newTodoText,
            },
            optimisticResponse: (vars) => ({
              newTodo: {
                node: {
                  complete: false,
                  id: `OPTIMISTIC-${Math.random()}`,
                  task: `OPTIMISTIC-${vars.text}`,
                },
              },
            }),
          })
        }
      >
        Add todo
      </button>
    </div>
  );
}

export default App;
