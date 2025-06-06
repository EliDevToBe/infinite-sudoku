import { centerText } from "./center-text";

export const wait = async () => {
	console.log(centerText(" -  - --== Waiting for db 😭 ==--- -  - "));
	await new Promise((resolve) => {
		setTimeout(resolve, 2000);
	});

	console.log(centerText(" -  - --== ✨ Finished ✨ ==--- -  - "));
};
wait();
