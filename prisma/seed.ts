const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.submission.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.lessonProgress.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash("password123", 12);

  // Create Teacher
  const teacher = await prisma.user.create({
    data: {
      fullName: "Professor Sarah",
      username: "sarah_teacher",
      email: "sarah@example.com",
      passwordHash,
      role: "TEACHER",
      avatarColor: "#7c3aed",
    },
  });

  // Create Students
  const students = await Promise.all([
    prisma.user.create({
      data: {
        fullName: "Ahmed Kid",
        username: "ahmed",
        email: "ahmed@example.com",
        passwordHash,
        role: "STUDENT",
        avatarColor: "#ec4899",
      },
    }),
    prisma.user.create({
      data: {
        fullName: "Yasmine Learner",
        username: "yasmine",
        email: "yasmine@example.com",
        passwordHash,
        role: "STUDENT",
        avatarColor: "#3b82f6",
      },
    }),
  ]);

  // Create Lessons
  const lesson1 = await prisma.lesson.create({
    data: {
      title: "Our Wonderful Solar System 🚀",
      description: "Learn about the planets, the moon, and our giant Sun!",
      type: "VIDEO",
      contentUrl: "https://www.youtube.com/watch?v=libKVRa01L8",
      teacherId: teacher.id,
      order: 1,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      title: "Amazing Sea Animals 🐬",
      description: "Discover the secrets of the deep blue ocean and its friendly creatures.",
      type: "PDF",
      contentUrl: "https://www.worldwildlife.org/publications/sea-turtles-and-the-ocean--2.pdf",
      teacherId: teacher.id,
      order: 2,
    },
  });

  // Create Quizzes
  await prisma.quiz.create({
    data: {
      title: "Solar System Quiz! 🌟",
      lessonId: lesson1.id,
      teacherId: teacher.id,
      questions: JSON.stringify([
        { id: "q1", text: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctIndex: 1 },
        { id: "q2", text: "What is the largest object in our solar system?", options: ["The Moon", "Earth", "The Sun", "Jupiter"], correctIndex: 2 },
        { id: "q3", text: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], correctIndex: 1 }
      ]),
    },
  });

  console.log("Seed data created successfully! 🌱");
  console.log("Teacher login: sarah_teacher / password123");
  console.log("Student login: ahmed / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
