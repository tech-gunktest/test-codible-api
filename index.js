const express = require('express');
const app = express();
aprocess = require('child_process');
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
    const py = aprocess.spawn('python3', args)
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
    const node = aprocess.spawn('node', [f])
    node.stdout.on('data', (data)=>{
        res.send(data.toString())
    })
});

app.post('/compile/ruby', (req, res)=>{
    var f= getRandomString(16)+'.rb'
    if(fs.existsSync(f)){
        f= getRandomString(8)+'.rb'
    }else{
    fs.writeFile(f, req.body.code, (err)=>{
        if(err) throw err;
    })
}
    const ruby = aprocess.spawn('ruby', [f])
    ruby.stdout.on('data', (data)=>{
        res.send(data.toString())
    })
});

app.post('/compile/perl', (req, res)=>{
    var f= getRandomString(16)+'.pl'
    if(fs.existsSync(f)){
        f= getRandomString(8)+'.pl'
    }else{
    fs.writeFile(f, req.body.code, (err)=>{
        if(err) throw err;
    })
}
    const perl = aprocess.spawn('perl', [f])
    perl.stdout.on('data', (data)=>{
        res.send(data.toString())
    })
});

app.listen(process.env.port||4000, function(){
    console.log('listening on http://localhost:4000')
})
