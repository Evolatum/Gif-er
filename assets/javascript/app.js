var x="nCX0dHerF";
var y="nmaNC0RUMO1ZHL";

var gifr = {
    //Basic url, which is then built upon
    queryURL:"https://api.giphy.com/v1/gifs/search?api_key=",

    //GIPHY url
    giphySRC1:"https://i.giphy.com/media/",

    z:"dSnmwGm9c",
    
    limit:10,

    //Array of topics that gets updated
    topics:["cheese","dogs","cats","halloween","t-rex","mexico", "javascript","paper", "existance", "millenials", "dobbie"],

    //Holds current topic for when querying more of same topic
    currentTopic:"",
    
    //Holds current offset for when quering more of same topic
    offset:0,

    //Generates button for every topic in array
    genBtns:function(){
        $("#btnsHere").empty();
        for(let topic of this.topics){
          $("#btnsHere").append(`<button class="btn btn-info" id=${topic.split(" ").join("+")}>${topic}</button>`);
        }
    },

    //Adds an element to the topics array, and then re-generates the buttons by calling the method
    addTopic:function(topic){
        if(this.checkTopic(topic)){
            this.topics.push(topic);
            this.genBtns();
        } else{
            $('#errorTopic').modal('show');
        }
    },

    //Checks if the topic addes is not empty or already in the array
    checkTopic(newTopic){
        if(newTopic==="") return false;
        
        for(let topic of this.topics){
            if(topic.toLowerCase()===newTopic.toLowerCase())return false;
        }

        return true;
    },

    //Requests GIFs from GIPHY API
    queryTopic:function(topic){
        $.ajax({
            url: `${this.queryURL}${y+x+this.z}&q=${topic}&limit=${this.limit}&offset=${this.offset}`,
            method: "GET"
        }).then(function(response) {
            gifr.addGifs(response);
        });
        this.offset+=this.limit;
    },

    //Displays requested GIFs
    addGifs:function(gifs){
        console.log(gifs.data);
        for(let gif of gifs.data){
            $("#gifsHere").append(`
            <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12">
                <div class="card bg-light border-info">
                    <img src="${this.giphySRC1}${gif.id}/giphy_s.gif" id=${gif.id} class="card-img-top" alt="gif" data-still="true">
                    <div class="card-body">
                        <h5 class="card-title text-info">${gif.title===""||gif.title===" "?gif.slug.split("-").join(" "):gif.title}</h5>
                        <p class="card-text"><b>Rating:</b> ${gif.rating}</p>
                        <p class="card-text"><b>Uploded:</b> ${gif.import_datetime}</p>
                        <p class="card-text"><b>By:</b> `+(gif.username===""?"Anonymus":`<a href="${gif.user.profile_url}" target="_blank"><img src="${gif.user.avatar_url}" class="profilePic"/>${gif.user.display_name}</a>`)+`</p> 
                    </div>
                </div>
            </div>`);
        }
        $("#gifsHere").append(`<button type="button" class="btn btn-success">Load more GIFs!</button>`);
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
    $(document).on("click", ".btn-info", function() {
        if($(this).attr("id").toString() !== gifr.currentTopic){
            $("#gifsHere").empty();
            gifr.offset = 0;
            gifr.currentTopic = $(this).attr("id").toString();
            gifr.queryTopic(gifr.currentTopic);
        }
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

    //Adds more gifs of same topic
    $(document).on("click",".btn-success",function(){
        $(".btn-success").remove();
        gifr.queryTopic(gifr.currentTopic);
    });
    
});