const sampleSentences = [
  'Market opens higher as tech stocks rebound.',
  'Analysts predict a mixed quarter for global markets.',
  'Bond yields moved sideways today after inflation data.',
  'Small-cap stocks outperformed on earnings beat.',
  'Commodity prices reacted to supply concerns.'
]

const sources = ['Bloomberg', 'Reuters', 'Saras Research']
function buildDataset(query, total) {
  const trimmed = query.trim()
  const items = []
  for (let i = 0; i < total; i++) {
    const baseSentence = sampleSentences[(i + trimmed.length) % sampleSentences.length]
    const source = sources[i % sources.length]
    const publishedAt = new Date(Date.now() - i * 45 * 60 * 1000) // every 45 minutes

    items.push({
      id: `${trimmed}-${i}`,
      title: `${trimmed} · ${baseSentence}`,
      snippet: `${baseSentence} A short summary for \"${trimmed}\" result #${i + 1}.`,
      long: `${baseSentence} This is an extended description containing more details about the result and why it is relevant to the query \"${trimmed}\" in the context of Saras Finance style search.`,
      source,
      date: publishedAt.toLocaleString(),
      publishedAt: publishedAt.toISOString(),
      score: ((100 - i * 2) - (trimmed.length % 5)).toString()
    })
  }
  return items
}

export async function searchArticles({ query, page = 1, pageSize = 8 } = {}) {
  const trimmed = (query || '').trim()
  if (!trimmed) {
    return {
      items: [],
      page: 1,
      pageSize,
      total: 0
    }
  }

  const safePage = Math.max(1, page | 0)
  const safePageSize = Math.min(Math.max(3, pageSize | 0), 20)

  const total = 24 + (trimmed.length % 8) 
  const dataset = buildDataset(trimmed, total)

  const start = (safePage - 1) * safePageSize
  const end = Math.min(start + safePageSize, total)
  const items = start >= total ? [] : dataset.slice(start, end)

  const latency = 260 + Math.floor(Math.random() * 420)

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items,
        page: safePage,
        pageSize: safePageSize,
        total
      })
    }, latency)
  })
}

export async function fetchSearchResults(query = '') {
  const { items } = await searchArticles({ query, page: 1, pageSize: 10 })
  return items
}
