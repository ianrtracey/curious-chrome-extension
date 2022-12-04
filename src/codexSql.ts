import demoExamples from './demoExamples'

export const getCodexSQL = async (prompt: string) => {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

  await delay(2000)

  const response = demoExamples.find(example =>
    example.prompt.toLowerCase().startsWith(prompt)
  )
  if (!response) {
    return null
  }
  return response
}

export default null
