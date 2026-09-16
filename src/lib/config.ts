export const siteConfig = {
  businessName: 'Gordo Salgados',
  contact: {
    // Used for WhatsApp API links
    whatsappNumber: '+5586998532928',
    // Formatted phone number for display
    displayPhoneNumber: '(86) 99853-2928',
    address: {
      street: 'Rua do Pé de Pequi, 500',
      neighborhood: 'Santa Luzia',
      cityState: 'Água Branca - PI',
    },
    // It's recommended to generate a fresh embed URL from Google Maps
    googleMapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d501.0192842523282!2d-42.6348727021369!3d-5.89921613557894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1spt-BR!2sbr!4v1768954678933!5m2!1spt-BR!2sbr',
  },
  operatingHours: {
    weekdays: 'Seg a Sáb: 07h às 18h',
    weekends: 'Dom: 8h às 12h',
  },
};

export const whatsappLink = `https://wa.me/${siteConfig.contact.whatsappNumber}`;