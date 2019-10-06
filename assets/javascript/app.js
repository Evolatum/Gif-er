var x="nCX0dHerF";
var y="nmaNC0RUMO1ZHL";

var gifr = {
    //Basic url, which is then built upon
    queryURL:"https://api.giphy.com/v1/gifs/search?api_key=",

    //GIPHY url
    giphySRC1:"https://i.giphy.com/media/",

    z:"dSnmwGm9c",
    
    limit:3,
    offset:0,

    //Array of topics that gets updated
    topics:["cheese","dogs","cats","halloween","t-rex","mexico", "javascript","paper", "existance", "millenials", "dobbie"],

    //Generates button for every topic in array
    genBtns:function(){
        $("#btnsHere").empty();
        for(let topic of this.topics){
          $("#btnsHere").append(`<button class="btn btn-secondary topicBtn" id=${topic.split(" ").join("+")}>${topic}</button>`);
        }
    },

    //Adds an element to the topics array, and then re-generates the buttons by calling the method
    addTopic:function(topic){
        this.topics.push(topic);
        this.genBtns();
    },

    //Requests GIFs from GIPHY API
    queryTopic:function(topic){
        $.ajax({
            url: `${this.queryURL}${y+x+this.z}&q=${topic}&limit=${this.limit}&offset=${this.offset}`,
            method: "GET"
        }).then(function(response) {
            $("#gifsHere").empty();
            gifr.addGifs(response);
            console.log(response);
        });
    },

    //Displays requested GIFs
    addGifs:function(gifs){
        for(let gif of gifs.data){
            console.log(gif);
            $("#gifsHere").append(`
            <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12">
                <div class="card bg-light border-info">
                    <img src="${this.giphySRC1}${gif.id}/giphy_s.gif" id=${gif.id} class="card-img-top" alt="gif" data-still="true">
                    <div class="card-body">
                        <h5 class="card-title text-info">${gif.title}</h5>
                        <p class="card-text"><b>Rating:</b> ${gif.rating}</p>
                        <p class="card-text"><b>Uploded:</b> ${gif.import_datetime}</p>
                        <p class="card-text"><b>By:</b> `+(gif.username===""?"Anonymus":`<a href="${gif.user.profile_url}" target="_blank"><img src="${gif.user.avatar_url}" class="profilePic"/>${gif.user.display_name}</a>`)+`</p> 
                    </div>
                </div>
            </div>`);
        }
    },

    //Changes animated gif to still and vice-versa
    gifState:function(id){
        if($(`#${id}`).attr("data-still")==="true"){
            $(`#${id}`).attr("src",`${this.giphySRC1}${id}/giphy.gif`)
            $(`#${id}`).attr("data-still","false")
        }else{
            $(`#${id}`).attr("src",`${this.giphySRC1}${id}/giphy_s.gif`)
            $(`#${id}`).attr("data-still","true")
        }
    },
}

$(document).ready(function() {
    //Initial buttons display
    gifr.genBtns();

    //Receives topic clicked and generates GIFs based on the id of the button
    $(document).on("click", ".topicBtn", function() {
        gifr.queryTopic($(this).attr("id").toString());
    });

    //Adds a new topic to array
    $("#addGif").on("click", function(event) {
        event.preventDefault();
        gifr.addTopic($("#gifInput").val().trim());
    });

    //Changes still gif to animates and vice-versa
    $(document).on("click",".card-img-top",function(){
        gifr.gifState($(this).attr("id").toString());
    });
});