import { NextResponse } from 'next/server'
import { isAdminAuthenticated, isSameOriginRequest } from '@/lib/admin-auth'
import {
  deleteTeaStory,
  getTeaStoryById,
  updateTeaStory,
} from '@/lib/tea-stories'
import {
  imageFromFormData,
  teaStoryApiError,
  teaStoryInputFromFormData,
} from '@/lib/tea-story-form'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteContext = {
  params: { id: string }
}

export async function PUT(request: Request, { params }: RouteContext) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })
  }

  try {
    const existing = await getTeaStoryById(params.id)
    if (!existing) {
      return NextResponse.json({ error: 'Story not found.' }, { status: 404 })
    }

    const form = await request.formData()
    const story = await updateTeaStory(
      existing,
      teaStoryInputFromFormData(form),
      imageFromFormData(form),
    )
    return NextResponse.json({ story })
  } catch (error) {
    const { message, status } = teaStoryApiError(error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })
  }

  try {
    const existing = await getTeaStoryById(params.id)
    if (!existing) {
      return NextResponse.json({ error: 'Story not found.' }, { status: 404 })
    }

    await deleteTeaStory(existing)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const { message, status } = teaStoryApiError(error)
    return NextResponse.json({ error: message }, { status })
  }
}
