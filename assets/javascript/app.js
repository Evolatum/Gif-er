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
    topics:["cheese","dogs","blue","halloween","t-rex"],

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
            gifr.addGifs(response);
            console.log(response);
        });
    },

    //Displays requested GIFs
    addGifs:function(gifs){
        $("#gifsHere").empty();
        for(let gif of gifs.data){
            console.log(gif);
            //<iframe src=${gif.embed_url} width="480" height="480" frameBorder="0"></iframe>
            $("#gifsHere").append(`
            <div class="col-4">
                <img src=${this.giphySRC1}${gif.id}/giphy_s.gif id=${gif.id} class="img-fluid" data-still="true">
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
    $(document).on("click",".img-fluid",function(){
        gifr.gifState($(this).attr("id").toString());
    });
});