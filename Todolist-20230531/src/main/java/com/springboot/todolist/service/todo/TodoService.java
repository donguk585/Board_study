package com.springboot.todolist.service.todo;

import java.util.List;

import com.springboot.todolist.web.dto.todo.CreateTodoReqDto;
import com.springboot.todolist.web.dto.todo.TodoListRespDto;
import com.springboot.todolist.web.dto.todo.UpdateTodoReqDto;

public interface TodoService {
	public boolean createTodo(CreateTodoReqDto createTodoReqDto) throws Exception;
	
	public List<TodoListRespDto> getTodoList(String type, int page, int contentCount) throws Exception;
	
//	public List<TodoListRespDto> getImportanceTodoList(int page, int contentCount) throws Exception;
	
	
	
	public boolean updateTodoComplete(int todoCode) throws Exception;
	
	public boolean importanceTodoComplete(int todoCode) throws Exception;
	
	public boolean updateContentTodo(UpdateTodoReqDto updateTodoReqDto) throws Exception;
	
	public boolean deleteContentTodo(int todocode) throws Exception;
}
