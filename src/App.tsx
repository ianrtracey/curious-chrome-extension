import React from 'react'
import { useState } from 'react'
import { CopyBlock, atomOneLight } from 'react-code-blocks'
import logo from './logo.svg'
import './App.css'
import { Button, Textarea, Text, Spacer } from '@geist-ui/core'
import { getCodexSQL } from './codexSql'

function App () {
  const [isLoading, setIsLoading] = useState(false)
  const [schemaText, setSchemaText] = useState('')
  const [queryText, setQueryText] = useState('')
  const [resultText, setResultText] = useState('')
  const [explanationText, setExplanationText] = useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setResultText('')
    console.log('submit')
    setIsLoading(true)
    const response = await getCodexSQL(queryText)
    console.log({ response })
    if (response) {
      setResultText(response.result)
      setExplanationText(response.explanation)
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
        display: 'flex',
        justifyContent: 'center',
        padding: '10px',
        border: '1px solid red'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '50px'
        }}
      >
        <form onSubmit={handleSubmit}>
          <Textarea
            style={{
              height: '150px'
            }}
            onChange={onQueryTextChange}
            value={queryText}
            disabled={isLoading}
            width='100%'
            placeholder='write a function to add two numbers together'
          />
          <div style={{ marginTop: '12px' }}>
            <Button
              onClick={handleSubmit}
              loading={isLoading}
              type='secondary'
              auto
              scale={2 / 3}
            >
              🔮 Generate
            </Button>
          </div>
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
              <Text>{explanationText}</Text>
            </div>
          )}
        </form>
      </div>
    </main>
  )
}

export default App
