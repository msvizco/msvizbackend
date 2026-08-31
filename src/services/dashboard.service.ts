import { prisma } from '../config/prisma';

export async function getDashboardStats() {
  const [
    totalProjects,
    completedProjects,
    latestProjects,
    featuredProjects,
    totalServices,
    contactMessages,
    recentProjects,
    recentMessages,
  ] = await prisma.$transaction([
    prisma.project.count(),
    prisma.project.count({ where: { completed: true } }),
    prisma.project.count({ where: { latest: true } }),
    prisma.project.count({ where: { featured: true } }),
    prisma.service.count(),
    prisma.contactMessage.count(),
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        status: true,
        published: true,
        coverImage: true,
        createdAt: true,
      },
    }),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        service: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    totals: {
      totalProjects,
      completedProjects,
      latestProjects,
      featuredProjects,
      totalServices,
      contactMessages,
    },
    recentProjects,
    recentMessages,
  };
}
