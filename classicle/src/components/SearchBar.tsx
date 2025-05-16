interface SearchBarProps {
	onInput: (input: string) => void
}

const SearchBar = ({ onInput } : SearchBarProps) => {
	const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
		onInput(e.currentTarget.value);
	};

	return (
		<form autoComplete="off">
			<div>
				<input type="text" id="guess-input" className="search" placeholder="Guess Piece" onInput={handleInput}></input>
			</div>
		</form>
	)
}

export default SearchBar