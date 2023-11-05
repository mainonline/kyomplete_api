/**
 * Generate a custom id
 * @param {string} complex
 * @param {string} block
 * @param {number} floor
 * @param {number} area
 * @param {number} rooms
 * @returns {string}
 */

const generateCustomId = (complex: string, block: string, floor: number, area: number, rooms: number): string => {
  // Create a unique string
  const uniqueString = `${complex}-${block}-${floor}-${area}-${rooms}`;

  // Use a larger character set
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const totalCharacters = characters.length;

  // Convert the unique string to a number
  let hash = 0;
  for (let i = 0; i < uniqueString.length; i += 1) {
    hash = (hash * 31 + uniqueString.charCodeAt(i)) % totalCharacters;
  }

  console.log('hash: ', hash);

  // Generate the custom ID using the calculated hash
  let customId = '';
  for (let i = 0; i < 3; i += 1) {
    customId += characters[hash % totalCharacters];
    hash = Math.floor(hash / totalCharacters);
  }

  return customId;
};

export default generateCustomId;
