import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const img = {
  villa: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80',
  cabin: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1800&q=80',
  interior: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80',
  lounge: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=80',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80',
  atrium: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80',
  night: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80',
  kitchen: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1800&q=80',
  pool: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1800&q=80',
  plan: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=80',
  render: 'https://images.unsplash.com/photo-1487958449943-2429e8be8624?auto=format&fit=crop&w=1800&q=80',
  lobby: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=80',
  facade: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80',
  bedroom: 'https://images.unsplash.com/photo-1616593969747-4797dc75033e?auto=format&fit=crop&w=1800&q=80',
  stairs: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=80',
  leaves: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=80',
  tea: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1400&q=80',
  fern: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1400&q=80',
  portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
  gold: 'https://images.unsplash.com/photo-1615800098779-1be32e60cca3?auto=format&fit=crop&w=1000&q=80',
};

async function main() {
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.adminUser.deleteMany();

  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@MSVIZ2026', 12);

  await prisma.adminUser.create({
    data: {
      email: (process.env.ADMIN_EMAIL || 'admin@msviz.com').toLowerCase(),
      password,
      name: process.env.ADMIN_NAME || 'MSVIZ Admin',
    },
  });

  await prisma.siteSetting.create({
    data: {
      id: 'default',
      companyName: 'MSVIZ',
      email: 'hello@msviz.com',
      phone: '+1 (212) 555-0148',
      whatsapp: '+12125550148',
      address: '1200 Atelier Avenue, Suite 400, New York, NY 10001',
      facebook: 'https://facebook.com/msviz',
      instagram: 'https://instagram.com/msviz',
      linkedin: 'https://linkedin.com/company/msviz',
      youtube: 'https://youtube.com/@msviz',
      websiteDescription:
        'MSVIZ is an architecture and 3D visualization studio crafting interiors, exteriors, floor plans, and photorealistic renders for residential and commercial clients worldwide.',
      heroHeading: 'Architecture Beyond Imagination',
      heroSubtitle: '3D Visualization • Interior Design • Exterior Design • Floor Planning',
      aboutIntro:
        'MSVIZ is a multidisciplinary studio where architecture, visualization, and spatial storytelling converge. We design spaces that feel inevitable — composed, atmospheric, and built around how people actually live.',
      vision:
        'To become the defining visualization and design partner for architects, developers, and private clients who refuse generic space.',
      mission:
        'We translate unbuilt ideas into convincing, emotionally charged environments — from the first floor plate to the final dusk render.',
      philosophy:
        'Restraint over ornament. Light over decoration. Proportion over trend. Every project is an editorial composition of material, landscape, and human scale.',
      differentiators:
        'Photoreal visualization integrated with design, not added at the end. A single studio for interiors, exteriors, and documentation. Obsessive attention to atmosphere, season, and time of day.',
      yearsExperience: 12,
      projectsCompleted: 180,
      clientsServed: 90,
      awardsWon: 24,
    },
  });

  const services = [
    {
      name: '3D Architectural Visualization',
      slug: '3d-architectural-visualization',
      shortDescription: 'Photoreal stills and sequences that sell the unbuilt with cinematic clarity.',
      fullDescription:
        'From concept massing to final marketing imagery, we produce architectural visualizations that communicate material, light, and landscape with complete conviction. Clients use our work for planning boards, investor decks, and luxury marketing campaigns.',
      imageUrl: img.render,
      icon: 'cube',
      displayOrder: 1,
    },
    {
      name: 'Interior Design',
      slug: 'interior-design',
      shortDescription: 'Atmospheric interiors composed around light, material, and daily ritual.',
      fullDescription:
        'We design interiors as complete spatial experiences — millwork, furniture, lighting, and finishes — then visualize them so clients can inhabit the space before construction begins.',
      imageUrl: img.interior,
      icon: 'sofa',
      displayOrder: 2,
    },
    {
      name: 'Exterior Design',
      slug: 'exterior-design',
      shortDescription: 'Facades, landscape, and envelope studies with a strong architectural identity.',
      fullDescription:
        'Exterior design at MSVIZ balances form, climate, and context. We develop facades, terraces, and landscape relationships, then render them across seasons and times of day.',
      imageUrl: img.villa,
      icon: 'home',
      displayOrder: 3,
    },
    {
      name: 'Floor Planning',
      slug: 'floor-planning',
      shortDescription: 'Clear, elegant plans that resolve circulation, proportion, and program.',
      fullDescription:
        'Our floor planning work turns briefs into lucid spatial diagrams and presentation-ready plans. We optimize flow, privacy, and daylight while keeping documentation beautiful enough to present.',
      imageUrl: img.plan,
      icon: 'grid',
      displayOrder: 4,
    },
    {
      name: '3D Modeling',
      slug: '3d-modeling',
      shortDescription: 'Precise digital models ready for visualization, VR, and documentation.',
      fullDescription:
        'We build clean, well-organized 3D models from drawings or sketches — suitable for rendering, design iteration, and coordination with consultants.',
      imageUrl: img.atrium,
      icon: 'box',
      displayOrder: 5,
    },
    {
      name: 'Architectural Rendering',
      slug: 'architectural-rendering',
      shortDescription: 'High-end stills for residences, hospitality, and commercial developments.',
      fullDescription:
        'Our rendering pipeline emphasizes natural light, material honesty, and editorial composition. Every image is graded like a photograph, not a software default.',
      imageUrl: img.night,
      icon: 'aperture',
      displayOrder: 6,
    },
    {
      name: 'Residential Design',
      slug: 'residential-design',
      shortDescription: 'Houses, villas, and apartments designed as private landscapes of living.',
      fullDescription:
        'From compact urban apartments to hillside villas, we design residences that feel both intimate and cinematic — with visualization throughout the process.',
      imageUrl: img.cabin,
      icon: 'house',
      displayOrder: 7,
    },
    {
      name: 'Commercial Design',
      slug: 'commercial-design',
      shortDescription: 'Workplaces, lobbies, and hospitality interiors with a gallery-grade presence.',
      fullDescription:
        'We create commercial environments that photograph well, wear well, and communicate brand through space rather than signage.',
      imageUrl: img.office,
      icon: 'building',
      displayOrder: 8,
    },
  ];

  for (const service of services) {
    await prisma.service.create({
      data: { ...service, storagePath: `seed/${service.slug}.jpg`, active: true },
    });
  }

  const projects = [
    {
      title: 'Northern Crest Residence',
      slug: 'northern-crest-residence',
      shortDescription: 'A gabled glass pavilion set into an autumn forest in Nuevo Leon.',
      description:
        'Northern Crest is a private residence composed as a sequence of timber frames and floor-to-ceiling glass. The house sits lightly on the ridge, opening living spaces toward the forest while protecting sleeping rooms behind a quieter, more solid volume. Visualization focused on late-afternoon light, fallen leaves, and the warmth of the interior against the dark timber structure.',
      category: 'residential',
      location: 'Nuevo Leon, Mexico',
      year: 2024,
      status: 'completed',
      client: 'Private client',
      architect: 'MSVIZ Studio',
      projectArea: '480 m²',
      coverImage: img.cabin,
      featured: true,
      latest: true,
      completed: true,
      published: true,
      displayOrder: 1,
      images: [img.cabin, img.pool, img.interior, img.stairs],
    },
    {
      title: 'Obsidian Penthouse',
      slug: 'obsidian-penthouse',
      shortDescription: 'A dark, gallery-like interior with tailored millwork and muted stone.',
      description:
        'The Obsidian Penthouse is an interior project for a collector in Manhattan. We reduced the palette to smoked oak, honed limestone, and blackened steel, then used visualization to study how art and furniture occupy the long living gallery.',
      category: 'interior',
      location: 'New York, USA',
      year: 2025,
      status: 'completed',
      client: 'East River Holdings',
      architect: 'MSVIZ Interiors',
      projectArea: '320 m²',
      coverImage: img.lounge,
      featured: true,
      latest: true,
      completed: true,
      published: true,
      displayOrder: 2,
      images: [img.lounge, img.kitchen, img.bedroom, img.lobby],
    },
    {
      title: 'Meridian Commercial Tower',
      slug: 'meridian-commercial-tower',
      shortDescription: 'Exterior visualization for a mixed-use tower on a downtown boulevard.',
      description:
        'Meridian is a speculative mixed-use tower. Our role was full exterior visualization — dusk and daylight campaigns, street-level human scale, and a night sequence used for leasing. The glass facade was studied across multiple sky conditions.',
      category: 'visualization',
      location: 'Dubai, UAE',
      year: 2025,
      status: 'in-progress',
      client: 'Meridian Developments',
      architect: 'Atelier North + MSVIZ',
      projectArea: '48,000 m²',
      coverImage: img.facade,
      featured: true,
      latest: true,
      completed: false,
      published: true,
      displayOrder: 3,
      images: [img.facade, img.render, img.office, img.night],
    },
    {
      title: 'Atrium House Plans',
      slug: 'atrium-house-plans',
      shortDescription: 'A courtyard house resolved as a precise set of presentation floor plans.',
      description:
        'Atrium House is organized around a central light well. Floor planning work included three levels, a guest wing, and a basement gallery. Drawings were produced as both working diagrams and presentation plates.',
      category: 'floor-plans',
      location: 'Lisbon, Portugal',
      year: 2023,
      status: 'completed',
      client: 'Private client',
      architect: 'MSVIZ',
      projectArea: '390 m²',
      coverImage: img.plan,
      featured: false,
      latest: false,
      completed: true,
      published: true,
      displayOrder: 4,
      images: [img.plan, img.atrium, img.stairs],
    },
    {
      title: 'Coastal Villa Exterior',
      slug: 'coastal-villa-exterior',
      shortDescription: 'A low, linear villa facing the water, rendered through four seasons.',
      description:
        'This exterior design study for a coastal villa explores a long horizontal roof plane, deep terraces, and a limestone plinth. Renders were produced for summer noon, autumn dusk, and a quiet winter morning.',
      category: 'exterior',
      location: 'Amalfi Coast, Italy',
      year: 2024,
      status: 'completed',
      client: 'Villa Solis',
      architect: 'MSVIZ',
      projectArea: '620 m²',
      coverImage: img.villa,
      featured: true,
      latest: false,
      completed: true,
      published: true,
      displayOrder: 5,
      images: [img.villa, img.pool, img.night],
    },
    {
      title: 'Lumen Workplace',
      slug: 'lumen-workplace',
      shortDescription: 'A commercial interior for a design-led headquarters in a historic warehouse.',
      description:
        'Lumen Workplace inserts a calm, gallery-like workplace into a brick warehouse. Visualization focused on daylight from the original sawtooth roof and the contrast between new millwork and existing structure.',
      category: 'commercial',
      location: 'London, United Kingdom',
      year: 2024,
      status: 'completed',
      client: 'Lumen Studio',
      architect: 'MSVIZ',
      projectArea: '1,100 m²',
      coverImage: img.office,
      featured: false,
      latest: true,
      completed: true,
      published: true,
      displayOrder: 6,
      images: [img.office, img.lobby, img.atrium],
    },
    {
      title: 'Gallery House Interior',
      slug: 'gallery-house-interior',
      shortDescription: 'A residence designed as a sequence of rooms for living with art.',
      description:
        'Gallery House treats circulation as exhibition. Interiors were designed and visualized as a slow procession from a dark entry court into a double-height living hall washed with north light.',
      category: 'interior',
      location: 'Kyoto, Japan',
      year: 2023,
      status: 'completed',
      client: 'Private collection',
      architect: 'MSVIZ',
      projectArea: '410 m²',
      coverImage: img.interior,
      featured: false,
      latest: false,
      completed: true,
      published: true,
      displayOrder: 7,
      images: [img.interior, img.bedroom, img.stairs],
    },
    {
      title: 'Horizon Concept Villa',
      slug: 'horizon-concept-villa',
      shortDescription: 'An in-progress concept for a desert residence with a sunken courtyard.',
      description:
        'Horizon is currently in concept design. Early visualization explores a sunken courtyard, rammed-earth walls, and a thin hovering roof. The project is unpublished in some markets and used internally as a design study — published here as a concept.',
      category: 'other',
      location: 'AlUla, Saudi Arabia',
      year: 2026,
      status: 'concept',
      client: 'Confidential',
      architect: 'MSVIZ',
      projectArea: '540 m²',
      coverImage: img.render,
      featured: false,
      latest: true,
      completed: false,
      published: true,
      displayOrder: 8,
      images: [img.render, img.night],
    },
  ];

  for (const project of projects) {
    const { images, ...data } = project;
    const created = await prisma.project.create({
      data: {
        ...data,
        coverImagePath: `seed/${data.slug}-cover.jpg`,
      },
    });
    await prisma.projectImage.createMany({
      data: images.map((imageUrl, index) => ({
        projectId: created.id,
        imageUrl,
        storagePath: `seed/${data.slug}-${index}.jpg`,
        altText: `${data.title} view ${index + 1}`,
        caption: data.shortDescription,
        displayOrder: index,
      })),
    });
  }

  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Elena Voss',
        role: 'Principal',
        company: 'Voss Architects',
        quote:
          'MSVIZ does not decorate a model. They understand the architecture well enough to light it like a photographer who has lived in the building.',
        rating: 5,
        featured: true,
        active: true,
      },
      {
        name: 'James Okonkwo',
        role: 'Development Director',
        company: 'Meridian Developments',
        quote:
          'The Meridian campaign images closed a round of leasing conversations that drawings never could. Precise, atmospheric, and commercially sharp.',
        rating: 5,
        featured: true,
        active: true,
      },
      {
        name: 'Sofia Alvarez',
        role: 'Private client',
        company: 'Northern Crest',
        quote:
          'We approved the house from the visualizations. Walking onto site later felt like returning somewhere we already knew.',
        rating: 5,
        featured: true,
        active: true,
      },
    ],
  });

  await prisma.faq.createMany({
    data: [
      {
        question: 'What types of projects does MSVIZ take on?',
        answer:
          'We work across residential, commercial, hospitality, and unbuilt visualization — interiors, exteriors, floor plans, and full 3D campaigns.',
        displayOrder: 1,
        active: true,
      },
      {
        question: 'Do you work with architects or only with private clients?',
        answer:
          'Both. Many of our commissions come from architecture studios who need a visualization partner; others come from homeowners and developers who want design and imagery from one studio.',
        displayOrder: 2,
        active: true,
      },
      {
        question: 'How long does a typical visualization package take?',
        answer:
          'A focused stills package is often two to four weeks depending on model readiness. Full interior design plus visualization is scoped per project.',
        displayOrder: 3,
        active: true,
      },
      {
        question: 'Can you work from sketches or incomplete drawings?',
        answer:
          'Yes. We regularly build models from sketches, massing studies, or partial CAD. Clarity of the brief matters more than the polish of the source files.',
        displayOrder: 4,
        active: true,
      },
      {
        question: 'Where is the studio based?',
        answer:
          'MSVIZ is based in New York and collaborates remotely with clients worldwide.',
        displayOrder: 5,
        active: true,
      },
    ],
  });

  await prisma.contactMessage.create({
    data: {
      name: 'Daniel Cho',
      email: 'daniel@example.com',
      phone: '+1 415 555 0199',
      service: '3D Architectural Visualization',
      message: 'We are preparing a hillside residence and would like to discuss a dusk exterior package and two interior hero stills.',
      status: 'new',
    },
  });

  console.log('Seed complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
