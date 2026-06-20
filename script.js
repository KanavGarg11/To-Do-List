// DOM SELECTIONS


let add_button = document.querySelector(".add_button") ;
let bg_blurr = document.querySelector(".bg_blurr") ;
let create_task = document.querySelector(".create_task") ;
let cancel_button = document.querySelector(".cancel_button") ;
let create_button = document.querySelector(".create_button") ;
let task_input = document.querySelector("#task_input") ;
let task_section = document.querySelector(".task_section") ;
let finished_tasks = document.querySelector(".finished_tasks") ;


// VARIABALES

let taskCount = 1 ;
let create_task_open = false ;


// EVENT FUNCTIONS

function taskCreation(eve)
{
    bg_blurr.style.visibility = "visible" ;
    create_task.style.visibility = "visible" ;

    create_task_open = true ;
    task_input.focus() ;
}

function cancelClicked(eve)
{
    task_input.value = "" ;
    bg_blurr.style.visibility = "hidden" ;
    create_task.style.visibility = "hidden" ;

    create_task_open = false ;
}

function createTaskHtml(id) {
    let new_task_html = `<div class="mover option">
                        <div class = "mover_popup popup">
                                Re-order
                        </div>
                    </div>

                    <div class="date" id = "date_${id}">
                    </div>
        
                    <div class="task_name" id = "task_name_${id}">
                    </div>
        
                    <div class="options">
        
                        <div class="tick_box option">

                            <div class="tick_box_popup popup">
                                Mark Completed
                            </div>
                    
                            <label for="tick_2">
                            </label>
                            <input type="checkbox" id="tick_${id}" class = "tick" placeholder="">

                        </div>
        
                        <div class="delete_button option">
                            <div class = "delete_popup popup">
                                Delete Task
                            </div>
                        </div>
        
                        <div class="star_button option">

                            <div class = "star_popup popup">
                                Star The Task
                            </div>
                            
                        </div>
        
                    </div>`
    return new_task_html ;
}

function createTask(eve)
{
    taskCount += 1 ;

    let new_task = document.createElement("div") ;

    new_task.classList.add("task") ;
    new_task.classList.add("unstarred") ;
    new_task.id = "task_" + taskCount ;

    new_task.innerHTML = createTaskHtml(taskCount) ;

    let date = new_task.querySelector(`#date_${taskCount}`) ;
    let content = new_task.querySelector(`#task_name_${taskCount}`) ;

    // --------DATE OBBTAINING-----------------
    const now = new Date() ;
    const day = String(now.getDate()).padStart(2, '0') ;
    const month = String(now.getMonth() + 1).padStart(2, '0') ;
    const year = String(now.getFullYear() % 100).padStart(2, '0') ;
    const formattedDate = `${day}/${month}/${year}` ;
    //------------------------------------------

    date.innerText = formattedDate ;
    content.innerText = task_input.value.trim() ;

    task_section.append(new_task) ;

    attachDragEvents(new_task);

    task_input.value = "" ;
    bg_blurr.style.visibility = "hidden" ;
    create_task.style.visibility = "hidden" ;
    
    create_task_open = false ;
    // -----------DELETE FUNCTIONALITY------------------------
    let delete_button = new_task.querySelector(".delete_button");

    delete_button.addEventListener("click", function () {
        new_task.remove();
    });
    
    //--------------------------------------------------------


    // -----------STAR FUNCTIONALITY-------------------------

    let star_button = new_task.querySelector(".star_button");

    star_button.addEventListener("click" , (eve) =>
    {
        if (new_task.classList.contains("unstarred"))
        {
            star_button.style.backgroundImage = `url("https://cdn-icons-png.flaticon.com/512/8212/8212616.png")` ;

            task_section.prepend(new_task) ;

            new_task.classList.remove("unstarred") ;
            new_task.classList.add("starred") ;
        }
        else
        {
            star_button.style.backgroundImage = `url("https://www.iconpacks.net/icons/1/free-star-icon-984-thumb.png")` ;

            task_section.append(new_task) ;

            new_task.classList.add("unstarred") ;
            new_task.classList.remove("starred") ;
        }
    }) ;

    //-------------------------------------------------------


    // -----------TASK DONE FUNCTIONALITY---------------------

    let tick = new_task.querySelector(".tick");

    tick.addEventListener("change", (eve) => {
        if (eve.target.checked) {
            finished_tasks.append(new_task);
            new_task.classList.add("deleted_task_class_list");
            star_button.style.pointerEvents = "none";
        } else {
            new_task.classList.remove("deleted_task_class_list");
            if (new_task.classList.contains("unstarred")) {
                task_section.append(new_task);
            }
            else {
                task_section.prepend(new_task) ;
            }
            star_button.style.pointerEvents = "auto";
        }
    });

    //-------------------------------------------------------

}


function attachDragEvents(taskElement) {
    let mover = taskElement.querySelector(".mover");

    // Restrict dragging to the mover handle only
    mover.addEventListener("mousedown", () => taskElement.setAttribute("draggable", "true"));
    mover.addEventListener("mouseup", () => taskElement.removeAttribute("draggable"));
    mover.addEventListener("mouseleave", () => taskElement.removeAttribute("draggable"));

    // Handle the actual drag start and end
    taskElement.addEventListener("dragstart", () => taskElement.classList.add("dragging"));
    taskElement.addEventListener("dragend", () => {
        taskElement.classList.remove("dragging");
        taskElement.removeAttribute("draggable"); 
    });
}




function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".task:not(.dragging)")];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


// EVENT LISTENERS

add_button.addEventListener("click" , taskCreation) ;

cancel_button.addEventListener("click" , cancelClicked) ;

create_button.addEventListener("click" , createTask) ;

create_task.addEventListener("keydown" , (eve) =>
{
    if (eve.key == "Enter") {
        if (create_task_open == true) {
            createTask();
        }
    }
    else if (eve.key == "Escape") {
        if (create_task_open == true) {
            task_input.value = "";
            bg_blurr.style.visibility = "hidden";
            create_task.style.visibility = "hidden";

            create_task_open = false;
        }
    }
    return ;
}) ;


task_section.addEventListener("dragover", (eve) => {
    eve.preventDefault(); 
    
    const afterElement = getDragAfterElement(task_section, eve.clientY);
    const draggable = document.querySelector(".dragging");
    
    if (draggable) {
        if (afterElement == null) {
            task_section.appendChild(draggable);
        } else {
            task_section.insertBefore(draggable, afterElement);
        }
    }
}) ;