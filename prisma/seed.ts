import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
   const designTeam = await prisma.team.upsert({
      where: { id: 'ckzd563vz00003e6cnb21c29e' },
      update: {},
      create: {
         id: 'ckzd563vz00003e6cnb21c29e',
         title: 'Design',
      },
   });

   const developmentTeam = await prisma.team.upsert({
      where: { id: 'ckzd563vz00013e6crdaf97l3' },
      update: {},
      create: {
         id: 'ckzd563vz00013e6crdaf97l3',
         title: 'Development',
      },
   });

   const thomas = await prisma.user.upsert({
      where: { email: 'thomas@innovation.hub' },
      update: {},
      create: {
         email: 'thomas@innovation.hub',
         username: 'thomas.preiner',
         firstName: 'Thomas',
         lastName: 'Preiner',
         profilePictureURL:
            'https://ca.slack-edge.com/T02NXMD73PS-U02NDFMKSFM-6f673363b8f4-72',
      },
   });

   const leon = await prisma.user.upsert({
      where: { email: 'leon.oberwaditzer@gmail.com' },
      update: {},
      create: {
         id: 'cl2ss9h9m00258eh5v6s25i69',
         email: 'leon.oberwaditzer@gmail.com',
         username: 'leon.oberwaditzer',
         firstName: 'Leon',
         lastName: 'Oberwaditzer',
         profilePictureURL:
            'https://ca.slack-edge.com/T02NXMD73PS-U02N1938PCN-e92454e40239-72',
      },
   });

   const leon2 = await prisma.user.upsert({
      where: { email: 'leon@oberwaditzer.com' },
      update: {},
      create: {
         id: 'cl2ss9h9m00258eh5v6s25i60',
         email: 'leon@oberwaditzer.com',
         username: 'oberwaditzer',
         firstName: 'Leon 2',
         lastName: 'Oberwaditzer',
         profilePictureURL:
            'https://ca.slack-edge.com/T02NXMD73PS-U02N1938PCN-e92454e40239-72',
      },
   });

   const luca = await prisma.user.upsert({
      where: { email: 'luca@innovation.hub' },
      update: {},
      create: {
         email: 'luca@innovation.hub',
         username: 'luca.rath-heel',
         firstName: 'Luca',
         lastName: 'Rath-Heel',
         profilePictureURL:
            'https://ca.slack-edge.com/T02NXMD73PS-U02N1985PQE-1e5607e800cf-512',
      },
   });

   await prisma.usersOnTeams.upsert({
      where: { userId_teamId: { userId: thomas.id, teamId: designTeam.id } },
      update: {},
      create: {
         userId: thomas.id,
         teamId: designTeam.id,
         admin: true,
      },
   });

   await prisma.usersOnTeams.upsert({
      where: { userId_teamId: { userId: leon.id, teamId: designTeam.id } },
      update: {},
      create: {
         userId: leon.id,
         teamId: designTeam.id,
         admin: false,
      },
   });

   await prisma.usersOnTeams.upsert({
      where: { userId_teamId: { userId: leon2.id, teamId: designTeam.id } },
      update: {},
      create: {
         userId: leon2.id,
         teamId: designTeam.id,
         admin: false,
      },
   });

   await prisma.usersOnTeams.upsert({
      where: { userId_teamId: { userId: leon.id, teamId: developmentTeam.id } },
      update: {},
      create: {
         userId: leon.id,
         teamId: developmentTeam.id,
         admin: true,
      },
   });

   await prisma.usersOnTeams.upsert({
      where: { userId_teamId: { userId: luca.id, teamId: developmentTeam.id } },
      update: {},
      create: {
         userId: luca.id,
         teamId: developmentTeam.id,
         admin: true,
      },
   });

   const workshopTemplate = await prisma.workshopTemplate.create({
      data: {
         public: true,
         title: 'Retrospective',
         userId: leon.id,
      },
   });

   const workshopTemplateStepBrainstorming =
      await prisma.workshopTemplateStep.create({
         data: {
            title: 'Brainstorming',
            step: 1,
            durationSeconds: 300,
            type: 'brainstorming',
            data: {},
            workshopTemplateId: workshopTemplate.id,
         },
      });

   await prisma.workshopTemplateStep.create({
      data: {
         title: 'Voting',
         step: 2,
         durationSeconds: 300,
         type: 'voting',
         data: {},
         workshopTemplateId: workshopTemplate.id,
      },
   });

   await prisma.workshop
      .upsert({
         where: { id: 'ckzd563vz00023e6cyh70f1tt' },
         update: {},
         create: {
            id: 'ckzd563vz00023e6cyh70f1tt',
            title: 'Lorem ipsum dolor sit amet',
            type: 'problem',
            status: 'CREATED',
            teams: {
               connect: {
                  id: designTeam.id,
               },
            },
            steps: {
               createMany: {
                  data: [
                     {
                        step: 1,
                        durationSeconds: 300,
                        type: 'brainstorming',
                        title: 'Brainstorming',
                     },
                     {
                        step: 2,
                        durationSeconds: 300,
                        type: 'voting',
                        title: 'Voting',
                        configuration: {
                           voteAmount: 3,
                           maxSelect: 1
                        }
                     }],
               },
            },
            template: {
               connect: {
                  id: workshopTemplate.id,
               },
            },
         },
      })
      .then(async (workshop) => {
         await prisma.usersOnWorkshops.upsert({
            where: {
               userId_workshopId: {
                  workshopId: workshop.id,
                  userId: thomas.id,
               },
            },
            update: {},
            create: {
               workshopId: workshop.id,
               userId: thomas.id,
               admin: false,
            },
         });
         await prisma.usersOnWorkshops.upsert({
            where: {
               userId_workshopId: { workshopId: workshop.id, userId: leon.id },
            },
            update: {},
            create: {
               workshopId: workshop.id,
               userId: leon.id,
               admin: true,
            },
         });
         await prisma.usersOnWorkshops.upsert({
            where: {
               userId_workshopId: { workshopId: workshop.id, userId: leon2.id },
            },
            update: {},
            create: {
               workshopId: workshop.id,
               userId: leon2.id,
               admin: false,
            },
         });
      });

   await prisma.workshop
      .upsert({
         where: { id: 'ckzd563vz00033e6c8l2oydnx' },
         update: {},
         create: {
            id: 'ckzd563vz00033e6c8l2oydnx',
            title: 'At vero eos et accusam',
            type: 'problem',
            status: 'STARTED',
            teams: {
               connect: {
                  id: developmentTeam.id,
               },
            },
         },
      })
      .then(async (workshop) => {
         await prisma.usersOnWorkshops.upsert({
            where: {
               userId_workshopId: { workshopId: workshop.id, userId: leon.id },
            },
            update: {},
            create: {
               workshopId: workshop.id,
               userId: leon.id,
               admin: false,
            },
         });
         await prisma.usersOnWorkshops.upsert({
            where: {
               userId_workshopId: { workshopId: workshop.id, userId: luca.id },
            },
            update: {},
            create: {
               workshopId: workshop.id,
               userId: luca.id,
               admin: true,
            },
         });
      });

   await prisma.workshop
      .upsert({
         where: { id: 'ckzd563vz00043e6cf3ne5ooa' },
         update: {},
         create: {
            id: 'ckzd563vz00043e6cf3ne5ooa',
            title: 'Consetetur sadipscing elitr',
            type: 'problem',
            status: 'STOPPED',
            teams: {
               connect: [
                  {
                     id: designTeam.id,
                  },
                  {
                     id: developmentTeam.id,
                  },
               ],
            },
         },
      })
      .then(async (workshop) => {
         await prisma.usersOnWorkshops.upsert({
            where: {
               userId_workshopId: {
                  workshopId: workshop.id,
                  userId: thomas.id,
               },
            },
            update: {},
            create: {
               workshopId: workshop.id,
               userId: thomas.id,
               admin: false,
            },
         });
         await prisma.usersOnWorkshops.upsert({
            where: {
               userId_workshopId: { workshopId: workshop.id, userId: leon.id },
            },
            update: {},
            create: {
               workshopId: workshop.id,
               userId: leon.id,
               admin: true,
            },
         });
         await prisma.usersOnWorkshops.upsert({
            where: {
               userId_workshopId: { workshopId: workshop.id, userId: luca.id },
            },
            update: {},
            create: {
               workshopId: workshop.id,
               userId: luca.id,
               admin: false,
            },
         });
      });

   await prisma.workshop
      .upsert({
         where: { id: 'ckzd563vz00053e6cj56429k5' },
         update: {},
         create: {
            id: 'ckzd563vz00053e6cj56429k5',
            title: 'Dolore magna aliquyam erat',
            type: 'problem',
            status: 'FINISHED',
         },
      })
      .then(async (workshop) => {
         await prisma.usersOnWorkshops.upsert({
            where: {
               userId_workshopId: {
                  workshopId: workshop.id,
                  userId: thomas.id,
               },
            },
            update: {},
            create: {
               workshopId: workshop.id,
               userId: thomas.id,
               admin: true,
            },
         });

         await prisma.usersOnWorkshops.upsert({
            where: {
               userId_workshopId: { workshopId: workshop.id, userId: luca.id },
            },
            update: {},
            create: {
               workshopId: workshop.id,
               userId: luca.id,
               admin: true,
            },
         });
      });
}

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
