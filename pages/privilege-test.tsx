import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import PageContainer, {
  ComponentContainer,
  ComponentType,
} from '../lib/components/AppContainer'
import MyFooter from '../lib/components/Footer'
import schools from '../lib/data/schools'

const QUIZ_VERSION = 1

export type QuizLog = {
  version: number
  race: string
  secondarySchool: string
  blueChasCard: boolean
  answers: boolean[]
  score: number
}

const useStyles = makeStyles((theme) => ({
  testContent: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      padding: '1rem 4rem',
    },
  },
  form: {
    marginTop: '2rem',
  },
  progressBar: {
    margin: '2rem 0',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1.25rem',
    '& button': {
      marginRight: '2.5rem',
      '&:last-child': {
        marginRight: 'unset',
      },
    },
  },
  scoreText: {
    fontSize: '4rem',
    fontWeight: 700,
    margin: '1rem 0',
  },
  formControlLabel: {
    margin: '9px 0',
    maxWidth: '100%',
  },
  checkbox: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
}))

type PrivilegeTestProps = {
  questions: string[]
}

const PrivilegeTest: NextPage<PrivilegeTestProps> = ({ questions }) => {
  const questionsInPage = 15
  const classes = useStyles()

  const defaultState = new Array<boolean>(questions.length).fill(false)
  const [page, setPage] = useState<number>(0)
  const maxPage = Math.floor(questions.length / questionsInPage)
  const [showResults, setShowResults] = useState<boolean>(false)

  const [race, setRace] = useState<string>(null)
  const [secondarySchool, setSecondarySchool] = useState<string>(null)
  const [isBlueChasCard, setIsBlueChasCard] = useState<boolean>(null)
  const [questionStates, setQuestionStates] = useState<boolean[]>(defaultState)

  const canViewScore = () => {
    return (
      race != null &&
      race != '' &&
      secondarySchool != null &&
      secondarySchool != '' &&
      isBlueChasCard != null
    )
  }

  const onViewScore = () => {
    const logObject: QuizLog = {
      version: QUIZ_VERSION,
      race,
      secondarySchool,
      blueChasCard: isBlueChasCard,
      answers: questionStates,
      score: questionStates.filter((el) => Boolean(el)).length,
    }
    fetch('https://api.candid.sg/quiz/submission', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logObject),
    })
    setShowResults(true)
  }

  const clearQuestionStates = () => {
    setPage(0)
    setQuestionStates(defaultState)
    setShowResults(false)
    setRace(null)
    setSecondarySchool(null)
    setIsBlueChasCard(null)
  }

  const pageQuestion = questions.slice(
    page * questionsInPage,
    (page + 1) * questionsInPage
  )

  const DemographicComponent: React.FC = () => (
    <div style={{ margin: '1rem 0' }}>
      <Typography style={{ margin: '1rem 0' }} variant="subtitle1">
        Your Race
      </Typography>
      <Autocomplete
        options={['Chinese', 'Malay', 'Indian', 'Others']}
        getOptionLabel={(option) => option}
        style={{ width: 200 }}
        renderInput={(params) => (
          <TextField {...params} label="Select race" variant="outlined" />
        )}
        value={race}
        onChange={(_, value) => setRace(value)}
      />
      <Typography style={{ margin: '1rem 0' }} variant="subtitle1">
        Your Secondary School
      </Typography>
      <Autocomplete
        options={schools}
        getOptionLabel={(option) => option}
        style={{ maxWidth: 450, width: '100%' }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a school name"
            variant="outlined"
          />
        )}
        value={secondarySchool}
        onChange={(_, value) => setSecondarySchool(value)}
      />
      <Typography style={{ margin: '1rem 0' }} variant="subtitle1">
        Holding a Blue CHAS Card?
      </Typography>
      <Autocomplete
        options={['Yes', 'No']}
        getOptionLabel={(option) => option}
        style={{ width: 200 }}
        renderInput={(params) => (
          <TextField {...params} label="Select if you do" variant="outlined" />
        )}
        value={isBlueChasCard == null ? null : isBlueChasCard ? 'Yes' : 'No'}
        onChange={(_, value) => {
          if (value == 'Yes') {
            setIsBlueChasCard(true)
          } else if (value == 'No') {
            setIsBlueChasCard(false)
          } else {
            setIsBlueChasCard(null)
          }
        }}
      />
    </div>
  )

  const QuestionsComponent: React.FC = () => (
    <ComponentContainer type={ComponentType.Section}>
      <Typography variant="h3">{'Privilege Test'}</Typography>
      <FormGroup className={classes.form}>
        {pageQuestion.map((qn, id) => {
          const indexOffset = page * questionsInPage
          return (
            <FormControlLabel
              key={id}
              className={classes.formControlLabel}
              control={
                <Checkbox
                  className={classes.checkbox}
                  checked={questionStates[indexOffset + id]}
                  onChange={(event) => {
                    questionStates[indexOffset + id] = event.target.checked
                    setQuestionStates([...questionStates])
                  }}
                  name={`question-${indexOffset + id}`}
                />
              }
              label={`${id + indexOffset + 1}. ${qn}`}
            />
          )
        })}
        {page === maxPage && <DemographicComponent />}
      </FormGroup>
      <LinearProgress
        className={classes.progressBar}
        variant="determinate"
        value={(page * 100) / maxPage}
      />
      <div className={classes.buttonRow}>
        <Button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          variant="outlined"
        >
          {'Previous'}
        </Button>
        {page !== maxPage ? (
          <Button
            onClick={() => setPage(page + 1)}
            variant="contained"
            color="primary"
          >
            {'Next'}
          </Button>
        ) : (
          <Button
            onClick={onViewScore}
            variant="contained"
            color="primary"
            disabled={!canViewScore()}
          >
            {'Get score'}
          </Button>
        )}
      </div>
    </ComponentContainer>
  )

  const ResultsComponent: React.FC = () => (
    <ComponentContainer type={ComponentType.Section}>
      <Typography variant="h3">{'Your Privilege Score:'}</Typography>
      <Typography className={classes.scoreText}>
        {questionStates.filter((el) => Boolean(el)).length}
      </Typography>
      <Button onClick={clearQuestionStates} variant="contained" color="primary">
        {'Try again'}
      </Button>
    </ComponentContainer>
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  return (
    <PageContainer>
      <Head>
        <title>Privilege Test</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>

      <main>
        <div className={classes.testContent}>
          {!showResults ? <QuestionsComponent /> : <ResultsComponent />}
        </div>
      </main>

      <MyFooter />
    </PageContainer>
  )
}

export const getStaticProps = async () => {
  const response = await fetch(
    'https://api.candid.sg/quiz/questions?' +
      new URLSearchParams({ version: QUIZ_VERSION.toString() }),
    { method: 'GET' }
  )
  const questions = (await response.json()).questions
  return { props: { questions } }
}

export default PrivilegeTest
