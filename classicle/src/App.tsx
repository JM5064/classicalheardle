import AnswerGroup from "./components/AnswerGroup";
import SearchBar from "./components/SearchBar";
import AutofillItems from "./components/AutofillItems";
import { useEffect, useState } from "react";
import type { Piece } from "./types/Piece";

function App() {
  let guesses = ["", "", "", "", "", ""];
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    async function fetchPieces() {
      // Fetch pieces list from public folder
      const response = await fetch("/data/pieces.json");
      const pieces: any[] = await response.json();
      
      setPieces(pieces);
    }
    
    fetchPieces();
  }, [])

  const handleInput = (input: string) => {
    setInput(input);
  }
  
  return (
    <>
      <div className="header">
        <p className="title">
          Classicle
        </p>
      </div>
      

      <div className="body">
        <SearchBar onInput={handleInput}></SearchBar>
        <AnswerGroup guesses={guesses} highlightIndex={0}></AnswerGroup>
      </div>
      {input.length > 0 && <AutofillItems input={input} piecesData={pieces} maxQueries={50}></AutofillItems>}
      
    </>
  )
}

export default App;