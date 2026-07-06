import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiShield, FiTruck, FiAward, FiDroplet } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import api from '../api/client'

const HERO_FEATURES = [
  { icon: FiDroplet, label: 'All Natural', desc: 'No pesticides or GMOs' },
  { icon: FiShield, label: 'Premium Quality', desc: 'Lab-tested & certified' },
  { icon: FiTruck, label: 'Fast Delivery', desc: 'Nationwide in Malaysia' },
  { icon: FiAward, label: 'Award Winning', desc: 'Best mushroom farm 2025' },
]

const BENEFITS = [
  { icon: '🧠', title: "Lion's Mane", desc: 'Boosts cognitive function, memory and focus. Known as the "smart mushroom".' },
  { icon: '🛡️', title: 'Reishi', desc: 'Adaptogenic properties to reduce stress and strengthen your immune system.' },
  { icon: '⚡', title: 'Cordyceps', desc: 'Enhance energy, stamina and athletic performance naturally.' },
  { icon: '🌿', title: 'Shiitake', desc: 'Rich in vitamins and minerals. A culinary and health powerhouse.' },
]

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

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
      {/* Hero Section */}
      <section className="relative bg-forest-950 text-white overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1628781688523-b9c5d1dc2b3b?w=1600&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-gold-500/20 text-gold-300 text-sm font-semibold px-4 py-1.5 rounded-full border border-gold-500/30 mb-6">
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
              <Link to="/products" className="btn-gold flex items-center gap-2 text-base">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/#about" className="btn-secondary border-white text-white hover:bg-white hover:text-forest-900 text-base">
                Our Story
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
              {HERO_FEATURES.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="text-center">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Icon size={18} className="text-gold-400" />
                  </div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image side */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <div className="w-80 h-80 bg-forest-800/40 rounded-full flex items-center justify-center border-2 border-forest-700/50">
                <span className="text-[180px] leading-none">🍄</span>
              </div>
              <div className="absolute -top-4 -right-4 bg-gold-500 text-white rounded-2xl px-4 py-2 text-sm font-bold shadow-lg">
                Premium Quality
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white text-forest-900 rounded-2xl px-4 py-2 text-sm font-bold shadow-lg">
                🌿 100% Natural
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="section-title">Shop by Category</h2>
              <p className="text-gray-500 mt-3">Explore our curated mushroom collections</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="group card p-6 text-center hover:border-forest-300 border-2 border-transparent transition-all"
                >
                  <div className="w-16 h-16 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-forest-100 transition-colors">
                    <span className="text-3xl">🍄</span>
                  </div>
                  <h3 className="font-semibold text-charcoal text-sm">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{cat.product_count} products</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="text-gray-500 mt-2">Our bestselling premium mushrooms</p>
            </div>
            <Link to="/products" className="text-forest-800 font-semibold text-sm flex items-center gap-1 hover:underline">
              View All <FiArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-2xl" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-3xl bg-forest-950 px-6 py-16 text-center">
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex items-center justify-center gap-8 flex-wrap">
                {['🍄','🌿','🍄','🌱','🍄','🌿','🍄','🌱','🍄','🌿'].map((e, i) => (
                  <span key={i} className="text-7xl">{e}</span>
                ))}
              </div>

              <div className="relative z-10">
                <span className="inline-block bg-gold-500/20 text-gold-300 text-xs font-bold px-4 py-1.5 rounded-full border border-gold-500/30 uppercase tracking-widest mb-6">
                  Coming Soon
                </span>
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
                  Something Special<br />Is Growing
                </h3>
                <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed mb-8">
                  Our premium mushroom collection is being carefully cultivated and curated.
                  Be the first to know when our finest products arrive.
                </p>

                {/* Teaser cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-10">
                  {["Lion's Mane", "Reishi", "Cordyceps", "Shiitake"].map((name) => (
                    <div key={name} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                      <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 border border-gold-500/20">
                        <span className="text-2xl">🍄</span>
                      </div>
                      <p className="text-white text-xs font-semibold">{name}</p>
                      <p className="text-gold-400 text-xs mt-1">Coming Soon</p>
                    </div>
                  ))}
                </div>

                <Link to="/products" className="btn-gold inline-flex items-center gap-2">
                  Explore All Products <FiArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Health Benefits */}
      <section className="py-20 bg-forest-950 text-white" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-white mb-3">
              The Power of Premium Mushrooms
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Each mushroom variety we cultivate carries unique health benefits, 
              backed by centuries of traditional use and modern science.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-forest-900/60 rounded-2xl p-6 border border-forest-800/50 hover:border-gold-500/40 transition-colors">
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="font-serif font-bold text-white text-lg mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why PrimeCrop */}
      <section className="py-20 bg-white" id="why-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-gold-600 font-semibold text-sm uppercase tracking-widest">Why Choose Us</span>
            <h2 className="section-title mt-2 mb-5">
              Malaysia's Most Trusted<br />Premium Mushroom Brand
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              At PrimeCrop, we believe in cultivating more than just mushrooms — we cultivate 
              wellness. Our state-of-the-art farm in Malaysia uses sustainable practices to 
              grow the finest mushrooms available anywhere in Southeast Asia.
            </p>
            <ul className="space-y-3">
              {[
                'Grown in controlled, sterile environments',
                'Harvested at peak nutritional value',
                'No artificial additives or preservatives',
                'Cold-chain delivery to preserve freshness',
                'Every batch lab-tested for quality assurance',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="w-5 h-5 bg-forest-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-forest-700 text-xs">✓</span>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/products" className="btn-primary mt-8 inline-flex items-center gap-2">
              Explore Products <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '500+', label: 'Happy Customers' },
              { value: '12+', label: 'Mushroom Varieties' },
              { value: '100%', label: 'Natural & Organic' },
              { value: '2-Day', label: 'Nationwide Delivery' },
            ].map((stat) => (
              <div key={stat.label} className="bg-cream rounded-2xl p-6 text-center border border-gray-100">
                <p className="font-serif font-bold text-4xl text-forest-800">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gold-500 py-14">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
            Ready to Elevate Your Health?
          </h2>
          <p className="text-gold-100 mb-7">
            Join hundreds of Malaysians who trust PrimeCrop for the world's finest mushrooms.
          </p>
          <Link to="/products" className="bg-white text-gold-700 font-bold px-8 py-3 rounded-lg hover:bg-gold-50 transition-colors inline-flex items-center gap-2">
            Shop Now <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  )
}
