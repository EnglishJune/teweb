import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const materialsPath = path.join(projectRoot, 'public', 'materials.json')
const rssTargets = [
  path.join(projectRoot, 'public', 'resources', 'te', 'rss.xml'),
  path.join(projectRoot, 'public', 'rss.xml'),
]

const siteUrl = 'https://www.jenglish.top'
const channelTitle = 'J English TE Updates'
const channelLink = `${siteUrl}/resources/te`
const feedUrl = `${siteUrl}/resources/te/rss.xml`
const channelDescription = 'Updates for J English TE learning materials.'

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function getPublishDate(date) {
  return new Date(`${date}T01:00:00.000Z`)
}

function toRssDate(date) {
  return getPublishDate(date).toUTCString()
}

function validateMaterial(material, index) {
  if (!material || typeof material !== 'object') {
    throw new Error(`Material at index ${index} must be an object.`)
  }

  if (!material.title || typeof material.title !== 'string') {
    throw new Error(`Material at index ${index} is missing a string title.`)
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(material.date || '')) {
    throw new Error(`Material "${material.title}" is missing a YYYY-MM-DD date.`)
  }
}

function buildRss(materials, buildDate = new Date()) {
  const sortedMaterials = [...materials].sort((a, b) => b.date.localeCompare(a.date))
  const lastBuildDate = buildDate.toUTCString()

  const items = sortedMaterials
    .map((material) => {
      const title = escapeXml(material.title)
      const date = escapeXml(material.date)
      const itemUrl = `${channelLink}?issue=${date}`

      return `    <item>
      <title>${title}</title>
      <link>${itemUrl}</link>
      <guid isPermaLink="false">te-${date}</guid>
      <pubDate>${toRssDate(material.date)}</pubDate>
      <description>New TE learning materials are available for ${date}.</description>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${channelLink}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>en</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>
`
}

const materials = JSON.parse(await readFile(materialsPath, 'utf8'))

if (!Array.isArray(materials)) {
  throw new Error('materials.json must contain an array.')
}

materials.forEach(validateMaterial)

const rss = buildRss(materials)

await Promise.all(rssTargets.map((target) => writeFile(target, rss)))

console.log(`Generated RSS from ${materials.length} materials.`)
