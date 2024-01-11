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
            
            fs.writeFile(
                path.join(__dirname, 'users.json'),
                JSON.stringify(users),// Object To String Convert
                (err)=>{
                    if(err)throw err;
                    res.writeHead(201,{Location: "/"})
                    res.end()
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
                    res.writeHead(200,{'Content-type':'text/html'})
                    res.end('Login SuccesFully..!')
                 }
                 else{
                    res.writeHead(401,{'Content-type': 'text/html'})
                    res.end('Login Failed')
                 }
             })
        })
   }else if(url==='/' && method === "GET"){
    fs.readFile(path.join(__dirname,'Home.html'),(err,data)=>{
       if(err) throw err;
       res.writeHead(200,{'Content-Type':'text/html'})
       res.end(data)
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
