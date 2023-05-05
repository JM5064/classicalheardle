

function switchMode () {
    var element = document.body;
    document.getElementById('submit').classList.toggle('light-mode');
    element.classList.toggle('light-mode');

}
  
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

var data;

readTextFile("openopusids.json", function(text) {
    data = JSON.parse(text);
    console.log(data);

    // const newData = {
    //     composers: data.composers.map((composer, composerIndex) => ({
    //     id: composerIndex + 1,
    //     name: composer.name,
    //     complete_name: composer.complete_name,
    //     epoch: composer.epoch,
    //     birth: composer.birth,
    //     death: composer.death,
    //     popular: composer.popular,
    //     recommended: composer.recommended,
    //     works: composer.works.map((work, workIndex) => ({
    //         id: `${composerIndex + 1}-${workIndex + 1}`,
    //         title: work.title,
    //         subtitle: work.subtitle,
    //         searchterms: work.searchterms,
    //         popular: work.popular,
    //         recommended: work.recommended,
    //         genre: work.genre
    //     }))
    //     }))
    // };
    
    // console.log(newData);
      
});

let guesses = [];
let numGuesses = 0;

focus = -1;

function closeAutofill() {
    focus = -1;
    if (document.getElementById("autocomplete") != null) {
        document.getElementById("autocomplete").remove();
    }
}

autofill(document.getElementById("guess-input"));

function removeSpecialCharacters(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function autofill(input) {

    input.addEventListener("input", function(e) {
        closeAutofill();
        var max = 50;
        let inp = removeSpecialCharacters(input.value.toUpperCase());

        var at = document.createElement('div');
        at.setAttribute("class", "autocomplete");
        at.setAttribute("id", "autocomplete");
        document.body.appendChild(at);

        for (let i = 0; i < data.composers.length; i++) {
            for (let j = 0; j < data.composers[i].works.length; j++) {
                let origPiece = data.composers[i].works[j].title + " - " + data.composers[i].complete_name;
                let piece = removeSpecialCharacters(origPiece);

                if (piece.toUpperCase().includes(inp) && (data.composers[i].works[j].popular == "1"
                // || data.composers[i].works[j].recommended == "1"
                )
                ) {
                    var e2;
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
                        // document.body.appendChild(e);

                    } else {
                        break;
                    }
                
                    e2.addEventListener("click", function(e) {
                        document.getElementById('guess-input').value = origPiece;
                        closeAutofill();
                    });
                }

            }
        }
        var fn = document.createElement('div');
        fn.setAttribute("class", "autocomplete-items");
        var fn2 = document.createElement('div');
        fn2.setAttribute("class", "footnote");
        fn2.innerHTML = "Showing " + document.getElementsByClassName("autocomplete-items").length + " results for \"" + input.value + "\"";
        fn.appendChild(fn2);
        at.appendChild(fn);

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
            let composer_id = document.getElementsByClassName("autocomplete-items-text")[focus].id.split(",")[0];
            let piece_id = document.getElementsByClassName("autocomplete-items-text")[focus].id.split(",")[1];
            document.getElementById('guess-input').value = data.composers[composer_id].works[piece_id].title + " - " + data.composers[composer_id].complete_name;
            closeAutofill();
        }
    });

    function clearHighlight(){
        for (let i = 0; i < document.getElementsByClassName("autocomplete-items-text").length; i++) {
            document.getElementsByClassName("autocomplete-items-text")[i].classList.remove("autocomplete-item-highlight");
        }
    }

}

document.addEventListener("click", function(e) {
    closeAutofill();
});

function render_guesses() {
    document.getElementById("guesses-list").innerHTML = '';
    document.getElementById('g' + guesses.length).textContent += guesses[guesses.length - 1];        
}

const submitHover = document.getElementById('submit');
    submitHover.addEventListener('click', function(e) {
    addGuess(document.getElementById('guess-input').value);
    document.getElementById('guess-input').value = '';
    render_skip_time()
});

const skipHover = document.getElementById('skip-button');
    skipHover.addEventListener('click', function(e) {
    addGuess('S K I P P E D');
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