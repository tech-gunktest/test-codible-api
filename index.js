const express = require('express');
const app = express();
process = require('child_process');
fs = require('fs');

app.use(express.urlencoded({ extended: false }))// server to understand what app data is
app.use(express.json())

function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/file.html')
})

app.post('/compile/python', (req, res)=>{
    const code = req.body.code
    const input = req.body.input
    const args = ['-c', code]
    const py = process.spawn('python3', args)
if(input){
    py.stdin.write(input)
    py.stdin.end()
}
    py.stdout.on('data', (data)=>{
        res.send(data.toString())
    })
})

app.post('/compile/node', (req, res)=>{
    var f= getRandomString(16)+'.js'
    if(fs.existsSync(f)){
        f= getRandomString(8)+'.js'
    }else{
    fs.writeFile(f, req.body.code, (err)=>{
        if(err) throw err;
    })
}
    const node = process.spawn('node', [f])
    node.stdout.on('data', (data)=>{
        res.send(data.toString())
    })
});

app.post('/compile/cpp', (req, res)=>{
    var f= getRandomString(16)+'.cpp'
    if(fs.existsSync(f)){
        f= getRandomString(8)+'.cpp'
    }else{
    fs.writeFile(f, req.body.code, (err)=>{
        if(err) throw err;
    })
}
    const gpp = process.spawn('g++', [f])
    gpp.stdout.on('data', (data)=>{
        res.send(data.toString())
    })
})
app.listen(process.env.PORT || 3000);
