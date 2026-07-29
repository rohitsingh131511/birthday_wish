export type Memory = { src: string; caption: string };

const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();

export const defaultName = params.get("name")?.slice(0, 24) || "Ayesha";
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
    src: "https://images.pexels.com/photos/5805040/pexels-photo-5805040.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    caption: "Confetti & cupcakes",
  },
  {
    src: "https://images.pexels.com/photos/27176125/pexels-photo-27176125.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    caption: "Party hats, always",
  },
  {
    src: "https://images.pexels.com/photos/7180890/pexels-photo-7180890.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    caption: "The whole crowd",
  },
  {
    src: "https://images.pexels.com/photos/37951113/pexels-photo-37951113.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    caption: "Balloons & sunshine",
  },
  {
    src: "https://images.pexels.com/photos/35399090/pexels-photo-35399090.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    caption: "Dancing till late",
  },
  {
    src: "https://images.pexels.com/photos/5805034/pexels-photo-5805034.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    caption: "Timeless moments",
  },
];
