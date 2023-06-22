package com.springboot.todolist.web.controller.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.todolist.service.todo.TodoService;
import com.springboot.todolist.web.dto.CMRespDto;
import com.springboot.todolist.web.dto.todo.CreateTodoReqDto;
import com.springboot.todolist.web.dto.todo.TodoListRespDto;
import com.springboot.todolist.web.dto.todo.UpdateTodoReqDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/todolist")
@RequiredArgsConstructor
public class TodoController {
	private final TodoService todoService;
	
	@PostMapping("/todo")
	public ResponseEntity<?> addContent(@RequestBody CreateTodoReqDto createTodoReqDto) {
		
		try {
//			todoService.createTodo(createTodoReqDto);
//			
			if(!todoService.createTodo(createTodoReqDto)) {
				throw new RuntimeException("DataBase Error");
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok().body(new CMRespDto<>(-1, "Adding todo failed", createTodoReqDto));
		}
		return ResponseEntity.ok().body(new CMRespDto<>(1, "success", createTodoReqDto));
	}
	
//	@GetMapping("/list")
//	public ResponseEntity<?> getTodoList(@RequestParam int page, int contentCount) {
//		List<TodoListRespDto> listRespDto = new ArrayList<TodoListRespDto>();
//		try {
//			listRespDto = todoService.getTodoList(page, contentCount);
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//			return ResponseEntity.ok().body(new CMRespDto<>(-1, page + "page list fail to load", listRespDto));
//		}
//		return ResponseEntity.ok().body(new CMRespDto<>(1, page + "page list success to load", listRespDto));
//	}
//	
//	@GetMapping("/list/importance")
//	public ResponseEntity<?> getImportanceTodoList(@RequestParam int page, int contentCount) {
//		List<TodoListRespDto> listRespDtos = null;
//		
//		try {
//			listRespDtos = todoService.getImportanceTodoList(page, contentCount);
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//			return ResponseEntity.ok().body(new CMRespDto<>(-1, page + "page importance list fail to load", listRespDtos));
//		}
//		
//		return ResponseEntity.ok().body(new CMRespDto<>(1, page + "page importance list success to load", listRespDtos));
//	}
	
	@GetMapping("/list/{type}")
	public ResponseEntity<?> getTodoList(@PathVariable String type, @RequestParam int page, int contentCount) {
		List<TodoListRespDto> list = null;
		try {
			list = todoService.getTodoList(type, page, contentCount);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.ok().body(new CMRespDto<>(-1, page + "page list fail to load", list));
		}
		return ResponseEntity.ok().body(new CMRespDto<>(1, page + "page list success to load", list));
	}
	
	@PutMapping("/complete/todo/{todoCode}")
	public ResponseEntity<?> setCompleteTodo(@PathVariable int todoCode) {
		boolean result = true;
		try {
			result = todoService.updateTodoComplete(todoCode);
			if(!result) {
				throw new Exception();
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok().body(new CMRespDto<>(-1, "fail", result));
		}
		return ResponseEntity.ok().body(new CMRespDto<>(1, "success", result));
	}
	
	@PutMapping("/importance/todo/{todoCode}")
	public ResponseEntity<?> setImportanceTodo(@PathVariable int todoCode) {
		boolean result = true;
		try {
			result = todoService.importanceTodoComplete(todoCode);
			if(!result) {
				throw new Exception();
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok().body(new CMRespDto<>(-1, "fail", result));
		}
		return ResponseEntity.ok().body(new CMRespDto<>(1, "success", result));
	}
	
	@PutMapping("/todo/{todoCode}")
	public ResponseEntity<?> setContentTodo(@PathVariable int todoCode, @RequestBody UpdateTodoReqDto updateTodoReqDto) {
		updateTodoReqDto.setTodoCode(todoCode);
		boolean result = false;
		
		try {
			result = todoService.updateContentTodo(updateTodoReqDto);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.ok().body(new CMRespDto<>(-1, "fail to update content", result));
		}
		
		return ResponseEntity.ok().body(new CMRespDto<>(1, "success to update content", result));
	}
	
	@DeleteMapping("/todo/{todoCode}")
	public ResponseEntity<?> deleteContentTodo(@PathVariable int todoCode) {
		boolean result = false;
		try {
			result = todoService.deleteContentTodo(todoCode);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok().body(new CMRespDto<>(-1, "failed", result));
		}
		return ResponseEntity.ok().body(new CMRespDto<>(1, "success", result));
	}
	
}

