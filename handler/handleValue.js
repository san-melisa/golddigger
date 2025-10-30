
export async function handleValue(req, res) {
    let goldEUR = 3455.21

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')



    setInterval(() => {
         let changePercent = (Math.random() - 0.5) * 0.006
         goldEUR = goldEUR * (1 + changePercent)
          let price =  goldEUR.toFixed(2)
          res.write(`data: ${JSON.stringify({ eur: price})} \n\n`)
    }, 3000)
}
