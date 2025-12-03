function randomId() {
  return Math.random().toString(36).slice(2, 9)
}

const sampleSentences = [
  'Market opens higher as tech stocks rebound.',
  'Analysts predict a mixed quarter for global markets.',
  'Bond yields moved sideways today after inflation data.',
  'Small-cap stocks outperformed on earnings beat.',
  'Commodity prices reacted to supply concerns.'
]

export async function fetchSearchResults(query = '') {
  const latency = 300 + Math.floor(Math.random() * 400)
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query || query.trim() === '') {
        resolve([])
        return
      }
      const count = 5 + Math.floor(Math.random() * 5)
      const list = Array.from({ length: count }).map((_, i) => {
        const s = sampleSentences[(i + query.length) % sampleSentences.length]
        return {
          id: randomId(),
          title: `${query} — ${s}`,
          snippet: `${s} A short summary for "${query}" result ${i + 1}.`,
          long: `${s} This is an extended description containing more details about the result and why it is relevant to the query "${query}".`,
          source: ['Bloomberg', 'Reuters', 'Saras Research'][i % 3],
          date: new Date(Date.now() - i * 3600 * 1000).toLocaleString(),
          score: (Math.random() * 100).toFixed(0)
        }
      })
      resolve(list)
    }, latency)
  })
}