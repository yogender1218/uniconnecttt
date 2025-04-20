import React, { useState } from 'react';
import styles from './StartupForm.module.css';
import { submitStartup } from '../services/startupAPI';  // 🔗 Apni nayi local service se connect

const StartupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    problem_statement: '',
    solution_approach: '',
    business_model: '',
    market_audience: '',
    funding_required: '',
    category: ''
  });

  const [submissionStatus, setSubmissionStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await submitStartup(formData);  // 🎯 Local submit
      setSubmissionStatus('success');
      setErrorMessage('');
      setFormData({
        name: '',
        problem_statement: '',
        solution_approach: '',
        business_model: '',
        market_audience: '',
        funding_required: '',
        category: ''
      });

      setTimeout(() => setSubmissionStatus(''), 3000);

    } catch (error) {
      setErrorMessage(error || '⚠️ Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Submit Your Startup Idea</h2>

      {submissionStatus === 'success' && (
        <p className={styles.successMessage}>✅ Submitted successfully!</p>
      )}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      {[
        { label: 'Startup Name', name: 'name', type: 'text' },
        { label: 'Problem Statement', name: 'problem_statement', type: 'textarea' },
        { label: 'Solution Approach', name: 'solution_approach', type: 'textarea' },
        { label: 'Business Model', name: 'business_model', type: 'text' },
        { label: 'Market Audience', name: 'market_audience', type: 'text' },
        { label: 'Funding Required', name: 'funding_required', type: 'number' },
        { label: 'Category', name: 'category', type: 'text' }
      ].map(({ label, name, type }) => (
        <div className={styles.formGroup} key={name}>
          <label htmlFor={name} className={styles.label}>{label}</label>
          {type === 'textarea' ? (
            <textarea
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className={styles.textarea}
              required
            />
          ) : (
            <input
              type={type}
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className={styles.input}
              required
            />
          )}
        </div>
      ))}

      <button type="submit" className={styles.submitButton}>🚀 Submit Idea</button>
    </form>
  );
};

export default StartupForm;
