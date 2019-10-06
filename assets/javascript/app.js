var x="nCX0dHerF";
var y="nmaNC0RUMO1ZHL";

var gifr = {
    //Basic url, which is then built upon
    queryURL:"https://api.giphy.com/v1/gifs/search?api_key=",
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
                <img src=https://i.giphy.com/media/${gif.id}/giphy.webp data="still">
            </div>
            `);
        }
        /*
        if(response.Response==="True"){
            $("#movies-view").prepend(`
            <div class="row">
                <div class="jumbotron col">
                <div class="row">
                    <div class="col-12">
                    <h1 class="text-center">${response.Title}</h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                    <img src=${response.Poster} class="img-fluid">
                    </div>
                    <div class="col-7">
                    <p class="text"><b>Rating:</b> ${response.Rated}</p>
                    <p class="text"><b>Release Date:</b> ${response.Released}</p>
                    <p class="text"><b>Plot:</b> ${response.Plot}</p>
                    </div>
                </div>
                </div>
            </div>`);
        }else{
            console.log("Movie not found, removing button");
            movies = movies.filter(function(value, index, arr){
            return value !== movie;
            });
            renderButtons();
        }
        */
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
});