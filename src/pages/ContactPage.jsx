import { useState } from 'react'

function ContactPage({ companyData = {}, contactData = {} }) {
  const {
    name: companyName = 'CataView',
  } = companyData

  const {
    addressLine1 = '42 Flavor Street',
    addressLine2 = '',
    city = 'New York',
    state = 'NY',
    zip = '10001',
    email = 'hello@cataview.com',
    mobile = '+1 (800) 123-4567',
    businessHours = 'Mon – Fri, 9 AM – 6 PM EST',
  } = contactData

  const fullAddress = [addressLine1, addressLine2, `${city}${state ? `, ${state}` : ''}${zip ? ` ${zip}` : ''}`]
    .filter(Boolean)
    .join(', ')

  const contactInfo = [
    { icon: '📍', label: 'Address', value: fullAddress },
    { icon: '📞', label: 'Phone', value: mobile },
    { icon: '✉', label: 'Email', value: email },
    { icon: '🕒', label: 'Business Hours', value: businessHours },
  ]
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="w-full">
      <section className="bg-gradient-to-br from-sky-950 via-slate-900 to-indigo-950 px-4 py-14 sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">Get In Touch</p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
            Contact {companyName}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Have a question about our catalogue, pricing, or partnership? Drop us a message and we'll get back to you within one business day.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div className="grid gap-4 self-start">
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sky-50 text-xl">
                  {item.icon}
                </span>
                <div>
                  <p className="m-0 text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</p>
                  <p className="m-0 mt-0.5 text-sm font-medium text-slate-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <span className="text-5xl">✅</span>
                <h2 className="text-2xl font-bold text-slate-900">Message Sent!</h2>
                <p className="max-w-sm text-base text-slate-600">
                  Thanks for reaching out. We'll get back to you within one business day.
                </p>
                <button
                  type="button"
                  className="mt-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h2 className="mb-6 text-xl font-bold text-slate-900 sm:text-2xl">Send {companyName} a Message</h2>
                <form className="grid gap-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <label htmlFor="contact-name" className="text-sm font-medium text-slate-700">Full Name</label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        required
                        autoComplete="name"
                        className="rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <label htmlFor="contact-email" className="text-sm font-medium text-slate-700">Email</label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        className="rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                  </div>

                  <div className="grid gap-1.5">
                    <label htmlFor="contact-subject" className="text-sm font-medium text-slate-700">Subject</label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                      className="rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <label htmlFor="contact-message" className="text-sm font-medium text-slate-700">Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us more..."
                      required
                      className="resize-none rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700 sm:w-auto sm:px-8"
                  >
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
