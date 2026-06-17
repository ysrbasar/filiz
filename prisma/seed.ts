import 'dotenv/config'
import { PrismaClient, SeedCategory, Difficulty, WaterNeeds, SunlightNeeds, TaskType, Priority, StageAnimation, ProductCategory, ArticleCategory, ActivityType } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Filiz demo verileri yükleniyor...')

  // ─── KULLANICILAR ────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin123!', 12)
  const userPassword = await bcrypt.hash('User1234!', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@filiz.com.tr' },
    update: {},
    create: {
      name: 'Filiz Admin',
      email: 'admin@filiz.com.tr',
      password: adminPassword,
      role: 'ADMIN',
      city: 'İzmir',
      region: 'Ege',
      xp: 5000,
    },
  })

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@filiz.com.tr' },
    update: {},
    create: {
      name: 'Ayşe Bahçıvan',
      email: 'demo@filiz.com.tr',
      password: userPassword,
      role: 'USER',
      city: 'İstanbul',
      region: 'Marmara',
      xp: 320,
    },
  })

  // ─── ROZETLER ────────────────────────────────────────────────────────
  await prisma.badge.createMany({
    skipDuplicates: true,
    data: [
      { slug: 'ilk-tohum', name: 'İlk Tohum', description: 'İlk tohumunu sepete ekledin', icon: '🌱', xpReward: 50, condition: { type: 'PURCHASE', count: 1 } },
      { slug: 'ilk-hasat', name: 'İlk Hasat', description: 'İlk hasadını yaptın', icon: '🌾', xpReward: 100, condition: { type: 'HARVEST', count: 1 } },
      { slug: 'organik-uretici', name: 'Organik Üretici', description: '3 organik ürün yetiştirdin', icon: '🌿', xpReward: 75, condition: { type: 'HARVEST', count: 3, organic: true } },
      { slug: 'usta-bahcivan', name: 'Usta Bahçıvan', description: '10 bitki yetiştirdin', icon: '👨‍🌾', xpReward: 200, condition: { type: 'PLANT', count: 10 } },
      { slug: 'topluluk-yildizi', name: 'Topluluk Yıldızı', description: 'İlk proje paylaşımın', icon: '⭐', xpReward: 30, condition: { type: 'PROJECT_SHARE', count: 1 } },
      { slug: 'fotograf', name: 'Bahçe Fotoğrafçısı', description: '5 bahçe fotoğrafı yükledin', icon: '📸', xpReward: 25, condition: { type: 'LOG_ENTRY', hasPhoto: true, count: 5 } },
      { slug: 'bes-bitki', name: '5 Bitki Kulübü', description: '5 farklı bitki ektin', icon: '🌻', xpReward: 80, condition: { type: 'PLANT', count: 5 } },
      { slug: 'mevsim-ustasi', name: 'Mevsim Ustası', description: 'Her mevsimde hasat yaptın', icon: '🍂', xpReward: 150, condition: { type: 'SEASONAL_HARVEST', seasons: 4 } },
    ],
  })

  // ─── ÜRÜNLER ─────────────────────────────────────────────────────────
  const topraksizToprak = await prisma.product.upsert({
    where: { slug: 'organik-topraksiz-yetistirme-topragi' },
    update: {},
    create: {
      slug: 'organik-topraksiz-yetistirme-topragi',
      name: 'Organik Yetiştirme Toprağı 10L',
      description: 'Torf, perlit ve kompost karışımı. Sebze ve meyve yetiştiriciliği için ideal.',
      price: 89.90,
      comparePrice: 109.90,
      stock: 500,
      images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'],
      category: ProductCategory.SOIL,
      brand: 'BioToprak',
      specs: { weight: '10L', ph: '6.0-7.0', composition: 'Torf 60%, Perlit 20%, Kompost 20%' },
      featured: true,
      publishedAt: new Date(),
    },
  })

  const gubre = await prisma.product.upsert({
    where: { slug: 'solucan-gubresi-500g' },
    update: {},
    create: {
      slug: 'solucan-gubresi-500g',
      name: 'Organik Solucan Gübresi 500g',
      description: 'Doğal solucan gübresi. Tüm bitkiler için güvenli, organik.',
      price: 49.90,
      stock: 300,
      images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'],
      category: ProductCategory.FERTILIZER,
      brand: 'EkoGübre',
      featured: true,
      publishedAt: new Date(),
    },
  })

  const saksi = await prisma.product.upsert({
    where: { slug: 'terracotta-saksisi-25cm' },
    update: {},
    create: {
      slug: 'terracotta-saksisi-25cm',
      name: 'Terracotta Saksı 25cm',
      description: 'El yapımı terracotta saksı. Nefes alan yapısıyla kök sağlığını destekler.',
      price: 69.90,
      stock: 150,
      images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'],
      category: ProductCategory.CONTAINER,
      brand: 'TerraArt',
      featured: false,
      publishedAt: new Date(),
    },
  })

  const hobbySet = await prisma.product.upsert({
    where: { slug: 'balkon-bahce-seti' },
    update: {},
    create: {
      slug: 'balkon-bahce-seti',
      name: 'Balkon Bahçe Başlangıç Seti',
      description: '3 saksı, toprak, gübre ve 5 çeşit tohum. Balkon bahçeciliğine başlamak için eksiksiz set.',
      price: 299.90,
      comparePrice: 399.90,
      stock: 80,
      images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'],
      category: ProductCategory.HOBBY_SET,
      brand: 'Filiz',
      specs: { includes: ['3x Saksı', '10L Toprak', '500g Gübre', '5x Tohum Paketi'] },
      featured: true,
      publishedAt: new Date(),
    },
  })

  // ─── TOHUM 1: DOMATES ────────────────────────────────────────────────
  const domates = await prisma.seed.upsert({
    where: { slug: 'cherry-domates' },
    update: {},
    create: {
      slug: 'cherry-domates',
      name: 'Cherry Domates',
      scientificName: 'Solanum lycopersicum var. cerasiforme',
      description: 'Tatlı ve çıtır cherry domatesler balkonda ve bahçede kolayca yetişir. Bol verimli, hastalıklara dayanıklı.',
      longDescription: 'Cherry domates, küçük boyutu ve tatlı aromasıyla hem balkonda hem bahçede yetiştirebileceğiniz en sevilen domates çeşididir. Saksıda bile bol ürün verir. Hasat dönemi uzun sürer ve düzenli sulama ile mükemmel sonuçlar alırsınız.',
      price: 24.90,
      stock: 250,
      images: [
        'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      ],
      category: SeedCategory.VEGETABLE,
      difficulty: Difficulty.BEGINNER,
      climateZone: ['Akdeniz', 'Ege', 'Marmara', 'İç Anadolu'],
      soilType: 'Besinli, iyi drene olan toprak',
      waterNeeds: WaterNeeds.MEDIUM,
      sunlight: SunlightNeeds.FULL_SUN,
      seoTitle: 'Cherry Domates Tohumu — Tohumdan Hasada Rehber | Filiz',
      seoDescription: 'Cherry domates nasıl yetiştirilir? Ekim takvimi, sulama sıklığı, gübreleme ve hasat rehberi. Balkon ve bahçe için.',
      featured: true,
      publishedAt: new Date(),
      stages: {
        create: [
          {
            order: 0, title: 'Tohum Hazırlığı', slug: 'tohum-hazirligi',
            description: 'Tohumları 12-24 saat ılık suda bekletin. Çimlenmeyi hızlandırmak için fide tepsisine ekin.',
            durationDays: 3, animationType: StageAnimation.SEED,
            tips: ['Tohumları ılık suda bekletin', 'Fide toprağı kullanın', 'Üzerini ince toprakla örtün'],
            warnings: ['Soğuk su kullanmayın', 'Tohumları çok derin gömmeyın (max 1cm)'],
            tasks: ['Tohum ıslatma', 'Fide tepsisi hazırlama', 'Ekim'],
          },
          {
            order: 1, title: 'Çimlenme', slug: 'cimlenme',
            description: 'Tohumlar 5-10 gün içinde çimlenir. Nemli ve sıcak ortam şarttır (20-25°C).',
            durationDays: 10, animationType: StageAnimation.SPROUT,
            tips: ['Ortam sıcaklığını 20-25°C tutun', 'Günde bir kez hafifçe nemlendirin', 'Doğrudan güneşten koruyun'],
            warnings: ['Toprak kurursa çimlenme durabilir', 'Aşırı sulama kök çürümesine yol açar'],
            tasks: ['Günlük nem kontrolü', 'Sıcaklık takibi'],
          },
          {
            order: 2, title: 'Fide Dönemi', slug: 'fide-donemi',
            description: 'İlk yapraklar çıktıktan sonra fide 10-15cm\'ye ulaşana kadar bekleyin. Şaşırtmaya hazırlık yapın.',
            durationDays: 21, animationType: StageAnimation.SEEDLING,
            tips: ['Günde 6+ saat ışık verin', 'Hafif seyreltilmiş sıvı gübre ekleyin', 'Fazla fideleri seyreltın'],
            warnings: ['Erken şaşırtma kök şokuna neden olur'],
            tasks: ['Seyreltme', 'İlk gübreleme', 'Işık ayarı'],
          },
          {
            order: 3, title: 'Şaşırtma & Gelişim', slug: 'sasirtma-gelisim',
            description: 'Fideleri büyük saksıya veya bahçeye taşıyın. Derin dikiş yapın — gövde boyunca kök çıkar.',
            durationDays: 30, animationType: StageAnimation.YOUNG_PLANT,
            tips: ['En az 30cm derinliğinde saksı kullanın', 'Derin dikiş yapın (gövdenin 2/3\'ü toprağa)', 'İlk hafta gölgede tutun'],
            warnings: ['Sıcak saatlerde dikmekten kaçının', 'Dikim sonrası bol sulayın'],
            tasks: ['Şaşırtma', 'Destek çubuğu koyma', 'Adaptasyon sulaması'],
          },
          {
            order: 4, title: 'Büyüme & Budama', slug: 'buyume-budama',
            description: 'Bitki hızla büyür. Koltuk sürgünlerini kesin, destek sağlayın. Düzenli sulama ve 2 haftada bir gübreleme.',
            durationDays: 35, animationType: StageAnimation.YOUNG_PLANT,
            tips: ['Koltuk sürgünlerini erken kesin', '2 haftada bir domates gübresi', 'Toprak nemini düzenli kontrol edin'],
            warnings: ['Koltuk sürgünleri bırakılırsa enerji verime gitmiyor', 'Aşırı azot yaprak büyütür, meyveyi geciktirir'],
            tasks: ['Koltuk sürgünü budama', 'Gübreleme', 'Sulama'],
          },
          {
            order: 5, title: 'Çiçeklenme', slug: 'ciceklenme',
            description: 'Sarı çiçekler açmaya başlar. Tozlaşma için hafifçe sallayın veya fırça kullanın.',
            durationDays: 14, animationType: StageAnimation.FLOWERING,
            tips: ['Sabah saatlerinde hafifçe sallayın', 'Balcekler için lavanta dikin', 'Potasyum gübresi çiçeklenmeyi destekler'],
            warnings: ['35°C üzerinde çiçekler dökülür', 'Çiçek döneminde azot gübresini azaltın'],
            tasks: ['Tozlaşma yardımı', 'Sıcaklık kontrolü', 'Potasyum gübrelemesi'],
          },
          {
            order: 6, title: 'Meyve Tutumu', slug: 'meyve-tutumu',
            description: 'Küçük yeşil domatesler oluşur. Bu dönemde su stresi yaşatmayın, meyve çatlayabilir.',
            durationDays: 21, animationType: StageAnimation.FRUITING,
            tips: ['Düzenli ve eşit sulama kritik', 'Kalsiyum eksikliği için kireç taşı tozu ekleyin', 'Meyveleri güneşten koruyun'],
            warnings: ['Ani sulama değişiklikleri meyve çatlamasına neden olur', 'Aşırı sıcakta gölge örtüsü kullanın'],
            tasks: ['Eşit sulama', 'Kalsiyum takviyesi', 'Meyve seyreltme'],
          },
          {
            order: 7, title: 'Hasat', slug: 'hasat',
            description: 'Cherry domatesler parlak kırmızı-turuncu renk alınca toplanır. Üstten aşağıya doğru hasat edin.',
            durationDays: 60, animationType: StageAnimation.HARVEST,
            tips: ['Sabah erkenden hasat edin', 'Salkım halinde toplayın', 'Oda sıcaklığında saklayın'],
            warnings: ['Buzdolabına koymak aromasını bozar', 'Tam olgunlaşmadan önce toplamayın'],
            tasks: ['Günlük hasat kontrolü', 'Salkım toplama'],
          },
        ],
      },
      monthlyTasks: {
        create: [
          { month: 2, task: 'İç mekânda fide ekimine başla', type: TaskType.PLANTING, priority: Priority.HIGH },
          { month: 3, task: 'Fideleri güneşlendirmeye başla', type: TaskType.CHECKING, priority: Priority.MEDIUM },
          { month: 4, task: 'Son dondan sonra dış mekâna şaşırt', type: TaskType.PLANTING, priority: Priority.HIGH },
          { month: 4, task: 'İlk gübreleme — dengeli NPK', type: TaskType.FERTILIZING, priority: Priority.MEDIUM },
          { month: 5, task: 'Koltuk sürgünlerini budamaya başla', type: TaskType.PRUNING, priority: Priority.HIGH },
          { month: 5, task: 'Destek çubuğu veya kafes kur', type: TaskType.CHECKING, priority: Priority.MEDIUM },
          { month: 5, task: 'Haftada 2-3 kez derin sulama', type: TaskType.WATERING, priority: Priority.HIGH },
          { month: 6, task: 'Çiçeklenme döneminde potasyum gübresi', type: TaskType.FERTILIZING, priority: Priority.HIGH },
          { month: 6, task: 'Yaprak biti kontrolü', type: TaskType.TREATING, priority: Priority.MEDIUM },
          { month: 7, task: 'Hasat başlıyor — günlük kontrol', type: TaskType.HARVESTING, priority: Priority.HIGH },
          { month: 7, task: 'Sıcak günlerde sabah sulama', type: TaskType.WATERING, priority: Priority.HIGH },
          { month: 8, task: 'Ana hasat dönemi', type: TaskType.HARVESTING, priority: Priority.HIGH },
          { month: 8, task: 'Erken hasat için tohumları sakla', type: TaskType.CHECKING, priority: Priority.LOW, isOptional: true },
          { month: 9, task: 'Son hasatlar, bitkiyi sökümeye hazırla', type: TaskType.HARVESTING, priority: Priority.MEDIUM },
          { month: 10, task: 'Bitkiyi söküp kompostlayın', type: TaskType.CHECKING, priority: Priority.LOW, isOptional: true },
        ],
      },
      faqs: {
        create: [
          { order: 0, question: 'Cherry domates ne zaman ekilir?', answer: 'İç mekânda Şubat-Mart aylarında fide olarak başlatılır. Son don tehlikesi geçtikten sonra (Nisan-Mayıs) dış mekâna alınır. Akdeniz ve Ege\'de doğrudan Mart\'ta dışarıya ekilebilir.' },
          { order: 1, question: 'Saksıda cherry domates yetişir mi?', answer: 'Evet! Cherry domates saksı yetiştiriciliğine en uygun domates çeşididir. En az 30cm derinliğinde, 20-25L hacimli bir saksı kullanın. Balkon ve teraslarda çok iyi sonuç verir.' },
          { order: 2, question: 'Ne sıklıkta sulanmalı?', answer: 'Yazın haftada 3-4 kez, ilkbahar ve sonbaharda haftada 2 kez sulayın. Toprağın üst 3-4cm\'si kuruyunca sulama zamanı gelmiştir. Düzenli ve eşit sulama meyve çatlamasını önler.' },
          { order: 3, question: 'Koltuk sürgünü nedir, kesilmeli mi?', answer: 'Koltuk sürgünleri, ana gövde ile yan dal arasından çıkan küçük filizlerdir. Bunları keserseniz enerji meyveye gider ve daha iri, bol domates elde edersiniz. Küçükken (5cm altında) temiz makasla kesin.' },
          { order: 4, question: 'Yapraklar sarardı, ne yapmalıyım?', answer: 'Alt yaprakların sararması normaldir. Ancak üst yapraklar da sararıyorsa azot eksikliği (gübre verin), aşırı sulama (sulamayı azaltın) veya kök çürümesi (drenajı kontrol edin) olabilir. Fotoğrafını yapay zeka danışmanımıza yükleyebilirsiniz.' },
        ],
      },
      diseases: {
        create: [
          {
            name: 'Erken Yanıklık (Alternaria)',
            symptoms: ['Alt yapraklarda kahverengi lekeler', 'Sarı hale ile çevrili koyu lekeler', 'Yaprak dökülmesi'],
            causes: ['Yüksek nem', 'Yaprak ıslanması', 'Zayıf hava sirkülasyonu'],
            solutions: ['Yaprak ıslanmasını önleyin', 'Bakırlı fungisit uygulayın', 'Alt yaprakları temizleyin'],
            productIds: [],
          },
          {
            name: 'Yaprak Biti (Aphid)',
            symptoms: ['Yaprak altında küçük yeşil-sarı böcekler', 'Yaprakların kıvrılması', 'Yapışkan madde izleri'],
            causes: ['Sıcak ve kuru hava', 'Doğal düşman eksikliği'],
            solutions: ['Sabun-su karışımıyla ilaçlayın', 'Sarı yapışkan tuzak kullanın', 'Neem yağı uygulayın'],
            productIds: [],
          },
        ],
      },
      regionCalendars: {
        create: [
          { city: 'İzmir', climateGroup: 'Ege', plantingMonths: [3, 4], harvestMonths: [6, 7, 8, 9], notes: 'Mart\'ta doğrudan dışarıya ekilebilir' },
          { city: 'Antalya', climateGroup: 'Akdeniz', plantingMonths: [2, 3], harvestMonths: [5, 6, 7, 8, 9], notes: 'Yıl boyunca yetiştiriciliği mümkün' },
          { city: 'İstanbul', climateGroup: 'Marmara', plantingMonths: [4, 5], harvestMonths: [7, 8, 9], notes: 'Nisan sonundan önce don riski var' },
          { city: 'Ankara', climateGroup: 'İç Anadolu', plantingMonths: [5], harvestMonths: [8, 9], notes: 'Mayıs öncesi don riski yüksek' },
          { city: 'Trabzon', climateGroup: 'Karadeniz', plantingMonths: [4, 5], harvestMonths: [7, 8, 9], notes: 'Yüksek nem mantar hastalıklarına dikkat' },
        ],
      },
    },
  })

  // ─── TOHUM 2: SALATALIK ──────────────────────────────────────────────
  const salatalik = await prisma.seed.upsert({
    where: { slug: 'balkoni-salatalik' },
    update: {},
    create: {
      slug: 'balkoni-salatalik',
      name: 'Balkoni Salatalık',
      scientificName: 'Cucumis sativus',
      description: 'Saksıya ve balkona özel geliştirilmiş kısa gövdeli salatalık. Çok verimli, acı yapmaz.',
      longDescription: 'Balkoni salatalık, özellikle saksı ve konteyner yetiştiriciliği için geliştirilmiş bir çeşittir. Kompakt yapısı sayesinde balkonda az yer kaplar, bol ürün verir.',
      price: 19.90,
      stock: 300,
      images: ['https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=800'],
      category: SeedCategory.VEGETABLE,
      difficulty: Difficulty.BEGINNER,
      climateZone: ['Akdeniz', 'Ege', 'Marmara'],
      soilType: 'Hafif, besinli toprak',
      waterNeeds: WaterNeeds.HIGH,
      sunlight: SunlightNeeds.FULL_SUN,
      seoTitle: 'Balkoni Salatalık Tohumu — Saksıda Salatalık Yetiştirme | Filiz',
      seoDescription: 'Balkonda salatalık nasıl yetiştirilir? Saksıda salatalık ekimi, sulama ve hasat rehberi.',
      featured: true,
      publishedAt: new Date(),
      stages: {
        create: [
          { order: 0, title: 'Ekim', slug: 'ekim', description: 'Tohumları 2cm derinliğe, fide tepsisine veya doğrudan saksıya ekin.', durationDays: 5, animationType: StageAnimation.SEED, tips: ['İki tohum beraber ekin, zayıfı söküm'], warnings: ['Soğuk toprağa ekmeyin (min 15°C)'], tasks: ['Ekim'] },
          { order: 1, title: 'Çimlenme', slug: 'cimlenme', description: '3-7 gün içinde çimlenir. Nemli ve sıcak ortam gerekir.', durationDays: 7, animationType: StageAnimation.SPROUT, tips: ['Nemli tutun'], warnings: ['Doğrudan güneşten koruyun'], tasks: ['Nem kontrolü'] },
          { order: 2, title: 'Fide', slug: 'fide', description: '2 gerçek yaprak çıktıktan sonra şaşırtın.', durationDays: 14, animationType: StageAnimation.SEEDLING, tips: ['Gün boyu ışık verin'], warnings: ['Geç şaşırtma kök sıkışmasına neden olur'], tasks: ['Seyreltme', 'Şaşırtma'] },
          { order: 3, title: 'Büyüme', slug: 'buyume', description: 'Sarmaşık çubuğu veya kafes kurun. Hızlı büyür.', durationDays: 25, animationType: StageAnimation.YOUNG_PLANT, tips: ['Destek çubuğu zorunlu', 'Bol sulama'], warnings: ['Su stresi meyve acılığa neden olur'], tasks: ['Destek kurma', 'Sulama'] },
          { order: 4, title: 'Çiçeklenme', slug: 'ciceklenme', description: 'Sarı çiçekler açar. Erkek ve dişi çiçekler ayrı.', durationDays: 10, animationType: StageAnimation.FLOWERING, tips: ['Arılar için açık balkon'], warnings: ['İç mekânda elle tozlaştırın'], tasks: ['Tozlaştırma'] },
          { order: 5, title: 'Hasat', slug: 'hasat', description: '15-20cm\'ye ulaşınca hasat. Gecikmiş hasat acılığa neden olur.', durationDays: 45, animationType: StageAnimation.HARVEST, tips: ['Her gün kontrol edin', 'Serin saatlerde toplayın'], warnings: ['Sararmış salatalıkları almayın'], tasks: ['Günlük hasat'] },
        ],
      },
      monthlyTasks: {
        create: [
          { month: 4, task: 'Fide ekimine başla', type: TaskType.PLANTING, priority: Priority.HIGH },
          { month: 5, task: 'Dış mekâna şaşırt', type: TaskType.PLANTING, priority: Priority.HIGH },
          { month: 5, task: 'Destek kafes kur', type: TaskType.CHECKING, priority: Priority.MEDIUM },
          { month: 6, task: 'Günde bir sulama', type: TaskType.WATERING, priority: Priority.HIGH },
          { month: 6, task: 'İlk hasat kontrolü', type: TaskType.HARVESTING, priority: Priority.MEDIUM },
          { month: 7, task: 'Ana hasat dönemi', type: TaskType.HARVESTING, priority: Priority.HIGH },
          { month: 7, task: 'Sıcakta sabah sulaması', type: TaskType.WATERING, priority: Priority.HIGH },
          { month: 8, task: 'Son hasatlar', type: TaskType.HARVESTING, priority: Priority.MEDIUM },
        ],
      },
      faqs: {
        create: [
          { order: 0, question: 'Salatalık saksıda yetişir mi?', answer: 'Evet, balkoni çeşitleri özellikle saksı için geliştirilmiştir. 20L ve üzeri saksı kullanın.' },
          { order: 1, question: 'Salatalık ne sıklıkla sulanır?', answer: 'Yazın her gün, sabah erken saatlerde sulayın. Toprak hiç kurumadan nemli kalmalıdır.' },
        ],
      },
      diseases: { create: [] },
      regionCalendars: {
        create: [
          { city: 'İzmir', climateGroup: 'Ege', plantingMonths: [4, 5], harvestMonths: [6, 7, 8], notes: 'Nisan başından itibaren ekilebilir' },
          { city: 'İstanbul', climateGroup: 'Marmara', plantingMonths: [5], harvestMonths: [7, 8], notes: 'Mayıs başı için uygundur' },
        ],
      },
    },
  })

  // ─── TOHUM 3: FESLEĞEN ──────────────────────────────────────────────
  const fesleğen = await prisma.seed.upsert({
    where: { slug: 'italyan-feslegeni' },
    update: {},
    create: {
      slug: 'italyan-feslegeni',
      name: 'İtalyan Fesleğeni',
      scientificName: 'Ocimum basilicum',
      description: 'Aromalı İtalyan fesleğeni. Mutfak penceresi ve balkonda kolayca yetişir. Pesto ve salatalarda vazgeçilmez.',
      longDescription: 'İtalyan fesleğeni, saksıda yetiştirebileceğiniz en kolay aromatik bitkilerden biridir. Güçlü kokusu sivrisinekleri uzak tutar.',
      price: 14.90,
      stock: 400,
      images: ['https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=800'],
      category: SeedCategory.HERB,
      difficulty: Difficulty.BEGINNER,
      climateZone: ['Akdeniz', 'Ege', 'Marmara', 'İç Anadolu'],
      soilType: 'Hafif, iyi drene olan toprak',
      waterNeeds: WaterNeeds.MEDIUM,
      sunlight: SunlightNeeds.FULL_SUN,
      seoTitle: 'İtalyan Fesleğeni Tohumu — Saksıda Fesleğen Yetiştirme | Filiz',
      seoDescription: 'Fesleğen nasıl yetiştirilir? Mutfak penceresi ve balkonda fesleğen ekimi rehberi.',
      featured: false,
      publishedAt: new Date(),
      stages: {
        create: [
          { order: 0, title: 'Ekim', slug: 'ekim', description: 'Yüzeye serpin, üzerini ince toprakla örtün.', durationDays: 2, animationType: StageAnimation.SEED, tips: ['Sıcak yerde tutun (22°C+)'], warnings: ['Derin ekmeyin'], tasks: ['Ekim'] },
          { order: 1, title: 'Çimlenme', slug: 'cimlenme', description: '5-10 günde çimlenir.', durationDays: 10, animationType: StageAnimation.SPROUT, tips: ['Nemli tutun'], warnings: ['Rüzgârdan koruyun'], tasks: ['Nem kontrolü'] },
          { order: 2, title: 'Fide & Büyüme', slug: 'fide-buyume', description: '4+ yaprak çıkınca budamaya başlayın. Bu büyümeyi hızlandırır.', durationDays: 21, animationType: StageAnimation.SEEDLING, tips: ['Tepe budama yaygınlaştırır'], warnings: ['Çiçek açmasına izin vermeyin'], tasks: ['Seyreltme', 'İlk budama'] },
          { order: 3, title: 'Hasat', slug: 'hasat', description: 'Üst yaprakları sürekli toplayın. Çiçek kısımlarını kesin.', durationDays: 90, animationType: StageAnimation.HARVEST, tips: ['Sabah toplayın', 'Salkım halinde toplayın'], warnings: ['Çiçek bırakmak yaprakları acılaştırır'], tasks: ['Haftalık hasat', 'Çiçek kesimi'] },
        ],
      },
      monthlyTasks: {
        create: [
          { month: 4, task: 'İç mekânda ekim', type: TaskType.PLANTING, priority: Priority.HIGH },
          { month: 5, task: 'Dış mekâna al', type: TaskType.PLANTING, priority: Priority.MEDIUM },
          { month: 5, task: 'İlk hasat budaması', type: TaskType.PRUNING, priority: Priority.HIGH },
          { month: 6, task: 'Haftalık hasat', type: TaskType.HARVESTING, priority: Priority.HIGH },
          { month: 7, task: 'Çiçekleri sürekli kes', type: TaskType.PRUNING, priority: Priority.HIGH },
          { month: 8, task: 'Hasat & kurutma', type: TaskType.HARVESTING, priority: Priority.MEDIUM },
          { month: 9, task: 'Tohum toplama', type: TaskType.CHECKING, priority: Priority.LOW, isOptional: true },
        ],
      },
      faqs: {
        create: [
          { order: 0, question: 'Fesleğen neden kararıyor?', answer: 'Soğuk hava veya soğuk su teması fesleğeni kararıyor. Oda sıcaklığında su kullanın ve 15°C altında tutmayın.' },
          { order: 1, question: 'Ne kadar ışık ister?', answer: 'Günde en az 6 saat doğrudan güneş. Güney veya batı penceresi idealdir.' },
        ],
      },
      diseases: { create: [] },
      regionCalendars: {
        create: [
          { city: 'İzmir', climateGroup: 'Ege', plantingMonths: [4, 5, 6], harvestMonths: [5, 6, 7, 8, 9], notes: 'Yıl boyu iç mekânda yetişir' },
          { city: 'İstanbul', climateGroup: 'Marmara', plantingMonths: [5, 6], harvestMonths: [6, 7, 8, 9], notes: 'Nisan\'dan itibaren pencerede başlatın' },
        ],
      },
    },
  })

  // ─── TOHUM 4: BİBER ─────────────────────────────────────────────────
  const biber = await prisma.seed.upsert({
    where: { slug: 'dolmalik-biber' },
    update: {},
    create: {
      slug: 'dolmalik-biber',
      name: 'Dolmalık Biber',
      scientificName: 'Capsicum annuum',
      description: 'Kalın etli, tatlı dolmalık biber. Saksı ve bahçede verimli. Renk değişimini izlemek eğlenceli.',
      longDescription: 'Dolmalık biber, yeşilden sarıya ve kırmızıya dönen renk yolculuğuyla bahçede estetik de katar. Vitamince zengin, bol verimli.',
      price: 22.90,
      stock: 180,
      images: ['https://images.unsplash.com/photo-1525585459854-99e1e9e38b6a?w=800'],
      category: SeedCategory.VEGETABLE,
      difficulty: Difficulty.INTERMEDIATE,
      climateZone: ['Akdeniz', 'Ege', 'Marmara', 'İç Anadolu', 'Güneydoğu'],
      soilType: 'Besinli, humusça zengin toprak',
      waterNeeds: WaterNeeds.MEDIUM,
      sunlight: SunlightNeeds.FULL_SUN,
      seoTitle: 'Dolmalık Biber Tohumu — Evde Biber Yetiştirme Rehberi | Filiz',
      seoDescription: 'Dolmalık biber nasıl yetiştirilir? Ekim takvimi, renk değişimi ve hasat rehberi.',
      featured: true,
      publishedAt: new Date(),
      stages: {
        create: [
          { order: 0, title: 'Fide Ekimi', slug: 'fide-ekimi', description: 'Ocak-Şubat aylarında iç mekânda fide ekimi yapın.', durationDays: 10, animationType: StageAnimation.SEED, tips: ['Sıcak ortam (23-27°C)'], warnings: ['Soğukta çimlenmez'], tasks: ['Ekim'] },
          { order: 1, title: 'Çimlenme', slug: 'cimlenme', description: '7-14 günde çimlenir. Sabırlı olun.', durationDays: 14, animationType: StageAnimation.SPROUT, tips: ['Sıcak tutun', 'Işık verin'], warnings: ['Soğuk geceler çimlenmeyi durdurur'], tasks: ['Sıcaklık kontrolü'] },
          { order: 2, title: 'Fide Büyümesi', slug: 'fide-buyumesi', description: 'Fide 15-20cm olunca şaşırtın.', durationDays: 45, animationType: StageAnimation.SEEDLING, tips: ['Güneş ışığı artırın', 'Seyreltik gübre'], warnings: [], tasks: ['Seyreltme', 'Gübreleme'] },
          { order: 3, title: 'Büyüme & Dallanma', slug: 'buyume-dallanma', description: 'Destek çubuğu koyun. Dal sayısı ürünü belirler.', durationDays: 30, animationType: StageAnimation.YOUNG_PLANT, tips: ['İlk çiçekleri koparın — bitki güçlenir'], warnings: [], tasks: ['Destek kurma', 'İlk çiçek kaldırma'] },
          { order: 4, title: 'Çiçek & Meyve', slug: 'cicek-meyve', description: 'Beyaz çiçeklerden küçük yeşil biberler oluşur.', durationDays: 30, animationType: StageAnimation.FRUITING, tips: ['Kalsiyum takviyesi'], warnings: ['Su stresi çiçek döküşüne yol açar'], tasks: ['Sulama', 'Kalsiyum takviyesi'] },
          { order: 5, title: 'Renk Değişimi & Hasat', slug: 'hasat', description: 'Yeşil → sarı → kırmızı. İstediğiniz aşamada toplayın.', durationDays: 60, animationType: StageAnimation.HARVEST, tips: ['Kırmızı hasat daha tatlı'], warnings: ['Makasla kesin, koparma hasarı verir'], tasks: ['Hasat'] },
        ],
      },
      monthlyTasks: {
        create: [
          { month: 1, task: 'İç mekânda fide ekimi', type: TaskType.PLANTING, priority: Priority.HIGH },
          { month: 2, task: 'Fideleri güneşlendirmeye başla', type: TaskType.CHECKING, priority: Priority.MEDIUM },
          { month: 4, task: 'Dış mekâna şaşırt (don tehlikesi geçince)', type: TaskType.PLANTING, priority: Priority.HIGH },
          { month: 5, task: 'Dengeli NPK gübresi', type: TaskType.FERTILIZING, priority: Priority.MEDIUM },
          { month: 6, task: 'Çiçek dönemi — potasyum gübresi', type: TaskType.FERTILIZING, priority: Priority.HIGH },
          { month: 7, task: 'Yeşil biber hasadı başlıyor', type: TaskType.HARVESTING, priority: Priority.MEDIUM },
          { month: 8, task: 'Sarı/kırmızı biber hasadı', type: TaskType.HARVESTING, priority: Priority.HIGH },
          { month: 9, task: 'Son hasat', type: TaskType.HARVESTING, priority: Priority.MEDIUM },
        ],
      },
      faqs: {
        create: [
          { order: 0, question: 'Biber ne zaman hasat edilir?', answer: 'Yeşil biber 60-70 günde, kırmızı biber 90-100 günde hazır olur. İstediğiniz renkte toplayabilirsiniz.' },
          { order: 1, question: 'İlk çiçekler neden koparılmalı?', answer: 'İlk çiçekleri koparmak bitkinin enerjisini kök ve dal gelişimine yönlendirir, ilerleyen dönemde çok daha bol ürün alırsınız.' },
        ],
      },
      diseases: { create: [] },
      regionCalendars: {
        create: [
          { city: 'Antalya', climateGroup: 'Akdeniz', plantingMonths: [2, 3], harvestMonths: [6, 7, 8, 9, 10], notes: 'Yıl boyunca yetiştiriciliği mümkün' },
          { city: 'İstanbul', climateGroup: 'Marmara', plantingMonths: [4, 5], harvestMonths: [8, 9], notes: 'Ocak\'ta iç mekânda başlatın' },
          { city: 'Ankara', climateGroup: 'İç Anadolu', plantingMonths: [5], harvestMonths: [8, 9], notes: 'Kısa yetişme sezonu' },
        ],
      },
    },
  })

  // ─── TOHUM 5: LAVANTA ────────────────────────────────────────────────
  const lavanta = await prisma.seed.upsert({
    where: { slug: 'fransiz-lavantasi' },
    update: {},
    create: {
      slug: 'fransiz-lavantasi',
      name: 'Fransız Lavantası',
      scientificName: 'Lavandula angustifolia',
      description: 'Mis kokulu Fransız lavantası. Bahçede dekoratif, kurusu aromatik, arılar için cennet.',
      longDescription: 'Lavanta, bir kez dikildiğinde yıllarca çiçek açan, bakımı kolay bir çok yıllık bitkidir. Kuraklığa dayanıklıdır.',
      price: 18.90,
      stock: 200,
      images: ['https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800'],
      category: SeedCategory.FLOWER,
      difficulty: Difficulty.INTERMEDIATE,
      climateZone: ['Akdeniz', 'Ege', 'Marmara', 'İç Anadolu'],
      soilType: 'Kireçli, iyi drene, kuru toprak',
      waterNeeds: WaterNeeds.LOW,
      sunlight: SunlightNeeds.FULL_SUN,
      seoTitle: 'Fransız Lavantası Tohumu — Lavanta Yetiştirme Rehberi | Filiz',
      seoDescription: 'Lavanta nasıl yetiştirilir? Ekim, sulama ve çiçek hasat rehberi.',
      featured: false,
      publishedAt: new Date(),
      stages: {
        create: [
          { order: 0, title: 'Soğuklama & Ekim', slug: 'soguklama-ekim', description: 'Tohumları 3-4 hafta buzdolabında bekletin (stratifikasyon). Sonra ekin.', durationDays: 30, animationType: StageAnimation.SEED, tips: ['Stratifikasyon çimlenmeyi 3x artırır'], warnings: ['Stratifikasyon yapılmazsa çimlenme çok düşük olur'], tasks: ['Stratifikasyon', 'Ekim'] },
          { order: 1, title: 'Çimlenme', slug: 'cimlenme', description: '14-21 günde çimlenir. Yavaş süreç normaldir.', durationDays: 21, animationType: StageAnimation.SPROUT, tips: ['Sabırlı olun'], warnings: ['Aşırı sulama öldürür'], tasks: ['Nem kontrolü'] },
          { order: 2, title: 'Fide & Şaşırtma', slug: 'fide', description: '8-10cm olunca şaşırt. Kökleri bozmadan taşıyın.', durationDays: 60, animationType: StageAnimation.SEEDLING, tips: ['Perlitli toprak kullanın'], warnings: ['Aşırı toprak nemi kök çürümesine neden olur'], tasks: ['Şaşırtma'] },
          { order: 3, title: 'Büyüme', slug: 'buyume', description: 'Yavaş büyür. İlk yıl çiçek açmayabilir, normal.', durationDays: 180, animationType: StageAnimation.YOUNG_PLANT, tips: ['Seyreltik gübre, ayda bir'], warnings: ['Aşırı gübre çiçeklenmeyi engeller'], tasks: ['Aylık gübreleme'] },
          { order: 4, title: 'Çiçeklenme & Hasat', slug: 'ciceklenme-hasat', description: '2. yıldan itibaren yaz aylarında mor çiçekler açar. %80 açınca hasat edin.', durationDays: 30, animationType: StageAnimation.HARVEST, tips: ['Sabah erkenden kesin', 'Demetler halinde kurutun'], warnings: ['Tam açmış çiçekler kolay döküür'], tasks: ['Hasat', 'Kurutma'] },
        ],
      },
      monthlyTasks: {
        create: [
          { month: 1, task: 'Tohumları buzdolabına koy (stratifikasyon)', type: TaskType.CHECKING, priority: Priority.HIGH },
          { month: 2, task: 'İç mekânda fide ekimi', type: TaskType.PLANTING, priority: Priority.HIGH },
          { month: 4, task: 'Dış mekâna şaşırt', type: TaskType.PLANTING, priority: Priority.MEDIUM },
          { month: 6, task: 'Çiçekleri takip et', type: TaskType.CHECKING, priority: Priority.MEDIUM },
          { month: 7, task: 'Hasat — %80 açınca kes', type: TaskType.HARVESTING, priority: Priority.HIGH },
          { month: 8, task: 'Sezon sonu budama', type: TaskType.PRUNING, priority: Priority.HIGH },
        ],
      },
      faqs: {
        create: [
          { order: 0, question: 'Lavanta ne zaman çiçek açar?', answer: 'Tohumdan yetiştirilen lavanta genellikle 2. yılda çiçek açar. Haziran-Ağustos ayları çiçek dönemidir.' },
          { order: 1, question: 'Lavanta ne kadar sulanır?', answer: 'Lavanta kuraklığa dayanıklıdır. 10 günde bir, toprak tamamen kuruyunca sulayın. Fazla su ölüm sebebidir.' },
        ],
      },
      diseases: { create: [] },
      regionCalendars: {
        create: [
          { city: 'Isparta', climateGroup: 'İç Anadolu', plantingMonths: [4, 5], harvestMonths: [6, 7], notes: 'Isparta lavanta bölgesidir, ideal iklim' },
          { city: 'İzmir', climateGroup: 'Ege', plantingMonths: [3, 4], harvestMonths: [5, 6, 7], notes: 'Kıyı bölgelerde yıl boyu yeşil kalabilir' },
        ],
      },
    },
  })

  // ─── İLİŞKİLİ ÜRÜNLER ────────────────────────────────────────────────
  await prisma.seedProduct.createMany({
    skipDuplicates: true,
    data: [
      { seedId: domates.id, productId: topraksizToprak.id, relationType: 'soil' },
      { seedId: domates.id, productId: gubre.id, relationType: 'fertilizer' },
      { seedId: domates.id, productId: saksi.id, relationType: 'container' },
      { seedId: salatalik.id, productId: topraksizToprak.id, relationType: 'soil' },
      { seedId: salatalik.id, productId: gubre.id, relationType: 'fertilizer' },
      { seedId: biber.id, productId: topraksizToprak.id, relationType: 'soil' },
      { seedId: biber.id, productId: saksi.id, relationType: 'container' },
      { seedId: fesleğen.id, productId: saksi.id, relationType: 'container' },
    ],
  })

  // ─── BLOG MAKALELERİ ────────────────────────────────────────────────
  await prisma.article.createMany({
    skipDuplicates: true,
    data: [
      {
        slug: 'balkon-bahcesine-baslarken',
        title: 'Balkon Bahçesine Başlayanlar İçin 10 Altın Kural',
        content: '# Balkon Bahçesine Başlayanlar İçin 10 Altın Kural\n\nBalkon bahçeciliği, küçük bir alana büyük bir keyif sığdırmanın en güzel yoludur...',
        excerpt: 'Küçük bir balkonda büyük bir bahçenin keyfini çıkarın. Başlangıç için bilmeniz gereken her şey burada.',
        coverImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
        category: ArticleCategory.BEGINNER,
        tags: ['balkon', 'başlangıç', 'saksı'],
        authorId: admin.id,
        seoTitle: 'Balkon Bahçesine Başlayanlar İçin 10 Altın Kural | Filiz',
        seoDescription: 'Balkon bahçeciliğine ilk adımı atmak için ihtiyacınız olan her şey.',
        readingTime: 7,
        viewCount: 1240,
        published: true,
        publishedAt: new Date('2024-03-15'),
      },
      {
        slug: 'organik-gubre-rehberi',
        title: 'Evde Kompost Yapımı: Mutfak Artıklarından Sihirli Gübre',
        content: '# Evde Kompost Yapımı\n\nMutfak artıklarınız değerli bir gübre kaynağına dönüşebilir...',
        excerpt: 'Meyve kabukları, sebze artıkları ve kahve telvesinden nasıl mükemmel kompost yapılır öğrenin.',
        coverImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
        category: ArticleCategory.COMPOST,
        tags: ['kompost', 'organik', 'gübre'],
        authorId: admin.id,
        seoTitle: 'Evde Kompost Yapımı Rehberi | Filiz Tarım Akademisi',
        seoDescription: 'Mutfak artıklarından organik kompost yapmanın adım adım rehberi.',
        readingTime: 10,
        viewCount: 890,
        published: true,
        publishedAt: new Date('2024-04-01'),
      },
      {
        slug: 'domates-yetistirme-rehberi',
        title: 'Domates Yetiştirmenin İncelikleri: Uzman Tüyoları',
        content: '# Domates Yetiştirmenin İncelikleri\n\nDomates, doğru bakımla metrekare başına en yüksek verimi veren sebzelerden biridir...',
        excerpt: 'Koltuk sürgününden gübreleme takvimine kadar, profesyonel domates yetiştiriciliğinin tüm sırları.',
        coverImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800',
        category: ArticleCategory.VEGETABLE,
        tags: ['domates', 'sebze', 'budama'],
        authorId: admin.id,
        readingTime: 12,
        viewCount: 2100,
        published: true,
        publishedAt: new Date('2024-05-10'),
      },
    ],
  })

  // ─── DEMO BAHÇE (demoUser) ───────────────────────────────────────────
  const planted1 = await prisma.plantedSeed.create({
    data: {
      userId: demoUser.id,
      seedId: domates.id,
      plantedDate: new Date('2026-04-10'),
      location: 'Balkon — Güney Cephe',
      city: 'İstanbul',
      currentStageOrder: 5,
      notes: 'Bu yıl ilk cherry domates deneyimim. Çok hızlı büyüdü!',
      photos: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'],
      isActive: true,
    },
  })

  const planted2 = await prisma.plantedSeed.create({
    data: {
      userId: demoUser.id,
      seedId: fesleğen.id,
      plantedDate: new Date('2026-05-01'),
      location: 'Mutfak Penceresi',
      city: 'İstanbul',
      currentStageOrder: 3,
      notes: 'Pesto için yetiştiriyorum, kokusu harika.',
      photos: ['https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400'],
      isActive: true,
    },
  })

  const planted3 = await prisma.plantedSeed.create({
    data: {
      userId: demoUser.id,
      seedId: salatalik.id,
      plantedDate: new Date('2026-05-15'),
      location: 'Balkon — Doğu Cephe',
      city: 'İstanbul',
      currentStageOrder: 2,
      notes: 'Kafes kurdum, büyümeye başladı.',
      isActive: true,
    },
  })

  // Admin bahçesi
  const planted4 = await prisma.plantedSeed.create({
    data: {
      userId: admin.id,
      seedId: lavanta.id,
      plantedDate: new Date('2026-03-01'),
      location: 'Bahçe — Güneş Alan Köşe',
      city: 'İzmir',
      currentStageOrder: 4,
      notes: 'Geçen yıldan gelen lavanta. Bu yıl çok güzel açtı.',
      photos: ['https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400'],
      isActive: true,
    },
  })

  const planted5 = await prisma.plantedSeed.create({
    data: {
      userId: admin.id,
      seedId: biber.id,
      plantedDate: new Date('2026-02-15'),
      location: 'Bahçe — Sera',
      city: 'İzmir',
      currentStageOrder: 4,
      notes: 'Sera içinde çok iyi gelişiyor. Kırmızı olmayı bekliyorum.',
      isActive: true,
      harvestedAt: new Date('2026-06-01'),
      harvestAmount: 2.5,
      harvestUnit: 'kg',
    },
  })

  // ─── BAHÇE GÜNLÜK LOGLARI ───────────────────────────────────────────
  await prisma.gardenLog.createMany({
    data: [
      // planted1 (domates) logları
      { plantedSeedId: planted1.id, date: new Date('2026-04-10'), type: TaskType.PLANTING, note: 'Tohumları ekdim, fide tepsisine koydum.' },
      { plantedSeedId: planted1.id, date: new Date('2026-04-18'), type: TaskType.CHECKING, note: 'İlk filizler çıktı! Çok heyecan verici.' },
      { plantedSeedId: planted1.id, date: new Date('2026-05-02'), type: TaskType.PLANTING, note: 'Büyük saksıya şaşırttım.', photo: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400' },
      { plantedSeedId: planted1.id, date: new Date('2026-05-10'), type: TaskType.FERTILIZING, note: 'İlk gübre — dengeli NPK.' },
      { plantedSeedId: planted1.id, date: new Date('2026-05-20'), type: TaskType.PRUNING, note: 'Koltuk sürgünlerini kestim.' },
      { plantedSeedId: planted1.id, date: new Date('2026-06-01'), type: TaskType.WATERING, note: 'Çiçekler açmaya başladı, sulamayı düzenledim.' },
      { plantedSeedId: planted1.id, date: new Date('2026-06-10'), type: TaskType.CHECKING, note: 'Küçük domatesler oluştu! 🍅', photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
      // planted2 (fesleğen) logları
      { plantedSeedId: planted2.id, date: new Date('2026-05-01'), type: TaskType.PLANTING, note: 'Mutfak penceresine ektim.' },
      { plantedSeedId: planted2.id, date: new Date('2026-05-12'), type: TaskType.CHECKING, note: 'Güzel filizlendi, 8 filiz var.' },
      { plantedSeedId: planted2.id, date: new Date('2026-05-25'), type: TaskType.PRUNING, note: 'İlk tepe budaması yaptım, dallanmaya başladı.' },
      { plantedSeedId: planted2.id, date: new Date('2026-06-05'), type: TaskType.HARVESTING, note: 'İlk hasat! Pesto yaptım, muhteşemdi.' },
      // planted3 (salatalık) logları
      { plantedSeedId: planted3.id, date: new Date('2026-05-15'), type: TaskType.PLANTING, note: 'Balkona ektim, kafes kurdum.' },
      { plantedSeedId: planted3.id, date: new Date('2026-05-22'), type: TaskType.CHECKING, note: 'Çimlenme başladı.' },
      // planted4 (lavanta - admin) logları
      { plantedSeedId: planted4.id, date: new Date('2026-03-01'), type: TaskType.PLANTING, note: 'Geçen yıldan kalan bitkiyi budadım.' },
      { plantedSeedId: planted4.id, date: new Date('2026-05-15'), type: TaskType.CHECKING, note: 'Tomurcuklar belirdi.', photo: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400' },
      { plantedSeedId: planted4.id, date: new Date('2026-06-10'), type: TaskType.HARVESTING, note: 'İlk çiçekler açtı, bir demet kestim.' },
      // planted5 (biber - admin) logları
      { plantedSeedId: planted5.id, date: new Date('2026-02-15'), type: TaskType.PLANTING, note: 'Serada fide ekimi.' },
      { plantedSeedId: planted5.id, date: new Date('2026-04-01'), type: TaskType.PLANTING, note: 'Sera içindeki büyük saksıya şaşırttım.' },
      { plantedSeedId: planted5.id, date: new Date('2026-06-01'), type: TaskType.HARVESTING, note: '2.5kg hasat! Kırmızı biberler çok tatlı çıktı.', photo: 'https://images.unsplash.com/photo-1525585459854-99e1e9e38b6a?w=400' },
    ],
  })

  // ─── SİPARİŞLER ─────────────────────────────────────────────────────
  const order1 = await prisma.order.create({
    data: {
      userId: demoUser.id,
      subtotal: 64.70,
      shipping: 0,
      total: 64.70,
      status: 'DELIVERED',
      paymentMethod: 'credit_card',
      trackingNumber: 'YK123456789TR',
      shippingAddress: { name: 'Ayşe Bahçıvan', address: 'Kadıköy Mah. Bağdat Cad. No:42', city: 'İstanbul', zip: '34710' },
      createdAt: new Date('2026-04-05'),
      items: {
        create: [
          { seedId: domates.id, quantity: 2, price: 24.90 },
          { seedId: fesleğen.id, quantity: 1, price: 14.90 },
        ],
      },
    },
  })

  const order2 = await prisma.order.create({
    data: {
      userId: demoUser.id,
      subtotal: 109.80,
      shipping: 29.90,
      total: 139.70,
      status: 'SHIPPED',
      paymentMethod: 'credit_card',
      trackingNumber: 'YK987654321TR',
      shippingAddress: { name: 'Ayşe Bahçıvan', address: 'Kadıköy Mah. Bağdat Cad. No:42', city: 'İstanbul', zip: '34710' },
      createdAt: new Date('2026-06-10'),
      items: {
        create: [
          { productId: topraksizToprak.id, quantity: 1, price: 89.90 },
          { seedId: salatalik.id, quantity: 1, price: 19.90 },
        ],
      },
    },
  })

  // Admin siparişi
  await prisma.order.create({
    data: {
      userId: admin.id,
      subtotal: 299.90,
      shipping: 0,
      total: 299.90,
      status: 'DELIVERED',
      paymentMethod: 'credit_card',
      createdAt: new Date('2026-03-10'),
      items: {
        create: [
          { productId: hobbySet.id, quantity: 1, price: 299.90 },
        ],
      },
    },
  })

  // ─── ROZETLER — KULLANICILARA ATAMA ─────────────────────────────────
  const allBadges = await prisma.badge.findMany()
  const badgeMap = Object.fromEntries(allBadges.map(b => [b.slug, b.id]))

  // demoUser rozetleri
  await prisma.userBadge.createMany({
    skipDuplicates: true,
    data: [
      { userId: demoUser.id, badgeId: badgeMap['ilk-tohum'],      earnedAt: new Date('2026-04-05') },
      { userId: demoUser.id, badgeId: badgeMap['topluluk-yildizi'], earnedAt: new Date('2026-04-20') },
      { userId: demoUser.id, badgeId: badgeMap['fotograf'],         earnedAt: new Date('2026-06-10') },
    ],
  })

  // admin rozetleri
  await prisma.userBadge.createMany({
    skipDuplicates: true,
    data: [
      { userId: admin.id, badgeId: badgeMap['ilk-tohum'],      earnedAt: new Date('2025-03-01') },
      { userId: admin.id, badgeId: badgeMap['ilk-hasat'],      earnedAt: new Date('2025-07-15') },
      { userId: admin.id, badgeId: badgeMap['organik-uretici'], earnedAt: new Date('2025-08-01') },
      { userId: admin.id, badgeId: badgeMap['bes-bitki'],       earnedAt: new Date('2025-09-01') },
      { userId: admin.id, badgeId: badgeMap['usta-bahcivan'],   earnedAt: new Date('2026-01-01') },
      { userId: admin.id, badgeId: badgeMap['mevsim-ustasi'],   earnedAt: new Date('2026-02-01') },
    ],
  })

  // ─── AKTİVİTE LOGLARI ───────────────────────────────────────────────
  await prisma.activityLog.createMany({
    data: [
      // demoUser aktiviteleri
      { userId: demoUser.id, type: ActivityType.PURCHASE,      xpEarned: 50,  createdAt: new Date('2026-04-05'), metadata: { orderId: order1.id } },
      { userId: demoUser.id, type: ActivityType.PLANT,         xpEarned: 30,  createdAt: new Date('2026-04-10'), metadata: { seedName: 'Cherry Domates' } },
      { userId: demoUser.id, type: ActivityType.BADGE_EARN,    xpEarned: 50,  createdAt: new Date('2026-04-05'), metadata: { badge: 'İlk Tohum' } },
      { userId: demoUser.id, type: ActivityType.PLANT,         xpEarned: 30,  createdAt: new Date('2026-05-01'), metadata: { seedName: 'İtalyan Fesleğeni' } },
      { userId: demoUser.id, type: ActivityType.BADGE_EARN,    xpEarned: 30,  createdAt: new Date('2026-04-20'), metadata: { badge: 'Topluluk Yıldızı' } },
      { userId: demoUser.id, type: ActivityType.PROJECT_SHARE, xpEarned: 30,  createdAt: new Date('2026-04-20'), metadata: { projectTitle: 'Balkonumda 3 Çeşit Domates' } },
      { userId: demoUser.id, type: ActivityType.LOG_ENTRY,     xpEarned: 10,  createdAt: new Date('2026-06-05'), metadata: { note: 'İlk hasat' } },
      { userId: demoUser.id, type: ActivityType.HARVEST,       xpEarned: 100, createdAt: new Date('2026-06-05'), metadata: { seedName: 'İtalyan Fesleğeni' } },
      { userId: demoUser.id, type: ActivityType.BADGE_EARN,    xpEarned: 25,  createdAt: new Date('2026-06-10'), metadata: { badge: 'Bahçe Fotoğrafçısı' } },
      { userId: demoUser.id, type: ActivityType.PURCHASE,      xpEarned: 50,  createdAt: new Date('2026-06-10'), metadata: { orderId: order2.id } },
      // admin aktiviteleri
      { userId: admin.id, type: ActivityType.PLANT,      xpEarned: 30,  createdAt: new Date('2026-03-01'), metadata: { seedName: 'Fransız Lavantası' } },
      { userId: admin.id, type: ActivityType.HARVEST,    xpEarned: 100, createdAt: new Date('2026-06-01'), metadata: { seedName: 'Dolmalık Biber', amount: '2.5kg' } },
      { userId: admin.id, type: ActivityType.LOG_ENTRY,  xpEarned: 10,  createdAt: new Date('2026-06-10'), metadata: { note: 'Lavanta ilk çiçek hasadı' } },
      { userId: admin.id, type: ActivityType.BADGE_EARN, xpEarned: 200, createdAt: new Date('2026-01-01'), metadata: { badge: 'Usta Bahçıvan' } },
    ],
  })

  // XP güncelle
  await prisma.user.update({ where: { id: demoUser.id }, data: { xp: 320 + 50 + 30 + 50 + 30 + 30 + 30 + 10 + 100 + 25 + 50 } })
  await prisma.user.update({ where: { id: admin.id },    data: { xp: 5000 } })

  // ─── DEMO PROJE ─────────────────────────────────────────────────────
  await prisma.project.createMany({
    skipDuplicates: false,
    data: [
      {
        userId: demoUser.id,
        title: 'Balkonumda 3 Çeşit Domates',
        description: 'Bu yaz 3 farklı domates çeşidi denedim. Cherry, salkım ve büyük domates yan yana harika görünüyor! Tüm balkonu kapladı ama değdi.',
        images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500'],
        tags: ['domates', 'balkon', 'yaz'],
        seedIds: [domates.id],
        likes: 45,
        viewCount: 280,
        published: true,
      },
      {
        userId: admin.id,
        title: 'İzmir\'de Lavanta Bahçesi',
        description: 'İzmir\'deki bahçemde 30m² lavanta tarlası kurdum. Arılar harika, komşular kokudan şikayetçi değil 😄 Her yıl kurutup satıyorum.',
        images: ['https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500'],
        tags: ['lavanta', 'İzmir', 'organik'],
        seedIds: [lavanta.id],
        likes: 128,
        viewCount: 1540,
        published: true,
      },
    ],
  })

  console.log('✅ Demo veriler başarıyla yüklendi!')
  console.log(`   👑 Admin: admin@filiz.com.tr / Admin123!`)
  console.log(`   👤 Demo:  demo@filiz.com.tr / User1234!`)
  console.log(`   🌱 5 Tohum | 📦 4 Ürün | 📰 3 Makale | 🏅 8 Rozet`)
  console.log(`   🪴 Bahçe: demo=3 bitki, admin=2 bitki`)
  console.log(`   🛒 Siparişler: demo=2, admin=1`)
  console.log(`   🏆 Rozetler: demo=3, admin=6`)
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
