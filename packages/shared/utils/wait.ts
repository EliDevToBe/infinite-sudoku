const centerText = (text: string) => {
  const width = process.stdout.columns || 80;
  return text
    .split("\n")
    .map((line) => {
      const padding = Math.max(0, Math.floor((width - line.length) / 2));
      return " ".repeat(padding) + line;
    })
    .join("\n");
};

export const wait = async () => {
  console.log(centerText(" -  - --== Waiting for db 😭 ==--- -  - "));
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  console.log(centerText(" -  - --== ✨ Finished ✨ ==--- -  - "));
};
wait();
