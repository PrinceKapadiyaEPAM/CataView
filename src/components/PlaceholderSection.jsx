function PlaceholderSection({ id, title, description }) {
  return (
    <section id={id} className="mt-4 rounded-2xl border border-slate-300 bg-white p-4 sm:p-5">
      <h2 className="m-0 text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h2>
      <p className="mt-1.5 mb-0 text-sm text-slate-600 sm:text-base">{description}</p>
    </section>
  )
}

export default PlaceholderSection
