// Load all posts (including soft-deleted)
async function LoadData() {
    let res = await fetch("http://localhost:3000/posts")
    let posts = await res.json();
    let body = document.getElementById("body_table");
    body.innerHTML = '';
    for (const post of posts) {
        let rowClass = post.isDeleted ? 'style="text-decoration: line-through;"' : '';
        body.innerHTML += `<tr ${rowClass}>
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.views}</td>
            <td>
                <input type="submit" value="Edit" onclick="EditPost(${post.id})"/>
                <input type="submit" value="Delete" onclick="Delete(${post.id})"/>
                <input type="submit" value="Comments" onclick="ShowComments(${post.id})"/>
            </td>
        </tr>`
    }
}

// Get max ID and calculate next ID
async function GetNextId() {
    let res = await fetch("http://localhost:3000/posts")
    let posts = await res.json();
    let maxId = 0;
    for (const post of posts) {
        let id = parseInt(post.id);
        if (id > maxId) {
            maxId = id;
        }
    }
    return (maxId + 1).toString();
}

// Edit post - load data into form
async function EditPost(id) {
    let res = await fetch('http://localhost:3000/posts/' + id)
    if (res.ok) {
        let post = await res.json();
        document.getElementById("id_txt").value = post.id;
        document.getElementById("title_txt").value = post.title;
        document.getElementById("view_txt").value = post.views;
    }
}

// Save post (Create or Update)
async function Save() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;
    
    if (!title || !views) {
        alert("Vui lòng nhập title và views");
        return false;
    }

    if (id) {
        // Update existing post
        let getItem = await fetch('http://localhost:3000/posts/' + id)
        if (getItem.ok) {
            let res = await fetch('http://localhost:3000/posts/'+id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    views: views,
                    isDeleted: false
                })
            });
            if (res.ok) {
                console.log("Cập nhật thành công");
                ClearForm();
                LoadData();
            }
        }
    } else {
        // Create new post with auto-increment ID
        try {
            let newId = await GetNextId();
            let res = await fetch('http://localhost:3000/posts', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: newId,
                    title: title,
                    views: views,
                    isDeleted: false
                })
            });
            if (res.ok) {
                console.log("Tạo mới thành công");
                ClearForm();
                LoadData();
            }
        } catch (error) {
            console.log(error);
        }
    }
    return false;
}

// Soft delete post
async function Delete(id) {
    if (confirm("Bạn có chắc muốn xoá bài viết này?")) {
        let res = await fetch("http://localhost:3000/posts/" + id, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isDeleted: true
            })
        })
        if (res.ok) {
            console.log("Xoá mềm thành công");
            LoadData();
        }
    }
    return false;
}

// Clear form
function ClearForm() {
    document.getElementById("id_txt").value = "";
    document.getElementById("title_txt").value = "";
    document.getElementById("view_txt").value = "";
}

// ===================== COMMENTS CRUD =====================

// Load comments for a post
async function ShowComments(postId) {
    let res = await fetch(`http://localhost:3000/posts/${postId}/comments`)
    let comments = await res.json();
    
    let commentsHtml = `<h3>Comments for Post ${postId}</h3>`;
    commentsHtml += `<div id="comments-list">`;
    
    for (const comment of comments) {
        if (!comment.isDeleted) {
            commentsHtml += `<div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
                <strong>${comment.name}</strong> (ID: ${comment.id})<br/>
                <span>${comment.body}</span><br/>
                <input type="submit" value="Edit Comment" onclick="EditComment(${postId}, ${comment.id})"/>
                <input type="submit" value="Delete Comment" onclick="DeleteComment(${postId}, ${comment.id})"/>
            </div>`;
        }
    }
    
    commentsHtml += `</div>`;
    commentsHtml += `<h4>Add New Comment</h4>`;
    commentsHtml += `<input type="text" id="comment_name_txt" placeholder="Name"/><br/>`;
    commentsHtml += `<textarea id="comment_body_txt" placeholder="Comment body"></textarea><br/>`;
    commentsHtml += `<input type="hidden" id="comment_id_txt" value=""/>`;
    commentsHtml += `<input type="submit" value="Save Comment" onclick="SaveComment(${postId})"/>`;
    commentsHtml += `<input type="submit" value="Back" onclick="LoadData()"/>`;
    
    document.getElementById("body_table").innerHTML = commentsHtml;
}

// Save comment (Create or Update)
async function SaveComment(postId) {
    let commentId = document.getElementById("comment_id_txt").value;
    let name = document.getElementById("comment_name_txt").value;
    let body = document.getElementById("comment_body_txt").value;
    
    if (!name || !body) {
        alert("Vui lòng nhập name và body");
        return false;
    }

    if (commentId) {
        // Update existing comment
        let res = await fetch(`http://localhost:3000/posts/${postId}/comments/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                body: body,
                isDeleted: false
            })
        });
        if (res.ok) {
            console.log("Cập nhật comment thành công");
            ShowComments(postId);
        }
    } else {
        // Create new comment with auto-increment ID
        try {
            let res = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    body: body,
                    isDeleted: false
                })
            });
            if (res.ok) {
                console.log("Tạo mới comment thành công");
                document.getElementById("comment_name_txt").value = "";
                document.getElementById("comment_body_txt").value = "";
                ShowComments(postId);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return false;
}

// Edit comment - load data
async function EditComment(postId, commentId) {
    let res = await fetch(`http://localhost:3000/posts/${postId}/comments/${commentId}`)
    if (res.ok) {
        let comment = await res.json();
        document.getElementById("comment_id_txt").value = comment.id;
        document.getElementById("comment_name_txt").value = comment.name;
        document.getElementById("comment_body_txt").value = comment.body;
    }
}

// Soft delete comment
async function DeleteComment(postId, commentId) {
    if (confirm("Bạn có chắc muốn xoá comment này?")) {
        let res = await fetch(`http://localhost:3000/posts/${postId}/comments/${commentId}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isDeleted: true
            })
        })
        if (res.ok) {
            console.log("Xoá mềm comment thành công");
            ShowComments(postId);
        }
    }
    return false;
}

LoadData();