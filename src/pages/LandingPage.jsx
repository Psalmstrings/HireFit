import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck, Sparkles, Target, ArrowRight, ShieldCheck, CheckCircle2,
  Cpu, Layers, Download, Check, ChevronDown, ChevronUp, Zap, Star
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'Does HireFit fabricate or invent fake experience?',
      a: 'Never. HireFit has strict zero-fabrication safety rules built into every prompt and service. We only improve how your genuine experience is framed, structured, and aligned with target keywords. If a requirement is not in your CV, we highlight it as "not evidenced".'
    },
    {
      q: 'Will the match score guarantee I get an interview?',
      a: 'No score can guarantee interview outcomes because hiring decisions involve recruiters, company dynamics, and human evaluation. Our AI Job Match Score is an evidence-based alignment estimate designed to help you communicate your real capabilities effectively.'
    },
    {
      q: 'What file formats can I upload and export?',
      a: 'You can upload resumes in PDF (.pdf) and Word (.docx) formats. You can edit every extracted field in our interactive editor and export your final CV in PDF format with multiple ATS-optimized templates.'
    },
    {
      q: 'Can I keep different CV versions for different jobs?',
      a: 'Yes! HireFit includes version management. Every time you optimize your CV for a specific job posting, a tailored version is created, linked to that target opportunity, and accessible in your dashboard.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ padding: '80px 24px 60px', background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', background: 'var(--primary-light)', color: 'var(--primary)',
            borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20
          }}>
            <Sparkles size={14} /> AI-Powered Career Alignment Engine
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, color: 'var(--text)',
            letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20
          }}>
            Turn your CV into a <span style={{ color: 'var(--primary)' }}>job-specific application.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 19px)', color: 'var(--muted)',
            lineHeight: 1.6, maxWidth: 680, margin: '0 auto 36px'
          }}>
            Analyze any job description, identify what employers are looking for, and tailor your CV around your real experience—with zero fabricated claims.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Optimize My CV <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn btn-secondary btn-lg">
              See How It Works
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 40, fontSize: 'var(--text-xs)', color: 'var(--muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} color="var(--success)" /> 100% Zero-Fabrication Guarantee
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color="var(--success)" /> ATS-Compliant Templates
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileCheck size={16} color="var(--success)" /> PDF & Word Supported
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
            How HireFit Works
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>
            From raw resume to job-tailored interview machine in 5 simple steps.
          </p>
        </div>

        <div className="grid grid-3 gap-6">
          <div className="card">
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 16 }}>
              1
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>Upload Your Existing CV</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>
              Upload your current resume in PDF or Word. Our parser extracts your work history, skills, education, and achievements into structured data.
            </p>
          </div>

          <div className="card">
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 16 }}>
              2
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>Paste Any Job Posting</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>
              Paste or upload the target job description. The AI parses prerequisites, preferred qualifications, and crucial keyword requirements.
            </p>
          </div>

          <div className="card">
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 16 }}>
              3
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>Get Your Match Score & Gaps</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>
              See an evidence-based match breakdown across 6 categories. Identify matched strengths, partial overlap, and unevidenced requirements.
            </p>
          </div>

          <div className="card">
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 16 }}>
              4
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>Tailor Without Fabrication</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>
              Our optimizer rewrites bullet points and summaries to highlight relevant experience using strong action verbs—preserving 100% factual truth.
            </p>
          </div>

          <div className="card">
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 16 }}>
              5
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>Review Diffs & Accept Changes</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>
              Every modification is shown in a clear before-and-after diff with full rationale. You accept, reject, or fine-tune every single line.
            </p>
          </div>

          <div className="card">
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 16 }}>
              6
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>Export in Clean ATS Templates</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>
              Choose from Modern, Minimal ATS, or Executive designs, then export directly to vector PDF or print with standard typography.
            </p>
          </div>
        </div>
      </section>

      {/* CV Optimization Preview Section */}
      <section style={{ padding: '80px 24px', background: 'var(--surface-2)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
              Transparent Optimization: See Exactly What Changed
            </h2>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>
              No mystery AI edits. Every improvement is highlighted with clear rationale so you stay in total control.
            </p>
          </div>

          <div className="change-card" style={{ background: '#FFFFFF' }}>
            <div className="change-card-header">
              <span className="change-section-label">Work Experience (Software Engineer)</span>
              <span className="badge badge-success">Accepted Improvement</span>
            </div>
            <div className="change-body">
              <div className="change-before">
                <div className="change-side-label">Original Statement</div>
                <div className="change-text">
                  "Worked on websites for clients using React and backend APIs."
                </div>
              </div>
              <div className="change-after">
                <div className="change-side-label">Tailored for Target Role</div>
                <div className="change-text">
                  "Engineered responsive full-stack web applications using React and JavaScript, integrating RESTful APIs to deliver dynamic user experiences."
                </div>
              </div>
            </div>
            <div className="change-rationale">
              <strong>Rationale: </strong> Your original statement was too passive. The revised wording emphasizes technologies and responsibilities already verified in your CV, matching the target job terminology.
            </div>
          </div>
        </div>
      </section>

      {/* ATS & Match Engine Section */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div className="grid grid-2 gap-8 items-center">
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', background: 'var(--primary-light)', color: 'var(--primary)',
              borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 700,
              marginBottom: 16
            }}>
              <Target size={14} /> Objective Alignment
            </div>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 16 }}>
              Know exactly where your CV stands before applying.
            </h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: 24 }}>
              Applicant Tracking Systems (ATS) and human recruiters scan for specific skills, context, and quantifiable outcomes. HireFit gives you a multi-category breakdown so you never have to guess.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--text-sm)' }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <span><strong>Skills Match: </strong>Explicit evidence verification across technical requirements</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--text-sm)' }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <span><strong>Keyword Alignment: </strong>Natural integration of posting keywords into existing bullets</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--text-sm)' }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <span><strong>ATS Readiness: </strong>Delineated section headers, contact visibility, clean layouts</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 32 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 20 }}>Sample Role Alignment</h4>
            <div className="score-bar-item">
              <span className="score-bar-label">Core Skills Overlap</span>
              <div className="score-bar-track"><div className="score-bar-fill high" style={{ width: '92%' }} /></div>
              <span className="score-bar-value">92%</span>
            </div>
            <div className="score-bar-item">
              <span className="score-bar-label">Experience Relevance</span>
              <div className="score-bar-track"><div className="score-bar-fill high" style={{ width: '84%' }} /></div>
              <span className="score-bar-value">84%</span>
            </div>
            <div className="score-bar-item">
              <span className="score-bar-label">Keyword Density</span>
              <div className="score-bar-track"><div className="score-bar-fill medium" style={{ width: '78%' }} /></div>
              <span className="score-bar-value">78%</span>
            </div>
            <div className="score-bar-item">
              <span className="score-bar-label">ATS Formatting Readiness</span>
              <div className="score-bar-track"><div className="score-bar-fill high" style={{ width: '96%' }} /></div>
              <span className="score-bar-value">96%</span>
            </div>
            <div style={{ marginTop: 24, padding: 14, background: 'var(--surface-2)', borderRadius: 'var(--radius)', fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
              ✓ 3 requirements matched directly · ⚠ 1 requirement not evidenced in CV
            </div>
          </div>
        </div>
      </section>

      {/* AI Career Assistant Suite */}
      <section style={{ padding: '80px 24px', background: 'var(--surface-2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 12 }}>
            Complete Career Assistant Suite
          </h2>
          <p style={{ color: 'var(--muted)', maxWidth: 600, margin: '0 auto 48px' }}>
            Beyond CV optimization, prepare every dimension of your job search.
          </p>

          <div className="grid grid-3 gap-6" style={{ textAlign: 'left' }}>
            <div className="card">
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <FileCheck size={20} />
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>Factual Cover Letters</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>
                Generate role-specific cover letters linking your verified achievements directly to the employer's mission.
              </p>
            </div>

            <div className="card">
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--warning-light)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Cpu size={20} />
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>Interview Preparation</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>
                Tailored technical & behavioral interview questions with candidate-specific talking points sourced directly from your CV.
              </p>
            </div>

            <div className="card">
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Layers size={20} />
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>Application Tracker</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>
                Track every submission from Saved to Applied, Interview, and Offer—linked with the exact CV version used.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px', maxWidth: 760, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%', padding: '18px 24px', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center',
                    background: 'none', textAlign: 'left', fontWeight: 700,
                    fontSize: 'var(--text-md)', color: 'var(--text)'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 24px 20px', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px', background: 'var(--primary)', color: '#FFFFFF', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Ready to stand out for your dream job?
          </h2>
          <p style={{ fontSize: 'var(--text-md)', opacity: 0.9, lineHeight: 1.6, marginBottom: 32 }}>
            Upload your CV now and get a comprehensive match analysis in seconds.
          </p>
          <Link to="/register" className="btn btn-lg" style={{ background: '#FFFFFF', color: 'var(--primary)', fontWeight: 700 }}>
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0F172A', color: '#94A3B8', padding: '48px 24px', fontSize: 'var(--text-sm)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: '#FFFFFF' }}>
              Hire<span style={{ color: 'var(--primary)' }}>Fit</span>
            </span>
            <p style={{ fontSize: 'var(--text-xs)', marginTop: 4 }}>
              Production AI CV Optimization & Job Matching Platform
            </p>
          </div>
          <div style={{ fontSize: 'var(--text-xs)' }}>
            © {new Date().getFullYear()} HireFit. Designed for genuine career growth.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
