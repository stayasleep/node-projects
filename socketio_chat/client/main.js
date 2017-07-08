$(document).ready(initialize);

let socket = io();
console.log('sock',socket);

function initialize(){
    $('.submitBtn').on('click', pickUsername);
    $('.chatSubBtn').on('click', sendMsg);
    $('#m').on('value',function(){
        socket.emit("typing", true);
    });
    // listen for server respn
    socket.on("chat message",function(data){
        console.log("data rec'd from server",data);
        $('.messages').append($('<li>').text(data.user+": "+data.msg));
    })
    socket.on('typing',function(data){
        console.log('is typing recd from server',data);
    })
    socket.on("is online",function(data){
        console.log('who is online',data);
        //clear out prev child nodes/texts everytime list updates
        $('.amOnline').empty();
        for(j=0;j<data.length;j++){
            $('.amOnline').append($('<li>').text(data[j]).addClass(`${j}`));
        }
    })
    socket.on("disconnect",(data)=>{
        
    })
};

function pickUsername(){
    let userN = $('#un').val();
    console.log("username picked",userN);
    socket.emit("new user",userN,function(data){
        if(data){
            $('.userForm').hide();
            $('.chats').css('display','block');
        }
    })
    $('#un').val("");
    return false;
}

function sendMsg(){
    let sentMsg = $('#m').val();
    socket.emit("chat message",sentMsg);
    $('#m').val("");
    return false;
}
