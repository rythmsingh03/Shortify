let currentsong = new Audio();
let songs;
let currentfolder

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}




async function getsong(folder) {
    currentfolder=folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songListHTML = " ";
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=" "
    for (const song of songs) {
        songListHTML += `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                            </div>
                            <div class="playnow">
                                <img class="invert" src="play.svg" alt="">
                            </div>
                        </li>`;
    }

    songul.innerHTML = songListHTML;

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            let songTitle = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playMusic(songTitle);
        })
    });
  
}

const playMusic = (track, pause = false) => {
    currentsong.src = `/${currentfolder}/` + track
    if (!pause) {
        currentsong.play()
        // play.src="pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayalbum(params) {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a")
    let cardcontainer= document.querySelector(".cardcontainer")
    let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
        if(e.href.includes("/songs")){
            let folder=(e.href.split("/").slice(-2)[0])
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            cardcontainer.innerHTML=cardcontainer.innerHTML + `<div data-folder="${folder}" class="card ">
                        <div  class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50"
                                fill="none">
                                <circle cx="12" cy="12" r="10" fill="green" />
                                <path
                                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                    fill="black" />
                            </svg>

                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
        
    }

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async items=>{
            songs= await getsong(`songs/${items.currentTarget.dataset.folder}`)
        })
    })
}



async function main() {

    await getsong("songs/ncs")
    playMusic(songs[0], true)

    displayalbum()
    // let songListHTML = " ";
    // songul.innerHTML=" "

    // let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    // for (const song of songs) {
    //     songListHTML += `<li>
    //                         <img class="invert" src="music.svg" alt="">
    //                         <div class="info">
    //                             <div>${song.replaceAll("%20", " ")}</div>
    //                         </div>
    //                         <div class="playnow">
    //                             <img class="invert" src="play.svg" alt="">
    //                         </div>
    //                     </li>`;
    // }

    // songul.innerHTML = songListHTML;

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            let songTitle = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playMusic(songTitle);
        })
    });
    // Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    //     e.addEventListener("click", element => {
    //         let songTitle = e.querySelector(".info").firstElementChild.innerHTML.trim();
    //         playMusic(songTitle); // Pass the title to playMusic
    //     });
    // });

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "play.svg"
        }

        else {
            currentsong.pause()
            play.src = "pause.svg"
        }
    })


    // play.addEventListener("onkeydown", () => {
    //     if (currentsong.paused) {
    //         currentsong.play()
    //         play.src = "play.svg"
    //     }

    //     else {
    //         currentsong.pause()
    //         play.src = "pause.svg"
    //     }
    // })



    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / 
        ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    document.querySelector(".hamsburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click", () => {
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        currentsong.volume = parseInt(e.target.value)/100
        if (currentsong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })
}
main()