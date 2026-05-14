export const mentalHealthQuestions = [
  "أستعيد هدوء بسرعة",
  "أستمع جيدا لمن يتحدث معي",
  "أثق بقدرتي على النجاح",
  "أحب الذهاب الى المدرسة",
  "أستطيع الإستماع إلى الآخرين حتى عندما أغضب",
  // Placeholders for remaining questions up to 37, as user truncated the prompt
  ...Array.from({ length: 32 }, (_, i) => `سؤال ${i + 6}`)
];
