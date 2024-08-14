export const setZIndex = (card: HTMLElement) => {
  if (!card) return;

  card.style.zIndex = "10";

  const cards = card.parentElement?.childNodes;

  cards?.forEach((sibling) => {
    if (sibling instanceof HTMLElement && sibling !== card) {
      sibling.style.zIndex = (Number(card.style.zIndex) - 1).toString();
    }
  });
};

export const bodyParser = (body: string) => {
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
};
