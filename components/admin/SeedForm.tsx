'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Save, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

const CATEGORIES = [
  { value: 'VEGETABLE', label: 'Sebze' },
  { value: 'FRUIT',     label: 'Meyve' },
  { value: 'HERB',      label: 'Bitki/Ot' },
  { value: 'FLOWER',    label: 'Çiçek' },
  { value: 'GRAIN',     label: 'Tahıl' },
]
const DIFFICULTIES = [
  { value: 'BEGINNER',     label: 'Başlangıç' },
  { value: 'INTERMEDIATE', label: 'Orta' },
  { value: 'ADVANCED',     label: 'İleri' },
]
const WATER_NEEDS   = [{ value: 'LOW', label: 'Az' }, { value: 'MEDIUM', label: 'Orta' }, { value: 'HIGH', label: 'Çok' }]
const SUNLIGHT      = [{ value: 'FULL_SUN', label: 'Tam Güneş' }, { value: 'PARTIAL_SHADE', label: 'Yarı Gölge' }, { value: 'FULL_SHADE', label: 'Tam Gölge' }]
const ANIMATION_TYPES = ['SEED','SPROUT','SEEDLING','YOUNG_PLANT','FLOWERING','FRUITING','HARVEST']
const TASK_TYPES = ['PLANTING','WATERING','FERTILIZING','HARVESTING','PRUNING','TREATING','CHECKING','REPOTTING']
const MONTHS_TR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']
const PRIORITIES = ['LOW','MEDIUM','HIGH']

interface Stage {
  id?: string; order: number; title: string; slug: string; description: string
  durationDays: number; tips: string[]; warnings: string[]; tasks: string[]
  animationType: string; imageUrl: string
}
interface MonthlyTask {
  id?: string; month: number; task: string; type: string; priority: string; isOptional: boolean
}
interface RegionCalendar {
  id?: string; city: string; climateGroup: string; plantingMonths: number[]; harvestMonths: number[]; notes: string
}
interface FAQ {
  id?: string; question: string; answer: string; order: number
}

interface Props {
  seed?: any
}

const emptyStage = (): Stage => ({
  order: 0, title: '', slug: '', description: '', durationDays: 7,
  tips: [], warnings: [], tasks: [], animationType: 'SEEDLING', imageUrl: '',
})
const emptyTask = (): MonthlyTask => ({ month: 1, task: '', type: 'WATERING', priority: 'MEDIUM', isOptional: false })
const emptyCalendar = (): RegionCalendar => ({ city: '', climateGroup: '', plantingMonths: [], harvestMonths: [], notes: '' })
const emptyFaq = (): FAQ => ({ question: '', answer: '', order: 0 })

export function SeedForm({ seed }: Props) {
  const router = useRouter()
  const isEdit = !!seed

  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'basic'|'stages'|'tasks'|'calendars'|'faqs'>('basic')

  // Temel alanlar
  const [name, setName]             = useState(seed?.name ?? '')
  const [slug, setSlug]             = useState(seed?.slug ?? '')
  const [scientificName, setScientificName] = useState(seed?.scientificName ?? '')
  const [description, setDescription]       = useState(seed?.description ?? '')
  const [longDescription, setLongDescription] = useState(seed?.longDescription ?? '')
  const [price, setPrice]           = useState(seed?.price ?? 0)
  const [stock, setStock]           = useState(seed?.stock ?? 0)
  const [category, setCategory]     = useState(seed?.category ?? 'VEGETABLE')
  const [difficulty, setDifficulty] = useState(seed?.difficulty ?? 'BEGINNER')
  const [waterNeeds, setWaterNeeds] = useState(seed?.waterNeeds ?? 'MEDIUM')
  const [sunlight, setSunlight]     = useState(seed?.sunlight ?? 'FULL_SUN')
  const [soilType, setSoilType]     = useState(seed?.soilType ?? '')
  const [images, setImages]         = useState<string[]>(seed?.images ?? [''])
  const [featured, setFeatured]     = useState(seed?.featured ?? false)
  const [published, setPublished]   = useState(!!seed?.publishedAt)
  const [seoTitle, setSeoTitle]     = useState(seed?.seoTitle ?? '')
  const [seoDesc, setSeoDesc]       = useState(seed?.seoDescription ?? '')

  // Alt tablolar
  const [stages, setStages]       = useState<Stage[]>(seed?.stages ?? [])
  const [tasks, setTasks]         = useState<MonthlyTask[]>(seed?.monthlyTasks ?? [])
  const [calendars, setCalendars] = useState<RegionCalendar[]>(seed?.regionCalendars ?? [])
  const [faqs, setFaqs]           = useState<FAQ[]>(seed?.faqs ?? [])

  function autoSlug(val: string) {
    return val.toLowerCase()
      .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
      .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
  }

  async function handleSave(publish = false) {
    setSaving(true); setError(null)
    try {
      const payload = {
        name, slug, scientificName: scientificName || null, description, longDescription: longDescription || null,
        price: Number(price), stock: Number(stock), category, difficulty, waterNeeds, sunlight,
        soilType: soilType || null, images: images.filter(Boolean), featured,
        publishedAt: publish ? new Date().toISOString() : (published ? seed?.publishedAt : null),
        seoTitle: seoTitle || null, seoDescription: seoDesc || null,
        stages: stages.map((s, i) => ({ ...s, order: i, durationDays: Number(s.durationDays) })),
        monthlyTasks: tasks,
        regionCalendars: calendars,
        faqs: faqs.map((f, i) => ({ ...f, order: i })),
      }
      const res = await fetch(isEdit ? `/api/admin/seeds/${seed.id}` : '/api/admin/seeds', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Kaydetme başarısız')
      }
      const data = await res.json()
      router.push(`/admin/tohumlar/${data.id ?? seed.id}`)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const FORM_TABS = [
    { id: 'basic',     label: 'Temel Bilgiler' },
    { id: 'stages',    label: `Aşamalar (${stages.length})` },
    { id: 'tasks',     label: `Görevler (${tasks.length})` },
    { id: 'calendars', label: `Takvimler (${calendars.length})` },
    { id: 'faqs',      label: `SSS (${faqs.length})` },
  ] as const

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      {/* Form sekmeleri */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-wrap">
        {FORM_TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              activeTab === id ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TEMEL BİLGİLER */}
      {activeTab === 'basic' && (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Tohum Adı *">
              <input
                className="input"
                value={name}
                onChange={e => { setName(e.target.value); if (!isEdit) setSlug(autoSlug(e.target.value)) }}
                placeholder="Domates"
              />
            </Field>
            <Field label="URL Slug *">
              <input className="input" value={slug} onChange={e => setSlug(e.target.value)} placeholder="domates" />
            </Field>
          </div>

          <Field label="Bilimsel Ad">
            <input className="input" value={scientificName} onChange={e => setScientificName(e.target.value)} placeholder="Solanum lycopersicum" />
          </Field>

          <Field label="Kısa Açıklama *">
            <textarea className="input min-h-[80px]" value={description} onChange={e => setDescription(e.target.value)} />
          </Field>

          <Field label="Uzun Açıklama">
            <textarea className="input min-h-[140px]" value={longDescription} onChange={e => setLongDescription(e.target.value)} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Fiyat (₺) *">
              <input type="number" step="0.01" className="input" value={price} onChange={e => setPrice(Number(e.target.value))} />
            </Field>
            <Field label="Stok *">
              <input type="number" className="input" value={stock} onChange={e => setStock(Number(e.target.value))} />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Kategori">
              <Select value={category} onChange={setCategory} options={CATEGORIES} />
            </Field>
            <Field label="Zorluk">
              <Select value={difficulty} onChange={setDifficulty} options={DIFFICULTIES} />
            </Field>
            <Field label="Su İhtiyacı">
              <Select value={waterNeeds} onChange={setWaterNeeds} options={WATER_NEEDS} />
            </Field>
            <Field label="Işık İhtiyacı">
              <Select value={sunlight} onChange={setSunlight} options={SUNLIGHT} />
            </Field>
          </div>

          <Field label="Toprak Tipi">
            <input className="input" value={soilType} onChange={e => setSoilType(e.target.value)} placeholder="Humuslu, iyi drene edilmiş toprak" />
          </Field>

          <Field label="Görseller (URL)">
            <div className="space-y-2">
              {images.map((img, i) => (
                <div key={i} className="flex gap-2">
                  <input className="input flex-1" value={img} onChange={e => { const n = [...images]; n[i] = e.target.value; setImages(n) }} placeholder="https://..." />
                  <button onClick={() => setImages(images.filter((_, j) => j !== i))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={() => setImages([...images, ''])} className="text-sm text-primary-600 flex items-center gap-1 hover:underline">
                <Plus className="w-3.5 h-3.5" /> Görsel Ekle
              </button>
            </div>
          </Field>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 accent-primary-500" />
              <span className="text-sm font-medium text-text-primary">Öne Çıkan</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="w-4 h-4 accent-primary-500" />
              <span className="text-sm font-medium text-text-primary">Yayında</span>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <Field label="SEO Başlık">
              <input className="input" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} />
            </Field>
            <Field label="SEO Açıklama">
              <input className="input" value={seoDesc} onChange={e => setSeoDesc(e.target.value)} />
            </Field>
          </div>
        </div>
      )}

      {/* AŞAMALAR */}
      {activeTab === 'stages' && (
        <div className="space-y-4">
          {stages.map((stage, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary-500">{i + 1}. Aşama</span>
                <button onClick={() => setStages(stages.filter((_, j) => j !== i))} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Başlık"><input className="input" value={stage.title} onChange={e => { const n=[...stages]; n[i]={...n[i],title:e.target.value,slug:autoSlug(e.target.value)}; setStages(n) }} /></Field>
                <Field label="Slug"><input className="input" value={stage.slug} onChange={e => { const n=[...stages]; n[i]={...n[i],slug:e.target.value}; setStages(n) }} /></Field>
              </div>
              <Field label="Açıklama">
                <textarea className="input" value={stage.description} onChange={e => { const n=[...stages]; n[i]={...n[i],description:e.target.value}; setStages(n) }} />
              </Field>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Süre (gün)">
                  <input type="number" className="input" value={stage.durationDays} onChange={e => { const n=[...stages]; n[i]={...n[i],durationDays:Number(e.target.value)}; setStages(n) }} />
                </Field>
                <Field label="Animasyon Tipi">
                  <Select value={stage.animationType} onChange={v => { const n=[...stages]; n[i]={...n[i],animationType:v}; setStages(n) }} options={ANIMATION_TYPES.map(v=>({value:v,label:v}))} />
                </Field>
              </div>
              <Field label="Görsel URL">
                <input className="input" value={stage.imageUrl} onChange={e => { const n=[...stages]; n[i]={...n[i],imageUrl:e.target.value}; setStages(n) }} placeholder="https://..." />
              </Field>
              <ChipInput label="Görevler" items={stage.tasks} onChange={v => { const n=[...stages]; n[i]={...n[i],tasks:v}; setStages(n) }} />
              <ChipInput label="İpuçları" items={stage.tips} onChange={v => { const n=[...stages]; n[i]={...n[i],tips:v}; setStages(n) }} />
              <ChipInput label="Uyarılar" items={stage.warnings} onChange={v => { const n=[...stages]; n[i]={...n[i],warnings:v}; setStages(n) }} />
            </div>
          ))}
          <button onClick={() => setStages([...stages, {...emptyStage(), order: stages.length}])}
            className="w-full border-2 border-dashed border-primary-200 rounded-2xl py-4 text-primary-500 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
            <Plus className="w-4 h-4" /> Aşama Ekle
          </button>
        </div>
      )}

      {/* AYLIK GÖREVLER */}
      {activeTab === 'tasks' && (
        <div className="space-y-3">
          {tasks.map((task, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 grid sm:grid-cols-5 gap-3 items-end">
              <Field label="Ay">
                <Select value={String(task.month)} onChange={v => { const n=[...tasks]; n[i]={...n[i],month:Number(v)}; setTasks(n) }}
                  options={MONTHS_TR.map((m,j)=>({value:String(j+1),label:m}))} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Görev">
                  <input className="input" value={task.task} onChange={e => { const n=[...tasks]; n[i]={...n[i],task:e.target.value}; setTasks(n) }} />
                </Field>
              </div>
              <Field label="Tip">
                <Select value={task.type} onChange={v => { const n=[...tasks]; n[i]={...n[i],type:v}; setTasks(n) }}
                  options={TASK_TYPES.map(v=>({value:v,label:v}))} />
              </Field>
              <div className="flex items-end gap-2">
                <Field label="Öncelik" className="flex-1">
                  <Select value={task.priority} onChange={v => { const n=[...tasks]; n[i]={...n[i],priority:v}; setTasks(n) }}
                    options={PRIORITIES.map(v=>({value:v,label:v}))} />
                </Field>
                <button onClick={() => setTasks(tasks.filter((_,j)=>j!==i))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mb-0.5">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button onClick={() => setTasks([...tasks, emptyTask()])}
            className="w-full border-2 border-dashed border-primary-200 rounded-2xl py-4 text-primary-500 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
            <Plus className="w-4 h-4" /> Görev Ekle
          </button>
        </div>
      )}

      {/* TAKVİMLER */}
      {activeTab === 'calendars' && (
        <div className="space-y-4">
          {calendars.map((cal, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary-500">{cal.city || 'Yeni Bölge'}</span>
                <button onClick={() => setCalendars(calendars.filter((_,j)=>j!==i))} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Şehir"><input className="input" value={cal.city} onChange={e=>{ const n=[...calendars]; n[i]={...n[i],city:e.target.value}; setCalendars(n) }} placeholder="İstanbul" /></Field>
                <Field label="İklim Grubu"><input className="input" value={cal.climateGroup} onChange={e=>{ const n=[...calendars]; n[i]={...n[i],climateGroup:e.target.value}; setCalendars(n) }} placeholder="Akdeniz" /></Field>
              </div>
              <MonthPicker label="Ekim Ayları" selected={cal.plantingMonths} onChange={v=>{ const n=[...calendars]; n[i]={...n[i],plantingMonths:v}; setCalendars(n) }} />
              <MonthPicker label="Hasat Ayları" selected={cal.harvestMonths} onChange={v=>{ const n=[...calendars]; n[i]={...n[i],harvestMonths:v}; setCalendars(n) }} />
              <Field label="Notlar"><input className="input" value={cal.notes} onChange={e=>{ const n=[...calendars]; n[i]={...n[i],notes:e.target.value}; setCalendars(n) }} /></Field>
            </div>
          ))}
          <button onClick={() => setCalendars([...calendars, emptyCalendar()])}
            className="w-full border-2 border-dashed border-primary-200 rounded-2xl py-4 text-primary-500 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
            <Plus className="w-4 h-4" /> Bölge Ekle
          </button>
        </div>
      )}

      {/* SSS */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary-500">SSS {i + 1}</span>
                <button onClick={() => setFaqs(faqs.filter((_,j)=>j!==i))} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <Field label="Soru"><input className="input" value={faq.question} onChange={e=>{ const n=[...faqs]; n[i]={...n[i],question:e.target.value}; setFaqs(n) }} /></Field>
              <Field label="Cevap"><textarea className="input min-h-[80px]" value={faq.answer} onChange={e=>{ const n=[...faqs]; n[i]={...n[i],answer:e.target.value}; setFaqs(n) }} /></Field>
            </div>
          ))}
          <button onClick={() => setFaqs([...faqs, emptyFaq()])}
            className="w-full border-2 border-dashed border-primary-200 rounded-2xl py-4 text-primary-500 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
            <Plus className="w-4 h-4" /> SSS Ekle
          </button>
        </div>
      )}

      {/* Kaydet butonları */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-background pb-4">
        <Button onClick={() => handleSave(false)} disabled={saving} className="bg-primary-500 hover:bg-primary-600 rounded-xl">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {isEdit ? 'Güncelle' : 'Taslak Kaydet'}
        </Button>
        <Button onClick={() => handleSave(true)} disabled={saving} variant="outline" className="rounded-xl border-primary-300 text-primary-600">
          <Eye className="w-4 h-4 mr-2" />
          {published ? 'Güncelle & Yayınla' : 'Yayınla'}
        </Button>
        {isEdit && seed?.slug && (
          <a href={`/tohum/${seed.slug}`} target="_blank" rel="noopener noreferrer"
            className="ml-auto text-sm text-text-secondary hover:text-primary-600 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> Önizle
          </a>
        )}
      </div>
    </div>
  )
}

// Küçük yardımcı bileşenler
function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-text-secondary mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="input">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function ChipInput({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState('')
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs px-2.5 py-1 rounded-full">
            {item}
            <button onClick={() => onChange(items.filter((_,j)=>j!==i))} className="text-primary-400 hover:text-red-500">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="input flex-1 text-sm" value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && draft.trim()) { onChange([...items, draft.trim()]); setDraft('') } }}
          placeholder="Yazın ve Enter'a basın" />
        <button onClick={() => { if (draft.trim()) { onChange([...items, draft.trim()]); setDraft('') } }}
          className="px-3 py-1.5 bg-primary-500 text-white rounded-lg text-xs">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </Field>
  )
}

function MonthPicker({ label, selected, onChange }: { label: string; selected: number[]; onChange: (v: number[]) => void }) {
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-1.5">
        {MONTHS_TR.map((m, i) => {
          const month = i + 1
          const active = selected.includes(month)
          return (
            <button key={month} type="button"
              onClick={() => onChange(active ? selected.filter(v=>v!==month) : [...selected, month].sort((a,b)=>a-b))}
              className={cn('text-xs px-2.5 py-1 rounded-full font-medium transition-colors',
                active ? 'bg-primary-500 text-white' : 'bg-gray-100 text-text-secondary hover:bg-primary-100')}>
              {m.slice(0,3)}
            </button>
          )
        })}
      </div>
    </Field>
  )
}
