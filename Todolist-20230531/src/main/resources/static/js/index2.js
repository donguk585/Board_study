const selectedTypeButton = document.querySelector(".selected-type-button");
const typeSelectBoxList = document.querySelector(".type-select-box-list");
const todoContentList = document.querySelector(".todo-content-list");
const typeSelectBoxListLis = document.querySelectorAll("li");
const selectedType = document.querySelector(".selected-type");
const sectionBody = document.querySelector(".section-body");


let page = 1;
let totalPage = 0;

listType = "all";
load();

selectedTypeButton.onclick = () => {
	typeSelectBoxList.classList.toggle("visible");
}

for(let i = 0; i < typeSelectBoxListLis.length; i++) {
	typeSelectBoxListLis[i].onclick = () => {
	page = 1;
	for(let i = 0; i < typeSelectBoxListLis.length; i++) {
		typeSelectBoxListLis[i].classList.remove("type-selected");
	}
	typeSelectBoxListLis[i].classList.add("type-selected");
	
	listType = typeSelectBoxListLis[i].textContent.toLowerCase();
	
	selectedType.textContent = typeSelectBoxListLis[i].textContent;
	
	todoContentList.innerHTML = '';
	load();
	
	typeSelectBoxList.classList.toggle("visible");
	}
}

sectionBody.onscroll = () => {
	let checkNum = todoContentList.clientHeight - sectionBody.offsetHeight - sectionBody.scrollTop;
	
	if(checkNum > -1 && checkNum < 1) {
		let newPage = page++;
		if(newPage < totalPage) {
			load();
		}
	}
}

function setTotalCount(totalCount) {
	totalPage = totalCount % 20 == 0 ? totalCount / 20 : Math.floor(totalCount / 20) + 1;
}

function load() {
	$.ajax ({
		type: "get",
		url: `/api/v1/todolist/list/${listType}`,
		data: {
			"page": page,
			contentCount: 20
		},
		dataType: "json",
		success: (response) => {
			getList(response.data);
		},
		error: errorMessage
	});
}

function errorMessage(request, status, error) {
    alert("요청실패");
    console.log(request.status);
    console.log(request.responseText);
    console.log(error);
}

function getList(data) {
	
	
	setTotalCount(data[0].totalCount);
	
	for(let content of data) {
		const listContent = `
		<li class="todo-content">
            <input type="checkbox" id="complete-check-${content.todoCode}" class="complete-check">
            <label for="complete-check-${content.todoCode}"></label>
            <div class="todo-content-text">${content.todo}</div>
            <input type="text" class="todo-content-input visible">
            <input type="checkbox" id="importance-check-${content.todoCode}" class="importance-check">
            <label for="importance-check-${content.todoCode}"></label>
            <div class="trash-button">
                <i class="fa-solid fa-trash"></i>
            </div>
        </li>
		`
		todoContentList.innerHTML += listContent;
	}
}

function addEvent() {
	const todoContent = document.querySelectorAll(".todo-content");
	
	for(let i = 0; i < todoContent.length; i++) {
		let todoCode = todoContent[i].querySelector(".complete-check").getAttribute("id");
		let index = todoCode.lastIndexOf("-");
		let todo = todoCode.substring(index + 1);
		
		todoContent[i].querySelector(".complete-check").onchange = () => {
			updateCheckStatus("complete", todoContent[i], todo);
		}
		todoContent[i].querySelector(".importance-check").onchange = () => {
			updateCheckStatus("importance", todoContent[i], todo);
		}
	}
}

function updateStatus(type, todoCode) {
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
	if(((type == "complete" &&(listType == "complete" || listType == "incomplete"))
		|| (type == "importance" && listType == " importance"))) {
			todoContentList.remove(todoContent);
		}
} 









