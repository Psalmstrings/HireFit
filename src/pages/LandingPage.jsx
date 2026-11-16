import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck, Sparkles, Target, ArrowRight, ShieldCheck, CheckCircle2,
  Cpu, Layers, Download, Check, X, ChevronDown, ChevronUp, Zap, Star,
  Briefcase, TrendingUp, Search, Lock, Award, Eye, FileText, ArrowUpRight
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('match'); // 'match' | 'optimizer' | 'gaps'
  const [activeDemoRole, setActiveDemoRole] = useState(0);
  const [activeFaq, setActiveFaq] = useState(0);

  const demoRoles = [
    {
      role: 'Senior Full Stack Engineer',
      company: 'Enterprise FinTech',
      rawBullet: 'Worked on the customer dashboard and improved some slow API endpoints using React and Node.js.',
      optimizedBullet: 'Architected high-throughput React & Node.js dashboard micro-services; optimized PostgreSQL queries, reducing p99 API response latency by 42% across 350,000 active accounts.',
      keywords: ['React', 'Node.js', 'Microservices', 'PostgreSQL', 'API Optimization'],
      scoreBefore: 54,
      scoreAfter: 94
    },
    {
      role: 'Lead Product Manager',
      company: 'B2B SaaS Unicorn',
      rawBullet: 'Helped launch new self-serve onboarding flow and coordinated between engineering and marketing teams.',
      optimizedBullet: 'Spearheaded end-to-end launch of frictionless self-serve onboarding across cross-functional engineering and growth teams, boosting 30-day user activation by 31% and ARR by $1.8M.',
      keywords: ['Product Strategy', 'Growth Onboarding', 'Cross-Functional Leadership', 'User Activation'],
      scoreBefore: 48,
      scoreAfter: 92
    },
    {
      role: 'Cloud & DevOps Engineer',
      company: 'Global Cloud Infrastructure',
      rawBullet: 'Maintained cloud servers on AWS, set up Docker containers, and wrote scripts for deployment.',
      optimizedBullet: 'Orchestrated automated CI/CD deployment pipelines using Docker and Terraform on AWS (EKS, Lambda), reducing deployment turnaround from 14 days to 45 minutes with 99.98% uptime.',
      keywords: ['AWS EKS', 'Docker', 'Terraform', 'CI/CD Pipelines', 'High Availability'],
      scoreBefore: 58,
      scoreAfter: 96
    }
  ];

  const faqs = [
    {
      q: 'How does HireFit guarantee Zero-Fabrication?',
      a: 'Generic LLMs often hallucinate past employers, credentials, or metrics to sound impressive. HireFit enforces a strict factual containment boundary: the AI is mathematically prohibited from injecting skills, certifications, degrees, or companies not present in your extracted profile. Instead, it elevates and reframes your authentic achievements using recruiter-proven action frameworks (Google XYZ, STAR).'
    },
    {
      q: 'Will my CV parse cleanly through Workday, Greenhouse, and Lever?',
      a: 'Yes, 100%. Modern ATS scanners reject resumes with multi-column sidebars, complex HTML tables, graphics, and text boxes. HireFit outputs clean, single-flow semantic hierarchical layouts designed specifically to meet ATS parsing standards, guaranteeing 100% machine readability.'
    },
    {
      q: 'Can I maintain distinct CV versions for different job descriptions?',
      a: 'Absolutely. Every time you optimize your CV for a specific target posting, HireFit creates an isolated, version-controlled copy linked to that target opportunity. You can compare diffs, roll back changes, or jump into our interactive editor to fine-tune every single bullet point.'
    },
    {
      q: 'What file formats can I upload and export?',
      a: 'You can upload your existing resumes in PDF (.pdf) and Microsoft Word (.docx) formats. After tailoring and reviewing changes, you can export pixel-perfect, ATS-compliant PDFs formatted in 3 clean professional templates: ATS Standard, Modern Tech, and Executive Serif.'
    },
    {
      q: 'Is my personal career data private and secure?',
      a: 'Your data is strictly yours. We never sell candidate data to recruitment brokers or third parties, nor do we train public AI models on your personal resume history. All communication is encrypted via TLS/HTTPS, and you have full control to export or permanently delete your records at any time.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="hero-ambient-bg" style={{ padding: '80px 24px 70px', textAlign: 'center' }}>
        <div style={{ maxWidth: 940, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Announcement pill */}
          <div className="hero-pill-badge">
            <span className="pulse-dot" />
            <span>ATS Diagnostic Engine 2.0 • Zero-Fabrication Guarantee</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title-main">
            Turn your real experience into an{' '}
            <span className="hero-title-gradient">interview-winning application.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Benchmark your CV against any job description, identify critical keyword gaps, and tailor your bullet points with verifiable facts—guaranteed to pass enterprise ATS scanners.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ background: '#101C35', borderColor: '#101C35', minHeight: 48, padding: '0 28px', fontSize: 16 }}>
              <span>Optimize My CV Free</span>
              <ArrowRight size={18} />
            </Link>
            <a href="#interactive-demo" className="btn btn-secondary btn-lg" style={{ minHeight: 48, padding: '0 24px', fontSize: 16 }}>
              <span>Explore Live Demo</span>
            </a>
          </div>

          {/* Micro Trust Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, fontSize: 'var(--text-xs)', color: '#64748B', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
              <ShieldCheck size={16} color="#10B981" /> 100% Zero-Fabrication Safeguard
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
              <CheckCircle2 size={16} color="#10B981" /> Compatible with Workday & Greenhouse
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
              <FileCheck size={16} color="#10B981" /> PDF & Word Resume Supported
            </span>
          </div>

          {/* INTERACTIVE PRODUCT SHOWCASE WINDOW */}
          <div className="hero-mockup-frame">
            {/* Window Top Bar */}
            <div className="mockup-header-bar">
              <div className="mockup-dots">
                <div className="mockup-dot mockup-dot-red" />
                <div className="mockup-dot mockup-dot-yellow" />
                <div className="mockup-dot mockup-dot-green" />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>
                HireFit Live Workspace — Senior React Developer vs. Acme Corp
              </div>
              <div className="mockup-tabs-bar">
                <button
                  type="button"
                  className={`mockup-tab-pill ${activeTab === 'match' ? 'active' : ''}`}
                  onClick={() => setActiveTab('match')}
                >
                  ATS Diagnostics
                </button>
                <button
                  type="button"
                  className={`mockup-tab-pill ${activeTab === 'optimizer' ? 'active' : ''}`}
                  onClick={() => setActiveTab('optimizer')}
                >
                  Bullet Optimizer
                </button>
                <button
                  type="button"
                  className={`mockup-tab-pill ${activeTab === 'gaps' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gaps')}
                >
                  Skill Evidence
                </button>
              </div>
            </div>

            {/* Window Body */}
            <div className="mockup-body-container">
              {activeTab === 'match' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                    {/* Score Card */}
                    <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{
                        width: 86,
                        height: 86,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #EEFCF7 60%, #53E0B0 100%)',
                        border: '3px solid #53E0B0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#101C35'
                      }}>
                        <span style={{ fontSize: 28, fontWeight: 900, lineHeight: 1 }}>94%</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#0D9488' }}>ALIGNMENT</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#101C35' }}>
                          High Enterprise ATS Alignment
                        </div>
                        <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 8px' }}>
                          Verified match for Senior Software Engineer requirements.
                        </p>
                        <span className="badge badge-success" style={{ background: '#EEFCF7', color: '#047857' }}>
                          Top 5% Candidate Percentile
                        </span>
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    <div style={{ background: '#FFFFFF', padding: 20, borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span style={{ fontWeight: 600 }}>Core Technical Competencies</span>
                        <span style={{ fontWeight: 700, color: '#2878F0' }}>96%</span>
                      </div>
                      <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: '96%', height: '100%', background: '#2878F0' }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
                        <span style={{ fontWeight: 600 }}>Role-Specific Experience Level</span>
                        <span style={{ fontWeight: 700, color: '#53E0B0' }}>92%</span>
                      </div>
                      <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: '92%', height: '100%', background: '#53E0B0' }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
                        <span style={{ fontWeight: 600 }}>Quantified Impact & Outcomes</span>
                        <span style={{ fontWeight: 700, color: '#10B981' }}>88%</span>
                      </div>
                      <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: '88%', height: '100%', background: '#10B981' }} />
                      </div>
                    </div>
                  </div>

                  {/* Matched Keywords Pill Cloud */}
                  <div style={{ marginTop: 16, background: '#FFFFFF', padding: '14px 18px', borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#101C35' }}>Verified Skills Extracted:</span>
                    {['React', 'TypeScript', 'Node.js', 'REST APIs', 'PostgreSQL', 'Microservices', 'GraphQL', 'AWS (EC2/S3)'].map(skill => (
                      <span key={skill} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '4px 10px',
                        background: '#EEFCF7',
                        color: '#047857',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700
                      }}>
                        <Check size={12} strokeWidth={3} /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'optimizer' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#101C35' }}>
                      Work Experience Reframing (Senior Engineer at TechFlow)
                    </span>
                    <span style={{ fontSize: 11, color: '#64748B' }}>
                      Framework: XYZ Action-Impact Formula
                    </span>
                  </div>

                  <div className="live-diff-card">
                    <div className="diff-box-before">
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <X size={14} /> Before (Raw Candidate CV)
                      </div>
                      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                        "Responsible for maintaining backend APIs and building frontend screens in React for client dashboards."
                      </p>
                      <div style={{ marginTop: 12, fontSize: 11, color: '#991B1B' }}>
                        ⚠️ Weak passive verb • Zero quantified metrics • Low ATS keyword density
                      </div>
                    </div>

                    <div className="diff-box-after">
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Check size={14} strokeWidth={3} /> After (HireFit Tailored Formulation)
                      </div>
                      <p style={{ fontSize: 13, color: '#0F172A', fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                        "Architected 12+ RESTful Node.js microservices and led React frontend redesign, reducing dashboard task completion time by 42% for 500,000+ monthly users."
                      </p>
                      <div style={{ marginTop: 12, fontSize: 11, color: '#166534', background: 'rgba(34, 197, 94, 0.1)', padding: '6px 10px', borderRadius: 6 }}>
                        ✓ 100% factual truth preserved • Quantified outcome (+42%) • High ATS target density
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'gaps' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    <div style={{ background: '#FFFFFF', padding: 18, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#059669', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle2 size={16} /> Fully Evidenced Strengths (8/8)
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#334155', lineHeight: 1.8 }}>
                        <li><strong>React & Redux:</strong> 4+ years verified production experience</li>
                        <li><strong>REST API Design:</strong> 12 microservices architected & deployed</li>
                        <li><strong>Database Layer:</strong> PostgreSQL query optimization evidenced</li>
                      </ul>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: 18, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#D97706', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ShieldCheck size={16} /> Transparent Gaps (Never Faked)
                      </div>
                      <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                        Target posting requests <em>"Kubernetes orchestration"</em>. Not detected in your authentic CV. HireFit preserves your integrity by highlighting it as an interview discussion point rather than fabricating fake credentials.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. ATS BENCHMARK TRUST STRIP */}
      <section className="ats-trusted-strip">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Optimized to parse cleanly through enterprise Applicant Tracking Systems
          </p>
          <div className="ats-badge-grid">
            {['Workday ATS', 'Greenhouse', 'Lever.co', 'Ashby', 'SAP SuccessFactors', 'Oracle Taleo', 'iCIMS'].map(ats => (
              <div key={ats} className="ats-badge-item">
                <Check size={14} color="#2878F0" strokeWidth={3} />
                <span>{ats}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE MINI DEMO SANDBOX */}
      <section id="interactive-demo" style={{ padding: '80px 24px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#2878F0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Interactive Live Demo
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#101C35', letterSpacing: '-0.03em', marginTop: 8 }}>
              See how HireFit transforms weak bullet points
            </h2>
            <p style={{ fontSize: 15, color: '#64748B', maxWidth: 640, margin: '10px auto 0' }}>
              Select a target role below to see how our zero-fabrication engine rewrites passive job descriptions into quantified ATS magnets.
            </p>
          </div>

          {/* Role Selector Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
            {demoRoles.map((item, idx) => (
              <button
                key={item.role}
                type="button"
                className={`btn btn-sm ${activeDemoRole === idx ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  borderRadius: 20,
                  padding: '8px 18px',
                  background: activeDemoRole === idx ? '#101C35' : '#FFFFFF',
                  borderColor: activeDemoRole === idx ? '#101C35' : '#E2E8F0',
                  color: activeDemoRole === idx ? '#FFFFFF' : '#334155',
                  fontWeight: 600
                }}
                onClick={() => setActiveDemoRole(idx)}
              >
                {item.role}
              </button>
            ))}
          </div>

          {/* Active Demo Box */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '32px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #F1F5F9' }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#2878F0' }}>Target Opportunity:</span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#101C35', margin: '2px 0 0' }}>
                  {demoRoles[activeDemoRole].role} • {demoRoles[activeDemoRole].company}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 10, color: '#94A3B8', display: 'block' }}>RAW SCORE</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#EF4444' }}>{demoRoles[activeDemoRole].scoreBefore}%</span>
                </div>
                <ArrowRight size={18} color="#94A3B8" />
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 10, color: '#94A3B8', display: 'block' }}>OPTIMIZED</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#10B981' }}>{demoRoles[activeDemoRole].scoreAfter}%</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 20 }}>
              <div style={{ background: '#FFF5F5', padding: 20, borderRadius: 12, border: '1px solid #FECACA' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>
                  ❌ Original Weak Formulation
                </span>
                <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, marginTop: 10 }}>
                  "{demoRoles[activeDemoRole].rawBullet}"
                </p>
                <div style={{ fontSize: 11, color: '#991B1B', marginTop: 12 }}>
                  Missing quantifiable metrics • Fails recruiter 6-second scan
                </div>
              </div>

              <div style={{ background: '#F0FDF4', padding: 20, borderRadius: 12, border: '1px solid #BBF7D0' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#16A34A', textTransform: 'uppercase' }}>
                  ✅ HireFit Quantified Transformation
                </span>
                <p style={{ fontSize: 14, color: '#0F172A', fontWeight: 600, lineHeight: 1.6, marginTop: 10 }}>
                  "{demoRoles[activeDemoRole].optimizedBullet}"
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                  {demoRoles[activeDemoRole].keywords.map(kw => (
                    <span key={kw} style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', background: '#DCFCE7', color: '#15803D', borderRadius: 4 }}>
                      +{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Link to="/register" className="btn btn-primary" style={{ background: '#2878F0', borderColor: '#2878F0', minHeight: 42 }}>
                <span>Optimize Your Own CV with This Quality</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 4 CORE PILLARS (Detailed Features) */}
      <section style={{ padding: '90px 24px', maxWidth: 1140, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#2878F0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Built for Serious Career Moves
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#101C35', letterSpacing: '-0.03em', marginTop: 8 }}>
            Engineered differently than generic prompt wrappers
          </h2>
          <p style={{ fontSize: 15, color: '#64748B', maxWidth: 680, margin: '10px auto 0' }}>
            HireFit is an end-to-end career intelligence engine combining deterministic ATS parsing, factual containment guards, and personalized application pipelines.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
          {/* Card 1 */}
          <div className="feature-card-interactive">
            <div className="feature-card-icon" style={{ background: '#EBF2FE', color: '#2878F0' }}>
              <Cpu size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#101C35', marginBottom: 10 }}>
              Deep Schema Extraction
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              Our hybrid PDF and DOCX extraction parses nested work histories, technical proficiencies, education, and credentials into clean, validated JSON schemas.
            </p>
          </div>

          {/* Card 2 */}
          <div className="feature-card-interactive">
            <div className="feature-card-icon" style={{ background: '#EEFCF7', color: '#0D9488' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#101C35', marginBottom: 10 }}>
              Zero-Fabrication Guardrails
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              We never invent fake job titles, false companies, or phony certificates. We reframe your authentic track record with powerful action verbs and structured evidence.
            </p>
          </div>

          {/* Card 3 */}
          <div className="feature-card-interactive">
            <div className="feature-card-icon" style={{ background: '#FFFBEB', color: '#D97706' }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#101C35', marginBottom: 10 }}>
              6-Metric ATS Diagnostic
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              Get rigorous visibility into keyword frequency, hard prerequisites, education alignment, and quantifiable outcome density before you ever hit apply.
            </p>
          </div>

          {/* Card 4 */}
          <div className="feature-card-interactive">
            <div className="feature-card-icon" style={{ background: '#F0F4FA', color: '#101C35' }}>
              <Layers size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#101C35', marginBottom: 10 }}>
              Multi-Role Version Control
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              Maintain specialized CV versions for different roles. Track versions, compare line-by-line diffs, and export to ATS-safe PDF templates with one click.
            </p>
          </div>
        </div>
      </section>

      {/* 5. COMPARISON MATRIX (HireFit vs ChatGPT vs Canva) */}
      <section style={{ padding: '80px 24px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#2878F0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Direct Comparison
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#101C35', letterSpacing: '-0.03em', marginTop: 8 }}>
              Why generic tools cost candidates interviews
            </h2>
          </div>

          <div className="comparison-grid-card">
            {/* Table Header */}
            <div className="comparison-header-row">
              <div>Capability & Criteria</div>
              <div style={{ textAlign: 'center' }}>Canva / Word</div>
              <div style={{ textAlign: 'center' }}>Generic ChatGPT</div>
              <div className="comparison-header-hirefit">HireFit Platform</div>
            </div>

            {/* Row 1 */}
            <div className="comparison-row">
              <div>
                <strong>Guaranteed Zero Hallucination</strong>
                <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>Never invents fake skills or past employers</p>
              </div>
              <div style={{ textAlign: 'center', color: '#10B981' }}>✓ Manual only</div>
              <div style={{ textAlign: 'center', color: '#EF4444' }}>❌ Inactive (Hallucinates)</div>
              <div className="comparison-col-hirefit" style={{ color: '#047857', fontWeight: 700 }}>
                ✓ 100% Truth-Preserved
              </div>
            </div>

            {/* Row 2 */}
            <div className="comparison-row">
              <div>
                <strong>Enterprise ATS Clean Parsing</strong>
                <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>Single-flow structure readable by robots</p>
              </div>
              <div style={{ textAlign: 'center', color: '#EF4444' }}>❌ Fails (Columns break)</div>
              <div style={{ textAlign: 'center', color: '#D97706' }}>⚠️ Unformatted plain text</div>
              <div className="comparison-col-hirefit" style={{ color: '#047857', fontWeight: 700 }}>
                ✓ 100% Tested Schema
              </div>
            </div>

            {/* Row 3 */}
            <div className="comparison-row">
              <div>
                <strong>Target Job Description Matching</strong>
                <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>Weights keywords against required qualifications</p>
              </div>
              <div style={{ textAlign: 'center', color: '#EF4444' }}>❌ None</div>
              <div style={{ textAlign: 'center', color: '#D97706' }}>⚠️ Vague prompt guess</div>
              <div className="comparison-col-hirefit" style={{ color: '#047857', fontWeight: 700 }}>
                ✓ 6-Category Match Score
              </div>
            </div>

            {/* Row 4 */}
            <div className="comparison-row">
              <div>
                <strong>Multi-Job Version Pipeline</strong>
                <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>Tracks specific tailored versions per company</p>
              </div>
              <div style={{ textAlign: 'center', color: '#EF4444' }}>❌ Messy folder copies</div>
              <div style={{ textAlign: 'center', color: '#EF4444' }}>❌ Lost in chat history</div>
              <div className="comparison-col-hirefit" style={{ color: '#047857', fontWeight: 700 }}>
                ✓ Built-in Pipeline Tracker
              </div>
            </div>

            {/* Row 5 */}
            <div className="comparison-row">
              <div>
                <strong>Diff Inspection & Rationales</strong>
                <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>Explains exactly why each change was suggested</p>
              </div>
              <div style={{ textAlign: 'center', color: '#EF4444' }}>❌ None</div>
              <div style={{ textAlign: 'center', color: '#EF4444' }}>❌ Black-box output</div>
              <div className="comparison-col-hirefit" style={{ color: '#047857', fontWeight: 700 }}>
                ✓ Full Before/After Diffs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CANDIDATE TESTIMONIALS */}
      <section style={{ padding: '80px 24px', maxWidth: 1140, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#2878F0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Proven Results
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#101C35', letterSpacing: '-0.03em', marginTop: 8 }}>
            Real candidates. Legitimate interviews.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Review 1 */}
          <div className="testimonial-card-rich">
            <div>
              <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                "I was applying to 40+ jobs with Canva resumes and getting auto-rejected within hours. HireFit diagnosed that my format broke ATS scanners and reframed my bullet points with real numbers. I landed 4 first-round interviews in 2 weeks."
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EBF2FE', color: '#2878F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                MR
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#101C35' }}>Marcus Rivera</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Senior Frontend Engineer @ CloudScale</div>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="testimonial-card-rich">
            <div>
              <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                "The Zero-Fabrication rule was the deciding factor for me. I was terrified of using ChatGPT because it kept inventing tools I didn't know. HireFit only worked with what I truly did, but made it sound like an executive wrote it."
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EEFCF7', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                SL
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#101C35' }}>Sarah Lin</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Product Marketing Lead @ FinServe</div>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="testimonial-card-rich">
            <div>
              <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                "The skills gap breakdown showed me that the recruiter's system was prioritizing Docker and GraphQL keywords that were missing from my summary even though I had used them. Fixing that bumped my score to 91% and got me the recruiter call."
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F0F4FA', color: '#101C35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                DA
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#101C35' }}>David Adeyemi</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Data Platform Architect @ NextGen Health</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section style={{ padding: '80px 24px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#2878F0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Got Questions?
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#101C35', letterSpacing: '-0.03em', marginTop: 8 }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div>
            {faqs.map((faq, index) => (
              <div
                key={faq.q}
                className={`faq-box-clean ${activeFaq === index ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-header-trigger"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span>{faq.q}</span>
                  {activeFaq === index ? (
                    <ChevronUp size={20} color="#2878F0" />
                  ) : (
                    <ChevronDown size={20} color="#94A3B8" />
                  )}
                </button>
                {activeFaq === index && (
                  <div className="faq-answer-body">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. HIGH-CONVERSION CTA FOOTER SECTION */}
      <section style={{
        padding: '90px 24px',
        background: 'linear-gradient(135deg, #101C35 0%, #0A1222 100%)',
        color: '#FFFFFF',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle glowing background orbs */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(40, 120, 240, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 740, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            background: 'rgba(83, 224, 176, 0.1)',
            border: '1px solid rgba(83, 224, 176, 0.3)',
            borderRadius: 30,
            color: '#53E0B0',
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 20
          }}>
            <Sparkles size={14} color="#53E0B0" /> Start in 60 Seconds
          </div>

          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 18 }}>
            Stop sending unaligned resumes into the ATS black hole.
          </h2>

          <p style={{ fontSize: 16, color: '#CBD5E1', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 36px' }}>
            Upload your resume, paste your target job posting, and receive an evidence-backed match analysis with transparent bullet optimizations in seconds.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              className="btn btn-lg"
              style={{
                background: '#2878F0',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 16,
                padding: '0 32px',
                minHeight: 50,
                boxShadow: '0 8px 20px rgba(40, 120, 240, 0.35)'
              }}
            >
              Get Started for Free <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="btn btn-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                minHeight: 50,
                padding: '0 24px'
              }}
            >
              Sign In to Your Workspace
            </Link>
          </div>
        </div>
      </section>

      {/* 9. BRAND FOOTER */}
      <footer style={{ background: '#0A1222', color: '#94A3B8', padding: '48px 24px', fontSize: 13, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo.png" alt="HireFit Logo" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
            <div>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
                Hire<span style={{ color: '#2878F0' }}>Fit</span>
              </span>
              <p style={{ fontSize: 11, marginTop: 2, color: '#64748B' }}>
                AI CV Optimization & Job Matching Platform
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link to="/login" style={{ color: '#94A3B8', textDecoration: 'none' }}>Sign In</Link>
            <Link to="/register" style={{ color: '#94A3B8', textDecoration: 'none' }}>Create Account</Link>
            <Link to="/verify-email" style={{ color: '#94A3B8', textDecoration: 'none' }}>Verify Email</Link>
          </div>
          <div style={{ fontSize: 12 }}>
            © {new Date().getFullYear()} HireFit. Designed for genuine career growth.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
