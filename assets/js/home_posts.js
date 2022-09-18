console.log("home js loaded");

{
    //method to send data to serve using AJAX
    function createPost(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(event){
            event.preventDefault();
            $.ajax({
                type:'post',
                url:'/post/create',
                data: newPostForm.serialize(),
                success: function(data){
                    addPostToDOM(data.data);
                    document.getElementById('post-input').value = '';
                },
    
                error: function(err){
                    console.log(err.responseText);
                }
            });
        });

        
    }
    createPost();



    //Method to add post to DOM

    function addPostToDOM(data){
        console.log("function");
        console.log(data.post.content);
        let postItem = document.createElement('li');
        postItem.innerHTML=
        `
        <h3>
            ${data.post.content}
            <a class="delete-post" id="delete-${data.post._id}" class="delete-post-button" href="/post/delete/${data.post._id}">Delete</a>
        </h3>
        <h4>${data.username}</h4>
       
        <form class = "createComment" method="POST" action = "/comment/create" id="comments-form-${data.post._id}">
            <input type = "text" name="content">
            <input type="submit" value="Comment">
            <input type = "text" value="${data.post._id}" hidden name="post">
        </form>
        
        `;
        postItem.classList.add('post-item');
        postItem.id = data.post._id;


    $('#posts-list').prepend(postItem);
    }

    // Method to remove a post from DB using AJAX
    function deletePost(element){
        $.ajax({
            type:'delete',
            url:"/post/delete/",
            data:{
                id:element
            },
            success:function(data){
                deletePostFromDOM(data)
            },
            error: function(err){
                console.log(err.responseText);
            }
        });
    }


    function deletePostFromDOM(data){
        let elementId = data.data.id.slice(7);
        let element = document.getElementById(elementId);
        element.remove();
    }
    
    document.addEventListener('click', function(event){
        if(event.target.classList[0] == 'delete-post'){
            event.preventDefault();
            deletePost(event.target.id);
        }
    });
}