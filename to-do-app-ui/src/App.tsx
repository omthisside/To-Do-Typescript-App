import React, { useEffect, useState } from 'react';
import './App.css';
import InputFeild from './components/InputFeild';
import { Todo } from './model';
import TodoList from './components/TodoList';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

const App: React.FC = () => {

  const charactersLimit = 100;

  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const savedTodos = JSON.parse(
      localStorage.getItem('react-todos-app-data') as string
    );
      if (savedTodos) {
        setTodos(savedTodos);
      }
  }, []);

  useEffect(() => {
    localStorage.setItem('react-todos-app-data', JSON.stringify(todos));
  }, [todos]);
  

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (todo) {
      setTodos([...todos, { id: Date.now(), todo, isDone: false}]);
      setTodo("");
    }
  };

  const onDragEnd = (result: DropResult) => {
    const {source, destination} = result;

    if (!destination) return;
    if (destination.droppableId===source.droppableId && destination.index === source.index) return;

    let add, 
        active = todos,
        complete = completedTodos;

    if(source.droppableId === 'TodosList') {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
    }

    if(destination.droppableId === 'TodosList') {
      active.splice(destination.index, 0, add);
    } else {
      complete.splice(destination.index, 0, add);
    }

    setCompletedTodos(complete);
    setTodos(active);
    console.log(result);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <span className="heading">Go-To-Do</span>
        <span className='charactersLimit'>{charactersLimit - todo.length} characters remaining</span>
        <InputFeild charactersLimit={charactersLimit} todo={todo} setTodo={setTodo} handleAdd={handleAdd}/>
        <TodoList todos={todos}
          setTodos={setTodos} 
          completedTodos={completedTodos} 
          setCompletedTodos={setCompletedTodos}/>
      </div>
    </DragDropContext>
  );
}

export default App;
