export const generateUid = (type, identifier, unique) => {
    const id = unique ? `${identifier}_${Date.now()}` : `${identifier || Date.now()}`;
    return `${id}_${type}`.toLowerCase().replace(/\s/g, '_');
  };
