let hmbr = document.querySelector(".hamburgar");
let left = document.querySelector(".sidebar");
let xmark = document.querySelector(".logox");
let mstr = document.querySelector("#mstrbtn");
let gif = document.querySelector(".main-picture");
let previous = document.querySelector("#previous");
let next = document.querySelector("#next");
let currentfolder;
let songs;
let like = document.querySelector("#icon1");

like.addEventListener("click", () => {
  like.style.color = "red";
  setInterval(() => {
    like.style.color = "white";
  }, 5000);
});

hmbr.addEventListener("click", () => {
  //console.log("clicked");
  left.style.left = "0";
});

xmark.addEventListener("click", () => {
  // console.log("xclicked");
  left.style.left = "-900px";
});

//funtion for changing second to minutes second format
function convertSecondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const minutesString = String(minutes).padStart(2, "0");
  const secondsString = String(remainingSeconds).padStart(2, "0");

  return `${minutesString}:${secondsString}`;
}

// songs
let currentSong = new Audio();

async function getSongs(folder) {
  currentfolder = folder;
  songs = [];
  let urlextract = `https://sachinsingh29.github.io/Spotify/${folder}/song.json`;
  let url = urlextract.split("/").slice("-3").join("/");
  //console.log(url);
  let data = await fetch(url);
  let response = await data.json();
  //console.log(response);

  //storing tahe song in array using map
  songs = response.songs.map((songData) => {
    return songData.path.split("/").slice(-1)[0].replaceAll(" ", "%20");
  });

  // console.log(songs);

  //adding song in list
  let songUl = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    let modified = song.split("/").slice(-1)[0].replaceAll("%20", " ");
    //console.log(modified);

    songUl.innerHTML += `<li>
   <i class="fa-solid fa-music"></i>
   <div class="info">
     <div class="songid">${modified}</div>
   </div>
       <span>Play Now</span>
       <i class="fa-solid fa-play"></i>
 </li>`;
  }

  // attach a eventlistner for each song that are in list to play
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      //console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
}

//playmusic function
const playMusic = (track, pause = false) => {
  //let audio = new Audio("/songs/" + track);
  currentSong.src = `${currentfolder}/${track}`;
  if (!pause) {
    currentSong.play();
  }
  gif.style.opacity = "1";
  mstr.src = "images/pause4.webp";
  document.querySelector(".song-name").innerHTML = track
    .slice(0, 15)
    .replaceAll("%20", " ");
};

//function for displaying album dynmic
async function displayAlbum() {
  let response = await fetch("songs/");
  let htmlContent = await response.text();

  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  //console.log(tempDiv);

  // Extract information from the directory listing
  let links = tempDiv.querySelectorAll('#files a');

  let folder = Array.from(links).map((link) => {
    const url = "songs/"+link.getAttribute("href").split("/").slice(-1)[0];
    const folderTitle =
      link.getAttribute("title").toUpperCase() || "Unknown Title";
    
     console.log("URL:", url);
    console.log("Folder Title:", folderTitle);

    return {
      //name: link.querySelector('.name').textContent,
      url,
      folderTitle,
    };
    
  });

  console.log(folder);
  //console.log(links)

  // Creating album card
  let cardContainer = document.querySelector(".card-container");
  cardContainer.innerHTML = "";

  folder.forEach((folder) => {
    cardContainer.innerHTML += `
      <div data-folder="${folder.url}" class="card">
        <div class="play">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill=#000>
            <path d="M5 20V4L19 12L5 20Z" stroke="#000000" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
        <img src="songs/${folder.url}/cover.jpeg" class="card-img" />
        <p class="card-title">${folder.folderTitle}</p>
        <p class="card-info">Your daily update of the most played...</p>
      </div>`;
  });

  //loading playlist when card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      //console.log(item, item.currentTarget.dataset);
      await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}

async function main() {
  //getting all songs
  await getSongs("songs/topsong");
  playMusic(songs[0]);
  //console.log(songs);

  //display album on page
  displayAlbum();

  //event listner for play previous and next
  mstr.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      mstr.src = "images/pause4.webp";
      gif.style.opacity = "1";
    } else {
      currentSong.pause();
      mstr.src = "images/player_icon3.png";
      gif.style.opacity = "0";
    }
  });

  //event for next
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    //console.log(currentSong.src.split("/").slice(-1),index)
    if (index + 1 < songs.length - 1) {
      playMusic(songs[index + 1]);
    }
  });

  //event for previous
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    console.log(index);
    //console.log(currentSong.src.split("/").slice(-1),index)
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  //event for volume
  document
    .querySelector(".control-option")
    .getElementsByTagName("input")[0]
    .addEventListener("mouseover", (e) => {
      //console.log(e.target, e.target.value);
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  //time update
  currentSong.addEventListener("timeupdate", () => {
    //console.log(currentSong.currentTime, currentSong.duration);

    document.querySelector(
      ".current-time"
    ).innerHTML = `${convertSecondsToMinutesSeconds(currentSong.currentTime)}`;

    document.querySelector(
      ".total-time"
    ).innerHTML = `${convertSecondsToMinutesSeconds(currentSong.duration)}`;

    //for stoping the song when song is played full
    if (currentSong.currentTime == currentSong.duration) {
      currentSong.pause();
      mstr.src = "images/player_icon3.png";
      gif.style.opacity = "0";
    }
  });

  // Add an event listener to update the progress bar as the audio plays
  const progress = document.querySelector(".progress-bar");
  currentSong.addEventListener("timeupdate", () => {
    const progressValue =
      (currentSong.currentTime / currentSong.duration) * 100;
    progress.value = progressValue;
  });

  //add and event listner for progress chnge
  progress.addEventListener("input", () => {
    const seekTime = (progress.value / 100) * currentSong.duration;
    if (!isNaN(seekTime) && isFinite(seekTime)) {
      document.querySelector(
        ".current-time"
      ).innerHTML = `${convertSecondsToMinutesSeconds(seekTime)}`;
      currentSong.currentTime = seekTime;

      if (currentSong.paused) {
        currentSong.play();
        mstr.src = "images/pause4.webp";
        gif.style.opacity = "1";
      }
    }
  });
}

main();
