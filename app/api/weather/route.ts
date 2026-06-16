import { NextRequest, NextResponse } from 'next/server'
import { getCityByName } from '@/lib/cities'

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city')
  if (!city) return NextResponse.json({ error: 'city gerekli' }, { status: 400 })

  const cityData = getCityByName(city)
  if (!cityData) return NextResponse.json({ error: 'Şehir bulunamadı' }, { status: 404 })

  const { lat, lon } = cityData

  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', lat.toString())
  url.searchParams.set('longitude', lon.toString())
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation')
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,relative_humidity_2m_max')
  url.searchParams.set('timezone', 'Europe/Istanbul')
  url.searchParams.set('forecast_days', '7')

  const res = await fetch(url.toString(), { next: { revalidate: 1800 } })
  if (!res.ok) return NextResponse.json({ error: 'Hava durumu alınamadı' }, { status: 502 })

  const data = await res.json()
  return NextResponse.json({ city: cityData, weather: data })
}
