import { useState } from 'react';
import toast from 'react-hot-toast';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import SEO from '../components/SEO.jsx';
import api from '../api/axios.js';
import { company, serviceOptions } from '../data/content.js';

const initial = { name: '', email: '', phone: '', service: serviceOptions[0], message: '' };

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Please enter a valid email address.';
    if (form.message.trim().length < 5) return 'Please write a short message (at least 5 characters).';
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setStatus({ state: 'error', message: err });
      return;
    }
    setStatus({ state: 'loading', message: '' });
    try {
      const res = await api.post('/contacts', form);
      const successMsg = res.data?.message || "Thanks! We'll be in touch within one business day.";
      setStatus({ state: 'success', message: successMsg });
      toast.success(successMsg);
      setForm(initial);
    } catch (error) {
      const errMsg =
        error.message ||
        "We couldn't send your message right now. Please email us directly at " + company.email + '.';
      setStatus({ state: 'error', message: errMsg });
      toast.error(errMsg);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description={`Get in touch with ${company.name} in Kathmandu, Nepal. Call, email, or send us a message about your web, app, or software project.`}
        path="/contact"
      />

      <section className="page-hero">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow on-dark">Get In Touch</span>
            <h1>Let's build something together</h1>
            <p className="lead">
              We're based in Kathmandu, Nepal. Visit us during office hours, or reach out by phone,
              email, or the form below.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="contact">
        <div className="wrap contact-grid">
          <Reveal>
            <div className="ci-list">
              <div className="ci">
                <div className="ci-ic"><Icon name="mapPin" size={20} /></div>
                <div>
                  <div className="lbl">Our Office</div>
                  <div className="val">{company.address}</div>
                </div>
              </div>
              <div className="ci">
                <div className="ci-ic"><Icon name="phone" size={20} /></div>
                <div>
                  <div className="lbl">Phone</div>
                  <div className="val"><a href={company.phoneHref}>{company.phone}</a></div>
                </div>
              </div>
              <div className="ci">
                <div className="ci-ic"><Icon name="mail" size={20} /></div>
                <div>
                  <div className="lbl">Email</div>
                  <div className="val"><a href={`mailto:${company.email}`}>{company.email}</a></div>
                </div>
              </div>
            </div>
            <div className="hours">
              {company.hours.map((h) => (
                <div key={h.days}>
                  <div className="lbl">{h.days}</div>
                  <div className="v">{h.time}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="form-wrap">
            <form className="form" onSubmit={onSubmit} noValidate>
              <h3>Send us a message</h3>
              <p className="fd">Tell us a bit about your project and we'll get back to you.</p>

              <div className="two">
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" value={form.name} onChange={onChange} placeholder="Your name" />
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" value={form.phone} onChange={onChange} placeholder="+977 ..." />
                </div>
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
              </div>

              <div className="field">
                <label htmlFor="service">Service</label>
                <select id="service" name="service" value={form.service} onChange={onChange}>
                  {serviceOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" value={form.message} onChange={onChange} placeholder="Tell us about your project..." />
              </div>

              <button className="btn btn-primary form-submit" type="submit" disabled={status.state === 'loading'}>
                {status.state === 'loading' ? 'Sending…' : 'Send message'}
                {status.state !== 'loading' && <Icon name="arrowRight" size={16} className="arr" />}
              </button>

              {status.state === 'success' && <p className="form-note success">{status.message}</p>}
              {status.state === 'error' && <p className="form-note error">{status.message}</p>}
              {status.state === 'idle' && <p className="form-note">We typically reply within one business day.</p>}
            </form>
          </Reveal>
        </div>
      </section>

      <section className="map-sec">
        <Reveal as="div">
          <iframe
            title="NLCITS office location"
            src="https://www.google.com/maps?q=Nepal+Living+Connecting+IT+Solution+Pvt.+Ltd.,+Tarakeshwar-4,+Kathmandu,+Nepal&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </Reveal>
      </section>
    </>
  );
}
