import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function weekBounds(now: Date) {
  const current = new Date(now)
  const day = current.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const start = new Date(current)
  start.setHours(0, 0, 0, 0)
  start.setDate(current.getDate() + diffToMonday)
  const end = new Date(start)
  end.setDate(start.getDate() + 7)
  return { start, end }
}

function buildSummary(row: any) {
  const sessions = Array.isArray(row.sessions) ? row.sessions : []
  const now = new Date()
  const { start, end } = weekBounds(now)
  const weeklySessions = sessions.filter((session: any) => {
    if (!session?.date) return false
    const date = new Date(`${session.date}T12:00:00`)
    return date >= start && date < end
  })
  const done = weeklySessions.filter((session: any) => session?.estado === 'realizada')
  const pending = weeklySessions.filter((session: any) => session?.estado !== 'realizada')
  const patients = [...new Set(weeklySessions.flatMap((session: any) => (session?.pacientes || []).map((p: any) => p?.nombre).filter(Boolean)))]

  const lines = [
    'Resumen semanal FonoKids',
    '',
    `Semana: ${start.toLocaleDateString('es-CL')} al ${new Date(end.getTime() - 86400000).toLocaleDateString('es-CL')}`,
    `Sesiones totales: ${weeklySessions.length}`,
    `Sesiones realizadas: ${done.length}`,
    `Sesiones pendientes: ${pending.length}`,
    `Pacientes atendidos: ${patients.join(', ') || 'Sin pacientes'}`,
    '',
    'Detalle de sesiones:',
    ...weeklySessions.map((session: any) => {
      const names = (session?.pacientes || []).map((p: any) => p?.nombre).filter(Boolean).join(', ') || 'Sin pacientes'
      return `- ${session.date} ${session.inicio}-${session.fin} | ${names} | ${session.estado || 'pendiente'}${session?.informe ? ` | Informe: ${session.informe}` : ''}`
    }),
  ]

  return lines.join('\n')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!
    const emailFrom = Deno.env.get('WEEKLY_EMAIL_FROM')!

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: rows, error } = await supabase
      .from('app_state')
      .select('user_id, sessions')

    if (error) throw error

    for (const row of rows || []) {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(row.user_id)
      if (userError || !userData.user?.email) continue

      const text = buildSummary(row)
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'fonokids-weekly-summary/1.0'
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [userData.user.email],
          subject: 'Resumen semanal FonoKids',
          text,
        }),
      })

      if (!response.ok) {
        const body = await response.text()
        console.error('Resend error', body)
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
