const completeSound = new Audio("/sounds/tasksSuccess.mp3");
const levelUpSound = new Audio("/sounds/levelUp.mp3");

completeSound.volume = 0.4;
levelUpSound.volume = 0.5;

export const playCompleteSound = () => {
  completeSound.currentTime = 0;
  completeSound.play().catch(() => {});
};

export const playLevelUpSound = () => {
  levelUpSound.currentTime = 0;
  levelUpSound.play().catch(() => {});
};
