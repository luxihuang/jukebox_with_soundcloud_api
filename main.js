SC.initialize({
  client_id: 'fd4e76fc67798bfa742089ed619084a6'
});

var JukeBox = {
    songs:[],
    songIndex: 0,
    previousTime: 0,

    init: function() {
        var _this = this;  //making the object available to the methods
        var searchInput = document.getElementById("q");
        var audio = document.getElementById("js-audio");
        var searchButton = document.getElementById("js-searchButton");
        var playButton = document.getElementById("js-playButton");
        var stopButton = document.getElementById("js-stopButton");
        var nextButton = document.getElementById("js-nextButton");
        var previousButton = document.getElementById("js-previousButton");
        var shuffleButton = document.getElementById("js-shuffleButton");
        var muteButton = document.getElementById("js-muteButton");
        this.songArtWorkImage = document.getElementById("js-audio-artwork");
        this.songTitle = document.getElementById("js-audio-title");

        playButton.addEventListener("click", function() {
            _this.play(_this.songIndex);
        });

        stopButton.addEventListener("click", function() {
            _this.stop(_this.songIndex);
        });

        nextButton.addEventListener("click", function() {
            _this.next(_this.songIndex);
        });


        previousButton.addEventListener("click", function() {
             _this.previous(_this.songIndex);
        });

        shuffleButton.addEventListener("click", function() {
            _this.shuffle(_this.songIndex);
        });


        searchButton.addEventListener("click", function() {
            _this.search(searchInput.value);
        });

        this.search('mixedtape'); //loads a search searching for keyword 'mixedtape' when you first load
    },

    renderSong: function(){
        this.songArtWorkImage.src = this.songs[this.songIndex].artwork_url || "";
        this.songTitle.innerHTML = this.songs[this.songIndex].title || ""; //title is text so its innertext or innerhtml
    },

    renderPlayList: function(list) {
        var _this = this;
        var singleSong = document.getElementById('js-each-song');
        singleSong.innerHTML = ''; //this clears the song list everything you do another search

        var i = 0;
        list.forEach(function(item){
            var newSingleSong = document.createElement('li');
            newSingleSong.innerHTML = item.title;
            newSingleSong.classList.add('track');
            newSingleSong.setAttribute('id', item.id);
            newSingleSong.setAttribute('index', i);
            newSingleSong.addEventListener('click', function(){
                _this.currentSongIndex = newSingleSong.getAttribute('index');
                _this.play(_this.getsongIndex());;
            })
            singleSong.appendChild(newSingleSong);
            i++;
        })

    },

    search: function(searchTerm){
        var self = this
        SC.get('/tracks', {
            q: searchTerm
        }).then(function(tracks) {
            self.songs = tracks //connected our songs to soundcloud's tracks
            console.log(self.songs); //self is only within this scope
        });
        self.renderPlayList(self.songs);
    },

    getsongIndex: function() {
        return this.songs[this.songIndex].id;
    },

    stream: function(id){
        console.log(id);
        var self = this;  //self is destroyed after the function, but it connects to this
        SC.stream('/tracks/' + id).then(function(player){
            self.player = player //makes soundcloud player available for other functions
            player.play();
            console.log(player);
        });
    },

    play: function(id) {
        if (!id) {
            id = this.getsongIndex();
        }
        this.stream(id);  //JukeBox.play(JukeBox.songs[JukeBox.songIndex]);
        this.renderSong(id);
    },

    stop: function() {
        this.player.pause(); //Soundcloud player JukeBox.stop(JukeBox.songs[1]);
    },

    shuffle: function() {
        var random = Math.floor(Math.random()*this.songs.length);
        while(random === this.songIndex) { //while loop is better than for loop because for loop will only run once 
            console.log("random equals to songIndex",random,this.songIndex);
            random = Math.floor(Math.random()*this.songs.length);
            }
            this.songIndex = random;

            this.play(this.getsongIndex());
   },

    next: function() {
        console.log("Before",this.songIndex);
        if(this.songIndex >= this.songs.length) {
            this.songIndex = 0;
        } else {
            this.songIndex = this.songIndex + 1;
        }
        console.log("After",this.songIndex);
        this.play(this.getsongIndex()); //same as JukeBox.play()
    },

    previous: function() {
        console.log("B4",this.songIndex);
        if(this.songIndex <= 0) {
            this.songIndex = 0;
        } else{
            this.songIndex = this.songIndex - 1;
        }
        console.log("After",this.songIndex);
        this.play(this.getsongIndex());
    }
}

//once document is ready, call JukeBox init function. Handler when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function(event) {
  JukeBox.init();
});


//for about.html will ahve to type it in
// run command 'simplehttpserver' when in the specific project folder to do http://localhost:8000/



    // renderPlayList(){
    //     var ul = document.getElementById('js-playlist');
    //     ul.innerHTML = '';
    //     this.songs.forEach(function(item) {
    //         ul.innerHTML += '<li>' + item.title + '</li>';    //less flexible because you are rendering every song into the entire parent UL element.  You can't click on the specific element
    //     })
    //         console.log(this.songs.length);
    //     }
    // },
