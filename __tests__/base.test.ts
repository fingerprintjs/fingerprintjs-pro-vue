import { getGreeting } from '../src/greeting'

describe('Greeting', () => {
  it('should greet World', () => {
    expect(getGreeting('World')).toBe('Hello World!')
  })
})
