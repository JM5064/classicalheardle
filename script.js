let correct = [false, false];
let guess = -1;
let randlist = 0;
let randindex = 0;
let answer = randindex;

let guesses = [];
let numGuesses = 0;
let time = 1000;
let gameOver = false;

let audioState = 0; // 0 = paused, 1 = playing
const audio = document.querySelector('audio');
const playButton = document.getElementById("play-icon");

// document.cookie = "hi" + "=" + (encodeURI(true));
console.log(document.cookie.split("=")[1]);

if(document.cookie.split("=")[1] == "false") {
    let element = document.body;
    element.classList.toggle('light-mode');
}


function readFile(file)
{
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                let allText = rawFile.responseText;
                randlist = allText;
            }
        }
    }
    rawFile.send(null);
}

function switchMode () {
    let element = document.body;
    element.classList.toggle('light-mode');
    drawDecibelLevels();

    if(document.cookie.split("=")[1] == "true") {
        document.cookie = "hi" + "=" + (encodeURI(false));
    } else {
        document.cookie = "hi" + "=" + (encodeURI(true));
    }
    console.log(document.cookie)
    
    // setTimeout(function() {
    //     drawDecibelLevels();
    // }, 75);
    // setTimeout(function() {
    //     drawDecibelLevels();
    // }, 150);
}

readFile('data/easylist.txt')
// readFile('http://classicle.rf.gd/easyrandlist.txt')
let randarray = randlist.split('\n')

newSong();

function newSong() {
    randindex = Math.floor(Math.random() * 138); // 273
    // randindex = 0;
    // console.log(randarray[randindex]);
    url = 'recordings/' + randarray[randindex];
    // url = 'recordings/72. Violin Concerto no. 1 in G minor, op. 26 - Bruch.mp3'
    document.getElementsByClassName("audio")[0].setAttribute("src", url)
    // readFile('easyrandlist.txt');
    // readFile('http://classicle.rf.gd/easyrandlist.txt');
    answer = randarray[randindex].split(".")[0];
    randindex++;
    console.log(url);
}


function resetGame () {
    newSong();

    if (gameOver) {
        clearEnd();
    }

    correct = [false, false];
    guess = -1;

    if (guesses.length + 1 < 7) {
        document.getElementById('g' + (guesses.length + 1)).setAttribute('class', "guess");
    }
    document.getElementById('g1').setAttribute('class', 'highlight');

    guesses = [];
    numGuesses = 0;
    time = 1000;
    gameOver = false;

    audio.pause();
    audio.currentTime = 0;
    audioState = 0;
    playButton.innerHTML = ">";

    movingProgressBar.style.setProperty('width', `${0}px`);
    
    document.getElementById('skip-button').textContent = 'SKIP (+' + (numGuesses + 1) + "s)";

    clearGuesses();

    drawDecibelLevels();
}
  
function readTextFile(file, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

let data;

readTextFile("data/popular.json", function(text) {
    data = JSON.parse(text);

    // const newData = data.composers.flatMap(composer =>
    //     composer.works
    //       .filter(work => work.popular === "1")
    //       .map(work => ({
    //         composer: composer.complete_name,
    //         title: work.title,
    //         subtitle: work.subtitle,
    //         genre: work.genre
    //       }))
    //   );
      
    //   const jsonString = JSON.stringify(newData, null, 2);

    //   console.log(jsonString);
      
});



let focus = -1;

function closeAutofill() {
    focus = -1;
    if (document.getElementById("autocomplete") != null) {
        document.getElementById("autocomplete").remove();
        document.getElementById("autocomplete-footnote").remove();
    }
}

autofill(document.getElementById("guess-input"));

function removeSpecialCharacters(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function autofill(input) {

    input.addEventListener("input", function(e) {
        closeAutofill();
        let max = 50;
        let inp = removeSpecialCharacters(input.value.toUpperCase());

        let at = document.createElement('div');
        at.setAttribute("class", "autocomplete");
        at.setAttribute("id", "autocomplete");
        document.body.appendChild(at);

        let numResults = 0;

        for (let i = 0; i < data.length; i++) {
            let origPiece = data[i].title + " - " + data[i].composer;
            let piece = removeSpecialCharacters(origPiece);

            if (piece.toUpperCase().includes(inp)) {
                numResults++;
                    let e2;
                    if (document.getElementsByClassName("autocomplete-items").length < max) {
                        e = document.createElement('div');
                        e.setAttribute("class", "autocomplete-items");
                        at.appendChild(e);
                        e2 = document.createElement('div');
                        e2.setAttribute("class", "autocomplete-items-text");
                        e2.setAttribute("id", [i]);
                
                        if (!piece.toUpperCase().includes(inp)) {
                            e2.innerHTML = origPiece;
                        } else {
                            e2.innerHTML = origPiece.substring(0, piece.toUpperCase().indexOf(inp));
                            e2.innerHTML += "<span class='letter-highlight'>" + origPiece.substring(piece.toUpperCase().indexOf(inp), piece.toUpperCase().indexOf(inp) + inp.length) + "</span>";
                            e2.innerHTML += origPiece.substring(piece.toUpperCase().indexOf(inp) + inp.length);
                        }

                        e.appendChild(e2);

                    } else {
                        break;
                    }
                
                    e2.addEventListener("click", function(e) {
                        document.getElementById('guess-input').value = origPiece;
                        guess = i;
                        closeAutofill();
                    });
            }
        }

    
        let fn = document.createElement('div');
        fn.setAttribute("class", "autocomplete");
        fn.setAttribute("id", "autocomplete-footnote");
        let fn2 = document.createElement('div');
        fn2.setAttribute("class", "footnote");
        if (numResults > 0) {
            fn2.innerHTML = "Showing " + document.getElementsByClassName("autocomplete-items").length + " results out of " + numResults + " for \"" + input.value + "\" - scroll to see more";
        } else {
            fn2.innerHTML = "No results for \"" + input.value + "\"";
        }
        fn.appendChild(fn2);
        document.body.appendChild(fn);

        if (document.getElementById('guess-input').value == '') {
            closeAutofill();
        }

    });

    input.addEventListener("keydown", function(e){
        if (e.keyCode == 38) { // up
            focus--;
            if (focus < 0) {
                focus = document.getElementsByClassName("autocomplete-items-text").length - 1;
            }
            clearHighlight();
            document.getElementsByClassName("autocomplete-items-text")[focus].classList.add("autocomplete-item-highlight");
        } else if (e.keyCode == 40) { // down
            focus++;
            if (focus > document.getElementsByClassName("autocomplete-items-text").length - 1) {
                focus = 0;
            }
            clearHighlight();
            document.getElementsByClassName("autocomplete-items-text")[focus].classList.add("autocomplete-item-highlight");
        } else if (e.keyCode == 13) { // enter
            e.preventDefault();
            guess = document.getElementsByClassName("autocomplete-items-text")[focus].id.split(",")[0];
            document.getElementById('guess-input').value = data[guess].title + " - " + data[guess].composer;
            closeAutofill();
        }
    });

    function clearHighlight(){
        for (let i = 0; i < document.getElementsByClassName("autocomplete-items-text").length; i++) {
            document.getElementsByClassName("autocomplete-items-text")[i].classList.remove("autocomplete-item-highlight");
        }
    }

}

const progressBar = document.getElementById("progress-bar");
const movingProgressBar = document.getElementById("moving-progress-bar");

const whilePlaying = () => {
    movingProgressBar.style.setProperty('width', `${audio.currentTime * (progressBar.offsetWidth - 3) / 30}px`);
    if (audioState == 1 && audio.currentTime <= 30) {
        requestAnimationFrame(whilePlaying);
    }
}


playButton.addEventListener("click", () => {
    if (audioState == 0) {
        audio.play();
        audioState = 1;
        playButton.innerHTML = "ll";
        requestAnimationFrame(whilePlaying);

        setTimeout(function() {
            audio.pause();
            audio.currentTime = 0;
            audioState = 0;
            playButton.innerHTML = ">";
        }, time);

    } 
    // else {
    //     audio.pause();
    //     audio.currentTime = 0;
    //     audioState = 0;
    //     playButton.innerHTML = ">";
    // }
});



function evaluateGuess(guess) {
    if (data[guess].composer == data[answer].composer) {
        if (guess == answer) {
            return [true, true];
        } else {
            return [true, false];
        }
    } else {
        return [false, false];
    }
}


document.addEventListener("click", function(e) {
    closeAutofill();
});


function render_guesses() {
    document.getElementById('g' + guesses.length).appendChild(guesses[guesses.length - 1]);
    document.getElementById('g' + guesses.length).setAttribute('class', "guess");
    if (guesses.length + 1 < 7) {
        document.getElementById('g' + (guesses.length + 1)).setAttribute('class', 'highlight');
    }
}

const submitHover = document.getElementById('submit');
    submitHover.addEventListener('click', function(e) {
    if (guess != -1 && !gameOver){
        if (evaluateGuess(guess)[0]) {
            if (evaluateGuess(guess)[1]) {
                let correct = document.createElement('span');
                correct.innerHTML = document.getElementById('guess-input').value + " - CORRECT!!!";
                // addGuess(correct);
                guess = -1;
                createWinScreen();
                time = audio.duration * 1000;
                gameOver = true;
            } else {
                let partial = document.createElement('span');
                partial.innerHTML = "<span class='partial'>&#8212;</span> " + document.getElementById('guess-input').value;
                guess = -1;
                if (numGuesses == 6) {
                    createLoseScreen();
                    gameOver = true;
                } else {
                    addGuess(partial);
                }
            }
        } else if (guess[0] != -1) {
            let wrong = document.createElement('span');
            wrong.innerHTML = "<span class='wrong'>X</span> " + document.getElementById('guess-input').value;
            guess = -1;
            if (numGuesses == 6) {
                createLoseScreen();
                gameOver = true;
            } else {
                addGuess(wrong);
            }
        }
    }
    document.getElementById('guess-input').value = '';
    render_skip_time()
});


const skipHover = document.getElementById('skip-button');
    skipHover.addEventListener('click', function(e) {
        let skip = document.createElement('div');
        skip.innerHTML = 'S K I P P E D';
        document.getElementById('guess-input').value = '';
        if (!gameOver) {
            if (numGuesses == 6) {
                createLoseScreen();
                gameOver = true;
            } else {
                addGuess(skip);
            }
        }
        render_skip_time()
});


function addGuess(guess) {
    if (numGuesses < 7 && guess != '') {
        guesses.push(guess);
        render_guesses();
        numGuesses++;
        if (numGuesses < 6) {
            time = time + (numGuesses) * 1000;
        } else {
            time = 30000;
        }
    }
}


function render_skip_time() {
    document.getElementById('skip-button').innerHTML = '';
    if (numGuesses < 6) {
        if (numGuesses < 5) {
            document.getElementById('skip-button').textContent = 'SKIP (+' + (numGuesses + 1) + "s)";
        } else {
            document.getElementById('skip-button').textContent = 'SKIP (+' + (14) + "s)";
        }
    } else {
        document.getElementById('skip-button').textContent = 'SKIP';
    }
}

function clearGuesses() {
    for (let i = 1; i <= 6; i++) {
        document.getElementById("g" + i).innerHTML = "";
    }
    // render_guesses();
}

function clearEnd() {
    document.getElementById("end").remove();
}


function createWinScreen() {
    // document.getElementsByClassName("body")[0].remove()
    let end = document.createElement('div');
    end.setAttribute("id", "end");
    if (numGuesses == 0) {
        end.innerHTML = "Correct! <br>" 
        + data[answer].title + " - " + data[answer].composer + "</br>"
        + "<br> You guessed the piece in " +  1  + " second!</br";    
    } else {
        end.innerHTML = "Correct! <br>" 
        + data[answer].title + " - " + data[answer].composer + "</br>"
        + "<br> You guessed the piece in " +  (time / 1000)  + " seconds!</br";    
    }
    document.body.appendChild(end);
}


function createLoseScreen() {
    // document.getElementsByClassName("body")[0].remove()
    let end = document.createElement('div');
    end.setAttribute("id", "end");
    end.innerHTML = "Unlucky! <br>" + data[answer].title + " - " + data[answer].composer + "</br>"
    document.body.appendChild(end);
}

function openSettings() {
    let settings = document.createElement('div');
    settings.setAttribute("class", "settings");
    document.body.appendChild(settings);

    let settingsBox = document.createElement('div');
    settingsBox.setAttribute("class", "settings-box");
    settings.appendChild(settingsBox);
    
}

  
const canvas = document.getElementById('decibelCanvas');
const ctx = canvas.getContext('2d');

const lineDurationInSeconds = 0.5;

const totalLines = 29.5/lineDurationInSeconds;



function getDecibelLevels(audioFile, callback) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const decibelData = [];
  
    fetch(audioFile)
      .then(response => response.arrayBuffer())
      .then(audioData => audioContext.decodeAudioData(audioData))
      .then(decodedBuffer => {

        for (let i = 0; i < totalLines; i++) {
            const time = i * lineDurationInSeconds;

            const audioData = decodedBuffer.getChannelData(0);
            
            const sampleRate = decodedBuffer.sampleRate;
            const index = Math.floor(time * sampleRate);

            let sumOfSquares = 0;
            for (let i = 0; i < sampleRate; i++) {
                const sample = audioData[i + index];
                sumOfSquares += sample * sample;
            }
            const rms = Math.sqrt(sumOfSquares / sampleRate);

            decibelData.push(rms);
        }
        // console.log(decibelData)
        callback(decibelData);
      })
      .catch(error => console.error('Error decoding audio file:', error));
}


// function drawDecibelLevels() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     getDecibelLevels(url, decibelData => {
//         if (decibelData.length === totalLines) {
//             const maxDecibel = Math.max(...decibelData);
//             const minDecibel = Math.min(...decibelData);

//             const mappedData = decibelData.map(decibelLevel =>
//                 canvas.height - ((decibelLevel - minDecibel) / (maxDecibel - minDecibel)) * canvas.height
//             );

//             const timeInterval = canvas.width / totalLines;
//             for (let i = 0; i < totalLines; i++) {
//                 const x = i * timeInterval;
//                 const y = mappedData[i];
     
//                 ctx.strokeStyle = 'rgba(90, 90, 90, 0.4)';
//                 ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('background-color');
//                 ctx.strokeRect(x, y, 10, canvas.height);
//                 ctx.fillRect(x, 0, 12, y);
//                 ctx.stroke();
//             }
//         }
//     });
// }



let allDecibelData = 0;

function readDecibelFile(file)
{
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                let allText = rawFile.responseText;
                allDecibelData = allText;
            }
        }
    }
    rawFile.send(null);
}

readDecibelFile('data/decibeldata.txt');

function drawDecibelLevels() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let decibelData = allDecibelData.split("\n")[randindex - 1].split(',');
    
    if (decibelData.length === totalLines) {
        const maxDecibel = Math.max(...decibelData);
        const minDecibel = Math.min(...decibelData);

        const mappedData = decibelData.map(decibelLevel =>
            canvas.height - ((decibelLevel - minDecibel) / (maxDecibel - minDecibel)) * canvas.height
        );

        const timeInterval = canvas.width / totalLines;
        for (let i = 0; i < totalLines; i++) {
            const x = i * timeInterval;
            const y = mappedData[i];
 
            ctx.strokeStyle = 'rgba(90, 90, 90, 0.4)';
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('background-color');
            ctx.strokeRect(x, y, 10, canvas.height);
            ctx.fillRect(x, 0, 12, y);
            ctx.stroke();
        }
    }
}

drawDecibelLevels();
