import React, { useEffect, useState } from 'react';
import styles from './StartupCard.module.css';
import { getStartups } from '../services/startupAPI';  // 📚 Naya source

const demoStartups = [
  {
    name: 'GreenTech Solutions',
    studentName: 'John Doe',
    problem_statement: 'High energy consumption in residential areas leads to increased carbon footprint.',
    solution_approach: 'Smart home devices optimize energy usage through AI, reducing waste and costs.',
    business_model: 'Subscription-based service with a one-time setup fee.',
    market_audience: 'Homeowners, renters, property managers interested in sustainability.',
    funding_required: '$500,000',
    category: 'Sustainable Technology'
  },
  {
    name: 'EduFuture',
    studentName: 'Jane Smith',
    problem_statement: 'Traditional education systems lack personalization.',
    solution_approach: 'AI-driven platform tailoring learning experiences to individual needs.',
    business_model: 'Freemium model with premium personalized learning paths.',
    market_audience: 'Students, educators, educational institutions.',
    funding_required: '$300,000',
    category: 'EdTech'
  },
  {
    name: 'HealthTrack',
    studentName: 'Mike Johnson',
    problem_statement: 'Lack of accessible, real-time health monitoring for chronic patients.',
    solution_approach: 'Wearable device monitoring vitals with mobile app integration.',
    business_model: 'Direct-to-consumer sales with subscription for advanced analytics.',
    market_audience: 'Chronic patients, healthcare providers.',
    funding_required: '$750,000',
    category: 'HealthTech'
  },
];

const StartupCard = () => {
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    const fetchStartups = async () => {
      const fetchedStartups = await getStartups();
      setStartups(fetchedStartups);
    };

    fetchStartups();
  }, []);

  const combinedStartups = [...demoStartups, ...startups]; // 💥 Purana + Naya

  return (
    <div className={styles.startupList}>
      {combinedStartups.length === 0 ? (
        <p className={styles.noStartups}>🚫 No startups submitted yet!</p>
      ) : (
        combinedStartups.map((startup, index) => (
          <div key={index} className={styles.startupCard}>
            <h3 className={styles.name}>{startup.name}</h3>
            <p className={styles.studentName}>👤 {startup.studentName}</p>
            <p><strong>Problem:</strong> {startup.problem_statement}</p>
            <p><strong>Solution:</strong> {startup.solution_approach}</p>
            <p><strong>Business Model:</strong> {startup.business_model}</p>
            <p><strong>Market Audience:</strong> {startup.market_audience}</p>
            <p><strong>Funding Required:</strong> {startup.funding_required}</p>
            <p><strong>Category:</strong> {startup.category}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default StartupCard;
