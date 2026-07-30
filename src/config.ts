export type Memory = { src: string; caption: string };

const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();

export const defaultName = params.get("name")?.slice(0, 24) || "Son Di";
export const defaultSender = params.get("from")?.slice(0, 24) || "Someone who adores you";

export const wishes = [
  { icon: "🌸", text: "May every sunrise this year feel as warm as your smile." },
  { icon: "✨", text: "May your dreams grow bolder and your fears grow smaller." },
  { icon: "💫", text: "May you be surrounded by people who love loudly and stay kindly." },
  { icon: "🍀", text: "May luck follow you like petals follow the wind." },
  { icon: "💖", text: "And may you always know how deeply you are cherished." },
];

export const letterLines = [
  "On this beautiful day, the world got a little brighter — because it's the day you arrived in it.",
  "Thank you for your laughter that fills rooms, your kindness that heals hearts, and the quiet magic you carry everywhere you go.",
  "I hope this year brings you golden mornings, adventures worth retelling, and a thousand tiny reasons to smile.",
  "You deserve every wonderful thing — and then a little more.",
];

export const memories: Memory[] = [
  {
    src: "/src/images/1.jpg",
    caption: "Confetti & cupcakes",
  },
  {
    src: "/src/images/2.jpg",
    caption: "Party hats, always",
  },
  {
    src: "/src/images/3.jpg",
    caption: "The whole crowd",
  },
  {
    src: "/src/images/4.jpg",
    caption: "Balloons & sunshine",
  },
  {
    src: "/src/images/5.jpg",
    caption: "Dancing till late",
  },
  {
    src: "/src/images/6.jpg",
    caption: "Timeless moments",
  },
];
