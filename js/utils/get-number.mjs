export const getNumberBetweenTwoNumbers = (lowerBound, upperBound) => {
    const randomNumber = Math.random();
    return ~~(randomNumber * Math.abs(upperBound - lowerBound) + lowerBound);
  };
  