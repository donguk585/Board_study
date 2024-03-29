package com.springboot.todolist.domain.todo;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TodoRepository {
	public int save(Todo todo) throws Exception;
	
	public List<Todo> getTodoList(Map<String, Object> map) throws Exception;
	
//	public List<Todo> getImportanceTodoListofIndex(Map<String, Object> map) throws Exception;
	
	public int updateTodoComplete(int code) throws Exception;
	
	public int importanceTodoComplete(int code) throws Exception;
	
	public int updateContentTodo(Todo todo) throws Exception;
	
	public int deleteContentTodo(int code) throws Exception;
}
