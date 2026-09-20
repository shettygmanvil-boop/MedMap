import { Link } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';

export function LandingPage() {
  return (
    <>
      <Badge text="The project is under development." />
      
      <div className="container">
        <header>
          <div className="logo">MedMap</div>
          <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Link to="/patient">Patient Onboarding</Link>
            <Link to="/patient/intake">Intake</Link>
            <Link to="/patient/documents">Documents</Link>
            <Link to="/patient/verification">Verification</Link>
            <Link to="/doctor/cases">Doctor Cases</Link>
          </nav>
        </header>

        <main>
          <section className="hero">
            <h1>AI-powered pre-consultation patient case-taking platform.</h1>
            <p>
              MedMap is an AI-powered pre-consultation platform that helps patients provide their medical history through voice or touch and upload their previous medical documents. AI organizes the information from the conversation and documents into a unified clinical case, including a chronological view of relevant medical information. Patients can verify important information before it reaches the doctor, helping the doctor begin the consultation with a structured pre-consultation brief.
            </p>
          </section>

          <section className="cards-grid">
            <Card 
              title="Voice & Touch Intake" 
              description="Patients easily provide their medical history through an intuitive conversational interface using voice or touch, capturing nuances accurately." 
            />
            <Card 
              title="Document Upload" 
              description="Securely upload previous medical records, test results, and notes, allowing the system to extract and contextualize past health data." 
            />
            <Card 
              title="Unified Clinical Case" 
              description="AI intelligently organizes all conversation inputs and documents into a structured, chronological view of relevant medical information." 
            />
            <Card 
              title="Patient Verification" 
              description="Patients maintain control by verifying the accuracy of the compiled information before it is submitted to the healthcare provider." 
              highlightVerify={true}
            />
            <Card 
              title="Pre-consultation Brief" 
              description="Doctors receive a verified, clearly structured brief before the consultation begins, saving time and improving care quality." 
            />
          </section>
        </main>
      </div>
    </>
  );
}
