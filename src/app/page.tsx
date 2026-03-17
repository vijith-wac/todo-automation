"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type Filter = "all" | "active" | "completed";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("todos");
    return stored ? (JSON.parse(stored) as Todo[]) : [];
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() },
    ]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center pt-20 px-4">
      <h1 className="text-5xl font-bold text-gray-300 tracking-widest mb-8">
        TODOS
      </h1>

      {/* Input */}
      <div className="w-full max-w-lg bg-white rounded shadow flex items-center px-4 py-3 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="What needs to be done?"
          className="flex-1 outline-none text-gray-700 placeholder-gray-400"
        />
        <button
          onClick={addTodo}
          className="ml-2 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          +
        </button>
      </div>

      {/* Todo List */}
      {filtered.length > 0 && (
        <div className="w-full max-w-lg bg-white rounded shadow overflow-hidden mb-4">
          {filtered.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center px-4 py-3 border-b border-gray-100 last:border-b-0 group"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 rounded-full border-gray-300 mr-4 accent-green-500 cursor-pointer"
              />
              <span
                className={`flex-1 text-gray-700 ${
                  todo.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-lg"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {todos.length > 0 && (
        <div className="w-full max-w-lg bg-white rounded shadow flex items-center justify-between px-4 py-2 text-sm text-gray-400">
          <span>{activeCount} item{activeCount !== 1 ? "s" : ""} left</span>

          <div className="flex gap-2">
            {(["all", "active", "completed"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 rounded border ${
                  filter === f
                    ? "border-red-300 text-red-400"
                    : "border-transparent hover:border-gray-300"
                } capitalize`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={clearCompleted}
            className="hover:text-gray-600 transition-colors"
          >
            Clear completed
          </button>
        </div>
      )}
    </main>
  );
}
