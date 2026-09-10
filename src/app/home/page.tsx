"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
  AppBar,
  Box,
  BoxProps,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Grid, keyframes } from '@mui/system';
import { ArrowForward, ArrowBack, CheckCircle, Close, Email, Facebook, Instagram, LinkedIn, LocationOn, Menu, Phone, Verified, Security, SupportAgentOutlined, WhatsApp } from "@mui/icons-material";
import WhatsAppButton from "../../components/whatsAppFab";


const slideInUp = keyframes`
from {
    opacity: 0;
    transform: translateY(60px);
}
to {
    opacity: 1;
    transform: translateY(0);
}
`;

const slideInLeft = keyframes`
from {
    opacity: 0;
    transform: translateX(-60px);
}
to {
    opacity: 1;
    transform: translateX(0);
}
`;

const slideInRight = keyframes`
from {
    opacity: 0;
    transform: translateX(60px);
}
to {
    opacity: 1;
    transform: translateX(0);
}
`;

interface AnimatedBoxProps extends Omit<BoxProps, 'animation'> {
  children: React.ReactNode;
  delay?: number;
  animation?: 'up' | 'left' | 'right';
}

const AnimatedBox = React.forwardRef<HTMLDivElement, AnimatedBoxProps>(
  ({ children, delay = 0, animation = 'up', sx, ...props }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const currentRef = innerRef.current;
      if (!currentRef) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.12 }
      );

      observer.observe(currentRef);
      return () => {
        observer.unobserve(currentRef);
      };
    }, [ref]);

    const animationMap = {
      up: slideInUp,
      left: slideInLeft,
      right: slideInRight,
    };

    return (
      <Box
        ref={(node: HTMLDivElement | null) => {
          innerRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        sx={{
          animation: isVisible ? `${animationMap[animation]} 0.8s ease-out ${delay}s both` : 'none',
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

AnimatedBox.displayName = 'AnimatedBox';

export default function HomePage() {

    const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About us', id: 'aboutus' },
    { label: 'Why Succour', id: 'shop' },
    { label: 'Eligibility', id: 'eligibility' },
    { label: 'Our Directors', id: 'bestdeals' },
    { label: 'Contact', id: 'contact' },
    ];

    
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [eligibilityStep, setEligibilityStep] = useState(0);
    const [eligibilityAnswers, setEligibilityAnswers] = useState<Record<string, string>>({});
    const [eligibilityResult, setEligibilityResult] = useState<boolean | null>(null);
    const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const eligibilityQuestions = [
      {
        key: 'age',
        label: 'How old are you?',
        helper: 'Our initial pre-screen is for women aged 21 to 38.',
        options: ['Under 21', '21–38', 'Over 38'],
      },
      {
        key: 'pregnancy',
        label: 'Have you previously had a healthy pregnancy and delivery?',
        helper: 'A previous healthy pregnancy helps our medical team assess suitability.',
        options: ['Yes', 'No'],
      },
      {
        key: 'lifestyle',
        label: 'Are you currently smoke-free and free from recreational drugs?',
        helper: 'Honest answers help protect you and any future pregnancy.',
        options: ['Yes', 'No'],
      },
      {
        key: 'screening',
        label: 'Are you willing to complete medical and background screening?',
        helper: 'Every candidate completes professional screening before matching.',
        options: ['Yes', 'No'],
      },
    ];

    const currentEligibilityQuestion = eligibilityQuestions[eligibilityStep];

    const answerEligibilityQuestion = (answer: string) => {
      setEligibilityAnswers((current) => ({ ...current, [currentEligibilityQuestion.key]: answer }));
    };

    const submitEligibility = () => {
      const answers = { ...eligibilityAnswers, [currentEligibilityQuestion.key]: eligibilityAnswers[currentEligibilityQuestion.key] };
      setEligibilityAnswers(answers);
      setEligibilityResult(
        answers.age === '21–38' &&
        answers.pregnancy === 'Yes' &&
        answers.lifestyle === 'Yes' &&
        answers.screening === 'Yes'
      );
    };

    const submitContactForm = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setContactStatus('sending');

      try {
        await axios.post('/api/contact', {
          ...contactForm,
          title: 'Website contact request',
        });
        setContactForm({ name: '', email: '', phone: '', message: '' });
        setContactStatus('success');
      } catch {
        setContactStatus('error');
      }
    };

    const scrollToSection = (sectionId: string) => {
    const target = sectionRefs.current[sectionId] ?? document.getElementById(sectionId);
    if (!target) return;

    const offset = window.innerWidth < 900 ? 88 : 110;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    setMobileMenuOpen(false);
};

  return (
    <Box>
        <AppBar
                position="fixed"
                sx={{
                backgroundColor: '#eaeaea',
                boxShadow: 'none',
                zIndex: 1000,
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: {xs: 'space-between', md:'space-around'},
                        py: 1,
                        minHeight: { xs: 72, md: 88 },
                        position: 'relative',
                    }}
                >
                <Box sx={{display: 'flex', flexDirection:'row'}}>
                    <Box
                        component="img"
                        src="/succour-logo.png"
                        alt="succour-logo"
                        sx={{
                            alignItems: 'center',
                            width: 70,
                        }}
                    />
                    <Box sx={{py:2}}>
                        <Typography sx={{ color: '#165b52', fontFamily: 'verdana', fontWeight: 900, fontSize: { xs: '15px', md: '18px' } }}>SUCCOUR</Typography>
                        <Typography sx={{ color: '#555', fontFamily: 'var(--font-nunito)', fontSize: { xs: '10px', md: '12px' } }}>Surrogacy Agency</Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                    display: { xs: 'none', md: 'flex' },
                    justifyContent: 'center',
                    gap: { md: 2 },
                    }}
                >
                    {navItems.map((item) => (
                    <Box
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.3,
                        cursor: 'pointer',
                        }}
                    >
                       <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            transition: 'all 0.3s ease',
                        }}
                        />
                        <Typography
                        sx={{
                            fontFamily: 'Helvetica',
                            fontSize: { xs: '12px', md: '14px' },
                            fontWeight: { xs: 400, md: 700 },
                            letterSpacing: '2px',
                            color: '#555',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                            color: '#888',
                            },
                        }}
                        >
                        {item.label}
                        </Typography>
                    </Box>
                    ))}
                </Box>

                <IconButton
                    aria-label="toggle navigation menu"
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    sx={{
                        display: { xs: 'flex', md: 'none' },
                        color: '#5f3a5f',
                        border: '1px solid rgba(95,58,95,0.2)',
                        borderRadius: 2,
                    }}
                >
                    {mobileMenuOpen ? <Close /> : <Menu />}
                </IconButton>
                </Toolbar>

                <Box
                    sx={{
                        display: { xs: mobileMenuOpen ? 'flex' : 'none', md: 'none' },
                        flexDirection: 'column',
                        gap: 1.5,
                        px: 2,
                        pb: 2,
                        backgroundColor: '#ebebeb',
                        borderTop: '1px solid rgba(95,58,95,0.15)',
                    }}
                >
                    {navItems.map((item) => (
                        <Box
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            sx={{
                                py: 1,
                                px: 1,
                                cursor: 'pointer',
                                borderBottom: '1px solid rgba(17,17,17,0.08)',
                                color: '#000',
                            }}
                        >
                            <Typography sx={{ fontFamily: 'Helvetica', fontWeight: 700, letterSpacing: '1.5px' }}>
                                {item.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
        </AppBar>

        <AnimatedBox
            component="section"
            id="home"
            ref={(node: HTMLDivElement | null) => {
                sectionRefs.current.home = node;
            }}
            sx={{
            backgroundColor: '#ececec',
            paddingTop: {xs: '100px', md: '120px'},
            paddingBottom: '60px',
            px: { xs: 2, md: 4 },
            position: 'relative',
            minHeight: {xs: '80vh', md: '90vh'},
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            scrollMarginTop: { xs: '90px', md: '110px' },
            }}
        >
        <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
                <AnimatedBox
                    animation="left"
                    delay={0.12}
                    sx={{
                    padding: { xs: '10px', md: '20px' },
                }} >
                    <Typography
                        variant="h1"
                        sx={{
                            color: '#165b52',
                            fontSize: { xs: '35px', md: '45px' },
                            fontFamily: 'var(--font-nunito), sans-serif',
                            fontWeight: 800,
                            textAlign: {xs:'center', md:'left'},
                        }}
                    >
                    Completing Families, 
                    </Typography>
                    <Typography
                        variant="h1"
                        sx={{
                            color: '#d63a07',
                            fontSize: { xs: '35px', md: '45px' },
                            fontFamily: 'var(--font-nunito), sans-serif',
                            fontWeight: 800,
                            textAlign: {xs:'center', md:'left'},
                            mb: 3,
                        }}
                    >
                     Nurturing Dreams. 
                    </Typography>
                    <Box sx={{display: {xs: 'block', md: 'none'}, mb: 2}}>
                        <Box
                            component="img"
                            src="/family_hero.png"
                            alt="remedy"
                            sx={{
                                height: 'auto',
                                width: { xs: '400px',  md: '600px' },
                                borderRadius: '50px',
                                border: 'none',
                                objectFit: 'cover',
                                position: 'relative',
                                cursor: 'cell',
                                zIndex: 15,
                            }}
                        />
                    </Box>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#000',
                            fontSize: '16px',
                            fontFamily: 'georgia',
                            textAlign: {xs:'center', md:'left'},
                            lineHeight: 2,
                            pb: 3,
                        }}
                    >
                    Surrogacy made simple! Connecting parents with caring, vetted surrogates, providing full medical and professional support from match to birth
                    </Typography>
                    <Box sx={{display: 'flex', justifyContent: {xs: 'space-evenly', md: 'normal'} , alignItems: {xs: 'center'}, mt: 2}}>
                        <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#d63a07',
                            color: '#fff',
                            fontSize: '14px',
                            fontFamily: 'var(--font-nunito), sans-serif',
                            textAlign: 'center',
                            textTransform: 'none',
                            px: 2,
                            py: 1,
                            mr: 2,
                            borderRadius: '4px',
                        }}
                        >
                        Start Journey 
                        </Button>
                        <Button
                        variant="outlined"
                        sx={{
                            borderColor: '#5f3a5f',
                            color: '#5f3a5f',
                            fontSize: '14px',
                            fontFamily: 'var(--font-nunito), sans-serif',
                            textAlign: 'center',
                            textTransform: 'none',
                            px: 2,
                            py: 1,
                            borderRadius: '4px',
                        }}
                        >
                        Become a Surrogate
                        </Button>
                    </Box>
                </AnimatedBox>
            </Grid>
            <Grid size={{ xs: 0, md: 6 }} sx={{display: {xs:'none', md: 'block'}}}>
                <Box
                    component="img"
                    src="/family_hero.png"
                    alt="remedy"
                    sx={{
                        height: 'auto',
                        width: { xs: '400px',  md: '600px' },
                        borderRadius: '50px',
                        border: 'none',
                        objectFit: 'cover',
                        position: 'relative',
                        cursor: 'cell',
                        zIndex: 15,
                    }}
                />
            </Grid>
        </Grid>
    </AnimatedBox>
      <Box  sx={{ py: { xs: 2, md: 15 }, textAlign: 'center', backgroundColor: '#ebebeb', width: '100%' }}>
        {/* THREE CARDS SECTION */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
            gap: 4,
            mb: 8,
            maxWidth: 900,
            mx: 'auto',
          }}
        >
          {[
            { title: 'Legal Coverage', icon: Security, description: '✓ 100% Escrow & Legal Protection' },
            { title: 'Verified Matches', icon: Verified, description: '✓ Pre-screened & Vetted Matches' },
            { title: 'Dedicated Management', icon: SupportAgentOutlined, description: '✓ 24/7 Dedicated Case Management`' },
          ].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <AnimatedBox
                key={idx}
                animation="up"
                delay={idx * 0.1}
                sx={{
                  bgcolor: '#ebebeb',
                  py: 4,
                  mx: { xs: 2, md: 0 },
                  borderRadius: 3,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                  transition: 'all 0.4s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(46, 140, 127, 0.45)',
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <IconComponent sx={{ fontSize: '3rem', color: '#165b52' }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: 'Verdana, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#165b52',
                    mb: 1,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Lora, serif',
                    fontSize: '0.95rem',
                    color: '#666666',
                  }}
                >
                  {item.description}
                </Typography>
              </AnimatedBox>
            );
          })}
        </Box>
      </Box>
      <WhatsAppButton />
      <AnimatedBox
        component="section"
        id="aboutus"
        ref={(node: HTMLDivElement | null) => {
          sectionRefs.current.aboutus = node;
        }}
        sx={{
          backgroundColor: '#f7f5f0',
          px: { xs: 2, md: 6 },
          py: { xs: 8, md: 14 },
          scrollMarginTop: { xs: '90px', md: '110px' },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
            <Typography
              sx={{
                color: '#d63a07',
                fontFamily: 'var(--font-nunito), sans-serif',
                fontSize: '0.6rem',
                fontWeight: 800,
                letterSpacing: '3px',
                textTransform: 'uppercase',
              }}
            >
              - About Us -
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: '#165b52',
                fontFamily: 'var(--font-nunito), sans-serif',
                fontSize: { xs: '2.25rem', md: '3rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                mt: 2,
              }}
            >
              Building Families with Care and Integrity
            </Typography>
            <Typography
              sx={{
                color: '#647875',
                fontFamily: 'Georgia, serif',
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.7,
                maxWidth: 780,
                mx: 'auto',
                mt: 3,
              }}
            >
              Succour was founded on a simple belief: every intended parent deserves a trusted path to a family, and every surrogate deserves to be treated with dignity, honesty, and exceptional care.
            </Typography>
          </Box>

          <Grid container sx={{alignItems: "center"}} >
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="/surrogate_mum_and_doc.png"
                alt="Medical support for surrogate"
                sx={{
                  width: '90%',
                  height: { xs: 300, md: 460 },
                  objectFit: 'cover',
                  borderRadius: { xs: '28px', md: '42px' },
                  display: 'block',
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  sx={{
                    color: '#165b52',
                    fontFamily: 'var(--font-nunito), sans-serif',
                    fontSize: { xs: '1.5rem', md: '1.8rem' },
                    fontWeight: 800,
                    mb: 2,
                  }}
                >
                  A thoughtful beginning for a life-changing journey
                </Typography>
                <Typography sx={{ color: '#647875', fontFamily: 'Georgia, serif', lineHeight: 1.8, mb: 3 }}>
                  Succour Surrogacy Agency Ltd brings together compassionate people, dependable medical guidance, and strong professional standards to make surrogacy feel clear and supported from the first conversation to birth.
                </Typography>
                <Typography sx={{ color: '#647875', fontFamily: 'Georgia, serif', lineHeight: 1.8, mb: 4 }}>
                  Our mission is to create ethical, transparent family-building relationships where intended parents, surrogates, and their families are listened to, protected, and cared for at every step.
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, textAlign: 'left' }}>
                  {[
                    ['01', 'Compassion first', 'People before process, always.'],
                    ['02', 'Ethical practice', 'Clear guidance and accountable care.'],
                  ].map(([number, title, description]) => (
                    <Box key={number} sx={{ borderTop: '2px solid #d63a07', pt: 2 }}>
                      <Typography sx={{ color: '#d63a07', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 800 }}>{number}</Typography>
                      <Typography sx={{ color: '#165b52', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 800, mt: 0.5 }}>{title}</Typography>
                      <Typography sx={{ color: '#647875', fontSize: '0.9rem', mt: 0.5 }}>{description}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </AnimatedBox>

      <AnimatedBox
        component="section"
        id="bestdeals"
        ref={(node: HTMLDivElement | null) => {
          sectionRefs.current.bestdeals = node;
        }}
        sx={{
          backgroundColor: '#165b52',
          px: { xs: 2, md: 6 },
          py: { xs: 8, md: 14 },
          scrollMarginTop: { xs: '90px', md: '110px' },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
            <Typography sx={{ color: '#f7c6a5', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' }}>
              - Leadership Spotlight -
            </Typography>
            <Typography variant="h2" sx={{ color: '#fffaf3', fontFamily: 'var(--font-nunito), sans-serif', fontSize: { xs: '2.25rem', md: '3rem' }, fontWeight: 800, mt: 2 }}>
              The people behind Succour
            </Typography>
            <Typography sx={{ color: '#d8e4df', fontFamily: 'Georgia, serif', lineHeight: 1.7, maxWidth: 700, mx: 'auto', mt: 3 }}>
              Experienced leadership with the warmth, wisdom, and professional rigour that an important family journey deserves.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: '100%', backgroundColor: '#fffaf3', borderRadius: 4, p: { xs: 3, md: 5 } }}>
                <Typography sx={{ color: '#d63a07', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
                  Founder’s Overview
                </Typography>
                <Box sx={{alignItems: 'center', display: 'flex', flexDirection: 'column', mt: 2}}>
                    <Box
                        component="img"
                        src="/dr_udoka.jpg"
                        sx={{ width: '200px', height: 'auto', borderRadius: '50%', mt: 2 }}
                    />
                    <>
                    <Typography variant="h3" sx={{ color: '#165b52', fontFamily: 'var(--font-nunito), sans-serif', fontSize: { xs: '1.4rem', md: '2rem' }, fontWeight: 800, mt: 2 }}>
                    Dr. Udoka Helen Chukwu
                    </Typography>
                    <Typography sx={{ color: '#647875', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 700, mt: 1 }}>
                    Founder and Director
                    </Typography>
                    </>
                </Box>
                <Typography sx={{ color: '#647875', fontFamily: 'Georgia, serif', lineHeight: 1.8, mt: 3 }}>
                  With doctorates in Political Science, Business Leadership, and Human Resource Management, Dr. Udoka Helen Chukwu leads Succour with deep HR expertise and a compassionate commitment to helping families overcome childlessness.
                </Typography>
                <Typography sx={{ color: '#647875', fontFamily: 'Georgia, serif', lineHeight: 1.8, mt: 2 }}>
                  Her vision is a professional, empathetic, and seamless surrogacy experience where every person feels informed, respected, and genuinely supported.
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: '100%', backgroundColor: '#f7c6a5', borderRadius: 4, p: { xs: 3, md: 5 } }}>
                <Typography sx={{ color: '#165b52', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
                  Legal, Compliance &amp; Ethics
                </Typography>
                
                <Box sx={{alignItems: 'center', display: 'flex', flexDirection: 'column', mt: 2}}>
                    <Box
                        component="img"
                        src="/chiugu.jpg"
                        sx={{ width: '200px', height: 'auto', borderRadius: '50%', mt: 2 }}
                    />
                    <>
                    <Typography variant="h3" sx={{ color: '#165b52', fontFamily: 'var(--font-nunito), sans-serif', fontSize: { xs: '1.4rem', md: '2.25rem' }, fontWeight: 800, mt: 2 }}>
                    Chiugu Ken-Okenini, ESQ.
                    </Typography>
                    <Typography sx={{ color: '#165b52', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 700, mt: 1 }}>
                    LLB, BL, LLM · Director, Legal, Compliance &amp; Ethics
                    </Typography>
                    </>
                </Box>
                <Typography sx={{ color: '#315f58', fontFamily: 'Georgia, serif', lineHeight: 1.8, mt: 3 }}>
                  Chiugu is a Lawyer, Chartered Secretary, Health Law professional, and Corporate Governance expert with over 15 years’ experience in regulated industries.
                </Typography>
                <Typography sx={{ color: '#315f58', fontFamily: 'Georgia, serif', lineHeight: 1.8, mt: 2 }}>
                  She provides the legal and ethical backbone that keeps Succour committed to professionalism, transparency, and meaningful client protection.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </AnimatedBox>

      <AnimatedBox
        component="section"
        id="shop"
        ref={(node: HTMLDivElement | null) => {
          sectionRefs.current.shop = node;
        }}
        sx={{ backgroundColor: '#fffaf3', px: { xs: 2, md: 6 }, py: { xs: 8, md: 13 }, scrollMarginTop: { xs: '90px', md: '110px' } }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
            <Typography sx={{ color: '#d63a07', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' }}>
              - Why Choose Succour -
            </Typography>
            <Typography variant="h2" sx={{ color: '#165b52', fontFamily: 'var(--font-nunito), sans-serif', fontSize: { xs: '2.25rem', md: '3rem' }, fontWeight: 800, mt: 2 }}>
              Care you can feel. Standards you can trust.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              ['01', 'Trusted leadership', 'Seasoned professionals guide each decision with experience, accountability, and genuine care.'],
              ['02', 'Rigorous selection', 'Thoughtful screening helps create safe, compatible matches between intended parents and surrogates.'],
              ['03', 'Empathy-driven support', 'Clear communication and emotional support keep everyone informed and cared for at every step.'],
            ].map(([number, title, description]) => (
              <Grid size={{ xs: 12, md: 4 }} key={number}>
                <Box sx={{ height: '100%', borderTop: '3px solid #d63a07', pt: 3, px: { xs: 1, md: 2 } }}>
                  <Typography sx={{ color: '#d63a07', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '1.2rem', fontWeight: 800 }}>{number}</Typography>
                  <Typography sx={{ color: '#165b52', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '1.4rem', fontWeight: 800, mt: 1 }}>{title}</Typography>
                  <Typography sx={{ color: '#647875', fontFamily: 'Georgia, serif', lineHeight: 1.8, mt: 2 }}>{description}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </AnimatedBox>

      <AnimatedBox
        component="section"
        id="journey"
        ref={(node: HTMLDivElement | null) => {
          sectionRefs.current.journey = node;
        }}
        sx={{ backgroundColor: '#165b52', px: { xs: 2, md: 6 }, py: { xs: 8, md: 13 }, scrollMarginTop: { xs: '90px', md: '110px' } }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
            <Typography sx={{ color: '#f7c6a5', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' }}>- How It Works -</Typography>
            <Typography variant="h2" sx={{ color: '#fffaf3', fontFamily: 'var(--font-nunito), sans-serif', fontSize: { xs: '2.25rem', md: '3.5rem' }, fontWeight: 800, mt: 2 }}>Two journeys, one shared destination</Typography>
            <Typography sx={{ color: '#d8e4df', fontFamily: 'Georgia, serif', lineHeight: 1.7, maxWidth: 700, mx: 'auto', mt: 3 }}>A clear roadmap makes a complex process feel more manageable, personal, and supported.</Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              ['For intended parents', ['Consultation', 'Matching', 'Legal contracts', 'Medical / IVF transfer', 'Pregnancy & delivery', 'Bringing baby home']],
              ['For surrogates', ['Initial screening', 'Matching with parents', 'Independent legal representation', 'IVF procedure', 'Pregnancy support & compensation', 'Delivery']],
            ].map(([title, steps]) => (
              <Grid size={{ xs: 12, md: 6 }} key={title as string}>
                <Box sx={{ backgroundColor: '#fffaf3', borderRadius: 4, p: { xs: 3, md: 5 }, height: '100%' }}>
                  <Typography sx={{ color: '#d63a07', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '1.35rem', fontWeight: 800, mb: 3 }}>{title}</Typography>
                  <Box sx={{ display: 'grid', gap: 1.5 }}>
                    {(steps as string[]).map((step, index) => (
                      <Box key={step} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ backgroundColor: '#f7c6a5', color: '#165b52', borderRadius: '50%', minWidth: 32, height: 32, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 800 }}>{index + 1}</Box>
                        <Typography sx={{ color: '#647875', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 700 }}>{step}</Typography>
                        {index < (steps as string[]).length - 1 && <ArrowForward sx={{ color: '#d63a07', display: { xs: 'none', sm: 'block' }, ml: 'auto' }} />}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </AnimatedBox>

      <AnimatedBox
        component="section"
        id="benefits"
        ref={(node: HTMLDivElement | null) => {
          sectionRefs.current.benefits = node;
        }}
        sx={{ backgroundColor: '#f7e8d0', minHeight: { md: 700 }, scrollMarginTop: { xs: '90px', md: '110px' } }}
      >
        <Grid container sx={{ minHeight: { md: 600 } }}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ px: { xs: 3, sm: 8, md: 12 }, py: { xs: 8, md: 12 }, display: 'flex', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ color: '#d63a07', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' }}>- Benefits -</Typography>
              <Typography variant="h2" sx={{ color: '#d96835', fontFamily: 'var(--font-nunito), sans-serif', fontSize: { xs: '2.3rem', md: '3.35rem' }, fontWeight: 800, lineHeight: 1.08, mt: 3 }}>A supported path to a hopeful beginning</Typography>
              <Typography sx={{ color: '#dc916e', fontFamily: 'var(--font-nunito), sans-serif', fontSize: { xs: '1rem', md: '1.15rem' }, fontWeight: 700, lineHeight: 1.55, mt: 3 }}>From your first conversation with us, you are met with practical guidance and human support.</Typography>
              <Typography sx={{ color: '#dc916e', fontFamily: 'Georgia, serif', lineHeight: 1.8, mt: 3 }}>We coordinate the details, protect the relationships, and help each person move forward with confidence.</Typography>
              <Box sx={{ display: 'grid', gap: 3, mt: 4 }}>
                {[
                  ['Personalised guidance', 'A dedicated team helps you understand each stage and make informed decisions.'],
                  ['Responsible matching', 'Careful assessment supports respectful, well-informed relationships.'],
                ].map(([title, description]) => (
                  <Box key={title} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <CheckCircle sx={{ color: '#f7c6a5', backgroundColor: '#fffaf3', borderRadius: '50%', fontSize: 42, flexShrink: 0 }} />
                    <Box><Typography sx={{ color: '#d96835', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 800, fontSize: '1.1rem' }}>{title}</Typography><Typography sx={{ color: '#dc916e', lineHeight: 1.6, mt: 0.5 }}>{description}</Typography></Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ minHeight: { xs: 380, md: 700 } }}>
            <Box component="img" src="/pretty_surrogate.png" alt="Smiling surrogate mother receiving support" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </Grid>
        </Grid>
      </AnimatedBox>

      <AnimatedBox
        component="section"
        id="eligibility"
        ref={(node: HTMLDivElement | null) => {
          sectionRefs.current.eligibility = node;
        }}
        sx={{ backgroundColor: '#fffaf3', px: { xs: 2, md: 6 }, py: { xs: 8, md: 13 }, scrollMarginTop: { xs: '90px', md: '110px' } }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: '#d63a07', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' }}>- Quick Pre-Screen -</Typography>
            <Typography variant="h2" sx={{ color: '#165b52', fontFamily: 'var(--font-nunito), sans-serif', fontSize: { xs: '2.2rem', md: '3.25rem' }, fontWeight: 800, mt: 2 }}>Could surrogacy be right for you?</Typography>
            <Typography sx={{ color: '#647875', fontFamily: 'Georgia, serif', lineHeight: 1.7, mt: 3 }}>Answer four quick questions to see whether you meet our initial surrogate criteria.</Typography>
          </Box>
          <Box sx={{ backgroundColor: '#f7f5f0', borderRadius: 4, p: { xs: 3, md: 5 }, mt: 5, boxShadow: '0 16px 40px rgba(22,91,82,0.12)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ color: '#165b52', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 800 }}>Question {eligibilityStep + 1} of {eligibilityQuestions.length}</Typography>
              <Typography sx={{ color: '#d63a07', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 800 }}>{Math.round(((eligibilityStep + 1) / eligibilityQuestions.length) * 100)}%</Typography>
            </Box>
            <Box sx={{ height: 6, backgroundColor: '#e8d8c8', borderRadius: 4, mb: 4 }}><Box sx={{ width: `${((eligibilityStep + 1) / eligibilityQuestions.length) * 100}%`, height: '100%', backgroundColor: '#d63a07', borderRadius: 4 }} /></Box>
            <Typography variant="h3" sx={{ color: '#165b52', fontFamily: 'var(--font-nunito), sans-serif', fontSize: { xs: '1.5rem', md: '1.9rem' }, fontWeight: 800 }}>{currentEligibilityQuestion.label}</Typography>
            <Typography sx={{ color: '#647875', fontFamily: 'Georgia, serif', lineHeight: 1.6, mt: 1 }}>{currentEligibilityQuestion.helper}</Typography>
            <Box sx={{ display: 'grid', gap: 1.5, mt: 4 }}>
              {currentEligibilityQuestion.options.map((option) => (
                <Button key={option} onClick={() => answerEligibilityQuestion(option)} variant={eligibilityAnswers[currentEligibilityQuestion.key] === option ? 'contained' : 'outlined'} sx={{ justifyContent: 'flex-start', borderColor: '#165b52', color: eligibilityAnswers[currentEligibilityQuestion.key] === option ? '#fffaf3' : '#165b52', backgroundColor: eligibilityAnswers[currentEligibilityQuestion.key] === option ? '#165b52' : 'transparent', fontFamily: 'var(--font-nunito), sans-serif', textTransform: 'none', fontWeight: 700, px: 2, py: 1.5, '&:hover': { backgroundColor: '#165b52', color: '#fffaf3' } }}>{option}</Button>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button disabled={eligibilityStep === 0} startIcon={<ArrowBack />} onClick={() => setEligibilityStep((step) => step - 1)} sx={{ color: '#647875', fontFamily: 'var(--font-nunito), sans-serif', textTransform: 'none' }}>Back</Button>
              {eligibilityStep < eligibilityQuestions.length - 1 ? <Button disabled={!eligibilityAnswers[currentEligibilityQuestion.key]} endIcon={<ArrowForward />} onClick={() => setEligibilityStep((step) => step + 1)} sx={{ color: '#d63a07', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 800, textTransform: 'none' }}>Next</Button> : <Button disabled={!eligibilityAnswers[currentEligibilityQuestion.key]} onClick={submitEligibility} variant="contained" sx={{ backgroundColor: '#d63a07', fontFamily: 'var(--font-nunito), sans-serif', textTransform: 'none', fontWeight: 800, '&:hover': { backgroundColor: '#b92f04' } }}>Check eligibility</Button>}
            </Box>
          </Box>
          <Typography sx={{ color: '#8a9995', fontSize: '0.8rem', lineHeight: 1.6, textAlign: 'center', mt: 3 }}>This quick pre-screen is an initial guide only. Final eligibility depends on medical, legal, and background review by qualified professionals.</Typography>
        </Container>
      </AnimatedBox>

      <Dialog open={eligibilityResult !== null} onClose={() => setEligibilityResult(null)} slotProps={{ paper: { sx: { borderRadius: 4, p: 2, maxWidth: 460 } } }}>
        <DialogTitle sx={{ color: '#165b52', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 800 }}>{eligibilityResult ? 'You may be eligible!' : 'Not eligible at this stage!'}</DialogTitle>
        <DialogContent sx={{ color: '#647875', fontFamily: 'Georgia, serif', lineHeight: 1.7 }}>{eligibilityResult ? 'Based on your answers, you meet our initial pre-screen criteria. Our team will need to complete a full medical, legal, and background assessment before confirming eligibility.' : 'Based on your answers, you do not meet our initial pre-screen criteria at this stage. Requirements can vary, so our team can still answer questions about your circumstances.'}</DialogContent>
        <DialogActions><Button onClick={() => setEligibilityResult(null)} sx={{ color: '#d63a07', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 800, mr: {xs: 1, md: 2} }}>Close</Button></DialogActions>
      </Dialog>

      <AnimatedBox
        component="section"
        id="contact"
        ref={(node: HTMLDivElement | null) => {
          sectionRefs.current.contact = node;
        }}
        sx={{
          minHeight: { xs: 680, md: 660 },
          backgroundImage: 'url("/doctor_and_couple.png")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          px: { xs: 2, md: 6 },
          py: { xs: 8, md: 12 },
          scrollMarginTop: { xs: '90px', md: '110px' },
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-end' },
          alignItems: 'center',
        }}
      >
        <Box
          component="form"
          onSubmit={submitContactForm}
          sx={{
            width: { xs: '100%', sm: 460, md: 480 },
            backgroundColor: 'rgba(255, 250, 243, 0.65)',
            backdropFilter: 'blur(8px)',
            borderRadius: 4,
            p: { xs: 2.5, md: 3.5 },
            boxShadow: '0 18px 50px rgba(22, 91, 82, 0.2)',
          }}
        >
          <Typography sx={{ color: '#d63a07', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' }}>
            - Contact Us -
          </Typography>
          <Typography variant="h2" sx={{ color: '#165b52', fontFamily: 'var(--font-nunito), sans-serif', fontSize: { xs: '2rem', md: '2rem' }, fontWeight: 800, lineHeight: 1.1, mt: 2 }}>
            Let’s start a conversation
          </Typography>
          <Typography sx={{ color: '#647875', fontFamily: 'Georgia, serif', lineHeight: 1.6, mt: 2, mb: 3 }}>
             How we can support your family-building journey?
          </Typography>
          <Box sx={{ display: 'grid', gap: 1.5 }}>
            <TextField
              required
              label="Name"
              value={contactForm.name}
              onChange={(event) => setContactForm((current) => ({ ...current, name: event.target.value }))}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fff', borderRadius: '50px', padding: '2px 12px', }, '& .MuiInputBase-input': { padding: '13px' }, }}
            />
            <TextField
              required
              type="email"
              label="Email"
              value={contactForm.email}
              onChange={(event) => setContactForm((current) => ({ ...current, email: event.target.value }))}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fff', borderRadius: '50px', padding: '2px 12px', }, '& .MuiInputBase-input': { padding: '13px' }, }}
            />
            <TextField
              required
              type="tel"
              label="Phone Number"
              value={contactForm.phone}
              onChange={(event) => setContactForm((current) => ({ ...current, phone: event.target.value }))}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fff', borderRadius: '50px', padding: '2px 12px', }, '& .MuiInputBase-input': { padding: '13px' }, }}
            />
            <TextField
              required
              label="Message"
              value={contactForm.message}
              onChange={(event) => setContactForm((current) => ({ ...current, message: event.target.value }))}
              multiline
              minRows={3}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fff', borderRadius: '25px' } }}
            />
          </Box>
          <Button
            type="submit"
            disabled={contactStatus === 'sending'}
            variant="contained"
            sx={{ backgroundColor: '#d63a07', color: '#fffaf3', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 800, textTransform: 'none', mt: 3, px: 3, py: 1.25, '&:hover': { backgroundColor: '#b92f04' } }}
          >
            {contactStatus === 'sending' ? 'Sending...' : 'Send message'}
          </Button>
          {contactStatus === 'success' && <Typography role="status" sx={{ color: '#165b52', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 700, mt: 2 }}>Thank you. Your message has been sent.</Typography>}
          {contactStatus === 'error' && <Typography role="alert" sx={{ color: '#b92f04', fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 700, mt: 2 }}>We could not send your message. Please try again.</Typography>}
        </Box>
      </AnimatedBox>

      <Box component="footer" sx={{ backgroundColor: '#ebebeb', color: '#222', px: { xs: 3, md: 6 }, pt: { xs: 7, md: 10 }, pb: 4 }}>
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 5, md: 8 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box component="img" src="/succour-logo.png" alt="Succour Surrogacy Agency" sx={{ width: 100, height: 100, objectFit: 'contain',  mb: 2 }} />
              <Typography sx={{ maxWidth: 360, color: '#222', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.8 }}>
                Succour Surrogacy Agency - your trusted partner in building your family with care, ethics, and professionalism.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography sx={{ color: '#222', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '1.3rem', fontWeight: 800, mb: 2 }}>Quick Links</Typography>
              {[
                ['Home', 'home'],
                ['About Us', 'aboutus'],
                ['Why Succour', 'shop'],
                ['Eligibility', 'eligibility'],
                ['Contact', 'contact'],
              ].map(([label, id]) => (
                <Button key={id} onClick={() => scrollToSection(id)} sx={{ display: 'block', color: '#222', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '1rem', justifyContent: 'flex-start', px: 0, py: 0.6, textTransform: 'none', '&:hover': { color: '#165b52', backgroundColor: 'transparent' } }}>{label}</Button>
              ))}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography sx={{ color: '#222', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '1.3rem', fontWeight: 800, mb: 2 }}>Services</Typography>
              {['Surrogacy coordination', 'Consultation', 'Surrogate screening', 'Pregnancy support', 'Post-birth support'].map((service) => <Typography key={service} sx={{ color: '#222', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '1rem', py: 0.6 }}>{service}</Typography>)}
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography sx={{ color: '#222', fontFamily: 'var(--font-nunito), sans-serif', fontSize: '1.3rem', fontWeight: 800, mb: 2 }}>Contact Us</Typography>
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}><Email /><Typography sx={{ color: '#222' }}>soccoursurrogacy@gmail.com</Typography></Box>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}><Phone /><Typography sx={{ color: '#222' }}>+234 705 239 9118</Typography></Box>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}><WhatsApp /><Typography sx={{ color: '#222' }}>+234 706 546 9884</Typography></Box>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}><LocationOn /><Typography sx={{ color: '#222' }}>Lagos, Nigeria</Typography></Box>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid rgba(255,250,243,0.3)', mt: { xs: 6, md: 8 }, pt: 3, display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Typography sx={{ color: '#222', fontFamily: 'var(--font-nunito), sans-serif' }}>© 2026 Succour Surrogacy Agency. All rights reserved.</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[Facebook, Instagram, LinkedIn].map((Icon, index) => <IconButton key={index} aria-label={['Facebook', 'Instagram', 'LinkedIn'][index]} sx={{ color: '#222' }}><Icon /></IconButton>)}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
