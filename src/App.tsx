import React from 'react'
import { useState } from 'react'
import { CopyBlock, atomOneLight } from 'react-code-blocks'
import logo from './logo.svg'
import './App.css'
import {
  Button,
  Textarea,
  Text,
  Spacer,
  Grid,
  Card,
  AutoComplete
} from '@geist-ui/core'
import { getCodexSQL } from './codexSql'

// const COMMANDS = [
//   { label: 'document' },
//   { label: 'summarize' },
//   { label: 'create table' },
//   { label: 'define metric' },
//   { label: 'edit code' }
// ]

// const CommandOptions = () => (
//   <Grid.Container gap={1.5} style={{ margin: '8px' }}>
//     {COMMANDS.map(command => (
//       <Grid xs={7} key={command.label}>
//         {/*@ts-ignore */}
//         <Card type={'success'} width='100%'>
//           <Text small my={0}>
//             {command.label}
//           </Text>
//         </Card>
//       </Grid>
//     ))}
//   </Grid.Container>
// )
// </Grid>
// ))}
// </Grid.Container>
// )

const Logo = () => (
  <h1
    style={{
      fontFamily: 'Hanson-Bold',
      fontSize: '18px',
      opacity: '85%'
    }}
  >
    Curious
  </h1>
)

function App () {
  const [isLoading, setIsLoading] = useState(false)
  const [schemaText, setSchemaText] = useState('')
  const [queryText, setQueryText] = useState('')
  const [resultText, setResultText] = useState('')
  const [explanationText, setExplanationText] = useState([])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setResultText('')
    setExplanationText([])
    console.log('submit')
    setIsLoading(true)
    const response = await getCodexSQL(queryText)
    console.log({ response })
    if (response) {
      setResultText(response.result)
      setExplanationText(response.explanation as any)
    }
    setIsLoading(false)
  }
  const onSchemaTextChange = (e: any) => {
    e.preventDefault()
    setSchemaText(e.target.value)
  }
  const onQueryTextChange = (e: any) => {
    e.preventDefault()
    setQueryText(e.target.value)
  }

  return (
    <main
      style={{
        padding: '10px',
        width: '450px',
        minHeight: '600px'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Logo />
      </div>
      <div
        style={{
          width: '100%',
          marginTop: '25px'
        }}
      >
        <Textarea
          style={{
            height: '100px'
          }}
          width='100%'
          onChange={onQueryTextChange}
          value={queryText}
          disabled={isLoading}
          placeholder=''
        />
        <div style={{ marginTop: '12px' }}>
          <Button
            width='100%'
            onClick={handleSubmit}
            loading={isLoading}
            type='secondary'
          >
            🔮 Generate
          </Button>
        </div>
        <Spacer h={2} />
        {explanationText && explanationText.length > 0 && (
          <div
            style={{
              background: '#F5F5F5',
              padding: '12px',
              borderRadius: '10px'
            }}
          >
            <Text h4 my={0}>
              Explanation
            </Text>
            {/* @ts-ignore */}
            {explanationText.map(block => (
              <Text p>{block}</Text>
            ))}
          </div>
        )}
        <Spacer />
        {resultText && (
          <div>
            <div>
              <CopyBlock
                style={{ overflow: 'scroll', fontSize: '12px' }}
                language={'sql'}
                text={resultText}
                showLineNumbers={false}
                theme={atomOneLight}
              />
            </div>
            <Spacer />
          </div>
        )}
      </div>
    </main>
  )
}

export default App
