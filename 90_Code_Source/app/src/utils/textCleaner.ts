/**
 * Utilitaire de nettoyage et décodage robuste des entités HTML et caractères spéciaux
 * pour l'affichage scénique des tablatures et paroles.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return ''
  
  let cleaned = text
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')

  if (typeof document !== 'undefined' && cleaned.includes('&')) {
    try {
      const txt = document.createElement('textarea')
      txt.innerHTML = cleaned
      cleaned = txt.value
    } catch {
      // Fallback
    }
  }

  return cleaned
}
