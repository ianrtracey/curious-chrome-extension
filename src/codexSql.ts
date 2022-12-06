import demoExamples from './demoExamples'

export const getCodexSQL = async (prompt: string) => {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

  await delay(2000)

  const promptPrefixes = [
    ['explain', 'explain_this'],
    ['convert', 'edit_code'],
    ['define', 'define_metric'],
    ['create', 'create_table'],
    ['add', 'add_documentation']
  ]

  const promptMatch = promptPrefixes.find(prefix =>
    prompt.toLowerCase().startsWith(prefix[0])
  ) as any

  if (promptMatch) {
    return demoExamples.find(example => example.id === promptMatch[1])
  }

  const response = demoExamples.find(example =>
    example.prompt.toLowerCase().startsWith(prompt)
  )
  if (!response) {
    return null
  }
  return response
}

export default null
