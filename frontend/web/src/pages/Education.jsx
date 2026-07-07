import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiBookOpen, FiShield, FiZap, FiHeart, FiTrendingUp, FiClock, FiAward, FiMaximize, FiThermometer, FiDroplet } from 'react-icons/fi'

function MushroomImage({ src, alt, icon }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-forest-100 to-forest-200">
        {icon}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

const MUSHROOM_GUIDES = [
  {
    id: 'lions-mane',
    name: "Lion's Mane",
    icon: '🧠',
    scientific: 'Hericium erinaceus',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    image: 'https://placehold.co/400x300/d97706/FFFFFF?text=Lion%27s+Mane&font=playfair-display',
    size: '10–25 cm across',
    taste: 'Delicate, seafood-like — often compared to crab or lobster with a sweet, earthy undertone',
    texture: 'Tender, stringy, and spongy when cooked — shreds like pulled meat',
    nutrients: ['Beta-glucans', 'Hericenones', 'Erinacines', 'Potassium', 'Zinc', 'Selenium'],
    benefits: ['Cognitive Enhancement', 'Memory Support', 'Nerve Regeneration', 'Mood Balance'],
    description: 'Known as the "smart mushroom," Lion\'s Mane contains hericenones and erinacines that stimulate nerve growth factor (NGF) production, supporting brain health and cognitive function.',
    usage: 'Tea, coffee, capsules, or powder extract. 500–1000mg daily.',
  },
  {
    id: 'reishi',
    name: 'Reishi',
    icon: '🛡️',
    scientific: 'Ganoderma lucidum',
    color: 'from-red-500 to-rose-600',
    bg: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    image: 'https://placehold.co/400x300/ef4444/FFFFFF?text=Reishi&font=playfair-display',
    size: '5–20 cm across, kidney-shaped cap',
    taste: 'Extremely bitter and woody — rarely eaten fresh, typically consumed as extract or tea',
    texture: 'Tough, woody, and cork-like — not palatable raw; requires long simmering or alcohol extraction',
    nutrients: ['Triterpenes', 'Ganoderic Acid', 'Polysaccharides', 'Sterols', 'Peptidoglycans', 'Germanium'],
    benefits: ['Immune Support', 'Stress Reduction', 'Sleep Quality', 'Anti-Inflammatory'],
    description: 'Revered as the "mushroom of immortality" in Eastern medicine, Reishi contains triterpenes and polysaccharides that modulate the immune system and promote calm.',
    usage: 'Tea, tincture, or capsules. 1–3g daily for general wellness.',
  },
  {
    id: 'cordyceps',
    name: 'Cordyceps',
    icon: '⚡',
    scientific: 'Cordyceps militaris',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    image: 'https://placehold.co/400x300/3b82f6/FFFFFF?text=Cordyceps&font=playfair-display',
    size: '3–8 cm tall, slender club-like fruiting body',
    taste: 'Earthy, nutty, and slightly sweet with a mild mushroom flavor — pleasant in soups and broths',
    texture: 'Chewy and meaty when rehydrated; powdery when ground into extract',
    nutrients: ['Cordycepin', 'Adenosine', 'Polysaccharides', 'Beta-glucans', 'Selenium', 'Vitamin B12'],
    benefits: ['Energy & Stamina', 'Athletic Performance', 'Oxygen Utilization', 'Anti-Aging'],
    description: 'Cordyceps is prized for its ability to increase ATP production, improving cellular energy and oxygen utilization — making it a favorite among athletes.',
    usage: 'Powder, capsules, or extract. 1–3g before workouts.',
  },
  {
    id: 'shiitake',
    name: 'Shiitake',
    icon: '🌿',
    scientific: 'Lentinula edodes',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    image: 'https://placehold.co/400x300/22c55e/FFFFFF?text=Shiitake&font=playfair-display',
    size: '5–15 cm across, umbrella-shaped brown cap',
    taste: 'Rich, savory, and umami-packed with a subtle garlicky note — the most culinary of medicinal mushrooms',
    texture: 'Meaty and chewy when fresh; firm and dense when cooked — holds shape beautifully in stir-fries and braises',
    nutrients: ['Lentinan', 'Vitamin D', 'B Vitamins', 'Copper', 'Selenium', 'Eritadenine'],
    benefits: ['Heart Health', 'Immune Support', 'Vitamin D Rich', 'Gut Health'],
    description: 'The world\'s most consumed medicinal mushroom, Shiitake is rich in lentinan, a beta-glucan that supports immune health, plus B vitamins and vitamin D.',
    usage: 'Cooked fresh or dried in soups, stir-fries. 5–10g daily.',
  },
  {
    id: 'turkey-tail',
    name: 'Turkey Tail',
    icon: '🦚',
    scientific: 'Trametes versicolor',
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    image: 'https://placehold.co/400x300/a855f7/FFFFFF?text=Turkey+Tail&font=playfair-display',
    size: '2–8 cm across, fan-shaped with concentric color zones',
    taste: 'Mild, earthy, and slightly bitter — typically consumed as tea or extract rather than eaten whole',
    texture: 'Tough, leathery, and thin — inedible raw; best steeped as a tea or powdered in capsules',
    nutrients: ['PSK (Polysaccharide-K)', 'PSP', 'Beta-glucans', 'Sterols', 'Vitamin D', 'Antioxidants'],
    benefits: ['Gut Microbiome', 'Immune Modulation', 'Digestive Health', 'Antioxidant Rich'],
    description: 'Turkey Tail contains PSK and PSP — two of the most studied immune-supporting compounds in mushroom science. A powerful prebiotic for gut health.',
    usage: 'Tea, tincture, or capsules. 1–3g daily.',
  },
  {
    id: 'maitake',
    name: 'Maitake',
    icon: '🪸',
    scientific: 'Grifola frondosa',
    color: 'from-cyan-500 to-teal-600',
    bg: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    borderColor: 'border-cyan-200',
    image: 'https://placehold.co/400x300/06b6d4/FFFFFF?text=Maitake&font=playfair-display',
    size: '10–30 cm across, large clusters of ruffled fan-shaped caps',
    taste: 'Rich, earthy, and deeply savory with a delicate sweetness — known as the "dancing mushroom" for its delicious flavor',
    texture: 'Tender yet firm with a slight crunch — frilly edges crisp up beautifully when roasted or pan-seared',
    nutrients: ['Beta-glucans (D-Fraction)', 'Vitamin B & D', 'Niacin', 'Potassium', 'Copper', 'Amino Acids'],
    benefits: ['Blood Sugar Balance', 'Metabolic Health', 'Weight Management', 'Immune Support'],
    description: 'Known as the "dancing mushroom," Maitake supports healthy blood sugar levels and metabolic function through its unique beta-glucan profile.',
    usage: 'Powder, capsules, or fresh. 500–1000mg daily.',
  },
]

const BENEFIT_CATEGORIES = [
  { icon: FiAward, label: 'Cognitive Health', desc: 'Lion\'s Mane supports memory, focus, and nerve regeneration.', color: 'from-amber-500 to-orange-500' },
  { icon: FiShield, label: 'Immune Support', desc: 'Reishi and Turkey Tail modulate and strengthen the immune system.', color: 'from-red-500 to-rose-500' },
  { icon: FiZap, label: 'Energy & Vitality', desc: 'Cordyceps boosts ATP and cellular energy production.', color: 'from-blue-500 to-indigo-500' },
  { icon: FiHeart, label: 'Heart & Gut Health', desc: 'Shiitake and Maitake support cardiovascular and digestive wellness.', color: 'from-green-500 to-emerald-500' },
  { icon: FiTrendingUp, label: 'Longevity', desc: 'Adaptogenic mushrooms help the body adapt to stress and age gracefully.', color: 'from-purple-500 to-violet-500' },
]

// Scroll reveal hook
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
          }
        })
      },
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function Education() {
  const [activeGuide, setActiveGuide] = useState(null)
  useScrollReveal()

  return (
    <div className="pt-16 min-h-screen bg-cream">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center gap-16 flex-wrap text-8xl">
          {['🍄','🌿','🧬','🔬','🍄','🌿'].map((e, i) => (
            <span key={i} className="inline-block" style={{ transform: `rotate(${i * 20}deg)` }}>{e}</span>
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <span className="inline-flex items-center gap-2 bg-gold-500/10 text-gold-300 text-xs font-bold px-4 py-2 rounded-full border border-gold-500/25 uppercase tracking-wider mb-5">
            <FiBookOpen size={14} />
            Learn & Discover
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 max-w-3xl">
            The Science of<br />
            <span className="text-gold-400">Functional Mushrooms</span>
          </h1>
          <p className="text-gray-300 max-w-xl text-base leading-relaxed mb-8">
            Explore the powerful world of medicinal mushrooms — backed by centuries of traditional wisdom 
            and cutting-edge modern research. Discover which mushroom is right for your wellness journey.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#guides" className="inline-flex items-center gap-2 bg-gold-500 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/25">
              Browse Mushroom Guides <FiArrowRight size={14} />
            </a>
            <a href="#benefits" className="inline-flex items-center gap-2 border-2 border-white/20 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all">
              Health Benefits
            </a>
          </div>
        </div>
      </section>

      {/* ═══ BENEFIT CATEGORIES ═══ */}
      <section className="py-20 bg-white reveal-on-scroll" id="benefits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold-600 font-semibold text-xs uppercase tracking-[4px] mb-2">Why Mushrooms</p>
            <h2 className="font-serif text-4xl font-bold text-charcoal mb-3">
              Targeted Health Benefits
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Different mushrooms offer distinct therapeutic properties. Find what matches your wellness goals.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFIT_CATEGORIES.map((cat) => (
              <div key={cat.label} className="group bg-cream rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4`}>
                  <cat.icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{cat.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MUSHROOM GUIDES ═══ */}
      <section className="py-20 bg-cream reveal-on-scroll" id="guides">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold-600 font-semibold text-xs uppercase tracking-[4px] mb-2">Mushroom Encyclopedia</p>
            <h2 className="font-serif text-4xl font-bold text-charcoal mb-3">
              Complete Mushroom Guides
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Deep dive into each mushroom variety — from traditional use to modern scientific research.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MUSHROOM_GUIDES.map((mushroom) => (
              <div key={mushroom.id} className="reveal-on-scroll">
                <button
                  onClick={() => setActiveGuide(activeGuide === mushroom.id ? null : mushroom.id)}
                  className={`w-full text-left bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group ${
                    activeGuide === mushroom.id ? 'shadow-xl ring-2 ring-forest-800' : 'shadow-sm'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-44 bg-forest-100 overflow-hidden">
                    <MushroomImage src={mushroom.image} alt={mushroom.name} icon={mushroom.icon} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${mushroom.color} flex items-center justify-center text-lg shadow-lg`}>
                          {mushroom.icon}
                        </div>
                        <div className="text-left">
                          <h3 className="font-serif font-bold text-white text-base drop-shadow-sm">{mushroom.name}</h3>
                          <p className="text-white/70 text-[10px] italic drop-shadow-sm">{mushroom.scientific}</p>
                        </div>
                      </div>
                    </div>
                    {/* Expand indicator */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-semibold text-gray-600 shadow-sm">
                      {activeGuide === mushroom.id ? '▲ Open' : '▼ Details'}
                    </div>
                  </div>

                  {/* Quick stats row */}
                  <div className="px-5 py-3.5 border-b border-gray-50">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Size</p>
                        <p className="text-xs text-gray-700 font-medium truncate">{mushroom.size.split(',')[0]}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Taste</p>
                        <p className="text-xs text-gray-700 font-medium truncate">{mushroom.taste.split(' —')[0]}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Texture</p>
                        <p className="text-xs text-gray-700 font-medium truncate">{mushroom.texture.split(' —')[0]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tag preview */}
                  <div className="px-5 py-3 flex flex-wrap gap-1.5">
                    {mushroom.benefits.slice(0, 2).map((b) => (
                      <span key={b} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${mushroom.bg} ${mushroom.textColor}`}>
                        {b}
                      </span>
                    ))}
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                      +{mushroom.benefits.length - 2 + mushroom.nutrients.length} details
                    </span>
                  </div>

                  {/* Expanded content */}
                  {activeGuide === mushroom.id && (
                    <div className="px-5 py-5 border-t border-gray-100 space-y-5 bg-gray-50/50">
                      {/* About */}
                      <div>
                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">About</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{mushroom.description}</p>
                      </div>

                      {/* Sensory details: Taste & Texture */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FiThermometer size={14} className="text-amber-500" />
                            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Taste</p>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{mushroom.taste}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FiDroplet size={14} className="text-blue-500" />
                            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Texture</p>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{mushroom.texture}</p>
                        </div>
                      </div>

                      {/* Size */}
                      <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <FiMaximize size={14} className="text-purple-500" />
                          <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Size & Appearance</p>
                        </div>
                        <p className="text-sm text-gray-700">{mushroom.size}</p>
                      </div>

                      {/* Nutrients */}
                      <div>
                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Key Nutrients & Compounds</p>
                        <div className="flex flex-wrap gap-1.5">
                          {mushroom.nutrients.map((n) => (
                            <span key={n} className={`text-xs font-medium px-3 py-1 rounded-full border ${mushroom.borderColor} ${mushroom.bg} ${mushroom.textColor}`}>
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div>
                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Health Benefits</p>
                        <div className="flex flex-wrap gap-1.5">
                          {mushroom.benefits.map((b) => (
                            <span key={b} className={`text-xs font-medium px-2.5 py-1 rounded-full ${mushroom.bg} ${mushroom.textColor}`}>
                              ✓ {b}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Suggested Use */}
                      <div className="bg-forest-50 rounded-xl p-4 border border-forest-100">
                        <p className="text-[11px] text-forest-600 font-semibold uppercase tracking-wider mb-1">Suggested Use</p>
                        <p className="text-sm text-forest-800">{mushroom.usage}</p>
                      </div>

                      <Link
                        to={`/products?search=${encodeURIComponent(mushroom.name)}`}
                        className={`inline-flex items-center gap-1.5 text-sm font-semibold ${mushroom.textColor} hover:underline`}
                      >
                        Browse {mushroom.name} Products <FiArrowRight size={13} />
                      </Link>
                    </div>
                  )}

                  {/* Expand indicator footer */}
                  <div className={`px-5 py-3 flex items-center gap-1.5 text-xs text-gray-400 border-t border-gray-50 ${activeGuide === mushroom.id ? 'border-transparent' : ''}`}>
                    <FiBookOpen size={12} />
                    {activeGuide === mushroom.id ? 'Tap to collapse' : 'Tap to explore full guide'}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FUN FACT / CTA ═══ */}
      <section className="bg-gradient-to-r from-forest-900 to-forest-800 py-16 reveal-on-scroll">
        <div className="max-w-3xl mx-auto text-center px-4">
          <span className="text-5xl mb-5 inline-block">🧬</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
            Did You Know?
          </h2>
          <p className="text-gray-300 max-w-lg mx-auto leading-relaxed mb-6">
            There are over 14,000 identified species of mushrooms on Earth, 
            and only about 100 have been studied for their medicinal potential. 
            Modern science is just scratching the surface.
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-gold-500 text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-gold-600 transition-all shadow-xl shadow-gold-500/25">
            Start Your Wellness Journey <FiArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ═══ DISCLAIMER ═══ */}
      <section className="py-10 bg-white reveal-on-scroll">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            * These statements have not been evaluated by the Ministry of Health Malaysia. 
            Our products are not intended to diagnose, treat, cure, or prevent any disease. 
            Always consult with a qualified healthcare professional before starting any supplement regimen.
          </p>
        </div>
      </section>
    </div>
  )
}