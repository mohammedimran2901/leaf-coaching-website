'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'

export default function DeleteStoryButton({
  storyId,
  storyTitle,
}: {
  storyId: string
  storyTitle: string
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete “${storyTitle}”? This removes the story and its image permanently.`,
    )
    if (!confirmed) return

    setPending(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/tea-stories/${storyId}`, {
        method: 'DELETE',
      })
      const data = (await response.json().catch(() => ({}))) as { error?: string }

      if (!response.ok) {
        setError(data.error || 'Could not delete the story.')
        setPending(false)
        return
      }

      router.refresh()
    } catch {
      setError('Could not reach the server. Please try again.')
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-red-700/75 transition hover:bg-red-50 hover:text-red-800 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        Delete
      </button>
      {error && <p className="max-w-[16rem] text-right text-[11px] text-red-700">{error}</p>}
    </div>
  )
}
