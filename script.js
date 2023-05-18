
let answer = [202, 117]; // composer, piece
let correct = [false, false];
let guess = [-1, -1];


function switchMode () {
    let element = document.body;
    element.classList.toggle('light-mode');
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
    console.log(data);
    console.log(data.composers[answer[0]].works[answer[1]].title);

    const newData = {
        composers: data.composers.map(composer => ({
          name: composer.name,
          works: composer.works.filter(work => work.popular === "1")
        }))
      };
      
    
    console.log(newData);
});


let guesses = [];
let numGuesses = 0;

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

        for (let i = 0; i < data.composers.length; i++) {
            for (let j = 0; j < data.composers[i].works.length; j++) {
                let origPiece = data.composers[i].works[j].title + " - " + data.composers[i].complete_name;
                let piece = removeSpecialCharacters(origPiece);

                if (piece.toUpperCase().includes(inp) && (data.composers[i].works[j].popular == "1"
                // || data.composers[i].works[j].recommended == "1"
                )
                ) {
                    numResults++;
                    let e2;
                    if (document.getElementsByClassName("autocomplete-items").length < max) {
                        e = document.createElement('div');
                        e.setAttribute("class", "autocomplete-items");
                        at.appendChild(e);
                        e2 = document.createElement('div');
                        e2.setAttribute("class", "autocomplete-items-text");
                        e2.setAttribute("id", [i, j]);
                
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
                        guess[0] = i;
                        guess[1] = j;
                        closeAutofill();
                    });
                }

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
            guess[0] = document.getElementsByClassName("autocomplete-items-text")[focus].id.split(",")[0];
            guess[1] = document.getElementsByClassName("autocomplete-items-text")[focus].id.split(",")[1];
            document.getElementById('guess-input').value = data.composers[guess[0]].works[guess[1]].title + " - " + data.composers[guess[0]].complete_name;
            closeAutofill();
        }
    });

    function clearHighlight(){
        for (let i = 0; i < document.getElementsByClassName("autocomplete-items-text").length; i++) {
            document.getElementsByClassName("autocomplete-items-text")[i].classList.remove("autocomplete-item-highlight");
        }
    }

}

function evaluateGuess(composerID, pieceID) {
    if (composerID == answer[0]) {
        if (pieceID == answer[1]) {
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
    document.getElementById("guesses-list").innerHTML = '';
    document.getElementById('g' + guesses.length).appendChild(guesses[guesses.length - 1]);
}

const submitHover = document.getElementById('submit');
    submitHover.addEventListener('click', function(e) {
    if (evaluateGuess(guess[0], guess[1])[0]) {
        if (evaluateGuess(guess[0], guess[1])[1]) {
            var correct = document.createElement('span');
            correct.innerHTML = document.getElementById('guess-input').value + " - CORRECT!!!";
            addGuess(correct);
            guess = [-1, -1];
        } else {
            var partial = document.createElement('span');
            partial.innerHTML = "<span class='partial'>—</span> " + document.getElementById('guess-input').value;
            addGuess(partial);
            guess = [-1, -1];
        }
    } else if (guess[0] != -1) {
        var wrong = document.createElement('span');
        wrong.innerHTML = "<span class='wrong'>X</span> " + document.getElementById('guess-input').value;
        addGuess(wrong);
        guess = [-1, -1];
    }
    document.getElementById('guess-input').value = '';
    render_skip_time()
});


const skipHover = document.getElementById('skip-button');
    skipHover.addEventListener('click', function(e) {
        var skip = document.createElement('div');
        skip.innerHTML = 'S K I P P E D';
        addGuess(skip);
        document.getElementById('guess-input').value = '';
        render_skip_time()
});


function addGuess(guess) {
    if (numGuesses < 6 && guess != '') {
        guesses.push(guess);
        render_guesses();
        numGuesses++; 
    }
}


function render_skip_time() {
    document.getElementById('skip-button').innerHTML = '';
    if (numGuesses < 5) {
        document.getElementById('skip-button').textContent = 'SKIP (+' + (numGuesses + 1) + "s)";
    } else {
        document.getElementById('skip-button').textContent = 'SKIP';
    }
}