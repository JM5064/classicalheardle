
interface AnswerGroupProps {
	guesses: string[]
	highlightIndex: number
}

const AnswerGroup = ({ guesses, highlightIndex }: AnswerGroupProps) => {
	return (
		<ul>
			{guesses.map((guess, index) => (
				<li 
					className={highlightIndex === index ? "guess highlight" : "guess"} id={"g" + (index+1)}
					key={index}
				>
					{guess}
				</li>
			))}
		</ul>
	)


}

export default AnswerGroup