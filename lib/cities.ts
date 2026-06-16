export interface CityData {
  name: string
  lat: number
  lon: number
  climateGroup: string
  suitablePlants: string[]
  plantingPeriod: string
  idealTempMin: number
  idealTempMax: number
  idealHumidityMin: number
  idealHumidityMax: number
}

// İklim grupları (PDF'den)
export const CLIMATE_GROUPS: Record<string, { label: string; description: string; color: string }> = {
  'Akdeniz/Ege': {
    label: 'Akdeniz / Ege',
    description: 'Yazlar sıcak ve nemli, kışlar ılık. Don riski çok düşük.',
    color: 'bg-orange-100 text-orange-700',
  },
  'İç/Geçiş Karasal': {
    label: 'İç / Geçiş Karasal',
    description: 'Gece-gündüz farkı yüksek. Nem az, saksılar hızlı kurur.',
    color: 'bg-amber-100 text-amber-700',
  },
  'Karadeniz': {
    label: 'Karadeniz',
    description: 'Yıl boyu yağışlı. Nem çok yüksek, mantar hastalıklarına dikkat.',
    color: 'bg-sky-100 text-sky-700',
  },
  'Soğuk Karasal': {
    label: 'Soğuk Karasal',
    description: 'Tarım penceresi dar. Mayıs sonuna kadar don riski var.',
    color: 'bg-blue-100 text-blue-700',
  },
}

// 81 il verisi (Excel + PDF birleşimi)
export const CITIES: CityData[] = [
  { name: 'Adana', lat: 37.0, lon: 35.32, climateGroup: 'Akdeniz/Ege', suitablePlants: ['Domates', 'Biber', 'Salatalık', 'Fesleğen', 'Çilek'], plantingPeriod: 'Şubat-Nisan', idealTempMin: 18, idealTempMax: 30, idealHumidityMin: 50, idealHumidityMax: 70 },
  { name: 'Adıyaman', lat: 37.76, lon: 38.27, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Afyonkarahisar', lat: 38.75, lon: 30.55, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Ağrı', lat: 39.72, lon: 43.05, climateGroup: 'Soğuk Karasal', suitablePlants: ['Marul', 'Ispanak', 'Bezelye', 'Turp', 'Patates'], plantingPeriod: 'Nisan-Haziran', idealTempMin: 10, idealTempMax: 25, idealHumidityMin: 40, idealHumidityMax: 65 },
  { name: 'Amasya', lat: 40.65, lon: 35.83, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Ankara', lat: 39.92, lon: 32.85, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Antalya', lat: 36.9, lon: 30.7, climateGroup: 'Akdeniz/Ege', suitablePlants: ['Domates', 'Biber', 'Salatalık', 'Fesleğen', 'Çilek'], plantingPeriod: 'Şubat-Nisan', idealTempMin: 18, idealTempMax: 30, idealHumidityMin: 50, idealHumidityMax: 70 },
  { name: 'Artvin', lat: 41.18, lon: 41.82, climateGroup: 'Karadeniz', suitablePlants: ['Marul', 'Pazı', 'Lahana', 'Fasulye', 'Çilek'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 12, idealTempMax: 26, idealHumidityMin: 60, idealHumidityMax: 85 },
  { name: 'Aydın', lat: 37.85, lon: 27.84, climateGroup: 'Akdeniz/Ege', suitablePlants: ['Domates', 'Biber', 'Salatalık', 'Fesleğen', 'Çilek'], plantingPeriod: 'Şubat-Nisan', idealTempMin: 18, idealTempMax: 30, idealHumidityMin: 50, idealHumidityMax: 70 },
  { name: 'Balıkesir', lat: 39.65, lon: 27.88, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Bilecik', lat: 40.15, lon: 29.98, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Bingöl', lat: 38.88, lon: 40.5, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Bitlis', lat: 38.4, lon: 42.12, climateGroup: 'Soğuk Karasal', suitablePlants: ['Marul', 'Ispanak', 'Bezelye', 'Turp', 'Patates'], plantingPeriod: 'Nisan-Haziran', idealTempMin: 10, idealTempMax: 25, idealHumidityMin: 40, idealHumidityMax: 65 },
  { name: 'Bolu', lat: 40.73, lon: 31.6, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Burdur', lat: 37.72, lon: 30.28, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Bursa', lat: 40.18, lon: 29.07, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Çanakkale', lat: 40.15, lon: 26.4, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Çankırı', lat: 40.6, lon: 33.62, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Çorum', lat: 40.55, lon: 34.95, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Denizli', lat: 37.78, lon: 29.1, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Diyarbakır', lat: 37.91, lon: 40.23, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Edirne', lat: 41.67, lon: 26.56, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Elazığ', lat: 38.68, lon: 39.22, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Erzincan', lat: 39.75, lon: 39.5, climateGroup: 'Soğuk Karasal', suitablePlants: ['Marul', 'Ispanak', 'Bezelye', 'Turp', 'Patates'], plantingPeriod: 'Nisan-Haziran', idealTempMin: 10, idealTempMax: 25, idealHumidityMin: 40, idealHumidityMax: 65 },
  { name: 'Erzurum', lat: 39.9, lon: 41.27, climateGroup: 'Soğuk Karasal', suitablePlants: ['Marul', 'Ispanak', 'Bezelye', 'Turp', 'Patates'], plantingPeriod: 'Nisan-Haziran', idealTempMin: 10, idealTempMax: 25, idealHumidityMin: 40, idealHumidityMax: 65 },
  { name: 'Eskişehir', lat: 39.78, lon: 30.52, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Gaziantep', lat: 37.06, lon: 37.38, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Giresun', lat: 40.92, lon: 38.38, climateGroup: 'Karadeniz', suitablePlants: ['Marul', 'Pazı', 'Lahana', 'Fasulye', 'Çilek'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 12, idealTempMax: 26, idealHumidityMin: 60, idealHumidityMax: 85 },
  { name: 'Gümüşhane', lat: 40.46, lon: 39.48, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Hakkâri', lat: 37.57, lon: 43.73, climateGroup: 'Soğuk Karasal', suitablePlants: ['Marul', 'Ispanak', 'Bezelye', 'Turp', 'Patates'], plantingPeriod: 'Nisan-Haziran', idealTempMin: 10, idealTempMax: 25, idealHumidityMin: 40, idealHumidityMax: 65 },
  { name: 'Hatay', lat: 36.4, lon: 36.35, climateGroup: 'Akdeniz/Ege', suitablePlants: ['Domates', 'Biber', 'Salatalık', 'Fesleğen', 'Çilek'], plantingPeriod: 'Şubat-Nisan', idealTempMin: 18, idealTempMax: 30, idealHumidityMin: 50, idealHumidityMax: 70 },
  { name: 'Isparta', lat: 37.77, lon: 30.55, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Mersin', lat: 36.8, lon: 34.63, climateGroup: 'Akdeniz/Ege', suitablePlants: ['Domates', 'Biber', 'Salatalık', 'Fesleğen', 'Çilek'], plantingPeriod: 'Şubat-Nisan', idealTempMin: 18, idealTempMax: 30, idealHumidityMin: 50, idealHumidityMax: 70 },
  { name: 'İstanbul', lat: 41.01, lon: 28.97, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'İzmir', lat: 38.42, lon: 27.14, climateGroup: 'Akdeniz/Ege', suitablePlants: ['Domates', 'Biber', 'Salatalık', 'Fesleğen', 'Çilek'], plantingPeriod: 'Şubat-Nisan', idealTempMin: 18, idealTempMax: 30, idealHumidityMin: 50, idealHumidityMax: 70 },
  { name: 'Kars', lat: 40.6, lon: 43.1, climateGroup: 'Soğuk Karasal', suitablePlants: ['Marul', 'Ispanak', 'Bezelye', 'Turp', 'Patates'], plantingPeriod: 'Nisan-Haziran', idealTempMin: 10, idealTempMax: 25, idealHumidityMin: 40, idealHumidityMax: 65 },
  { name: 'Kastamonu', lat: 41.38, lon: 33.78, climateGroup: 'Karadeniz', suitablePlants: ['Marul', 'Pazı', 'Lahana', 'Fasulye', 'Çilek'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 12, idealTempMax: 26, idealHumidityMin: 60, idealHumidityMax: 85 },
  { name: 'Kayseri', lat: 38.73, lon: 35.49, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Kırklareli', lat: 41.73, lon: 27.22, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Kırşehir', lat: 39.15, lon: 34.16, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Kocaeli', lat: 40.77, lon: 29.94, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Konya', lat: 37.87, lon: 32.48, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Kütahya', lat: 39.42, lon: 29.98, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Malatya', lat: 38.35, lon: 38.32, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Manisa', lat: 38.62, lon: 27.43, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Kahramanmaraş', lat: 37.58, lon: 36.94, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Mardin', lat: 37.32, lon: 40.73, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Muğla', lat: 37.22, lon: 28.37, climateGroup: 'Akdeniz/Ege', suitablePlants: ['Domates', 'Biber', 'Salatalık', 'Fesleğen', 'Çilek'], plantingPeriod: 'Şubat-Nisan', idealTempMin: 18, idealTempMax: 30, idealHumidityMin: 50, idealHumidityMax: 70 },
  { name: 'Muş', lat: 38.73, lon: 41.49, climateGroup: 'Soğuk Karasal', suitablePlants: ['Marul', 'Ispanak', 'Bezelye', 'Turp', 'Patates'], plantingPeriod: 'Nisan-Haziran', idealTempMin: 10, idealTempMax: 25, idealHumidityMin: 40, idealHumidityMax: 65 },
  { name: 'Nevşehir', lat: 38.62, lon: 34.72, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Niğde', lat: 37.97, lon: 34.68, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Ordu', lat: 40.98, lon: 37.88, climateGroup: 'Karadeniz', suitablePlants: ['Marul', 'Pazı', 'Lahana', 'Fasulye', 'Çilek'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 12, idealTempMax: 26, idealHumidityMin: 60, idealHumidityMax: 85 },
  { name: 'Rize', lat: 41.02, lon: 40.52, climateGroup: 'Karadeniz', suitablePlants: ['Marul', 'Pazı', 'Lahana', 'Fasulye', 'Çilek'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 12, idealTempMax: 26, idealHumidityMin: 60, idealHumidityMax: 85 },
  { name: 'Sakarya', lat: 40.78, lon: 30.4, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Samsun', lat: 41.28, lon: 36.33, climateGroup: 'Karadeniz', suitablePlants: ['Marul', 'Pazı', 'Lahana', 'Fasulye', 'Çilek'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 12, idealTempMax: 26, idealHumidityMin: 60, idealHumidityMax: 85 },
  { name: 'Siirt', lat: 37.93, lon: 41.94, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Sinop', lat: 42.02, lon: 35.15, climateGroup: 'Karadeniz', suitablePlants: ['Marul', 'Pazı', 'Lahana', 'Fasulye', 'Çilek'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 12, idealTempMax: 26, idealHumidityMin: 60, idealHumidityMax: 85 },
  { name: 'Sivas', lat: 39.75, lon: 37.02, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Tekirdağ', lat: 40.98, lon: 27.52, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Tokat', lat: 40.32, lon: 36.55, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Trabzon', lat: 41.0, lon: 39.73, climateGroup: 'Karadeniz', suitablePlants: ['Marul', 'Pazı', 'Lahana', 'Fasulye', 'Çilek'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 12, idealTempMax: 26, idealHumidityMin: 60, idealHumidityMax: 85 },
  { name: 'Tunceli', lat: 39.1, lon: 39.55, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Şanlıurfa', lat: 37.16, lon: 38.8, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Uşak', lat: 38.68, lon: 29.4, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Van', lat: 38.49, lon: 43.38, climateGroup: 'Soğuk Karasal', suitablePlants: ['Marul', 'Ispanak', 'Bezelye', 'Turp', 'Patates'], plantingPeriod: 'Nisan-Haziran', idealTempMin: 10, idealTempMax: 25, idealHumidityMin: 40, idealHumidityMax: 65 },
  { name: 'Yozgat', lat: 39.82, lon: 34.8, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Zonguldak', lat: 41.45, lon: 31.78, climateGroup: 'Karadeniz', suitablePlants: ['Marul', 'Pazı', 'Lahana', 'Fasulye', 'Çilek'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 12, idealTempMax: 26, idealHumidityMin: 60, idealHumidityMax: 85 },
  { name: 'Aksaray', lat: 38.37, lon: 34.03, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Bayburt', lat: 40.26, lon: 40.22, climateGroup: 'Soğuk Karasal', suitablePlants: ['Marul', 'Ispanak', 'Bezelye', 'Turp', 'Patates'], plantingPeriod: 'Nisan-Haziran', idealTempMin: 10, idealTempMax: 25, idealHumidityMin: 40, idealHumidityMax: 65 },
  { name: 'Karaman', lat: 37.18, lon: 33.22, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Kırıkkale', lat: 39.85, lon: 33.52, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Batman', lat: 37.88, lon: 41.13, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Şırnak', lat: 37.52, lon: 42.46, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Bartın', lat: 41.63, lon: 32.33, climateGroup: 'Karadeniz', suitablePlants: ['Marul', 'Pazı', 'Lahana', 'Fasulye', 'Çilek'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 12, idealTempMax: 26, idealHumidityMin: 60, idealHumidityMax: 85 },
  { name: 'Ardahan', lat: 41.11, lon: 42.7, climateGroup: 'Soğuk Karasal', suitablePlants: ['Marul', 'Ispanak', 'Bezelye', 'Turp', 'Patates'], plantingPeriod: 'Nisan-Haziran', idealTempMin: 10, idealTempMax: 25, idealHumidityMin: 40, idealHumidityMax: 65 },
  { name: 'Iğdır', lat: 39.92, lon: 44.05, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Yalova', lat: 40.65, lon: 29.27, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Karabük', lat: 41.2, lon: 32.63, climateGroup: 'Karadeniz', suitablePlants: ['Marul', 'Pazı', 'Lahana', 'Fasulye', 'Çilek'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 12, idealTempMax: 26, idealHumidityMin: 60, idealHumidityMax: 85 },
  { name: 'Kilis', lat: 36.72, lon: 37.12, climateGroup: 'İç/Geçiş Karasal', suitablePlants: ['Domates', 'Biber', 'Fasulye', 'Marul', 'Maydanoz'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 45, idealHumidityMax: 70 },
  { name: 'Osmaniye', lat: 37.08, lon: 36.25, climateGroup: 'Akdeniz/Ege', suitablePlants: ['Domates', 'Biber', 'Salatalık', 'Fesleğen', 'Çilek'], plantingPeriod: 'Şubat-Nisan', idealTempMin: 18, idealTempMax: 30, idealHumidityMin: 50, idealHumidityMax: 70 },
  { name: 'Düzce', lat: 40.84, lon: 31.16, climateGroup: 'Karadeniz', suitablePlants: ['Marul', 'Pazı', 'Lahana', 'Fasulye', 'Çilek'], plantingPeriod: 'Mart-Mayıs', idealTempMin: 12, idealTempMax: 26, idealHumidityMin: 60, idealHumidityMax: 85 },
]

export function getCityByName(name: string): CityData | undefined {
  return CITIES.find(c => c.name === name)
}

export const CITY_NAMES = CITIES.map(c => c.name).sort((a, b) => a.localeCompare(b, 'tr'))
