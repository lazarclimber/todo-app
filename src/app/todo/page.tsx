"use client"

import { Pencil, Save, Trash2 } from "lucide-react";
import { useState } from "react"

export default function TodoApp() {

	type Task = {
		id: number,
		checked: boolean,
		text: string,
		editable: boolean,
	}

	const [tasks, setTasks] = useState<Task[]>([]);
	const [inputText, setInputText] = useState<string>("");
	const [editText, setEditText] = useState<string>("");
	const [filter, setFilter] = useState<string>("");

	const filteredTasks = tasks.filter((task) => task.text.toLowerCase().includes(filter.toLowerCase()));

	const addNewTask = () => {
		if(inputText.length == 0) return;
		setTasks(prev=> [...prev, {id:tasks.length ,text: inputText, checked: false, editable: false}]);
		setInputText("");
	}

	const deleteTask = (selectedTask: Task) => {
		setTasks(prev => {
			const filtered = prev.filter(task => task.id !== selectedTask.id);
			const reindexed = filtered.map((task, index) => ({
				...task,
				id: index
			}));
			return reindexed;
		});
	};

	const handleCheckbox = (selectedTask: Task) => {
		setTasks((prev) =>
			prev.map((tasks) => 
				tasks.id == selectedTask.id ?
					{...tasks, checked: !tasks.checked}
					: tasks
			)
		)
		setFilter("");
	}

	const handleEdit = (selectedTask: Task) => {
		if(selectedTask.checked) return;
		setEditText(selectedTask.text);
		setTasks((prev) =>
			prev.map((tasks) => 
				tasks.id == selectedTask.id ?
					{...tasks, editable: true}
					: {...tasks, editable: false}
			)
		)
	}

	const handleSave = (selectedTask: Task) => {
		if(editText.length == 0) return;
		setTasks((prev) =>
			prev.map((tasks) => 
				tasks.id == selectedTask.id ?
					{...tasks, text: editText, editable: false}
					: {...tasks, editable: false}
			)
		)
	}

	const calculateCompletedTasks = () => {
		let numberOfTasks = 0;
		tasks.forEach((task) => {
			if(!task.checked) {
				numberOfTasks = numberOfTasks + 1;
			}
		})
		return (100 - (numberOfTasks / tasks.length * 100)).toFixed(0)
	}

	return(
		<>
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="flex font-mono flex-col py-5 px-10 gap-5 items-center border-2 border-gray-400 bg-gray-300 rounded-lg w-130 h-130">
					<h1 className="text-2xl">Todo App</h1>
					<div className="flex w-full border rounded-xl border-gray-400">
						<input
							value={inputText} 
							onChange={(e) => {
								setInputText(e.target.value)}
							}  
							onKeyDown={(e) => {if(e.key == 'Enter') addNewTask()}}
							type="text" 
							placeholder="What do you need to do"
							className="pl-3 bg-yellow-100 rounded-l-xl w-full h-full focus:outline-blue-500 placeholder:italic"
						/>
						<button 
							onClick={addNewTask}
							className="px-3 py-2 font-bold bg-blue-500 rounded-r-xl hover:bg-blue-400 active:bg-blue-300 text-white">
								ADD
						</button>
					</div>
					<div className={`${tasks.length == 0 && 'justify-center'} flex flex-col items-center h-full w-full border border-gray-400 rounded-xl bg-yellow-100 overflow-y-auto`}>
						{tasks.length > 0 && 
							<input 
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
								placeholder="Search for task" 
								type="text" 
								className="w-full pl-3 py-2 rounded-xl focus:outline-0 placeholder:italic"
							/>
						}
						{filteredTasks?.map((task, index) => (
							<div 	
								key={index}
								className="flex justify-between hover:bg-yellow-200 cursor-pointer border-b border-gray-400 last:border-0 items-center gap-10 py-2 px-3 w-full"
							>
								<div 
									className="flex gap-2"								
								>
									<input 										
										checked={task.checked} 
										onChange={()=> handleCheckbox(task)}
										type="checkbox" 
										name="" 
										id={task.id.toString()} 
									/>
									<input 
										type="text" 
										className={`${!task.editable ? 'focus:outline-0' : 'outline-2 outline-gray-500 rounded-lg'} ${task.checked ? 'line-through opacity-60' : ''}`}
										value={task.editable ? editText : task.text}
										onChange={(e) => {
											if(task.editable) {
												setEditText(e.target.value);
											}
										}}
										onKeyDown={(e) => {
											if(e.key === "Enter" && task.editable) {
												handleSave(task);
											}
										}}
										readOnly={!task.editable}
									/>
								</div>
								<div className="flex items-center gap-3">
									{task.editable ? 
										<Save 
											onClick={() => handleSave(task)}
											size={17}
										/> :
										<Pencil 
											onClick={() => handleEdit(task)}
											size={17}
										/>
									}									
									<Trash2
										onClick={() => deleteTask(task)}
										color="red" 
										size={17}
									/>
								</div>
							</div>
						))}
						{tasks.length == 0 && <p>No current tasks</p>}
						{filteredTasks.length == 0 && tasks.length > 0 && <p>No result</p>}					
					</div>
					{tasks.length > 0 && (
						<div className="flex justify-between w-full">
							<p>Total tasks: {tasks.length}</p>
							<p>Tasks completed: <span className={`font-bold text-lg ${calculateCompletedTasks() == '100' ? "text-green-600" : ""}`}>{calculateCompletedTasks()}%</span></p>
						</div>
					)}
				</div>
			</div>
		</>
	)
}