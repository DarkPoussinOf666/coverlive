import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import { extractSongFromUgHtml } from './src/utils/ugParser.ts'

function ugScraperPlugin(): Plugin {
  return {
    name: 'ug-scraper-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/scrape-ug')) {
          return next()
        }

        try {
          const parsedUrl = new URL(req.url, 'http://localhost')
          const targetUrl = parsedUrl.searchParams.get('url')

          if (!targetUrl) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Le paramètre URL est requis.' }))
            return
          }

          // Validation basique de domaine
          if (!targetUrl.includes('ultimate-guitar.com')) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: "L'URL doit provenir d'ultimate-guitar.com." }))
            return
          }

          const response = await fetch(targetUrl, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
          })

          if (!response.ok) {
            res.statusCode = response.status
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                error: `Impossible de contacter Ultimate Guitar (statut HTTP ${response.status}).`,
              })
            )
            return
          }

          const html = await response.text()
          const song = extractSongFromUgHtml(html, targetUrl)

          if (!song) {
            res.statusCode = 422
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                error:
                  'Aucune tablature publique exploitable trouvée sur cette page (morceau Pro ou format incompatible).',
              })
            )
            return
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, song }))
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Erreur interne de scraping' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ugScraperPlugin()],
})
