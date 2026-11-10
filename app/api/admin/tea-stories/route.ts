import { NextResponse } from 'next/server'
import { isAdminAuthenticated, isSameOriginRequest } from '@/lib/admin-auth'
import { createTeaStory } from '@/lib/tea-stories'
import {
  imageFromFormData,
  teaStoryApiError,
  teaStoryInputFromFormData,
} from '@/lib/tea-story-form'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })
  }

  try {
    const form = await request.formData()
    const image = imageFromFormData(form)
    if (!image) {
      return NextResponse.json(
        { error: 'Please add a cover image for the story.' },
        { status: 400 },
      )
    }

    const story = await createTeaStory(teaStoryInputFromFormData(form), image)
    return NextResponse.json({ story }, { status: 201 })
  } catch (error) {
    const { message, status } = teaStoryApiError(error)
    return NextResponse.json({ error: message }, { status })
  }
}
