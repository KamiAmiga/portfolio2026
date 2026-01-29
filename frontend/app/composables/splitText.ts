interface CustomSegment {
  index: number,
  segment: string,
  isSpace?: boolean,
  animDelay?: number
}

interface SplittedText extends CustomSegment {
  charsArray? : CustomSegment[]
}

const setSegmentsArray = (segments: Intl.Segments, initialAnimDelay: number = 0) => {
  const segmentsArray = []
  let animDelay = initialAnimDelay

  for (const word of Array.from(segments)) {
    segmentsArray.push({
      index: word.index,
      segment: word.segment,
      isSpace: word.segment === ' ',
      animDelay
    })

    if (word.isWordLike) {
      animDelay += .12
    }
  }

  return segmentsArray
}

export const useSplitByWord = (text: string): SplittedText[] => {
  const wordSegmenter = new Intl.Segmenter('fr', { granularity: 'word' })
  const segments = wordSegmenter.segment(text)

  return setSegmentsArray(segments)
}

export const useSplitByChar = (text: string): SplittedText[] => {
  const wordsArray = useSplitByWord(text)

  const charsSegmenter = new Intl.Segmenter('fr', { granularity: 'grapheme' })
  const charsAndWordsArray = []
  let animDelay = 0

  for (const word of wordsArray) {
    let charsArray = []

    if (!word.isSpace) {
      for (const char of charsSegmenter.segment(word.segment)) {
        charsArray.push({
          index: char.index,
          segment: char.segment,
          animDelay
        })

        animDelay += .012
      }
    }

    charsAndWordsArray.push({
      index: word.index,
      segment: word.segment,
      isSpace: word.segment === ' ',
      charsArray
    })
  }


  return charsAndWordsArray
}