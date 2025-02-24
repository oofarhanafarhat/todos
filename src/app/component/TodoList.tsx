"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Task {
  id: number;
  game: string;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const API_URL = "/api/game";

  // ✅ Tasks fetch karna
  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = await res.json();
      console.log("Fetched Data:", data);

      if (!Array.isArray(data)) throw new Error("Invalid data format");

      setTasks(data.filter((task) => task.game !== null)); // ✅ Null values remove
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Task bina refresh ke add karna
  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game: newTask }),
      });

      if (!res.ok) throw new Error("Failed to add task");

      const newTaskData: Task = await res.json();

      if (!newTaskData.id || !newTaskData.game) { 
        console.error("Invalid task data:", newTaskData);
        return;
      }

      setTasks((prevTasks) => [...prevTasks, newTaskData]); // ✅ UI turant update
      setNewTask(""); // ✅ Input clear
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // ✅ Task delete bina refresh ke
  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete task");

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)); // ✅ UI turant update
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#DD2476] p-4">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg w-80">
        <ul className="space-y-2">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center space-x-2 bg-white/30 p-2 rounded-md justify-between"
              >
                <div className="flex space-x-2">
                  <span className="w-3 h-3 bg-orange-500 font-bold rounded-full mt-2"></span>
                  <span className="text-white font-bold">{task.game}</span>
                </div>
                <button
                  className="text-red-400 hover:text-red-600 px-2 rounded-full"
                  onClick={() => deleteTask(task.id)}
                >
                  <Image src={"/v06.png"} width={15} height={15} alt="delete icon" />
                </button>
              </li>
            ))
          ) : (
            <p className="text-white text-center">No tasks yet!</p>
          )}
        </ul>
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-1 p-2 rounded-l-md outline-none text-black"
            placeholder="Write a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            className="bg-orange-500 p-2 rounded-r-md text-white hover:bg-orange-600"
            onClick={addTask}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
