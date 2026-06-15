export const CLIMATE_GROUPS: Record<string, string[]> = {
  Akdeniz:      ['Antalya', 'Mersin', 'Adana', 'Muğla', 'Hatay', 'Osmaniye'],
  Ege:          ['İzmir', 'Aydın', 'Manisa', 'Denizli', 'Uşak', 'Afyonkarahisar', 'Kütahya'],
  Karadeniz:    ['Trabzon', 'Rize', 'Samsun', 'Giresun', 'Ordu', 'Artvin', 'Zonguldak', 'Bolu', 'Kastamonu', 'Sinop', 'Bartın', 'Karabük', 'Düzce', 'Gümüşhane', 'Bayburt'],
  'İç Anadolu': ['Ankara', 'Konya', 'Kayseri', 'Sivas', 'Yozgat', 'Nevşehir', 'Aksaray', 'Niğde', 'Kırıkkale', 'Kırşehir', 'Çankırı', 'Eskişehir', 'Isparta', 'Karaman'],
  Marmara:      ['İstanbul', 'Bursa', 'Tekirdağ', 'Kocaeli', 'Balıkesir', 'Sakarya', 'Edirne', 'Kırklareli', 'Çanakkale', 'Bilecik', 'Yalova'],
  Güneydoğu:   ['Gaziantep', 'Şanlıurfa', 'Diyarbakır', 'Mardin', 'Batman', 'Siirt', 'Kilis', 'Adıyaman', 'Şırnak'],
  'Doğu Anadolu': ['Erzurum', 'Malatya', 'Elazığ', 'Van', 'Ağrı', 'Kars', 'Iğdır', 'Muş', 'Bitlis', 'Hakkari', 'Bingöl', 'Tunceli', 'Erzincan', 'Ardahan'],
}

export const FROST_RISK_MONTHS: Record<string, number[]> = {
  Akdeniz:        [12, 1, 2],
  Ege:            [12, 1, 2],
  Karadeniz:      [11, 12, 1, 2, 3],
  'İç Anadolu':  [10, 11, 12, 1, 2, 3, 4],
  Marmara:        [12, 1, 2, 3],
  Güneydoğu:     [12, 1, 2],
  'Doğu Anadolu': [10, 11, 12, 1, 2, 3, 4, 5],
}

export function getClimateGroup(city: string): string {
  for (const [group, cities] of Object.entries(CLIMATE_GROUPS)) {
    if (cities.includes(city)) return group
  }
  return 'Marmara' // varsayılan
}

export function getFrostRiskMonths(city: string): number[] {
  const group = getClimateGroup(city)
  return FROST_RISK_MONTHS[group] ?? [12, 1, 2]
}

export const ALL_CITIES = Object.values(CLIMATE_GROUPS).flat().sort((a, b) => a.localeCompare(b, 'tr'))
