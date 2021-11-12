# NodeReact application called ScrollReader

## Run commands
----------------------------------
### Terminal commands:
client: npm start
server: npx nodemon server
entire app: npm run dev

textSchema {
  fileID,
  startTime,
  endTime,
  familiarity,
  interest,
  pauses [
    {
      action,
      time
    }
  ],
  questionAnswers [
    {
      answer,
      skip,
      yPosition,
      time
    }
  ]
}

ReadingSessionSchema {
  userName,
  viewportDimensions [
    {
      width,
      height
    }
  ],
  templateID,
  startTime,
  endTime,
  speedTexts [textSchema],
  scrollTexts [textSchema]
}

SessionTemplateSchema {
  name,
  speedTest {
    texts [
      {
        fileID,
        styleID
      }
    ],
    instructions
  },
  scrollTexts [
    {
      fileID,
      instructions {
        main,
        hasFamiliarityQuestion,
        hasInterestQuestion
      },
      questionIDs
    }
  ],
  createdAt
}

TextFileSchema {
  text,
  fileName,
  questions [
    {
      question,
      answerRegion {
        startIndex,
        endIndex
      }
    }
  ],
  questionFormat,
  styles [
    {
      fontFamily,
      fontSize,
      lineHeight
    }
  ],
  createdAt
}