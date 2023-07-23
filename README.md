Project use nodejs (express) , mongoose , mongoDB , JWT

Feature : authentication , post, comment, message

1 . signup 
- [POST] /api/authe/signup
  + body : { username : string, password : string , email : string , roles ? : Array(string) }
    + ROLES : user,admin,moderator
  + return object user
  
2 . signin
- [POST] /api/auth/signin
  + payload : {username , password}
  + return object  { ...user,accessToken,refreshTokenn}

3 . post
- getAll : [GET] /api/post?_page=1&_limt=2
- create : [POST] /api/post/create
  + payload : {userID,description,mediaURL,type}
  + return object post
- update : [PATCH] /api/post/update/:postID
- remove : [PATCH] /api/post/remove/:postID (soft delete)
- delete : [DELETE] /api/post/delete/:postID (delete)

4 . comment
- get array comment : [GET] /api/comment/:commentID
- get commentDetail : [GET] /api/detail/:commentDetailID
- create commentDetail : [POST] /api/comment/create
  + payload : {commentContent, userID, reply, commentID}
- array commentDetail [POST] : /api/details
  + payload : {ids : commentDetailID[]}

5. message
- get messagae : [GET] /api/message/message/:messageID
- get messageDetail : [GET] /api/messageDetail/:messageDetailID
- send message : [POST] /api/message/send
  + payload : {userID, content, reply, messageDetailID}
  + return : {message : success || error}
- /api/message/create-message-detail , /api/message/create-message ( auto when signup user ) : initial value default
