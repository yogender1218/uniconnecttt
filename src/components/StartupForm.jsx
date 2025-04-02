import React, { useState } from 'react';
import styles from './StartupForm.module.css';

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

const handleChange = (e) => {
const { name, value } = e.target;
setFormData(prevState => ({
...prevState,
[name]: value
}));
};

const handleSubmit = (e) => {
e.preventDefault();
// Simulate successful submission
setSubmissionStatus('success');
// Reset the form
setFormData({
name: '',
problem_statement: '',
solution_approach: '',
business_model: '',
market_audience: '',
funding_required: '',
category: ''
});
// Clear the success message after a few seconds
setTimeout(() => {
setSubmissionStatus('');
}, 3000);
};

return (
<form onSubmit={handleSubmit} className={styles.form}>
<h2 className={styles.title}>Submit Your Startup Idea</h2>
{submissionStatus === 'success' && <p className={styles.successMessage}>Submit successfully!</p>}
<div className={styles.formGroup}>
<label htmlFor="name" className={styles.label}>Startup Name</label>
<input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={styles.input} />
</div>
<div className={styles.formGroup}>
<label htmlFor="problem_statement" className={styles.label}>Problem Statement</label>
<textarea id="problem_statement" name="problem_statement" value={formData.problem_statement} onChange={handleChange} className={styles.textarea}></textarea>
</div>
<div className={styles.formGroup}>
<label htmlFor="solution_approach" className={styles.label}>Solution Approach</label>
<textarea id="solution_approach" name="solution_approach" value={formData.solution_approach} onChange={handleChange} className={styles.textarea}></textarea>
</div>
<div className={styles.formGroup}>
<label htmlFor="business_model" className={styles.label}>Business Model</label>
<input type="text" id="business_model" name="business_model" value={formData.business_model} onChange={handleChange} className={styles.input} />
</div>
<div className={styles.formGroup}>
<label htmlFor="market_audience" className={styles.label}>Market Audience</label>
<input type="text" id="market_audience" name="market_audience" value={formData.market_audience} onChange={handleChange} className={styles.input} />
</div>
<div className={styles.formGroup}>
<label htmlFor="funding_required" className={styles.label}>Funding Required</label>
<input type="text" id="funding_required" name="funding_required" value={formData.funding_required} onChange={handleChange} className={styles.input} />
</div>
<div className={styles.formGroup}>
<label htmlFor="category" className={styles.label}>Category</label>
<input type="text" id="category" name="category" value={formData.category} onChange={handleChange} className={styles.input} />
</div>
<button type="submit" className={styles.submitButton}>Submit Idea</button>
</form>
);
};

export default StartupForm;