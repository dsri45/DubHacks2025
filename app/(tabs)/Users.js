export interface User {
  id: number;
  profileImage: string;
  name: string;
  skills: string[];
  location: string;
  teachingStatus: string;
}

export const users = [
  {
    id: 1,
    profileImage: "https://i.pravatar.cc/150?img=1",
    name: "Alice Johnson",
    skills: ["Guitar", "Singing", "Songwriting"],
    location: "3 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 2,
    profileImage: "https://i.pravatar.cc/150?img=2",
    name: "Marco Rossi",
    skills: ["Italian Cooking", "Baking", "Wine Tasting"],
    location: "Based in San Francisco",
    teachingStatus: "hybrid"
  },
  {
    id: 3,
    profileImage: "https://i.pravatar.cc/150?img=3",
    name: "Sophia Lee",
    skills: ["Programming", "Web Development", "Data Analysis"],
    location: "5 miles away",
    teachingStatus: "online"
  },
  {
    id: 4,
    profileImage: "https://i.pravatar.cc/150?img=4",
    name: "Daniel Kim",
    skills: ["Photography", "Photo Editing", "Graphic Design"],
    location: "4 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 5,
    profileImage: "https://i.pravatar.cc/150?img=5",
    name: "Priya Patel",
    skills: ["Yoga", "Meditation", "Nutrition"],
    location: "Based in Vancouver, BC",
    teachingStatus: "hybrid"
  },
  {
    id: 6,
    profileImage: "https://i.pravatar.cc/150?img=6",
    name: "James Smith",
    skills: ["Piano", "Music Theory", "Composition"],
    location: "7 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 7,
    profileImage: "https://i.pravatar.cc/150?img=7",
    name: "Elena García",
    skills: ["Spanish Language", "Translation", "Cultural Studies"],
    location: "Based in Madrid",
    teachingStatus: "online"
  },
  {
    id: 8,
    profileImage: "https://i.pravatar.cc/150?img=8",
    name: "Tom Becker",
    skills: ["Carpentry", "Woodworking", "DIY Projects"],
    location: "4 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 9,
    profileImage: "https://i.pravatar.cc/150?img=9",
    name: "Aisha Khan",
    skills: ["Graphic Design", "Illustration", "Branding"],
    location: "Based in New York City",
    teachingStatus: "hybrid"
  },
  {
    id: 10,
    profileImage: "https://i.pravatar.cc/150?img=10",
    name: "Lucas Chen",
    skills: ["Martial Arts", "Fitness Coaching", "Self-defense"],
    location: "2 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 11,
    profileImage: "https://i.pravatar.cc/150?img=11",
    name: "Grace Park",
    skills: ["Data Science", "Machine Learning", "Python"],
    location: "6 miles away",
    teachingStatus: "online"
  },
  {
    id: 12,
    profileImage: "https://i.pravatar.cc/150?img=12",
    name: "Hassan Ali",
    skills: ["Public Speaking", "Debate Coaching", "Writing"],
    location: "Based in Chicago",
    teachingStatus: "hybrid"
  },
  {
    id: 13,
    profileImage: "https://i.pravatar.cc/150?img=13",
    name: "Mia Nguyen",
    skills: ["Baking", "Pastry Arts", "Cake Decorating"],
    location: "3 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 14,
    profileImage: "https://i.pravatar.cc/150?img=14",
    name: "Owen Phillips",
    skills: ["3D Modeling", "Blender", "Animation"],
    location: "Based in London",
    teachingStatus: "online"
  },
  {
    id: 15,
    profileImage: "https://i.pravatar.cc/150?img=15",
    name: "Riley Thompson",
    skills: ["Photography", "Lighting", "Portrait Retouching"],
    location: "8 miles away",
    teachingStatus: "hybrid"
  },
  {
    id: 16,
    profileImage: "https://i.pravatar.cc/150?img=16",
    name: "Zara Rahman",
    skills: ["UX Design", "Prototyping", "User Research"],
    location: "5 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 17,
    profileImage: "https://i.pravatar.cc/150?img=17",
    name: "Liam O’Connor",
    skills: ["Irish Cooking", "Breadmaking", "Food Safety"],
    location: "Based in Dublin",
    teachingStatus: "online"
  },
  {
    id: 18,
    profileImage: "https://i.pravatar.cc/150?img=18",
    name: "Noah Williams",
    skills: ["JavaScript", "React", "Node.js"],
    location: "4 miles away",
    teachingStatus: "hybrid"
  },
  {
    id: 19,
    profileImage: "https://i.pravatar.cc/150?img=19",
    name: "Isabella Martinez",
    skills: ["Salsa Dancing", "Bachata", "Choreography"],
    location: "2 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 20,
    profileImage: "https://i.pravatar.cc/150?img=20",
    name: "Mateo Rivera",
    skills: ["Guitar", "Music Production", "Mixing"],
    location: "Based in Los Angeles",
    teachingStatus: "hybrid"
  },
  {
    id: 21,
    profileImage: "https://i.pravatar.cc/150?img=21",
    name: "Harper Brooks",
    skills: ["Creative Writing", "Screenwriting", "Editing"],
    location: "6 miles away",
    teachingStatus: "online"
  },
  {
    id: 22,
    profileImage: "https://i.pravatar.cc/150?img=22",
    name: "Ethan Zhang",
    skills: ["Math Tutoring", "SAT Prep", "Statistics"],
    location: "9 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 23,
    profileImage: "https://i.pravatar.cc/150?img=23",
    name: "Yuki Tanaka",
    skills: ["Japanese Language", "JLPT Prep", "Conversation"],
    location: "Based in Tokyo",
    teachingStatus: "online"
  },
  {
    id: 24,
    profileImage: "https://i.pravatar.cc/150?img=24",
    name: "Chloe Anderson",
    skills: ["Pilates", "Strength Training", "Mobility"],
    location: "3 miles away",
    teachingStatus: "hybrid"
  },
  {
    id: 25,
    profileImage: "https://i.pravatar.cc/150?img=25",
    name: "Aarav Mehta",
    skills: ["Machine Learning", "MLOps", "TensorFlow"],
    location: "Based in Bengaluru",
    teachingStatus: "online"
  },
  {
    id: 26,
    profileImage: "https://i.pravatar.cc/150?img=26",
    name: "Sofia Petrova",
    skills: ["Oil Painting", "Color Theory", "Figure Drawing"],
    location: "7 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 27,
    profileImage: "https://i.pravatar.cc/150?img=27",
    name: "Jonah Green",
    skills: ["Chess", "Endgame Strategy", "Openings"],
    location: "5 miles away",
    teachingStatus: "hybrid"
  },
  {
    id: 28,
    profileImage: "https://i.pravatar.cc/150?img=28",
    name: "Amélie Dubois",
    skills: ["French Language", "DELF Prep", "Pronunciation"],
    location: "Based in Paris",
    teachingStatus: "online"
  },
  {
    id: 29,
    profileImage: "https://i.pravatar.cc/150?img=29",
    name: "Victor Morales",
    skills: ["Soccer Coaching", "Conditioning", "Tactics"],
    location: "10 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 30,
    profileImage: "https://i.pravatar.cc/150?img=30",
    name: "Nia Okafor",
    skills: ["Afrobeats Dance", "Choreography", "Rhythm Training"],
    location: "Based in Lagos",
    teachingStatus: "online"
  },
  {
    id: 31,
    profileImage: "https://i.pravatar.cc/150?img=31",
    name: "Kai Müller",
    skills: ["Piano", "Ear Training", "Composition"],
    location: "6 miles away",
    teachingStatus: "hybrid"
  },
  {
    id: 32,
    profileImage: "https://i.pravatar.cc/150?img=32",
    name: "Luz Ramirez",
    skills: ["Photography", "Street Photography", "Lightroom"],
    location: "4 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 33,
    profileImage: "https://i.pravatar.cc/150?img=33",
    name: "Jasper Wright",
    skills: ["Back-end Development", "APIs", "Databases"],
    location: "8 miles away",
    teachingStatus: "online"
  },
  {
    id: 34,
    profileImage: "https://i.pravatar.cc/150?img=34",
    name: "Olivia Brown",
    skills: ["Ballet", "Contemporary Dance", "Flexibility"],
    location: "2 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 35,
    profileImage: "https://i.pravatar.cc/150?img=35",
    name: "Chen Wei",
    skills: ["Mandarin", "HSK Prep", "Business Chinese"],
    location: "Based in Shanghai",
    teachingStatus: "online"
  },
  {
    id: 36,
    profileImage: "https://i.pravatar.cc/150?img=36",
    name: "George Carter",
    skills: ["Public Speaking", "Pitch Coaching", "Storytelling"],
    location: "5 miles away",
    teachingStatus: "hybrid"
  },
  {
    id: 37,
    profileImage: "https://i.pravatar.cc/150?img=37",
    name: "Maya Singh",
    skills: ["Cooking", "Vegetarian Cuisine", "Meal Prep"],
    location: "3 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 38,
    profileImage: "https://i.pravatar.cc/150?img=38",
    name: "Andre Silva",
    skills: ["Brazilian Portuguese", "Conversation", "Accent Reduction"],
    location: "Based in São Paulo",
    teachingStatus: "online"
  },
  {
    id: 39,
    profileImage: "https://i.pravatar.cc/150?img=39",
    name: "Hannah Schultz",
    skills: ["Violin", "Music Theory", "Sight Reading"],
    location: "9 miles away",
    teachingStatus: "hybrid"
  },
  {
    id: 40,
    profileImage: "https://i.pravatar.cc/150?img=40",
    name: "Rahul Verma",
    skills: ["Cloud Architecture", "AWS", "DevOps"],
    location: "6 miles away",
    teachingStatus: "online"
  },
  {
    id: 41,
    profileImage: "https://i.pravatar.cc/150?img=41",
    name: "Emily Davis",
    skills: ["Sewing", "Pattern Making", "Alterations"],
    location: "4 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 42,
    profileImage: "https://i.pravatar.cc/150?img=42",
    name: "Diego Santos",
    skills: ["Soccer Skills", "Dribbling", "Shooting"],
    location: "Based in Mexico City",
    teachingStatus: "hybrid"
  },
  {
    id: 43,
    profileImage: "https://i.pravatar.cc/150?img=43",
    name: "Nora Ibrahim",
    skills: ["Calligraphy", "Arabic Script", "Design"],
    location: "7 miles away",
    teachingStatus: "online"
  },
  {
    id: 44,
    profileImage: "https://i.pravatar.cc/150?img=44",
    name: "Felix Novak",
    skills: ["Cycling Coaching", "Endurance Training", "Nutrition"],
    location: "8 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 45,
    profileImage: "https://i.pravatar.cc/150?img=45",
    name: "Sienna Rossi",
    skills: ["Watercolor", "Landscape Painting", "Sketching"],
    location: "5 miles away",
    teachingStatus: "hybrid"
  },
  {
    id: 46,
    profileImage: "https://i.pravatar.cc/150?img=46",
    name: "Tariq Hassan",
    skills: ["Android Development", "Kotlin", "UI Architecture"],
    location: "Based in Dubai",
    teachingStatus: "online"
  },
  {
    id: 47,
    profileImage: "https://i.pravatar.cc/150?img=47",
    name: "Bianca Conti",
    skills: ["Italian Language", "Conversation", "Grammar"],
    location: "Based in Rome",
    teachingStatus: "online"
  },
  {
    id: 48,
    profileImage: "https://i.pravatar.cc/150?img=48",
    name: "Evelyn Cooper",
    skills: ["Gardening", "Urban Farming", "Composting"],
    location: "3 miles away",
    teachingStatus: "in-person"
  },
  {
    id: 49,
    profileImage: "https://i.pravatar.cc/150?img=49",
    name: "William Turner",
    skills: ["Film Editing", "Premiere Pro", "Color Grading"],
    location: "10 miles away",
    teachingStatus: "hybrid"
  },
  {
    id: 50,
    profileImage: "https://i.pravatar.cc/150?img=50",
    name: "Zoe Bennett",
    skills: ["Social Media Strategy", "Content Planning", "Analytics"],
    location: "6 miles away",
    teachingStatus: "online"
  }
];

