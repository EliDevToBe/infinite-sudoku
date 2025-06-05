export const centerText = (text: string) => {
  const width = process.stdout.columns || 80;
  return text
    .split("\n")
    .map((line) => {
      const padding = Math.max(0, Math.floor((width - line.length) / 2));
      return " ".repeat(padding) + line;
    })
    .join("\n");
};
