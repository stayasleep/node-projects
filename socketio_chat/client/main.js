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
        $('.messages').append($('<li>').text(data.user+" ("+data.time+"): "+data.msg));
        $('.chatArea').scrollTop($('.chatArea')[0].scrollHeight);
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

    //if the name is taken, notify only that socket and not everyone
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
       $('.messages').append($('<li>').text(`---${data} has left the chatroom---`));
    })
};

function pickUsername(){
    let userN = $('#un').val();
    console.log("username picked",userN);
    socket.emit("new user",userN,function(data){
        if(data){
            console.log('what is this cb',data);
            $('.userForm').css("display","none");
            $('.greet').css("display","none");
            $('.leftCol').css("display","block");
            $('.rightCol').css("display","block");
            $('.chats').css('display','block');
        }
    })
    $('#un').val("");
    return false;
}

//check for blank spaces and white spaces maybe?
function sendMsg(){
    let d = new Date();
    d=d.toLocaleTimeString();
    let sentMsg = $('#m').val();
    let msgObj = {time:d, msg: sentMsg};
    if(sentMsg!==""){
        socket.emit("chat message",msgObj);
        $('#m').val("");
    }
    return false;
}
