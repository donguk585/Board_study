package com.springboot.todolist.web.dto.todo;

import com.springboot.todolist.domain.todo.Todo;

import lombok.Data;

@Data
public class CreateTodoReqDto {
	private boolean importance;
	private String todo;
	
	/*
	 * toEntity
	 * 삼항연산자사용하여 true -> 1, false -> 0
	 */
	
	public Todo toEntity() {
		return Todo.builder()
				.importance_flag(importance ? 1 : 0)
				.todo_content(todo)
				.build();
	}
}
