const todos = document.querySelector('#todolist');
const form = document.querySelector('#form');

const renderTodos = (doc) => {
    let li = document.createElement('li');
    let todo = document.createElement('span');
    let cross = document.createElement('span');
    
    cross.setAttribute('id', 'cross')
    cross.textContent = 'x'
    li.setAttribute('data-id', doc.id);

    todo.textContent = doc.data().todo;
    li.appendChild(todo);
    li.appendChild(cross);
    todos.appendChild(li);

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('todolist').doc(id).delete();
    })
}

/*db.collection('todolist').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        console.log(doc.data());
        renderTodos(doc);
    })
}) */

form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('todolist').add({
        todo: e.target.name.value
    })
    form.name.value = "";
})

db.collection('todolist').onSnapshot(snapshot => {
    console.log(snapshot.docChanges());
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == "added") {
            renderTodos(change.doc)
        } else if (change.type == "removed") {
            let li = document.querySelector(`[data-id=${change.doc.id}]`)
            todos.removeChild(li);
        } 
    })
})
