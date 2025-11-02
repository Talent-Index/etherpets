class Helpers {
  // Generate random ID
  static generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Format date to readable string
  static formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Calculate time difference in hours
  static getHoursDifference(date1, date2) {
    const diff = Math.abs(new Date(date2) - new Date(date1));
    return Math.floor(diff / (1000 * 60 * 60));
  }

  // Validate wallet address
  static isValidWalletAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Sanitize user input
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Calculate level from experience
  static calculateLevel(experience) {
    return Math.floor((Math.sqrt(100 * (2 * experience + 25)) + 50) / 100);
  }

  // Generate random color
  static generateColor() {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
      '#BB8FCE', '#85C1E9', '#82E0AA', '#F8C471'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Debounce function for API calls
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

module.exports = Helpers;