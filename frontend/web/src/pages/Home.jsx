import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiShield, FiTruck, FiDroplet } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import api from '../api/client'

const HERO_FEATURES = [
  { icon: FiDroplet, label: 'All Natural', desc: 'No pesticides or GMOs' },
  { icon: FiShield, label: 'Premium Quality', desc: 'Lab-tested & certified' },
  { icon: FiTruck, label: 'Fast Delivery', desc: 'Nationwide in Malaysia' },
]

const BENEFITS = [
  { icon: '🧠', title: "Lion's Mane", desc: 'Boosts cognitive function, memory and focus. Known as the "smart mushroom".' },
  { icon: '🛡️', title: 'Reishi', desc: 'Adaptogenic properties to reduce stress and strengthen your immune system.' },
  { icon: '⚡', title: 'Cordyceps', desc: 'Enhance energy, stamina and athletic performance naturally.' },
  { icon: '🌿', title: 'Shiitake', desc: 'Rich in vitamins and minerals. A culinary and health powerhouse.' },
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

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useScrollReveal()

  useEffect(() => {
    Promise.all([
      api.get('/products/featured?limit=8'),
      api.get('/categories'),
    ]).then(([prodRes, catRes]) => {
      setFeaturedProducts(prodRes.data)
      setCategories(catRes.data.slice(0, 4))
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="pt-16">
      {/* ═══ HERO SECTION — Premium Redesign ═══ */}
      <section className="relative bg-forest-950 text-white overflow-hidden min-h-[90vh] flex items-center">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1628781688523-b9c5d1dc2b3b?w=1600&q=80')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-br from-forest-950/95 via-forest-950/90 to-forest-900/95" />
        
        {/* Decorative mushroom watermarks */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden text-[120px] leading-none text-white/[0.02] flex items-center justify-center gap-20 flex-wrap tracking-[40px]">
          {'🍄 🌿 🍄 🌱 🍄 🌿'.split(' ').map((e, i) => (
            <span key={i} className="inline-block" style={{ transform: `rotate(${i % 2 === 0 ? -15 : 15}deg)` }}>{e}</span>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left: Text */}
          <div>
            <span className="inline-flex items-center gap-2 bg-gold-500/10 text-gold-300 text-xs font-bold px-4 py-2 rounded-full border border-gold-500/25 uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              Malaysia's Premium Mushroom Brand
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Nature's Finest,{' '}
              <span className="text-gold-400">Cultivated</span>{' '}
              to Perfection
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">
              Discover the world's most premium mushrooms — sustainably grown in Malaysia, 
              harvested at peak potency, and delivered fresh to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="inline-flex items-center gap-2 bg-gold-500 text-white px-7 py-3.5 rounded-xl font-bold text-base hover:bg-gold-600 hover:-translate-y-0.5 transition-all shadow-xl shadow-gold-500/25">
                Shop Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/#about" className="inline-flex items-center gap-2 border-2 border-white/20 text-white px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-white/10 hover:border-white/40 transition-all">
                Our Story
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-6 mt-14 max-w-md">
              {HERO_FEATURES.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="text-center group">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-2.5 border border-white/5 group-hover:bg-white/10 group-hover:border-gold-500/20 transition-all">
                    <Icon size={18} className="text-gold-400" />
                  </div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Circular visual */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Outer ring */}
              <div className="w-80 h-80 rounded-full border-2 border-forest-700/30 flex items-center justify-center">
                {/* Inner ring */}
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-forest-800/40 to-forest-700/20 flex items-center justify-center border border-forest-600/30 backdrop-blur-sm">
                  <span className="text-[120px] leading-none select-none">🍄</span>
                </div>
              </div>
              {/* Floating badge - top */}
              <div className="absolute -top-3 -right-3 bg-white/10 backdrop-blur-lg border border-white/15 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-xl">
                🌟 Premium Quality
              </div>
              {/* Floating badge - bottom */}
              <div className="absolute -bottom-3 -left-3 bg-white/10 backdrop-blur-lg border border-white/15 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-xl">
                🌿 100% Natural
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      {categories.length > 0 && (
        <section className="py-20 bg-white reveal-on-scroll">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-gold-600 font-semibold text-xs uppercase tracking-[4px] mb-2">Collections</p>
              <h2 className="font-serif text-4xl font-bold text-charcoal">Shop by Category</h2>
              <p className="text-gray-500 mt-3 max-w-md mx-auto">Explore our curated mushroom collections, each grown with care and precision</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {categories.map((cat, idx) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="group card p-8 text-center hover:border-forest-300 border-2 border-transparent transition-all hover:shadow-lg hover:-translate-y-1"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-forest-100 transition-colors">
                    <span className="text-3xl">🍄</span>
                  </div>
                  <h3 className="font-serif font-bold text-charcoal text-lg">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{cat.product_count} products</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section className="py-20 bg-cream reveal-on-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-gold-600 font-semibold text-xs uppercase tracking-[4px] mb-2">Best Sellers</p>
              <h2 className="font-serif text-4xl font-bold text-charcoal">Featured Products</h2>
              <p className="text-gray-500 mt-2">Our bestselling premium mushrooms, hand-picked for you</p>
            </div>
            <Link to="/products" className="text-forest-800 font-semibold text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all hover:text-gold-600">
              View All <FiArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl animate-pulse overflow-hidden">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product, idx) => (
                <div key={product.id} className="reveal-on-scroll" style={{ animationDelay: `${idx * 80}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 px-8 py-24 text-center shadow-2xl border border-forest-800/30">
              {/* Glow effects */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-forest-800/20 to-transparent" />
              
              {/* Decorative background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center gap-12 flex-wrap text-9xl">
                {['🍄','🌿','🍄','🌱','🍄','🌿','🍄','🌱'].map((e, i) => (
                  <span key={i} className="inline-block" style={{ transform: `rotate(${i * 25 + 10}deg) scale(${0.8 + Math.random() * 0.4})` }}>{e}</span>
                ))}
              </div>

              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 bg-gold-500/10 text-gold-300 text-sm font-bold px-5 py-2 rounded-full border border-gold-500/20 uppercase tracking-widest mb-8 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                  Coming Soon
                </span>
                
                <h3 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                  Something Exceptional<br />
                  <span className="text-gold-400">Is Being Cultivated</span>
                </h3>
                <p className="text-gray-400 max-w-lg mx-auto text-base leading-relaxed mb-12">
                  Our master growers are carefully nurturing Malaysia's most premium mushroom collection. 
                  Each variety is cultivated at peak potency for your wellness journey.
                </p>

                {/* Premium mushroom cards — large and bold */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto mb-12">
                  {[
                    { name: "Lion's Mane", icon: '🧠', benefit: 'Cognitive Health', color: 'from-amber-500/20 to-amber-600/10' },
                    { name: 'Reishi', icon: '🛡️', benefit: 'Immune Support', color: 'from-red-500/20 to-red-600/10' },
                    { name: 'Cordyceps', icon: '⚡', benefit: 'Energy & Stamina', color: 'from-blue-500/20 to-blue-600/10' },
                    { name: 'Shiitake', icon: '🌿', benefit: 'Culinary Premium', color: 'from-green-500/20 to-green-600/10' },
                  ].map((item) => (
                    <div key={item.name} className="group bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-7 backdrop-blur-md hover:bg-white/[0.10] hover:border-gold-500/30 hover:-translate-y-1 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-gold-500/20 to-gold-500/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gold-500/20 group-hover:border-gold-500/40 group-hover:scale-110 transition-all duration-300">
                        <span className="text-3xl">{item.icon}</span>
                      </div>
                      <h4 className="text-white font-serif font-bold text-lg mb-1">{item.name}</h4>
                      <p className="text-gray-500 text-sm mb-3">{item.benefit}</p>
                      <span className="inline-flex items-center gap-1 text-gold-400 text-xs font-semibold bg-gold-500/10 rounded-full px-3 py-1 border border-gold-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                        Launching Soon
                      </span>
                    </div>
                  ))}
                </div>

                <Link to="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:from-gold-600 hover:to-gold-700 hover:-translate-y-0.5 transition-all shadow-2xl shadow-gold-500/30">
                  Explore All Products <FiArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ HEALTH BENEFITS ═══ */}
      <section className="py-24 bg-forest-950 text-white reveal-on-scroll" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold-400 font-semibold text-xs uppercase tracking-[4px] mb-2">Why Mushrooms</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              The Power of Premium Mushrooms
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
              Each mushroom variety we cultivate carries unique health benefits, 
              backed by centuries of traditional use and modern science.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b, idx) => (
              <div key={b.title} className="group bg-forest-900/50 rounded-2xl p-7 border border-forest-800/30 hover:border-gold-500/30 hover:bg-forest-900/80 transition-all hover:-translate-y-1" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform inline-block">{b.icon}</div>
                <h3 className="font-serif font-bold text-white text-xl mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY PRIMECROP ═══ */}
      <section className="py-24 bg-white reveal-on-scroll" id="why-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-gold-600 font-semibold text-xs uppercase tracking-[4px] mb-2">Why Choose Us</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mt-2 mb-5">
              Malaysia's Most Trusted<br />
              <span className="text-forest-800">Premium Mushroom Brand</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              At PrimeCrop, we believe in cultivating more than just mushrooms — we cultivate 
              wellness. Our state-of-the-art farm in Malaysia uses sustainable practices to 
              grow the finest mushrooms available anywhere in Southeast Asia.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                'Grown in controlled, sterile environments',
                'Harvested at peak nutritional value',
                'No artificial additives or preservatives',
                'Cold-chain delivery to preserve freshness',
                'Every batch lab-tested for quality assurance',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="w-6 h-6 bg-forest-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-forest-700 text-xs font-bold">✓</span>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/products" className="inline-flex items-center gap-2 bg-forest-800 text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-forest-700 hover:-translate-y-0.5 transition-all shadow-xl shadow-forest-800/20">
              Explore Products <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              { value: '500+', label: 'Happy Customers', color: 'from-emerald-500 to-green-600' },
              { value: '12+', label: 'Mushroom Varieties', color: 'from-gold-500 to-gold-600' },
              { value: '100%', label: 'Natural & Organic', color: 'from-forest-600 to-forest-700' },
              { value: '2-Day', label: 'Nationwide Delivery', color: 'from-blue-500 to-indigo-600' },
            ].map((stat, idx) => (
              <div key={stat.label} className="group bg-cream rounded-2xl p-7 text-center border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all" style={{ animationDelay: `${idx * 100}ms` }}>
                <p className="font-serif font-bold text-4xl lg:text-5xl text-forest-800 group-hover:scale-105 transition-transform inline-block">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="bg-gradient-to-r from-gold-500 to-gold-600 py-16 reveal-on-scroll">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
            Ready to Elevate Your Health?
          </h2>
          <p className="text-gold-100 mb-8 max-w-lg mx-auto">
            Join hundreds of Malaysians who trust PrimeCrop for the world's finest mushrooms.
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-white text-gold-700 font-bold px-8 py-3.5 rounded-xl hover:bg-gold-50 hover:-translate-y-0.5 transition-all shadow-xl">
            Shop Now <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  )
}