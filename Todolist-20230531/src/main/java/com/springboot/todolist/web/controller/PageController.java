package com.springboot.todolist.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/todolist")
public class PageController {
	/*
	 * localhost: 8000/todolist/index
	 */
	@GetMapping("/index")
	public String indexPage() {
		return "index";
	}
}
