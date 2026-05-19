import React, { useState } from 'react';
import { sendContactMessage } from '../config/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await sendContactMessage(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitError(
        error.message ||
          'Could not send message. Make sure the .NET API is running and email (SMTP) is configured.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact" className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-6xl font-mono font-bold mb-2">WANT TO WORK TOGETHER?</h2>
          <div className="h-1 w-24 bg-white"></div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="border-8 border-white p-8">
            <p className="font-mono mb-8 text-lg">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            {submitted ? (
              <div className="bg-white text-black p-6">
                <h3 className="text-2xl font-mono font-bold mb-4">MESSAGE SENT!</h3>
                <p className="font-mono mb-4">Thank you for your message. I'll get back to you as soon as possible.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-black text-white font-mono py-3 px-6 hover:bg-gray-900 transition-colors"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-mono mb-2">
                    NAME
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-black border-2 ${formErrors.name ? 'border-red-500' : 'border-white'} p-3 font-mono text-white`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-red-500 text-sm font-mono">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block font-mono mb-2">
                    EMAIL
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-black border-2 ${formErrors.email ? 'border-red-500' : 'border-white'} p-3 font-mono text-white`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-red-500 text-sm font-mono">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block font-mono mb-2">
                    SUBJECT
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full bg-black border-2 ${formErrors.subject ? 'border-red-500' : 'border-white'} p-3 font-mono text-white`}
                  />
                  {formErrors.subject && (
                    <p className="mt-1 text-red-500 text-sm font-mono">{formErrors.subject}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block font-mono mb-2">
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full bg-black border-2 ${formErrors.message ? 'border-red-500' : 'border-white'} p-3 font-mono text-white h-40`}
                  />
                  {formErrors.message && (
                    <p className="mt-1 text-red-500 text-sm font-mono">{formErrors.message}</p>
                  )}
                </div>

                {submitError && (
                  <div className="bg-red-900 text-white p-3 font-mono">{submitError}</div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-white text-black font-mono py-3 px-8 hover:bg-gray-200 transition-colors ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'SENDING...' : 'SEND MESSAGE →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
