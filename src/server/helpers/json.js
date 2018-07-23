export const parseJson = data => {
  if (!data) {
    throw 'No data';
  }

  try {
    return JSON.parse(data);
  } catch (e) {
    throw 'JSON FORMAT IS WRONG ONE';
  }
};
