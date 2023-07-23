Project use nodejs (express) , mongoose , mongoDB , JWT

Feature : authentication , post, comment, message

1 . signup 
- /api/authe/signup
- body : { username : string, password : string , email : string , roles ? : Array(string) }
  + ROLES : user,admin,moderator
- return object user
2 . signin
- /api/auth/signin
- body : {username , password}
- return object  { ...user,accessToken,refreshTokenn}
3 . post
- getAll : /api/post?_page?_limit
- create : /api/post/create
  + payload : {userID,description,mediaURL,type}
  + return object post
- update : /api/post/update/:postID
- remove : /api/post/remove/:postID (soft delete)
- delete : /api/post/delete/:postID (delete)
4 . comment
- get array comment : /api/comment/:commentID
- get commentDetail : /api/detail/:commentDetailID
- create commentDetail : /api/comment/create
  + payload : {commentContent, userID, reply, commentID}
- array commentDetail [POST] : /api/details
  + payload : {ids : commentDetailID[]}
5. message
- get messagae : /api/message/message/:messageID
- get messageDetail : /api/messageDetail/:messageDetailID
- send message : /api/message/send
  + payload : {userID, content, reply, messageDetailID}
  + return : {message : success || error}
- /api/message/create-message-detail , /api/message/create-message ( auto when signup user ) : initial value default
