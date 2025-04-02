// StartupCard.js
import React, { useState } from 'react';
import styles from './StartupCard.module.css';

// Array of demo startups
const demoStartups = [
  {
    name: 'GreenTech Solutions',
    studentName: 'John Doe',
    problem_statement: 'High energy consumption in residential areas leads to increased carbon footprint.',
    solution_approach: 'We develop smart home devices that optimize energy usage through AI, reducing waste and costs.',
    business_model: 'Subscription-based service with a one-time setup fee.',
    market_audience: 'Homeowners, renters, and property managers interested in sustainability.',
    funding_required: '$500,000',
    category: 'Sustainable Technology'
  },
  {
    name: 'EduFuture',
    studentName: 'Jane Smith',
    problem_statement: 'Traditional education systems lack personalization.',
    solution_approach: 'An AI-driven platform that tailors learning experiences to individual student needs.',
    business_model: 'Freemium model with premium personalized learning paths.',
    market_audience: 'Students, educators, and educational institutions.',
    funding_required: '$300,000',
    category: 'EdTech'
  },
  {
    name: 'HealthTrack',
    studentName: 'Mike Johnson',
    problem_statement: 'Lack of accessible, real-time health monitoring for chronic disease patients.',
    solution_approach: 'A wearable device that monitors vital signs and integrates with a mobile app for real-time health tracking and alerts.',
    business_model: 'Direct-to-consumer sales with a subscription for advanced analytics.',
    market_audience: 'Patients with chronic conditions, healthcare providers.',
    funding_required: '$750,000',
    category: 'HealthTech'
  },
  {
    name: 'FoodChain',
    studentName: 'Emily White',
    problem_statement: 'Food waste is a significant issue in the supply chain.',
    solution_approach: 'An IoT solution that tracks food from farm to table, optimizing inventory and reducing waste through predictive analytics.',
    business_model: 'B2B model, selling to grocery chains and food distributors.',
    market_audience: 'Grocery stores, food distributors, and restaurants.',
    funding_required: '$600,000',
    category: 'AgriTech'
  },
  {
    name: 'SafeRoute',
    studentName: 'David Lee',
    problem_statement: 'Urban safety concerns for pedestrians and cyclists.',
    solution_approach: 'A mobile app that uses real-time data to suggest the safest routes based on crime statistics, traffic, and weather conditions.',
    business_model: 'Ad-supported with premium features for detailed safety analytics.',
    market_audience: 'City dwellers, especially those who walk or cycle regularly.',
    funding_required: '$250,000',
    category: 'UrbanTech'
  },
  {
    name: 'VR Therapy',
    studentName: 'Sarah Chen',
    problem_statement: 'Limited access to mental health therapy in remote areas.',
    solution_approach: 'Virtual Reality therapy sessions that can be conducted remotely, providing immersive environments for various therapeutic treatments.',
    business_model: 'Pay-per-session with monthly subscription options for regular users.',
    market_audience: 'Individuals in remote locations, mental health professionals.',
    funding_required: '$400,000',
    category: 'HealthTech'
  },
  {
    name: 'EcoPack',
    studentName: 'Tom Harris',
    problem_statement: 'Plastic pollution from packaging is harming the environment.',
    solution_approach: 'Biodegradable packaging solutions made from agricultural waste, offering an eco-friendly alternative to plastic.',
    business_model: 'B2B sales to manufacturers and retailers looking for sustainable packaging options.',
    market_audience: 'Retailers, manufacturers, environmentally conscious consumers.',
    funding_required: '$800,000',
    category: 'GreenTech'
  },
  {
    name: 'SmartGrid',
    studentName: 'Lisa Nguyen',
    problem_statement: 'Inefficient energy distribution leading to power outages and waste.',
    solution_approach: 'A smart grid system that uses AI to predict and manage energy distribution, reducing outages and optimizing energy use.',
    business_model: 'Partnerships with utility companies, revenue from efficiency savings.',
    market_audience: 'Utility companies, municipalities, energy consumers.',
    funding_required: '$1,000,000',
    category: 'EnergyTech'
  },
  {
    name: 'PetConnect',
    studentName: 'Alex Rodriguez',
    problem_statement: 'Pet owners struggle with finding reliable pet care services.',
    solution_approach: 'A platform that connects pet owners with verified pet sitters, groomers, and veterinarians, including real-time updates and booking.',
    business_model: 'Commission on each transaction, premium listings for service providers.',
    market_audience: 'Pet owners, pet care professionals.',
    funding_required: '$150,000',
    category: 'PetTech'
  },
  {
    name: 'ArtisanHub',
    studentName: 'Rachel Kim',
    problem_statement: 'Local artisans have difficulty reaching a broader market.',
    solution_approach: 'An online marketplace that focuses on handcrafted goods, providing artisans with tools for e-commerce, marketing, and logistics.',
    business_model: 'Transaction fees, premium features for enhanced visibility and sales tools.',
    market_audience: 'Artisans, craft enthusiasts, consumers looking for unique products.',
    funding_required: '$200,000',
    category: 'E-commerce'
  }
];

const StartupCard = () => {
  const [startups, setStartups] = useState(demoStartups);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSave = (e, index) => {
    e.preventDefault();
    // Simulate saving the edited data
    setEditStatus('saved');
    setEditingIndex(null);
    // Here you would typically send a PATCH request to update the startup data
    setTimeout(() => {
      setEditStatus('');
    }, 3000);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setStartups(prevStartups => {
      const newStartups = [...prevStartups];
      newStartups[index] = {
        ...newStartups[index],
        [name]: value
      };
      return newStartups;
    });
  };

  return (
    <div className={styles.cardContainer}>
      {startups.map((startup, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.header}>
            <h3 className={styles.cardTitle}>{startup.name}</h3>
            <p className={styles.studentName}><strong>Student:</strong> {startup.studentName}</p>
          </div>
          <div className={styles.body}>
            {editingIndex === index ? (
              <form onSubmit={(e) => handleSave(e, index)}>
                <div className={styles.formGroup}>
                  <label htmlFor={`problem_statement_${index}`} className={styles.label}>Problem Statement</label>
                  <textarea id={`problem_statement_${index}`} name="problem_statement" value={startup.problem_statement} onChange={(e) => handleChange(e, index)} className={styles.textarea}></textarea>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor={`solution_approach_${index}`} className={styles.label}>Solution Approach</label>
                  <textarea id={`solution_approach_${index}`} name="solution_approach" value={startup.solution_approach} onChange={(e) => handleChange(e, index)} className={styles.textarea}></textarea>
                </div>
                <button type="submit" className={styles.saveButton}>Save Changes</button>
                {editStatus === 'saved' && <p className={styles.successMessage}>Changes saved successfully!</p>}
              </form>
            ) : (
              <>
                <p className={styles.sectionTitle}>Problem Statement</p>
                <p className={styles.cardText}>{startup.problem_statement}</p>
                <p className={styles.sectionTitle}>Solution Approach</p>
                <p className={styles.cardText}>{startup.solution_approach}</p>
                <p className={styles.sectionTitle}>Business Model</p>
                <p className={styles.cardText}>{startup.business_model}</p>
                <p className={styles.sectionTitle}>Market Audience</p>
                <p className={styles.cardText}>{startup.market_audience}</p>
                <p className={styles.sectionTitle}>Funding Required</p>
                <p className={styles.cardText}>{startup.funding_required}</p>
                <p className={styles.sectionTitle}>Category</p>
                <p className={styles.cardText}>{startup.category}</p>
              </>
            )}
          </div>
          {!editingIndex && <button onClick={() => handleEdit(index)} className={styles.patchButton}>Patch</button>}
        </div>
      ))}
    </div>
  );
};

export default StartupCard;