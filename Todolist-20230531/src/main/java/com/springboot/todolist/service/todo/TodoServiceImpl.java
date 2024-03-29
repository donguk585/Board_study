package com.springboot.todolist.service.todo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.springboot.todolist.domain.todo.Todo;
import com.springboot.todolist.domain.todo.TodoRepository;
import com.springboot.todolist.web.dto.todo.CreateTodoReqDto;
import com.springboot.todolist.web.dto.todo.TodoListRespDto;
import com.springboot.todolist.web.dto.todo.UpdateTodoReqDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService{
	private final TodoRepository todoRepository;
	
	@Override
	public boolean createTodo(CreateTodoReqDto createTodoReqDto) throws Exception {
		Todo todoEntity = createTodoReqDto.toEntity();
		return todoRepository.save(todoEntity) > 0;
		
//		String content = todoEntity.getTodo_content();
//		for(int i = 0; i < 200; i++) {
//			todoEntity.setTodo_content(content + "_" + (i + 1));
//			if(i % 2 == 0) {
//				todoEntity.setImportance_flag(1);
//			} else {
//				todoEntity.setImportance_flag(0);
//			}
//			todoRepository.save(todoEntity);
//		}
//		
//		return true;
	}
	
	@Override
	public List<TodoListRespDto> getTodoList(String type, int page, int contentCount) throws Exception {
		
		List<Todo> todoList = todoRepository.getTodoList(createGetTodoListMap(type, page, contentCount));

		return createTodoListRespDtos(todoList);
	}

//	@Override
//	public List<TodoListRespDto> getImportanceTodoList(int page, int contentCount) throws Exception {
//		
//		List<Todo> todoList = todoRepository.getImportanceTodoListofIndex(createGetTodoListMap(page, contentCount));
//		
//		return createTodoListRespDtos(todoList);
//	}
	
	private Map<String, Object> createGetTodoListMap(String type, int page, int contentCount) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("type", type);
		map.put("index", (page - 1) * contentCount);
		map.put("count", contentCount);
		
		return map;
	}
	
	private List<TodoListRespDto> createTodoListRespDtos(List<Todo> todoList) {
		List<TodoListRespDto> todoListRespDto = new ArrayList<TodoListRespDto>();
		todoList.forEach(todo -> {
			todoListRespDto.add(todo.toListDto());
		});
		
		return todoListRespDto;
	}

	@Override
	public boolean updateTodoComplete(int todoCode) throws Exception {
		
		return todoRepository.updateTodoComplete(todoCode) > 0;
	}

	@Override
	public boolean importanceTodoComplete(int todoCode) throws Exception {
			
		return todoRepository.importanceTodoComplete(todoCode) > 0;
	}

	@Override
	public boolean updateContentTodo(UpdateTodoReqDto updateTodoReqDto) throws Exception {
		
		return todoRepository.updateContentTodo(updateTodoReqDto.todoEntity()) > 0;
	}

	@Override
	public boolean deleteContentTodo(int todocode) throws Exception {
		return todoRepository.deleteContentTodo(todocode) > 0;
	}

}











