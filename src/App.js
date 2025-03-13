import React, { useCallback, useEffect } from "react";
import "./App.css";

function Todo({ todo, index, completeTodo, removeTodo }) {
  return (
    <div
      className="todo"
      style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}
    >
      {todo.text}
      <div>
        <button onClick={() => completeTodo(index)}>completed</button>
        <button onClick={() => removeTodo(index)}>delete</button>
      </div>
    </div>
  );
}

function TodoForm({ addTodo }) {
  const [value, setValue] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <form className='todo' onSubmit={handleSubmit}>
      <p> ÚJ FELADAT: </p>
      <input
        type="text"
        className="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}

function App() {
  const [todos, setTodos] = React.useState([]);

  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem("todos");
      if (storedTodos) setTodos(JSON.parse(storedTodos));
    } catch (err) {
      console.error("Nem sikerült betölteni a feladatokat :", err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (err) {
      console.log("Nem sikerült elmenteni a feladatot", err);
    }
  }, [todos]);

  const addTodo = useCallback((text) => {
    const newTodos = [...todos, { text, isCompleted: false }];
    setTodos(newTodos);
  },[todos])

  const completeTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].isCompleted = true;
    setTodos(newTodos);
  };

  const removeTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const saveToFile = () => {
    const data = localStorage.getItem("todos");
    if (!data) return;

    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a"); 
    downloadLink.href = url;
    downloadLink.download = "todos.txt";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="app">
      <div className="todo-list">
        {todos.map((todo, index) => (
          <Todo
            key={todo.text + index}
            index={index}
            todo={todo}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
          />
        ))}
        <button onClick={saveToFile}>Save to File</button>
        <TodoForm addTodo={addTodo} />
      </div>
    </div>
  );
}

export default App;
