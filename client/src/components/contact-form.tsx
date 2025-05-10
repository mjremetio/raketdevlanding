import { useState } from 'react';
import { useFormValidation } from '@/hooks/use-form-validation';
import { motion } from 'framer-motion';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });
  
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const { errors, validateForm, validateField } = useFormValidation();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name as keyof typeof touched]) {
      validateField(name, value);
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateForm(formData);
    
    if (isValid) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Reset form after showing success message
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            projectType: '',
            message: ''
          });
          setTouched({
            name: false,
            email: false,
            message: false
          });
          setSubmitSuccess(false);
        }, 3000);
      }, 1000);
    }
  };

  return (
    <motion.form 
      className="bg-muted dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
    >
      {submitSuccess ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="text-4xl text-green-500 mb-4">
            <i className="fas fa-check-circle"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2 dark:text-white">Message Sent!</h3>
          <p className="dark:text-gray-300">Thank you for reaching out. We'll get back to you soon.</p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block mb-2 font-medium dark:text-white text-sm">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 sm:px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white`}
                placeholder="Your name"
                disabled={isSubmitting}
              />
              {errors.name && touched.name && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 font-medium dark:text-white text-sm">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 sm:px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white`}
                placeholder="Your email"
                disabled={isSubmitting}
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="projectType" className="block mb-2 font-medium dark:text-white text-sm">Project Type</label>
            <select 
              id="projectType" 
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            >
              <option value="" disabled>Select a service</option>
              <option value="web">Web App Development</option>
              <option value="mobile">Mobile App Development</option>
              <option value="design">Graphic Design</option>
              <option value="ui-ux">Layout & UI/UX Design</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 font-medium dark:text-white text-sm">Message</label>
            <textarea 
              id="message" 
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4} 
              className={`w-full px-3 sm:px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white`}
              placeholder="Tell us about your project"
              disabled={isSubmitting}
            ></textarea>
            {errors.message && touched.message && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.message}</p>
            )}
          </div>
          
          <button 
            type="submit" 
            className="w-full px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-md hover:bg-opacity-90 transition-all flex items-center justify-center shadow-md hover:shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">
                  <i className="fas fa-spinner"></i>
                </span>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </>
      )}
    </motion.form>
  );
}
