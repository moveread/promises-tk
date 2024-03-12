import { delay } from 'promises-tk'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    delay(2).then(() => console.log('Yeah!'))
  }, [])
  return (
    <div>
      <p>Testing app</p>
    </div>
  )
}

export default App
