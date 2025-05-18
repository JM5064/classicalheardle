import json
import librosa
import uuid
import numpy as np

# Checks whether the given composer is in the pieces dataset
def verify_composer(composer: str) -> bool:
    for piece in pieces:
        if piece["composer"] == composer:
            return True
        
    return False


def prompt_user():
    # Prompt composer
    composer = input("Enter the composer's full name: ")
    # if not verify_composer(composer):
    #     raise Exception("Composer not found")

    # Prompt title
    title = input("Enter the title of the piece: ")

    # Prompt subtitle
    has_subtitle = input("Has subtitle? Y/n: ")
    subtitle = None
    if has_subtitle.lower() == 'y':
        subtitle = input("Enter the subtitle: ")

    # Prompt recording
    has_recording = input("Has recording? Y/n: ")
    recording_path = None
    if has_recording.lower() == 'y':
        recording_path = input("Recording path: ")

    print("===== Summary =====")
    print(f"Composer: {composer}")
    print(f"Title: {title}")
    print(f"Subtitle: {subtitle}")
    print(f"Recording Path: {recording_path}")
    print()

    confirm = input("Confirm add? Y/n: ")
    if confirm.lower() == 'y':
        return composer, title, subtitle, recording_path
    else:
        return prompt_user()


def generate_id():
    return str(uuid.uuid4())


def insort(pieces: list, piece):
    # Sort based on composer first name, then piece title
    composer = piece['composer']
    title = piece['title']

    left = 0
    right = len(pieces) - 1

    while left <= right:
        mid = (right - left) // 2 + left

        if pieces[mid]['composer'] == composer:
            if pieces[mid]['title'] == title:
                raise Exception("Piece already exists")
            elif pieces[mid]['title'] < title:
                left = mid + 1
            else:
                right = mid - 1

        elif pieces[mid]['composer'] < composer:
            left = mid + 1
        else:
            right = mid - 1

    pieces.insert(left, piece)


def generate_decibel_data(recording_path, num_lines=60):
    # Calculates the root mean squares of chunks of the audio
    decibel_data = []

    # y - audio, encoded as a 1D np array of sampled points
    # sr - sample rate
    y, sr = librosa.load(recording_path)

    audio_length = min(len(y), sr * 30) # 30 seconds of audio = sample rate * 30
    chunk_size = audio_length // num_lines

    for i in range(num_lines-1):
        start = i * chunk_size

        sum_of_squares = 0
        for j in range(start, min(len(y), start + 2 * chunk_size)): # Adding next chunk makes it smoother
            sum_of_squares += y[j] ** 2
        
        rms = (sum_of_squares / (2 * chunk_size)) ** 0.5
        decibel_data.append(round(rms, 3))

    return decibel_data


def save_data(file_path, data):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=2)


def add_piece(composer, title, subtitle, recording_path):
    pieces_path = "classicle/public/data/pieces.json"
    recordings_path = "classicle/public/data/recordings.json"

    pieces = json.load(open(pieces_path, "r"))
    recordings = json.load(open(recordings_path, "r"))

    piece_id = generate_id()
    piece = {
        'composer': composer,
        'title': title,
        'subtitle': subtitle,
        'id': piece_id,
        'recording_id': None,
    }

    if recording_path is not None:
        recording_id = generate_id()
        decibel_data = generate_decibel_data(recording_path)
        recording = {
            'composer': composer,
            'title': title,
            'recording_path': recording_path,
            'decibel_data': decibel_data,
            'piece_id': piece_id,
            'id': recording_id
        }

        piece['recording_id'] = recording_id

        insort(recordings, recording)
        save_data(recordings_path, recordings)

    insort(pieces, piece)
    save_data(pieces_path, pieces)

    print(f'{title} by {composer} added successfully!')


if __name__ == "__main__":
    composer, title, subtitle, recording_path = prompt_user()
    add_piece(composer, title, subtitle, recording_path)

    
    
