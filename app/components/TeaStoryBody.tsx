import { Fragment, type ReactNode } from 'react'

function renderInline(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .filter(Boolean)
    .map((piece, index) => {
      if (piece.startsWith('**') && piece.endsWith('**')) {
        return <strong key={index}>{piece.slice(2, -2)}</strong>
      }
      if (piece.startsWith('*') && piece.endsWith('*')) {
        return <em key={index}>{piece.slice(1, -1)}</em>
      }
      return <Fragment key={index}>{piece}</Fragment>
    })
}

function renderLines(text: string): ReactNode[] {
  return text.split('\n').map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <br />}
      {renderInline(line)}
    </Fragment>
  ))
}

/**
 * A deliberately small, safe subset of Markdown for staff-written stories:
 * paragraphs, headings, quote blocks, bullet lists, horizontal rules, bold and
 * italic. Everything is rendered as React text — no HTML injection.
 */
export default function TeaStoryBody({ body }: { body: string }) {
  const blocks = body
    .replace(/\r\n/g, '\n')
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        const lines = block.split('\n')

        if (/^---+$/.test(block)) {
          return <hr key={index} className="my-10 border-ink/10" />
        }

        if (block.startsWith('### ')) {
          return (
            <h3 key={index} className="pt-4 font-serif text-2xl leading-snug text-ink">
              {renderInline(block.slice(4))}
            </h3>
          )
        }

        if (block.startsWith('## ') || block.startsWith('# ')) {
          return (
            <h2 key={index} className="pt-5 font-serif text-3xl leading-tight text-ink md:text-4xl">
              {renderInline(block.replace(/^#{1,2}\s+/, ''))}
            </h2>
          )
        }

        if (lines.every((line) => line.trimStart().startsWith('- '))) {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6 text-[17px] leading-[1.85] text-ink-soft">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(line.trimStart().slice(2))}</li>
              ))}
            </ul>
          )
        }

        if (lines.every((line) => line.trimStart().startsWith('> '))) {
          return (
            <blockquote
              key={index}
              className="my-8 border-l-2 border-clay/70 pl-6 font-serif text-2xl italic leading-relaxed text-forest"
            >
              {renderLines(lines.map((line) => line.trimStart().slice(2)).join('\n'))}
            </blockquote>
          )
        }

        return (
          <p key={index} className="text-[17px] leading-[1.9] text-ink-soft">
            {renderLines(block)}
          </p>
        )
      })}
    </div>
  )
}
