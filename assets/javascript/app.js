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

    //Array of favorite gifs
    favorites:[],

    //Holds if browser supports local storage
    localStor:false,
    
    //Holds current offset for when quering more of same topic
    offset:0,

    //Generates button for every topic in array
    genBtns:function(){
        $("#btnsHere").empty();
        $("#btnsHere").append(`<button class="btn btn-primary" id="favoritesBtn">Favorites</button>`);
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

    //Checks if the topic addes is not empty, contains a special character, or is already in the array
    checkTopic(newTopic){
        if(newTopic==="") return false;

        var regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if(regex.test(newTopic))return false;
        
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
                        <button class="btn btn-primary favGif" id="fav${gif.id}">Add to Favorites</button>
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

    //Checks if browser supports local storage
    checkLocalStorage:function(){
        if (typeof(Storage) !== "undefined") {
            this.localStor=true;
        } else {
            console.log("No web storage Support");
        }
    },

    //Adds a GIF to the favorites array
    addFav:function(favBtn){
        var newFav = favBtn.substring(3);
        if(this.checkFav(newFav)){
            this.favorites.push(newFav);
            if(this.localStor){
                window.localStorage.setItem('favs',this.favorites.join(","));
            }
        }
        $(`#${favBtn}`).remove();
    },

    //Checks if new favorite is already in array
    checkFav(newFav){
        for(fav of this.favorites){
            if(fav===newFav)return false;
        }

        return true;
    },

    //Displays favorites
    displayFavs:function(){
        //Retrieves local storage of favorites
        if(this.localStor){
            this.favorites = window.localStorage.getItem('favs').split(",");;
        }

        $.ajax({
            url: `https://api.giphy.com/v1/gifs?api_key=${y+x+this.z}&ids=${this.favorites.join(",")}`,
            method: "GET"
        }).then(function(response) {
            $("#gifsHere").empty();
            for(let gif of response.data){
                $("#gifsHere").append(`
                <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12">
                    <div class="card bg-light border-info">
                        <img src="${gifr.giphySRC1}${gif.id}/giphy_s.gif" id=${gif.id} class="card-img-top" alt="gif" data-still="true">
                        <div class="card-body">
                            <h5 class="card-title text-info">${gif.title===""||gif.title===" "?gif.slug.split("-").join(" "):gif.title}</h5>
                            <p class="card-text"><b>Rating:</b> ${gif.rating}</p>
                            <p class="card-text"><b>Uploded:</b> ${gif.import_datetime}</p>
                            <p class="card-text"><b>By:</b> `+(gif.username===""?"Anonymus":`<a href="${gif.user.profile_url}" target="_blank"><img src="${gif.user.avatar_url}" class="profilePic"/>${gif.user.display_name}</a>`)+`</p> 
                            <button class="btn btn-danger" id="remFav${gif.id}">Remove favorite</button>
                        </div>
                    </div>
                </div>`);
            }
        });

    },

    //Removes a GIF from favorites
    delFav:function(oldFav){
        for(let fav of this.favorites){
            if(fav===oldFav.substring(6)){
                this.favorites=this.favorites.filter(function(value,index,arr){
                    return value !== fav;
                });
            }
        }
        $(`#${oldFav}`).parent().parent().parent().remove();
        if(this.localStor){
            window.localStorage.setItem('favs',this.favorites.join(","));
        }
    },
}

$(document).ready(function() {
    //Checks if browser supports local storage
    gifr.checkLocalStorage();

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

    //Add GIF to favorites
    $(document).on("click", ".favGif", function() {
        gifr.addFav($(this).attr("id").toString());
    });

    //Display favorite GIFs
    $(document).on("click", "#favoritesBtn", function() {
        gifr.currentTopic="";
        gifr.displayFavs();
    });

    //Removes a GIF from favorites
    $(document).on("click", ".btn-danger", function() {
        gifr.delFav($(this).attr("id").toString());
    });
});