function AboutPage() {
  const values = [
    {
      icon: '🏆',
      title: 'Quality First',
      description: 'We source only the freshest produce and highest-grade products, vetted by our team before listing.',
    },
    {
      icon: '🤝',
      title: 'Reliable Partnerships',
      description: 'We work directly with trusted suppliers and farms to keep your supply chain stable and transparent.',
    },
    {
      icon: '💡',
      title: 'Modern Experience',
      description: 'Our platform is built to make browsing, ordering, and managing your catalogue fast and effortless.',
    },
    {
      icon: '📦',
      title: 'Consistent Delivery',
      description: 'Timely fulfilment for restaurants, retailers, and food-service teams across all order sizes.',
    },
  ]

  return (
    <div className="w-full">
      <section className="bg-gradient-to-br from-sky-950 via-slate-900 to-indigo-950 px-4 py-14 sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">Who We Are</p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
            Built for the Modern Food Business
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            CataView is a B2B catalogue platform connecting restaurants, retailers, and wholesalers with a seamless digital ordering experience.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 sm:text-3xl">Our Values</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-4 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Our Story</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">From a Simple Idea to a Trusted Platform</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              CataView started with a simple frustration: product catalogues were still being shared as PDFs and spreadsheets. We set out to build a fast, searchable, always-up-to-date storefront for B2B buyers and sellers.
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Today, our platform powers discovery for hundreds of suppliers and thousands of buyers across the food and beverage industry.
            </p>
          </div>
          <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 p-10">
            <span className="text-7xl" aria-hidden="true">🛒</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
