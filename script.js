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


function readFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                randlist = allText;
            }
        }
    }
    rawFile.send(null);
}

function switchMode () {
    let element = document.body;
    element.classList.toggle('light-mode');
}

readFile('easyrandlist.txt')
// readFile('http://classicle.rf.gd/easyrandlist.txt')
let randarray = randlist.split('\n')

newSong();

function newSong() {
    let randindex = Math.floor(Math.random() * 138); // 273
    // console.log(randarray[randindex]);
    url = 'recordings/' + randarray[randindex];
    // url = 'recordings/365. Nabucco - Verdi.mp3'
    document.getElementsByClassName("audio")[0].setAttribute("src", url)
    // document.getElementsByClassName("audio")[0].setAttribute("src", 'recordings/Dynamic Testing.mp3')
    // document.getElementsByClassName("audio")[0].setAttribute("src", 'http://classicle.rf.gd/recordings/' + randarray[randindex])
    readFile('easyrandlist.txt');
    // readFile('http://classicle.rf.gd/easyrandlist.txt');
    answer = randarray[randindex].split(".")[0];
    randindex++;
}


function resetGame () {
    newSong();

    if (gameOver) {
        clearEnd();
    }

    correct = [false, false];
    guess = -1;

    guesses = [];
    numGuesses = 0;
    time = 1000;
    gameOver = false;

    audio.pause();
    audio.currentTime = 0;
    audioState = 0;
    playButton.innerHTML = ">";
    
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

readTextFile("popular.json", function(text) {
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
    console.log(guess, answer);
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
    console.log(guesses.length);
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
                var correct = document.createElement('span');
                correct.innerHTML = document.getElementById('guess-input').value + " - CORRECT!!!";
                // addGuess(correct);
                guess = -1;
                createWinScreen();
                time = audio.duration * 1000;
                gameOver = true;
            } else {
                var partial = document.createElement('span');
                partial.innerHTML = "<span class='partial'>—</span> " + document.getElementById('guess-input').value;
                guess = -1;
                if (numGuesses == 6) {
                    createLoseScreen();
                    gameOver = true;
                } else {
                    addGuess(partial);
                }
            }
        } else if (guess[0] != -1) {
            var wrong = document.createElement('span');
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
        var skip = document.createElement('div');
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


// Function to get the decibel level at a given time in an audio file
function getDecibelLevelAtTime(audioFile, timeInSeconds, callback) {
    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
    // Fetch the audio file and decode it
    fetch(audioFile)
      .then(response => response.arrayBuffer())
      .then(audioData => audioContext.decodeAudioData(audioData))
      .then(decodedBuffer => {
        // Get the audio channel data (assuming mono audio)
        const audioData = decodedBuffer.getChannelData(0);
  
        // Find the index corresponding to the desired time
        const sampleRate = decodedBuffer.sampleRate;
        const index = Math.floor(timeInSeconds * sampleRate);
  
        // Calculate the root mean square (RMS) value for the given sample
        let sumOfSquares = 0;
        for (let i = 0; i < sampleRate; i++) {
          const sample = audioData[i + index];
          sumOfSquares += sample * sample;
        }
        const rms = Math.sqrt(sumOfSquares / sampleRate);
  
        // Calculate the decibel level (using 20 as a reference for the maximum amplitude of an audio signal)
        // const decibelLevel = 20 * Math.log10(rms / 1.0);
        const decibelLevel = rms;
  
        // Call the callback with the decibel level
        callback(decibelLevel);
      })
      .catch(error => console.error('Error decoding audio file:', error));
}
  
console.log(url);

  
// Define the canvas and its context
const canvas = document.getElementById('decibelCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas size
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Define the total duration (in seconds) you want to visualize
const lineDurationInSeconds = 0.5;

// Calculate the total number of lines to be drawn
const totalLines = 29.5/lineDurationInSeconds;

// Function to get the audio duration in seconds
// function getAudioDurationInSeconds() {
//   return new Promise(resolve => {
//     const audio = new Audio(url);
//     audio.onloadedmetadata = () => resolve(audio.duration);
//   });
// }

// Function to draw the decibel levels on the canvas
 function drawDecibelLevels() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Calculate the decibel levels for each line
    const decibelData = [];
    for (let i = 0; i < totalLines; i++) {
    const time = i * lineDurationInSeconds;
    getDecibelLevelAtTime(url, time, decibelLevel => {
        // Push the decibel level to the data array
        decibelData.push(decibelLevel);
        
        // Check if all data is available before drawing
        if (decibelData.length === totalLines) {
            // Find the maximum and minimum decibel levels from the data
            const maxDecibel = Math.max(...decibelData);
            const minDecibel = Math.min(...decibelData);

            // Map the decibel values to canvas heights
            const mappedData = decibelData.map(decibelLevel =>
                canvasHeight - ((decibelLevel - minDecibel) / (maxDecibel - minDecibel)) * canvasHeight
            );

            // Draw the decibel levels on the canvas
            const timeInterval = canvasWidth / totalLines;
            for (let i = 0; i < totalLines; i++) {
                const x = i * timeInterval;
                const y = mappedData[i];
                ctx.strokeStyle = 'rgb(50, 50, 50)';
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('background-color');
                ctx.rect(x, y, 10, canvasHeight);
                ctx.fillRect(x-1.5, 0, 12, y);
                console.log(x-1.5);
                // ctx.beginPath();
                // ctx.moveTo(x, canvasHeight);
                // ctx.lineTo(x, y);
                ctx.stroke();
            }
        }
    });
    }
}

// Call the function to draw the decibel levels
drawDecibelLevels();


