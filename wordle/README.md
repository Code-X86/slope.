# Wordle Unlimited

A browser-based clone of the popular word-guessing game Wordle with unlimited plays. This implementation features a clean, modern UI with animations and responsive design.

![Wordle Unlimited Screenshot](https://i.imgur.com/zdb1Lsn.png)

## Features

- **Unlimited gameplay**: Unlike the original Wordle, this version lets you play as many times as you want
- **word dictionary**: Uses a comprehensive list of valid English words
- **Modern UI**: Sleek dark theme with animations and visual feedback
- **Color-coded feedback**:
  - Green: Correct letter in correct position
  - Yellow: Correct letter in wrong position
  - Gray: Letter not in the word

## How To Play

1. Use your keyboard to type a 5 letter word
2. Submit your guess using the "Submit" button or press Enter
3. Get visual feedback on your guess with color-coded tiles
4. You have 6 attempts to guess the correct word
5. After completing a game (win or lose), a new word is automatically selected

## Technologies Used

- HTML5
- CSS3 (with animations and transitions)
- Vanilla JavaScript (ES6+)
- External word dictionary file

## Installation and Setup

1. Clone this repository:

   ```
   git clone https://github.com/zakriasabir/wordle-unlimited.git
   ```

2. Navigate to the project directory:

   ```
   cd wordle-unlimited
   ```

3. Make sure you have a `words.txt` file in the root directory containing 5-letter words, one per line.

4. Open `index.html` in your browser or use a local development server:

## Word Dictionary

The game requires a `words.txt` file containing a list of 5-letter English words (one word per line). The file should be placed in the root directory of the project.

You can create your own word list or find existing ones online from various word dictionaries. Popular sources include:

- English dictionaries
- Scrabble word lists
- Existing Wordle clone word lists

## Project Structure

```
wordle-unlimited/
├── index.html       # Main HTML structure
├── styles.css       # Styling and animations
├── script.js        # Game logic
└── words.txt        # Dictionary of 5-letter words
```

## Future Enhancements

- Add an on-screen keyboard for mobile users
- Implement statistics tracking (win rate, streak, etc.)
- Add difficulty levels with different word pools
- Create a share/export feature for results
- Add dark/light theme toggle

## License

MIT License - feel free to use, modify, and distribute this code.

## Acknowledgments

- Original Wordle game created by Josh Wardle
- Word list compiled from various English dictionary sources
