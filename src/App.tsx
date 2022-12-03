import React from 'react'
import { useState } from 'react'
import { CopyBlock, atomOneLight } from 'react-code-blocks'
import logo from './logo.svg'
import './App.css'
import { Button, Textarea, Text, Spacer } from '@geist-ui/core'
import { result4 } from './examples'

function App () {
  const [isLoading, setIsLoading] = useState(false)
  const [schemaText, setSchemaText] = useState('')
  const [queryText, setQueryText] = useState('')
  const [resultText, setResultText] = useState('')

  const getCodexSQL = async () => {
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

    await delay(2000)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setResultText('')
    console.log('submit')
    setIsLoading(true)
    const result = await getCodexSQL()
    console.log(result)
    // setResultText(result.data.choices[0].text)
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
          <div>
            <div>
              <CopyBlock
                style={{ overflow: 'scroll', fontSize: '12px' }}
                language={'sql'}
                text={result4}
                showLineNumbers={false}
                theme={atomOneLight}
              />
            </div>
            <Spacer />
            <Text>
              Note that this query will only return companies within a
              rectangular area defined by the minimum and maximum latitude and
              longitude coordinates. To return companies within a true 5-mile
              radius, a more complex query would be needed that takes into
              account the curvature of the Earth and uses a geospatial distance
              function.
            </Text>
          </div>
        </form>
      </div>
    </main>
  )
}

export default App
