
// Contact form submission storage service

export interface ContactFormData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

/**
 * Stores a contact form submission in local storage and exports it as text
 * @param formData The contact form data to store
 * @returns The ID of the stored submission
 */
export const storeContactFormSubmission = (formData: Omit<ContactFormData, 'id' | 'timestamp'>) => {
  // Add timestamp and ID
  const messageWithMetadata: ContactFormData = {
    ...formData,
    id: `msg-${Date.now()}`,
    timestamp: new Date().toISOString()
  };

  // Store in localStorage
  const existingMessages = localStorage.getItem('contactMessages');
  const messages = existingMessages ? JSON.parse(existingMessages) : [];
  messages.push(messageWithMetadata);
  localStorage.setItem('contactMessages', JSON.stringify(messages));

  // Generate exportable text version
  const textExport = generateTextExport(messageWithMetadata);
  
  // Create and offer download of text file
  downloadAsTextFile(textExport, `contact-submission-${messageWithMetadata.id}.txt`);

  // Return the new message ID
  return messageWithMetadata.id;
};

/**
 * Generates a text export of a contact form submission
 */
export const generateTextExport = (formData: ContactFormData): string => {
  return `
MINDFUL GROVE CONTACT FORM SUBMISSION
=====================================
ID: ${formData.id}
Date: ${new Date(formData.timestamp).toLocaleString()}
Recipient: akshaygurav416115@gmail.com

SENDER INFORMATION
-----------------
Name: ${formData.name}
Email: ${formData.email}

MESSAGE DETAILS
--------------
Subject: ${formData.subject}

Message:
${formData.message}

=====================================
This message was submitted through the Mindful Grove contact form.
  `.trim();
};

/**
 * Creates and downloads a text file containing the provided content
 */
export const downloadAsTextFile = (content: string, filename: string) => {
  const element = document.createElement('a');
  const file = new Blob([content], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Gets all stored contact form submissions
 */
export const getAllContactFormSubmissions = (): ContactFormData[] => {
  const existingMessages = localStorage.getItem('contactMessages');
  return existingMessages ? JSON.parse(existingMessages) : [];
};
