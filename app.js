// get reference
const todos = document.querySelector('#todolist');
const form = document.querySelector('#form');
const select = document.querySelector('#car');


// function for rendering todos fetched from firestore
const renderTodos = (doc) => {
    let li = document.createElement('li');
    let todo = document.createElement('span');
    let cross = document.createElement('span');
    let correct = document.createElement('i');
    let div = document.createElement('div');

    cross.setAttribute('id', 'cross')
    div.setAttribute('class', 'li-btn');
    li.setAttribute('data-id', doc.id);
    correct.setAttribute('class', 'fas fa-check-square');

    todo.textContent = doc.data().todo;
    cross.textContent = 'x';


    li.appendChild(todo);
    div.appendChild(correct);
    div.appendChild(cross);
    li.appendChild(div);
    todos.appendChild(li);
    // Event listener to delete selected todo
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.parentElement.getAttribute('data-id');
        db.collection('todolist').doc(id).delete();
    })
    // Event listener to identify selected todo as completed
    correct.addEventListener('click', (e) => {
        let id = e.target.parentElement.parentElement.getAttribute('data-id')
        db.collection('todolist').doc(id).update({
            completed: true
        })
    });
}

// rendering specific todos 
const renderPartial = (doc) => {
    let li = document.createElement('li');
    let todo = document.createElement('span');

    li.setAttribute('data-id', doc.id);
    todo.textContent = doc.data().todo;

    li.appendChild(todo);
    todos.appendChild(li);
}

/*db.collection('todolist').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        console.log(doc.data());
        renderTodos(doc);
    })
}) */

// add todo

form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('todolist').add({
        todo: e.target.name.value,
        completed: false
    })
    form.name.value = "";
});




// realtime Listener

db.collection('todolist').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == "added") {
            if (select.options[select.selectedIndex].value == "All" || select.options[select.selectedIndex].value == "Uncompleted") {
                renderTodos(change.doc)
            }
        }
        else if (change.type == "removed") {
            let li = document.querySelector(`[data-id=${change.doc.id}]`)
            todos.removeChild(li);
        }
    });
});



// conditional UI rendering

select.addEventListener('change', (e) => {
    todos.textContent = "";
    if (select.options[select.selectedIndex].value == "Completed") {
        db.collection('todolist').where('completed', '==', true).get().then(snapshot => {
            let docs = snapshot.docs;
            docs.forEach(doc => {
                
                renderPartial(doc);
            })
        })
    } else if (select.options[select.selectedIndex].value == "Uncompleted") {
        db.collection('todolist').where('completed' , '==', false).get().then(snapshot => {
            let docs = snapshot.docs;
            docs.forEach(doc => {
                renderPartial(doc);
            })
        })
    } else {
        db.collection('todolist').get().then(snapshot => {
            let docs = snapshot.docs;
            docs.forEach(doc => {
                renderTodos(doc);
            })
        })
    }
});
// The End :)
