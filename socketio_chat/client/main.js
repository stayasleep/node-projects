$(document).ready(initialize);

let socket = io();
console.log('sock',socket);

function initialize(){
    $('.submitBtn').on('click', pickUsername);
    $('.chatSubBtn').on('click', sendMsg);
    $('#m').on('value',function(){
        socket.emit("typing", true);
    });

    // listen for server response when a chat msg comes in
    socket.on("chat message",function(data){
        console.log("data rec'd from server",data);
        $('.messages').append($('<li>').text(data.user+": "+data.msg));
    })
    socket.on('typing',function(data){
        console.log('is typing recd from server',data);
    })

    //event listener updating our list of who is online currently
    socket.on("is online",function(data){

        console.log('who is online',data);
        $('.amOnline').empty();
        for(j=0;j<data.length;j++){
            $('.amOnline').append($('<li>').text(data[j]).addClass(`${j}`));
        }
    })
    socket.on("name taken",function(data){
        if(socket.id === data){
        console.log("TAKKKKENNN",data);
        $('.nameTaken').css("display","flex").css("justify-content","center").css("margin","2em");
        $('.nameTaken').html("<div>Error: Name is already in use, please pick another</div>");
        }
    })

    //listener affects everyone once somebody closes/refreshes the page
    socket.on("disconnect",(data)=>{
        console.log('disc',data);
       //affects everyone
       $('.messages').append($('<li>').text("A user has left the chatroom"));
    })
};

function pickUsername(){
    let userN = $('#un').val();
    console.log("username picked",userN);
    socket.emit("new user",userN,function(data){
        if(data){
            console.log('what is this cb',data);
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
