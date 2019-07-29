```js
Todo.List = DefineList.extend("TodoList",{
    "#": Todo,
    completeAll(){
        return this.forEach((todo) => { todo.complete = true; });
    }
});

const todoConnection = restModel({
    Map: Todo,
    List: Todo.List,
    url: "/api/todos/{id}"
});
```
<span line-highlight='5-7,only'/>
