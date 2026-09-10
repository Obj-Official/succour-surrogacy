import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import { WhatsApp } from '@mui/icons-material';

const WHATSAPP_NUMBER = "+2347065469884"; 
const MESSAGE = "Hello! I'm interested in your services."; // Optional pre-filled message

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <Tooltip title="Chat with us" placement="left" arrow>
      <Fab
        color="success"
        aria-label="whatsapp"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 20 }, // Responsive spacing
          right: { xs: 16, sm: 24 },
          bgcolor: '#25D366', // Official WhatsApp Green
          color: 'white',
          zIndex: 2000,
          '&:hover': {
            bgcolor: '#128C7E', // Darker green on hover
            transform: 'scale(1.1)',
            transition: 'all 0.3s ease-in-out',
          },
        }}
      >
        <WhatsApp fontSize="large" />
      </Fab>
    </Tooltip>
  );
}