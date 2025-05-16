import type { JSX } from "react"
import type { Piece } from "../types/Piece"

interface AutofillItemsProps {
	input: string
	piecesData: Piece[]
	maxQueries: number
}

const AutofillItems = ({ input, piecesData, maxQueries }: AutofillItemsProps) => {

  const removeSpecialCharacters = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	}

	const filterPieces = (): Piece[] => {
		// Filter pieces that match the input
		return piecesData.filter((piece) => {
			let formattedPiece = piece.title + " - " + piece.composer;
			let reducedPiece = removeSpecialCharacters(formattedPiece).toLowerCase();

			return reducedPiece.includes(input);
		});
	}

	const pieceToJSXElement = (piece: Piece, id: number): JSX.Element => {
		let formattedPiece = piece.title + " - " + piece.composer;
		let reducedPiece = removeSpecialCharacters(formattedPiece).toLowerCase();

		// Add highlighting to section matching input
		let inputStartIndex: number = reducedPiece.indexOf(input);

		let prehighlight = formattedPiece.substring(0, inputStartIndex);
		let highlighted = formattedPiece.substring(inputStartIndex, inputStartIndex + input.length);
		let posthighlight = formattedPiece.substring(inputStartIndex + input.length);

		// TODO: id={String(id)} should be the id of the piece not the index
		let outputQuery = <div className="autocomplete-items" key={id}>
			<div className="autocomplete-items-text" id={String(id)}> 
				{prehighlight}<span className="letter-highlight">{highlighted}</span>{posthighlight}
			</div>
		</div>
			

		return outputQuery;
	}

	let queries = filterPieces();
	let totalQueries = queries.length;
	queries = queries.slice(0, maxQueries);

	return (
		<>
			<div className="autocomplete" id="autocomplete">
				{queries.map((query, index) => (
					pieceToJSXElement(query, index)
				))}
			</div>
			<div className="autocomplete" id="autocomplete-footnote">
				<div className="footnote">
					{ queries.length > 0 ? 
					"Showing " + queries.length + " out of " + totalQueries + " for \"" + input + "\" - scroll to see more" : 
					"No results for \"" + input + "\""}
				</div>
			</div>
		</>
	)

}

export default AutofillItems