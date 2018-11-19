app = {
    items : [
        "rabbit",
        "cat",
        "lion",
        "apple",
        "fish",
        "dog",
        "water",
        "car",
        "truck",
        "juice",
        "raccoon",
        "jaguar"
    ],
    render_btn  : function(){
        var $btn_container = $("<div>");
        app.items.forEach(function(item, index){
            var $btn = $('<button>');
            $btn.attr('class', 'btn');
            $btn.attr('data-animal', item);
            $btn.text(item);
            $btn_container.append($btn);
        });
        $("#btn-container").html($btn_container.html());
    },
    show_gifs   : function(){
        var selected_animal = $(this).attr("data-animal");
        options = {
            url: "https://api.giphy.com/v1/gifs/search?q=" +selected_animal+ "&api_key=AqNnrtnepa5b2aNZIiHZJak2GT4lKcz4&limit=10",
            method: "GET"
        };
  
        $.ajax( options )
          .then( app.response_handler);
    },
    add_item  : function(event){
        event.preventDefault();
        var item_name = $("#item-input").val().toLowerCase().trim();
        $("#item-input").val("");

        if(app.items.indexOf(item_name) === -1 && item_name.length > 0){
            app.items.push(item_name);
            app.render_btn();
        }

    },
    response_handler    : function(response){
        var results = response.data;
        var $all_gif_container = $("<div>");

        for (var i = 0; i < results.length; i++) {
            var $gifDiv = $("<div>");

            $gifDiv.attr("class", "img-container");

            var $image = $("<div>");
            var width   = results[i].images.fixed_width_still.width;
            var height  = results[i].images.fixed_width_still.height;
            height = parseInt(height);
            if(height > 200){ height = 200;}
            
            $image.css("background-size", width + "px " + height + "px");
            $image.css("background-image", "url(' "+ results[i].images.fixed_width_still.url + "')");
            $image.attr("data-still", "url('" + results[i].images.fixed_width_still.url + "')");
            $image.attr("data-animate", "url('" + results[i].images.fixed_width.url + "')");
            $image.attr("state", "still");
            $image.attr("class", "image");

            var $p = $("<p>")

            var shift = (200 - 40 - parseInt(height))/2;
            $p.css("top", shift + "px");
            $p.attr("class", "image-label");
            $p.text("Rating: " + results[i].rating);
            $gifDiv.append($image);
            $gifDiv.append($p);

            $all_gif_container.append($gifDiv);
        }
        $("#gifs-appear-here").html( $all_gif_container.html() );
    },
    flip_animation      : function(){
        var state = $(this).attr("state");
        if(state === "still"){
            $(this).attr("state", "animate");
            $(this).css("background-image", $(this).attr("data-animate") );
        }
        else{
            $(this).attr("state", "still");
            $(this).css("background-image", $(this).attr("data-still") );
        }
    },
    initialize          : function(){
        app.render_btn();
    }
}

$(document).on("click", ".btn", app.show_gifs);
$(document).on("click", "#item-add", app.add_item);
$(document).on("click", ".image", app.flip_animation);

app.initialize();