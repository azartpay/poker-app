
export enum CardValue {
  two = 2,
  three = 3,
  four = 4,
  five = 5,
  six = 6,
  seven = 7,
  eight = 8,
  nine = 9,
  ten = 10,
  jack = 'J',
  queen = 'Q',
  king = 'K',
  ace = 'A'
};

export enum Suit {
  hearts = 'hearts',
  diamonds = 'diamonds',
  spades = 'spades',
  clubs = 'clubs'
};


export interface Card {
  suit: Suit;
  value: CardValue
};
