const selectedTypeButton = document.querySelector(".selected-type-button");
const typeSelectBoxList = document.querySelector(".type-select-box-list");
const todoContentList = document.querySelector(".todo-content-list");
const typeSelectBoxListLis = document.querySelectorAll("li");
const selectedType = document.querySelector(".selected-type");
const completeCheck = document.querySelector(".complete-check");
const sectionBody = document.querySelector(".section-body");
const incompleteCountNumber = document.querySelector(".incomplete-count-number");

const modalContainer = document.querySelector(".modal-container");
const todoAddButton = document.querySelector(".todo-add-button");

let page = 1;
let totalPage = 0;

sectionBody.onscroll = () => {
	console.log(sectionBody.offsetHeight);
	console.log(sectionBody.scrollTop);
	console.log(todoContentList.clientHeight);
	
	let checkNum = todoContentList.clientHeight - sectionBody.offsetHeight - sectionBody.scrollTop;
	
	if(checkNum < 1 && checkNum > -1) {
		let newPage = page++;
		if(newPage < totalPage) {
			load();
		}
	}
}

let listType = "all";
load();

selectedTypeButton.onclick = () => {
    typeSelectBoxList.classList.toggle("visible");
}

/*selectedTypeButton.onblur = () => {
    if(!typeSelectBoxList.classList.contains("visible")) {
        typeSelectBoxList.classList.toggle("visible");
    }
}*/

for(let i = 0; i < typeSelectBoxListLis.length; i++) {
	typeSelectBoxListLis[i].onclick = () => {
		/*alert(i);*/
		page = 1;
		for(let i = 0; i < typeSelectBoxListLis.length; i++) {
			typeSelectBoxListLis[i].classList.remove("type-selected")
		}
		typeSelectBoxListLis[i].classList.add("type-selected");
		
		listType = typeSelectBoxListLis[i].textContent.toLowerCase();
		
		selectedType.textContent = typeSelectBoxListLis[i].textContent;
		
		todoContentList.innerHTML = '';
		load();
		
		/*selectedType.innerText = typeSelectBoxListLis[i].innerText;*/
		
		typeSelectBoxList.classList.toggle("visible");
	}
}

function load() {
    $.ajax({
        type : "get",
        url : `/api/v1/todolist/list/${listType}`,
        data : {
            "page": page,
            contentCount: 20
        },
        datatype : "json",
        success : (response) => {
            /*console.log(JSON.stringify(response));*/
            getList(response.data);
            /*if(response != null) {
                loadContent(response);
            }*/
        },
        error : 
            errorMessage
    });
}

function errorMessage(request, status, error) {
    alert("요청실패");
    console.log(request.status);
    console.log(request.responseText);
    console.log(error);
}

function setTotalCount(totalCount) {
	totalPage = totalCount % 20 == 0 ? totalCount / 20 : Math.floor(totalCount / 20) + 1;
}

function getList(data) {

	
	incompleteCountNumber.textContent = data[0].incompleteCount;
	
	setTotalCount(data[0].totalCount);
	
	for(let content of data) {
		const listContent = `
	    <li class="todo-content">
	        <input type="checkbox" id="complete-check-${content.todoCode}" class="complete-check" ${content.todoComplete ? 'checked' : ''}>
	        <label for="complete-check-${content.todoCode}"></label>
	        <div class="todo-content-text">${content.todo}</div>
	        <input type="text" class="todo-content-input visible">
	        <input type="checkbox" id="importance-check-${content.todoCode}" class="importance-check" ${content.importance ? 'checked' : ''}>
	        <label for="importance-check-${content.todoCode}"></label>
	        <div class="trash-button">
	            <i class="fa-solid fa-trash"></i>
	        </div>
	    </li>
		`
		todoContentList.innerHTML += listContent;
	}
	addEvent();
}

function addEvent() {
	const todoContent = document.querySelectorAll(".todo-content");
	
	for(let i = 0; i < todoContent.length; i++) {
		let todoCode = todoContent[i].querySelector(".complete-check").getAttribute("id");
		let codeIndex = todoCode.lastIndexOf("-");
		/*console.log(todoCode.substring(codeIndex + 1 , codeIndex + 4));*/
		let todo = todoCode.substring(codeIndex + 1);
		
		
		todoContent[i].querySelector(".complete-check").onchange = () => {
			updateCheckStatus("complete", todoContent[i], todo);
			
			let incompleteCount = parseInt(incompleteCountNumber.textContent);
			if(todoContent[i].querySelector(".complete-check").checked) {
				incompleteCount + 1;
				incompleteCountNumber.textContent = incompleteCount - 1;
			} else {
				incompleteCountNumber.textContent = incompleteCount + 1;
			}
			
		}
		todoContent[i].querySelector(".importance-check").onchange = () => {
			updateCheckStatus("importance", todoContent[i], todo);
		}
		
		todoContent[i].querySelector(".trash-button").onclick = () => {
			deleteTodo(todoContent[i], todo);
		}
		
		const todoContentText = todoContent[i].querySelector(".todo-content-text");
		const todoContentInput = todoContent[i].querySelector(".todo-content-input");
		let todoContentValue = null;
		let eventFlag = false;
		
		todoContentText.onclick = () => {
			todoContentInput.value = todoContentText.textContent;
			todoContentValue = todoContentInput.value;
			todoContentText.classList.toggle("visible");
			todoContentInput.classList.toggle("visible");
			todoContentInput.focus();
			eventFlag = true;
		}
		
		let updateTodoContent = () => {
			if(todoContentValue != todoContentInput.value) {
				$.ajax({
					type: "put",
					url: `/api/v1/todolist/todo/${todo}`,
					contentType: "application/json",
					data: JSON.stringify({
						todo : todoContentInput.value
					}),
					async: false,
					dataType: "json",
					success: (response) => {
						console.log(response.data);
					}
				});
			}
			todoContentText.classList.toggle("visible");
			todoContentInput.classList.toggle("visible");
		}
		
		todoContentInput.onblur = () => {
			if(eventFlag) {
				updateTodoContent();
			}
		}
		
		todoContentInput.onkeyup = () => {
			if(window.event.keyCode == 13) {
				eventFlag = false;
				updateTodoContent();
			}
		}
	}
}

function updateStatus(type, todoCode) {
	result = false;
	
	$.ajax({
		type: "put",
		url: `/api/v1/todolist/${type}/todo/${todoCode}`,
		async: false,
		dataType: "json",
		success: (response) => {
			result = response.data;
		},
		error:
			errorMessage
	})
	return result;
}

function updateCheckStatus(type, todoContent, todoCode) {
	updateStatus(type, todoCode);
	if(((type == "complete" && (listType == "complete" || listType == "incomplete"))
		|| (type == "importance" && listType == "importance"))
	) {
		todoContentList.removeChild(todoContent);
	}
}

function deleteTodo(todoContent, todoCode) {
	$.ajax({
		type: "delete",
		url: `/api/v1/todolist/todo/${todoCode}`,
		async: false,
		dataType: "json",
		success: (response) => {
			if(response.data) {
				todoContentList.removeChild(todoContent);
			}
		},
		error: errorMessage
	});
}

todoAddButton.onclick = () => {
	modalContainer.classList.toggle("modal-visible");
	todoContentList.style.overflow = "hidden";

	setModalEvent();
}

function claerModalTodoInputValue(modalTodoInput) {
	modalTodoInput.value = "";
}

function setModalEvent() {
	const modalCloseButton = modalContainer.querySelector(".modal-close-button");
	const modalTodoInput = modalContainer.querySelector(".modal-todo-input");

	const modalCommitButton = modalContainer.querySelector(".modal-commit-button");
	modalTodoInput.focus();

	modalContainer.onclick = (e) => {
		if(e.target == modalContainer) {
			modalCloseButton.click();
		}
	}

	modalCloseButton.onclick = () => {
		modalContainer.classList.toggle("modal-visible");
		todoContentList.style.overflow = "auto";	
		claerModalTodoInputValue(modalTodoInput);
	}
	
	modalTodoInput.onkeyup = () => {
		if(window.event.keyCode == 13) {
			modalCommitButton.onclick();
		}
	}
	
	modalCommitButton.onclick = () => {
		data = {
			importance: false,
			todo: modalTodoInput.value
		}
		addTodo(data);
		modalCloseButton.onclick();
	}
}

function addTodo(todo) {
	$.ajax({
		type: "post",
		url: "/api/v1/todolist/todo",
		contentType: "application/json",
		data: JSON.stringify(todo),
		async: false,
		dataType: "json",
		success: (response) => {
			console.log(response.data);
			if(response.data) {
				todoContentList.innerHTML = '';
				load();
			}
		},
		error: errorMessage
	})
}
