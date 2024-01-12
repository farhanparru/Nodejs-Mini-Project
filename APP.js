 const http = require('http')
 const fs= require('fs')
 const path = require('path')

   const server = http.createServer((req,res)=>{
   const url = req.url.split('?')[0]
   const method = req.method

   if(url === '/Signup' && method==='GET'){
     fs.readFile(path.join(__dirname,'Signup.html'),(err,data)=>{
        if(err) throw err
         res.writeHead(200,{'Content-type':'text/html'})
         res.end(data)
     })
 //Posts in Node.js are used to create new resources. For example, when a user submits a form on a website, the form data is sent to the server using POST to create a new record in a database.
   }else if(url === '/Signup' && method==="POST"){
     let body = ""
     req.on('data', chunk =>{
         body +=chunk
     })
     //Event Module Node js: Event Emitter
     req.on("end", () => {
        const obj = parseBody(body);
  
        const username = obj.username;
        const password = obj.password;
        fs.readFile(path.join(__dirname, "users.json"), (err, data) => {
          if (err) throw err;
          const users = JSON.parse(data);
          const user = users.find((user)=>user.username === username);
          if(user){
              res.writeHead(409,{"Content-Type":"text/html"});
              res.end("<h1>User already exists");
              return
          }
        


          users.push({
            //unique user Data
            id: users.length + 1,
            username,
            password,
          });
          //secssion Cookise-create
            const session = {
                id:Math.floor(Math.random()*1000000000),
                username,
            }
          fs.readFile(path.join(__dirname,"sessions.json"),(err,data)=>{
            if(err)throw err;
            const sessions = JSON.parse(data)
            sessions.push(session)
            fs.writeFile(
              path.join(__dirname,"sessions.json"),
              JSON.stringify(sessions),
              (err)=>{
               if(err) throw err;
               //key values pirs session ids
               res.writeHead(302,{location:"/", 'Set-Cookie':`sessionId=${session.id}`})
               res.end()
            })
          })

            fs.writeFile(
                path.join(__dirname, 'users.json'),
                JSON.stringify(users),// Object To String Convert
                (err)=>{
                    if(err)throw err;
                   
              }
            )  
         })
         //Error [ERR_HTTP_HEADERS_SENT]: Cannot write headers after they are sent to the client
        //  res.end('ok')
     })
   }else if(url === '/login' && method === 'GET'){
     fs.readFile(path.join(__dirname,'login.html'),(err,data)=>{
        if(err)throw err ;
        res.writeHead(200,{'Content-type':'text/html'})
        res.end(data)
     })
   }else if(url === '/login' && method ==="POST"){
        let body = "";
        // req.on Is a Event EMitter (event Module)
        req.on('data',(chunk)=>{
            body +=chunk
        })
        req.on('end',()=>{
             const obj = parseBody(body)

             const username = obj.username
             const password = obj.password

             fs.readFile(path.join(__dirname,'users.json'),(err,data)=>{
                 if(err) throw err;
                 const users = JSON.parse(data)
                 // === checks if two values are equal, both in value and type
                 //The && (logical AND) operator indicates whether both operands are true
                 const user = users.find((user)=>user.username === username && user.password === password)
                 if(user){
                  const session = {
                    id: Math.floor(Math.random() * 1000000000),
                    username,
                  };
                  fs.readFile(
                    path.join(__dirname, "sessions.json"),
                    (err, data) => {
                      if (err) throw err;
                      const sessions = JSON.parse(data);
                      sessions.push(session);
                      fs.writeFile(
                        path.join(__dirname, "sessions.json"),
                        JSON.stringify(sessions),
                        (err) => {
                          if (err) throw err;
                          res.writeHead(302, {
                            Location: "/",
                            "Set-Cookie": `sessionId=${session.id}; HttpOnly`,
                          });
                          res.end();
                        }
                      );
                    }
                  ); 
                  }else{
                    res.writeHead(401,{'Content-type': 'text/html'})
                    res.end('Login Failed')
                 }
             })
        })
   }else if(url==='/' && method === "GET"){
    //Check Session
    if(!req.headers.cookie){
      res.writeHead(302, {Location: "/login"});
      res.end();
      return;
    }
    const sessionId = req.headers.cookie.split("=")[1]
    fs.readFile(path.join(__dirname,"sessions.json"),(err,data)=>{
      if(err)throw err;
      const sessions = JSON.parse(data)
      // sessionId check to Sessions using javascript find method(find used to searching)
      const secssion = sessions.find(secssion=> secssion.id === Number(sessionId) )
      console.log(secssion);
      if(secssion){
        fs.readFile(path.join(__dirname,'Home.html'),(err,data)=>{
          if(err) throw err;
          res.writeHead(200,{'Content-Type':'text/html'})
          res.end(data)
       })

      }else{
        //redirect To login
        res.writeHead(302,{location:'/login'}) 
      }
    })
     
 
   }
})

const PORT = "3000"
const IP = "127.0.0.1"


server.listen(PORT,IP, ()=>{
    console.log(`Server is running on http://${IP}:${PORT}/`);
})

function parseBody(body) {
    const obj ={}
    const kys = body.split('&')//username=farhan&password=4562 === [username=farhan,password=4526]
    for(let kv of kys){
        const [key,value]=kv.split('=')//[username,farhan]
        obj[key]=value // {username:farhan}
    }
    return obj
     
}
